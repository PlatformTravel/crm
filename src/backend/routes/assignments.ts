// Routes from server1.ts related to number assignments

import { getCollection, Collections, corsHeaders, convertMongoDocs, generateId } from "../utils.ts";

export async function listAssignments(req: any, url: URL) {
  const collection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
  const agentId = url.searchParams.get('agentId');
  const query = agentId ? { agentId } : {};
  const assignments = await collection.find(query).sort({ assignedAt: -1 }).toArray();
  return new Response(
    JSON.stringify({ success: true, assignments: convertMongoDocs(assignments) }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

export async function claimAssignment(req: any) {
  const body = await req.json();
  const { assignmentId, agentId } = body;
  const collection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
  const assignment = await collection.findOne({ id: assignmentId });
  if (!assignment) {
    return new Response(JSON.stringify({ success: false, error: 'Assignment not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  if (assignment.claimedBy && assignment.claimedBy !== agentId) {
    return new Response(JSON.stringify({ success: false, error: 'Already claimed' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  await collection.updateOne(
    { id: assignmentId },
    { $set: { claimedBy: agentId, claimedAt: new Date().toISOString(), status: 'claimed' } }
  );
  return new Response(JSON.stringify({ success: true, message: 'Assignment claimed successfully' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
