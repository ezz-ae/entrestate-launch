import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// We must not construct the OpenAI client at module import time because
// that can throw during a build when environment variables are not set.
// Instead, lazily import and construct the client inside the request handler.

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    // dynamic import to handle CJS/ESM differences for pdf-parse
  const pdfModule = await import('pdf-parse');
  const pdfModuleAny = pdfModule as any;
  const pdf = pdfModuleAny.default ?? pdfModuleAny;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    console.log(`Server received file: ${file.name} (${file.size} bytes)`);

    // Convert the file to a Buffer for processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF content
    const data = await pdf(buffer);

    // Generate Summary with OpenAI (lazily initialize client to avoid build-time errors)
    let analysis = null;
    if (process.env.OPENAI_API_KEY) {
      const openAIMod: any = await import('openai');
      const OpenAI = openAIMod?.default ?? openAIMod;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are an expert real estate copywriter. Analyze the provided brochure text and extract the following information in JSON format:\n- headline: A compelling, high-converting headline for the property.\n- description: A persuasive summary of the project (approx 100 words).\n- features: An array of 5-7 key amenities or selling points." },
          { role: "user", content: data.text.slice(0, 30000) }, // Truncate to avoid token limits
        ],
      });

      const content = completion?.choices?.[0]?.message?.content;
      try {
        analysis = JSON.parse(content || "{}");
      } catch (e) {
        console.error("Failed to parse OpenAI response", e);
      }
    } else {
      console.warn('OPENAI_API_KEY not set; skipping OpenAI analysis');
    }

    // Upload to S3
    const fileKey = `uploads/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    }));
    
    return NextResponse.json({ 
      success: true, 
      name: file.name,
      size: file.size,
      text: data.text,
      s3Key: fileKey,
      analysis
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}