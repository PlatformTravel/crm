import { corsHeaders } from '../lib/common.ts';
import { getCollection, Collections } from '../mongodb.tsx';
import { checkMongoReady } from '../lib/db.ts';

export async function getRecipients(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const mongoCheck = await checkMongoReady();
  if (mongoCheck) return mongoCheck;

  try {
    const collection = await getCollection(Collections.EMAIL_RECIPIENTS);
    const doc = await collection.findOne({ type: 'default' });

    if (doc && doc.recipients) {
      return new Response(
        JSON.stringify({ success: true, recipients: doc.recipients }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const defaultRecipients = [
      "operations@btmlimited.net",
      "quantityassurance@btmlimited.net",
      "clientcare@btmlimited.net"
    ];

    return new Response(
      JSON.stringify({ success: true, recipients: defaultRecipients, isDefault: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[EMAIL-RECIPIENTS] Error fetching recipients:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function saveRecipients(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const body = await req.json();
    const { recipients } = body;

    if (!recipients || !Array.isArray(recipients)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid recipients format. Expected array of email addresses.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Invalid email addresses: ${invalidEmails.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const collection = await getCollection(Collections.EMAIL_RECIPIENTS);
    await collection.updateOne(
      { type: 'default' },
      { $set: { recipients, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    console.log('[EMAIL-RECIPIENTS] ✅ Recipients saved successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Email recipients saved successfully', recipients }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[EMAIL-RECIPIENTS] Error saving recipients:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
