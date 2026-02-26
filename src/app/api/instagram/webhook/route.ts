export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createRequestId, jsonWithRequestId } from '@/lib/server/request-id';
import { appendInstagramMessage } from '@/server/repositories';

const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || 'your-very-secret-token';
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const challenge = searchParams.get('hub.challenge');
  const token = searchParams.get('hub.verify_token');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse('Forbidden', { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  const requestId = createRequestId();
  const respond = (body: Record<string, unknown>, init?: ResponseInit) =>
    jsonWithRequestId(requestId, body, init);
  try {
    const body = await req.json();
    console.log('Instagram webhook received:', JSON.stringify(body, null, 2));

    if (body.object === 'instagram' && body.entry) {
      for (const entry of body.entry) {
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'messages') {
              const message = change.value;
              const senderId = message.sender_id;
              const messageText = message.message;
              const timestamp = new Date(message.timestamp); // Assuming message.timestamp exists

              if (senderId && messageText) {
                console.log(`Received message from ${senderId}: ${messageText}`);

                await appendInstagramMessage(senderId, {
                  role: 'user',
                  text: messageText,
                  timestamp: timestamp.toISOString(),
                });

                const baseUrl = new URL(req.url).origin;
                const chatResponse = await fetch(`${baseUrl}/api/agent/demo`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    message: messageText,
                    context: 'Instagram DM lead capture.',
                  }),
                });

                if (chatResponse.ok) {
                  const chatData = await chatResponse.json();
                  const aiReply =
                    chatData?.data?.reply ||
                    chatData?.reply ||
                    'Thanks for your message. Share your budget, preferred area, and timeline, and we will follow up.';
                  console.log('Chat API response:', aiReply);

                  await appendInstagramMessage(senderId, {
                    role: 'assistant',
                    text: aiReply,
                    timestamp: new Date().toISOString(),
                  });

                  // Send AI reply back to Instagram
                  if (INSTAGRAM_ACCESS_TOKEN) {
                    const instagramSendApiUrl = `https://graph.facebook.com/v19.0/me/messages?access_token=${INSTAGRAM_ACCESS_TOKEN}`;
                    const sendPayload = {
                      recipient: { id: senderId },
                      message: { text: aiReply },
                    };

                    const instagramSendResponse = await fetch(instagramSendApiUrl, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(sendPayload),
                    });

                    if (instagramSendResponse.ok) {
                      console.log('Successfully sent message back to Instagram.');
                    } else {
                      console.error('Failed to send message back to Instagram:', await instagramSendResponse.text());
                    }
                  } else {
                    console.warn('INSTAGRAM_ACCESS_TOKEN is not set. Cannot send messages back to Instagram.');
                  }
                } else {
                  console.error('Error from chat API:', await chatResponse.text());
                }
              }
            }
          }
        }
      }
    }
    
    return respond({ ok: true, data: { status: 'success' }, requestId });
  } catch (error) {
    console.error('Error processing Instagram webhook:', error);
    return respond(
      {
        ok: false,
        error: { code: 'internal_error', message: 'Failed to process webhook.' },
        requestId,
      },
      { status: 500 }
    );
  }
}
