// Call progress & recycling related routes extracted from server1.ts

import { getCollection, Collections, corsHeaders, convertMongoDocs, checkMongoReady } from "../utils.ts";

// NOTE: the implementations below were copied verbatim from server1.ts,
// with a little cleanup. Additional routes should be added as needed.

export async function getCallProgress(req: any) {
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;

  try {
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const usersCollection = await getCollection(Collections.USERS);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const assignments = await assignmentsCollection.find({ assignedAt: { $gte: todayStr } }).toArray();
    const agents = await usersCollection.find({ role: { $in: ['agent', 'Agent'] } }).toArray();

    const progress = agents.map((agent: any) => {
      const agentAssignments = assignments.filter((a: any) => a.agentId === agent.id);
      const completedAssignments = agentAssignments.filter((a: any) => a.called === true);
      const uncompletedAssignments = agentAssignments.filter((a: any) => a.called !== true);

      return {
        agentUsername: agent.username || agent.id,
        agentName: agent.name || agent.username || 'Unknown Agent',
        type: 'client',
        totalAssigned: agentAssignments.length,
        completed: completedAssignments.length,
        uncompleted: uncompletedAssignments.length,
        completedNumbers: completedAssignments.map((a: any) => a.phoneNumber || a.numberData?.phoneNumber || a.id),
        uncompletedNumbers: uncompletedAssignments.map((a: any) => a.phoneNumber || a.numberData?.phoneNumber || a.id),
        assignedDate: todayStr,
      };
    });

    return new Response(
      JSON.stringify({ success: true, progress }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[CALL PROGRESS] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message, progress: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Other call-progress handlers (recycle, archive, recycle-agent) can be added here following same pattern

export async function recycleUncompletedCalls(req: any) {
  console.log('[CALL PROGRESS] Recycling uncompleted calls');
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) {
    return mongoCheck;
  }

  try {
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const clientsCollection = await getCollection(Collections.NUMBERS_DATABASE);
    const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);

    // Find all uncompleted assignments
    const uncompletedAssignments = await assignmentsCollection.find({
      called: { $ne: true }
    }).toArray();

    let recycled = 0;

    for (const assignment of uncompletedAssignments) {
      if (assignment.type === 'client') {
        const client = {
          id: assignment.recordId || assignment.id,
          phoneNumber: assignment.phoneNumber,
          name: assignment.name || 'Unknown',
          recycledAt: new Date().toISOString()
        };
        await clientsCollection.updateOne(
          { phoneNumber: assignment.phoneNumber },
          { $set: client },
          { upsert: true }
        );
      } else if (assignment.type === 'customer') {
        const customer = {
          id: assignment.recordId || assignment.id,
          phoneNumber: assignment.phoneNumber,
          name: assignment.name || 'Unknown',
          recycledAt: new Date().toISOString()
        };
        await customersCollection.updateOne(
          { phoneNumber: assignment.phoneNumber },
          { $set: customer },
          { upsert: true }
        );
      }
      recycled++;
    }

    await assignmentsCollection.deleteMany({
      called: { $ne: true }
    });

    console.log(`[CALL PROGRESS] Recycled ${recycled} uncompleted calls`);
    return new Response(
      JSON.stringify({
        success: true,
        recycled,
        message: `Successfully recycled ${recycled} uncompleted calls back to the database`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[CALL PROGRESS] Recycle error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function archiveCompletedCalls(req: any) {
  console.log('[CALL PROGRESS] Archiving completed calls');
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) {
    return mongoCheck;
  }

  try {
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const archiveCollection = await getCollection(Collections.ARCHIVE);

    const completedAssignments = await assignmentsCollection.find({
      called: true
    }).toArray();

    if (completedAssignments.length > 0) {
      const archiveRecords = completedAssignments.map(assignment => ({
        ...assignment,
        entityType: assignment.type === 'client' ? 'client' : 'customer',
        archivedAt: new Date().toISOString(),
        archivedBy: 'system-auto'
      }));

      await archiveCollection.insertMany(archiveRecords);
      await assignmentsCollection.deleteMany({ called: true });
      console.log(`[CALL PROGRESS] Archived ${completedAssignments.length} completed calls`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        archived: completedAssignments.length,
        message: `Successfully archived ${completedAssignments.length} completed calls`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[CALL PROGRESS] Archive error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function recycleAgentNumbers(req: any) {
  const body = await req.json();
  const { agentUsername, type } = body;

  console.log(`[CALL PROGRESS] Recycling ${type} numbers for agent: ${agentUsername}`);
  const mongoCheck = await checkMongoReady();
  if (mongoCheck) {
    return mongoCheck;
  }

  try {
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const usersCollection = await getCollection(Collections.USERS);
    const clientsCollection = await getCollection(Collections.NUMBERS_DATABASE);
    const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);

    const agent = await usersCollection.findOne({ username: agentUsername });
    if (!agent) {
      return new Response(
        JSON.stringify({ success: false, error: 'Agent not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const uncompletedAssignments = await assignmentsCollection.find({
      agentId: agent.id,
      type,
      called: { $ne: true }
    }).toArray();

    let recycled = 0;
    for (const assignment of uncompletedAssignments) {
      if (type === 'client') {
        const client = {
          id: assignment.recordId || assignment.id,
          phoneNumber: assignment.phoneNumber,
          name: assignment.name || 'Unknown',
          recycledAt: new Date().toISOString(),
          recycledFrom: agentUsername
        };
        await clientsCollection.updateOne(
          { phoneNumber: assignment.phoneNumber },
          { $set: client },
          { upsert: true }
        );
      } else if (type === 'customer') {
        const customer = {
          id: assignment.recordId || assignment.id,
          phoneNumber: assignment.phoneNumber,
          name: assignment.name || 'Unknown',
          recycledAt: new Date().toISOString(),
          recycledFrom: agentUsername
        };
        await customersCollection.updateOne(
          { phoneNumber: assignment.phoneNumber },
          { $set: customer },
          { upsert: true }
        );
      }
      recycled++;
    }

    await assignmentsCollection.deleteMany({
      agentId: agent.id,
      type,
      called: { $ne: true }
    });

    console.log(`[CALL PROGRESS] Recycled ${recycled} ${type} numbers from ${agentUsername}`);
    return new Response(
      JSON.stringify({
        success: true,
        recycled,
        message: `Recycled ${recycled} ${type} numbers from ${agentUsername}`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[CALL PROGRESS] Recycle-agent error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
