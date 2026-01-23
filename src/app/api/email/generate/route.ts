import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { FLASH_MODEL, getGoogleModel } from '@/lib/ai/google';

/**
 * AI Email Content Generator
 * COST OPTIMIZED: Switched to 1.5-FLASH
 */


export async function POST(req: NextRequest) {
    try {
        const { tenantId } = await requireRole(req, ALL_ROLES);
        const ip = getRequestIp(req);
        if (!(await enforceRateLimit(`email:generate:${tenantId}:${ip}`, 20, 60_000))) {
          return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        const { topic, context } = await req.json();

        if (!topic) return NextResponse.json({ error: 'Topic required' }, { status: 400 });

        const { text } = await generateText({
            model: getGoogleModel(FLASH_MODEL),
            system: "You are a real estate expert. Write a concise, professional email. Include 'Subject: ' on the first line.",
            prompt: `Email about: ${topic}. Context: ${context}.`,
        });

        const lines = text.split('\n');
        const subjectLine = lines.find(l => l.toLowerCase().includes('subject:')) || 'Subject: Entrestate OS Update';
        const body = text.replace(subjectLine, '').trim();

        return NextResponse.json({ 
            subject: subjectLine.replace(/subject:/i, '').trim(), 
            body: body 
        });
    } catch (error: any) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.json({ error: 'Generation failed', details: error.message }, { status: 500 });
    }
}
