import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { generateSiteStructure } from '@/lib/ai/vertex-service';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import {
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { SitePage, Block } from '@/lib/types';

export async function POST(req: NextRequest) {
    try {
        const { tenantId, uid } = await requireRole(req, ALL_ROLES);
        const { projectId, extractedText, language } = await req.json();

        if (!projectId || !extractedText) {
            return NextResponse.json({ error: 'projectId and extractedText are required' }, { status: 400 });
        }

        const prompt = `Generate a landing page for a real estate project based on the following text. The language is ${language || 'en'}.\n\n${extractedText}`;

        const { object: siteData } = await generateSiteStructure(prompt);

        const newSite: SitePage = {
            id: '',
            title: siteData.title,
            blocks: siteData.blocks.map((block: Omit<Block, 'blockId' | 'order'>, index: number) => ({
                ...block,
                blockId: `block-${index}`,
                order: index,
            })),
            seo: siteData.seo,
            canonicalListings: [],
            brochureUrl: '',
            ownerUid: uid,
            tenantId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const db = getAdminDb();
        await enforceUsageLimit(db, tenantId, 'landing_pages', 1);
        const siteRef = db.collection('sites').doc();
        const pageId = siteRef.id;
        await siteRef.set(
            {
                ...newSite,
                id: pageId,
                projectId: projectId || null,
                updatedAt: FieldValue.serverTimestamp(),
                createdAt: FieldValue.serverTimestamp(),
            },
            { merge: true },
        );

        return NextResponse.json({ pageId });
    } catch (error) {
        console.error("API Error:", error);

        if (error instanceof PlanLimitError) {
            return NextResponse.json(
                { error: error.message || 'You have exceeded your plan limit for landing page generation.' },
                { status: 402 },
            );
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: 'Authentication required. Please sign in to generate sites.' }, { status: 401 });
        }
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: 'Access denied. You do not have the necessary permissions to generate sites.' }, { status: 403 });
        }
        
        // More specific error for AI generation failure
        if (error && typeof error === 'object' && 'message' in error) {
            return NextResponse.json({ error: `Failed to generate site structure: ${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unexpected error occurred during site generation. Please try again or contact support.' }, { status: 500 });
