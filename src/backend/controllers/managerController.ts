import { corsHeaders } from '../lib/common.ts';
import { getCollection, Collections, convertMongoDocs } from '../mongodb.tsx';
import { checkMongoReady } from '../lib/db.ts';
import { determineAgentStatus } from '../lib/common.ts';

// GET /team-performance
export async function teamPerformance(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;

  try {
    const usersCollection = await getCollection(Collections.USERS);
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const progressCollection = await getCollection(Collections.DAILY_PROGRESS);

    const agents = await usersCollection.find({ role: 'agent' }).toArray();

    const teamData: any[] = [];
    let totalCalls = 0;
    let totalAssigned = 0;

    for (const agent of agents) {
      const assignments = await assignmentsCollection.find({
        agentId: agent.id,
        status: 'assigned'
      }).toArray();

      const progress = (await progressCollection.findOne({ agentId: agent.id })) || {
        callsMade: 0,
        successfulCalls: 0,
        missedCalls: 0
      };

      const assignedCount = assignments.length;
      const callsMade = progress.callsMade || 0;
      const completionRate = assignedCount > 0 ? Math.round((callsMade / assignedCount) * 100) : 0;

      totalCalls += callsMade;
      totalAssigned += assignedCount;

      teamData.push({
        agentId: agent.id,
        agentName: agent.name || agent.username,
        assigned: assignedCount,
        called: callsMade,
        completionRate,
        status: determineAgentStatus(progress.lastActivity)
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        teamPerformance: teamData,
        summary: {
          totalAgents: agents.length,
          totalAssigned,
          totalCalls,
          avgCompletionRate: totalAssigned > 0 ? Math.round((totalCalls / totalAssigned) * 100) : 0
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[MANAGER] Team performance error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// GET /agent-monitoring/agent/:id
export async function agentDetail(req: Request, agentId?: string): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!agentId) {
    return new Response(JSON.stringify({ success: false, error: 'Agent id missing' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;

  try {
    const usersCollection = await getCollection(Collections.USERS);
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);

    const agent = await usersCollection.findOne({ id: agentId });
    if (!agent) {
      return new Response(JSON.stringify({ success: false, error: 'Agent not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const crmAssignments = await assignmentsCollection.find({
      agentId,
      type: 'client'
    }).toArray();
    const crmRecords = crmAssignments.map((a: any) => a.numberData || a);

    const specialAssignments = await assignmentsCollection.find({
      agentId,
      type: 'special'
    }).toArray();
    const specialRecords = specialAssignments.map((a: any) => a.numberData || a);

    const customerRecords = await customersCollection.find({ assignedTo: agentId }).toArray();

    return new Response(
      JSON.stringify({
        success: true,
        agent: {
          id: agent.id,
          name: agent.name || agent.username,
          email: agent.email,
          role: agent.role
        },
        data: {
          crmRecords: convertMongoDocs(crmRecords),
          specialRecords: convertMongoDocs(specialRecords),
          customerRecords: convertMongoDocs(customerRecords)
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[MANAGER] Agent detail error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// GET /agent-monitoring/overview
export async function overview(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;

  try {
    const usersCollection = await getCollection(Collections.USERS);
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);

    const agents = await usersCollection.find({ role: 'agent' }).toArray();

    const agentStats = await Promise.all(agents.map(async (agent: any) => {
      const totalCRMAssignments = await assignmentsCollection.countDocuments({ agentId: agent.id, type: 'client' });
      const completedCRMAssignments = await assignmentsCollection.countDocuments({ agentId: agent.id, type: 'client', called: true });

      const totalSpecialAssignments = await assignmentsCollection.countDocuments({ agentId: agent.id, type: 'special' });
      const completedSpecialAssignments = await assignmentsCollection.countDocuments({ agentId: agent.id, type: 'special', called: true });

      const totalCustomerAssignments = await customersCollection.countDocuments({ assignedTo: agent.id });
      const customersWithNotes = await customersCollection.find({ assignedTo: agent.id }).toArray();
      const completedCustomerAssignments = customersWithNotes.filter((c: any) => c.interactionCompleted === true || (c.notes && c.notes.length > 0)).length;

      const overallTotal = totalCRMAssignments + totalSpecialAssignments + totalCustomerAssignments;
      const overallCompleted = completedCRMAssignments + completedSpecialAssignments + completedCustomerAssignments;
      const overallPending = overallTotal - overallCompleted;

      return {
        id: agent.id,
        name: agent.name || agent.username || 'Unknown',
        email: agent.email || '',
        crm: {
          total: totalCRMAssignments,
          completed: completedCRMAssignments,
          pending: totalCRMAssignments - completedCRMAssignments
        },
        specialNumbers: {
          total: totalSpecialAssignments,
          completed: completedSpecialAssignments,
          pending: totalSpecialAssignments - completedSpecialAssignments
        },
        customerService: {
          total: totalCustomerAssignments,
          completed: completedCustomerAssignments,
          pending: totalCustomerAssignments - completedCustomerAssignments
        },
        overall: {
          total: overallTotal,
          completed: overallCompleted,
          pending: overallPending,
          completionPercentage: overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0
        }
      };
    }));

    return new Response(JSON.stringify({ success: true, agents: agentStats }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('[MANAGER] Overview error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message, agents: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
