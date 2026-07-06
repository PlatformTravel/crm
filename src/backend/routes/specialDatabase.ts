// Routes extracted from server1.ts for the /special-database paths

import { getCollection, checkMongoReady, corsHeaders, generateId, Collections, convertMongoDocs, convertMongoDoc } from "../utils.ts";

// Each function handles a specific /special-database endpoint.
export async function getSpecialNumbers(req: any, path: string, url: URL) {
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;

  try {
    const specialDbCollection = await getCollection(Collections.SPECIAL_DATABASE);
    const numbers = await specialDbCollection.find({}).sort({ uploadedAt: -1 }).toArray();

    console.log(`[SPECIAL DATABASE] Found ${numbers.length} numbers in database`);
    console.log(`[SPECIAL DATABASE] Status breakdown:`, {
      available: numbers.filter(n => n.status === 'available').length,
      assigned: numbers.filter(n => n.status === 'assigned').length,
      archived: numbers.filter(n => n.status === 'archived').length
    });

    return new Response(
      JSON.stringify({ success: true, numbers: convertMongoDocs(numbers) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[SPECIAL DATABASE] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message, numbers: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function uploadNumbers(req: any) {
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;

  try {
    const body = await req.json();
    const { phoneNumbers, purpose, notes } = body;
    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Phone numbers are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!purpose || purpose.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, error: 'Purpose is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const specialDbCollection = await getCollection(Collections.SPECIAL_DATABASE);
    const numbersToUpload = phoneNumbers.map(phoneNumber => ({
      id: generateId(),
      phoneNumber: phoneNumber.trim(),
      purpose: purpose.trim(),
      notes: notes?.trim() || '',
      uploadedAt: new Date().toISOString(),
      status: 'available'
    }));

    await specialDbCollection.insertMany(numbersToUpload);
    console.log(`[SPECIAL DATABASE] Uploaded ${numbersToUpload.length} numbers for purpose: ${purpose}`);

    return new Response(
      JSON.stringify({ success: true, uploaded: numbersToUpload.length, message: `Successfully uploaded ${numbersToUpload.length} number(s)` }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[SPECIAL DATABASE] Upload error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function assignNumbers(req: any) {
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;

  try {
    const body = await req.json();
    const { agentId, numberIds } = body;
    if (!agentId || !numberIds || !Array.isArray(numberIds) || numberIds.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Agent ID and number IDs are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const specialDbCollection = await getCollection(Collections.SPECIAL_DATABASE);
    const usersCollection = await getCollection(Collections.USERS);
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);

    const agent = await usersCollection.findOne({ id: agentId });
    if (!agent) {
      return new Response(JSON.stringify({ success: false, error: 'Agent not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const numbers = await specialDbCollection.find({ id: { $in: numberIds }, status: 'available' }).toArray();
    if (numbers.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No available numbers found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const today = new Date().toISOString().split('T')[0];
    const assignments = numbers.map(number => ({
      id: generateId(),
      agentId: agent.id,
      agentName: agent.name || agent.username,
      phoneNumber: number.phoneNumber,
      purpose: number.purpose,
      notes: number.notes,
      specialNumberId: number.id,
      type: 'special',
      assignedAt: today,
      called: false,
      numberData: {
        id: number.id,
        phoneNumber: number.phoneNumber,
        name: number.purpose,
        purpose: number.purpose,
        notes: number.notes,
        type: 'special'
      }
    }));

    await assignmentsCollection.insertMany(assignments);
    await specialDbCollection.updateMany({ id: { $in: numberIds } }, { $set: { status: 'assigned', assignedTo: agent.name || agent.username, assignedAt: today } });

    console.log(`[SPECIAL DATABASE] Assigned ${numbers.length} numbers to ${agent.name || agent.username}`);
    return new Response(JSON.stringify({ success: true, assigned: numbers.length, message: `Successfully assigned ${numbers.length} number(s) to ${agent.name || agent.username}` }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[SPECIAL DATABASE] Assignment error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}

export async function deleteNumber(req: any, path: string) {
  const numberId = path.split('/')[2];
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;
  try {
    const specialDbCollection = await getCollection(Collections.SPECIAL_DATABASE);
    const result = await specialDbCollection.deleteOne({ id: numberId });
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Number not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ success: true, message: 'Number deleted successfully' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[SPECIAL DATABASE] Delete error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}

export async function getArchive(req: any) {
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;
  try {
    const archiveCollection = await getCollection(Collections.SPECIAL_DATABASE_ARCHIVE);
    const archived = await archiveCollection.find({}).sort({ completedAt: -1 }).toArray();
    return new Response(JSON.stringify({ success: true, archived: convertMongoDocs(archived) }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[SPECIAL DATABASE] Archive error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message, archived: [] }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}

export async function recycleNumbers(req: any) {
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;
  try {
    const body = await req.json();
    const { numberIds } = body;
    if (!numberIds || !Array.isArray(numberIds) || numberIds.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Number IDs are required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const archiveCollection = await getCollection(Collections.SPECIAL_DATABASE_ARCHIVE);
    const specialDbCollection = await getCollection(Collections.SPECIAL_DATABASE);
    const archivedNumbers = await archiveCollection.find({ id: { $in: numberIds } }).toArray();
    if (archivedNumbers.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No archived numbers found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const restoredNumbers = archivedNumbers.map(number => ({
      id: generateId(),
      phoneNumber: number.phoneNumber,
      purpose: number.purpose,
      notes: number.notes || '',
      uploadedAt: new Date().toISOString(),
      status: 'available',
      recycledFrom: number.agentName,
      recycledAt: new Date().toISOString()
    }));
    await specialDbCollection.insertMany(restoredNumbers);
    await archiveCollection.deleteMany({ id: { $in: numberIds } });
    return new Response(JSON.stringify({ success: true, recycled: restoredNumbers.length, message: `Successfully recycled ${restoredNumbers.length} number(s)` }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[SPECIAL DATABASE] Recycle error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}

export async function completeCall(req: any) {
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;
  try {
    const body = await req.json();
    const { assignmentId, callNotes } = body;
    if (!assignmentId) {
      return new Response(JSON.stringify({ success: false, error: 'Assignment ID is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const specialDbCollection = await getCollection(Collections.SPECIAL_DATABASE);
    const archiveCollection = await getCollection(Collections.SPECIAL_DATABASE_ARCHIVE);
    const assignment = await assignmentsCollection.findOne({ id: assignmentId });
    if (!assignment) {
      return new Response(JSON.stringify({ success: false, error: 'Assignment not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (assignment.type !== 'special') {
      return new Response(JSON.stringify({ success: true, message: 'Not a special database assignment' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const archivedNumber = {
      id: generateId(),
      phoneNumber: assignment.phoneNumber,
      purpose: assignment.purpose,
      notes: assignment.notes || '',
      agentId: assignment.agentId,
      agentName: assignment.agentName,
      completedAt: new Date().toISOString(),
      callNotes: callNotes || '',
      originalSpecialNumberId: assignment.specialNumberId
    };
    await archiveCollection.insertOne(archivedNumber);
    if (assignment.specialNumberId) {
      await specialDbCollection.deleteOne({ id: assignment.specialNumberId });
    }
    await assignmentsCollection.updateOne({ id: assignmentId }, { $set: { called: true, completedAt: new Date().toISOString() } });
    return new Response(JSON.stringify({ success: true, message: 'Call completed and number archived successfully' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[SPECIAL DATABASE] Complete call error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}

export async function migrateAssignments(req: any) {
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;
  try {
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const specialAssignments = await assignmentsCollection.find({ type: 'special', numberData: { $exists: false } }).toArray();
    if (specialAssignments.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No assignments need migration', migrated: 0 }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    let migrated = 0;
    for (const assignment of specialAssignments) {
      await assignmentsCollection.updateOne({ id: assignment.id }, { $set: { numberData: {
            id: assignment.specialNumberId || assignment.id,
            phoneNumber: assignment.phoneNumber,
            name: assignment.purpose || 'Special Number',
            purpose: assignment.purpose,
            notes: assignment.notes,
            type: 'special'
          } } });
      migrated++;
    }
    return new Response(JSON.stringify({ success: true, message: `Successfully migrated ${migrated} special assignment(s)`, migrated }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('[SPECIAL DATABASE] Migration error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}
