import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin'; // Import Firebase Admin
import { FieldValue } from 'firebase-admin/firestore'; // Import FieldValue for arrayUnion

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
  try {
    const body = await req.json();
    console.log('Instagram webhook received:', JSON.stringify(body, null, 2));

    if (body.object === 'instagram' && body.entry) {
      const db = getAdminDb(); // Get Firestore instance

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

                // Save user message to Firestore
                const conversationRef = db.collection('instagram_conversations').doc(senderId);
                await conversationRef.set({
                  senderId: senderId,
                  updatedAt: FieldValue.serverTimestamp(),
                  messages: FieldValue.arrayUnion({
                    role: 'user',
                    text: messageText,
                    timestamp: timestamp,
                  }),
                  // Potentially add other conversation metadata here (e.g., agentId, status)
                }, { merge: true });

                const chatResponse = await fetch('http://localhost:3000/api/chat', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    // TODO: Add Authorization header for tenantId if necessary
                  },
                  body: JSON.stringify({ message: messageText }),
                });

                if (chatResponse.ok) {
                  const chatData = await chatResponse.json();
                  const aiReply = chatData.reply;
                  console.log('Chat API response:', aiReply);

                  // Save AI reply to Firestore
                  await conversationRef.update({
                    updatedAt: FieldValue.serverTimestamp(),
                    messages: FieldValue.arrayUnion({
                      role: 'assistant',
                      text: aiReply,
                      timestamp: new Date(),
                    }),
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
    
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error processing Instagram webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
