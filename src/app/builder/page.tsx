'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { PageBuilder } from '@/components/page-builder';
import { EditorHeader } from '@/components/editor/header/editor-header';
import { LeftSidebar } from '@/components/editor/sidebar/left-sidebar';
import { RightSidebar } from '@/components/editor/sidebar/right-sidebar';
import { BuilderLandingPage } from '@/components/builder-landing-page';
import { PublishSuccessDialog } from '@/components/publish-success-dialog';
import { SeoSettingsDialog } from '@/components/seo-settings-dialog';
import { PageRenderer } from '@/components/page-renderer';
// All other imports are commented out
// import { SitePage, Block } from '@/lib/types';
// import { Loader2, Sparkles, ArrowLeftRight } from 'lucide-react';
// import { saveSite, getUserSites, updateSiteMetadata } from '@/lib/firestore-service';
// import { useToast } from '@/hooks/use-toast';
// import { getAuth } from 'firebase/auth';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { cn } from '@/lib/utils';
// import { getBlueprintTemplate } from '@/lib/onboarding-blueprints';
// import { createJob, subscribeToJobs, Job } from '@/lib/jobs';
// import { ToastAction } from '@/components/ui/toast';
// import { Button } from '@/components/ui/button';

// Mock types and functions that are no longer directly used but were from the original file
type SitePage = any;
type Block = any;
type Job = any;

const INITIAL_PAGE_STATE: SitePage = {
    id: '',
    title: 'Untitled Site',
    blocks: [],
    canonicalListings: [],
    brochureUrl: '',
    tenantId: 'public',
    seo: {
        title: '',
        description: '',
        keywords: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

function BuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    console.log('BuilderContent: Local components imported, rendering BuilderLandingPage.');

    // Mock functions needed by BuilderLandingPage
    const handleStartWithAI = (prompt: string) => { console.log('Mock handleStartWithAI called with:', prompt); };
    const onChooseTemplate = () => { console.log('Mock onChooseTemplate called'); };


    return (
        <BuilderLandingPage
            onStartWithAI={handleStartWithAI}
            onChooseTemplate={onChooseTemplate}
        />
    );
}

// Keep these functions/interfaces to avoid errors if they are referenced elsewhere, but their logic is irrelevant for this minimal test
const cloneSitePage = (value: SitePage): SitePage => JSON.parse(JSON.stringify(value));
interface RefinerArtifacts { snapshot: SitePage | null; html: string | null; previewUrl: string | null; }
const ensureSitePage = (value: any): SitePage | null => { if (!value || typeof value !== 'object') return null; if (!Array.isArray((value as SitePage).blocks)) return null; return value as SitePage; };
const extractRefinerArtifacts = (job?: Job | null): RefinerArtifacts => { return { snapshot: null, html: null, previewUrl: null }; };


export default function BuilderPage() {
    return (
        <BuilderContent />
    );
}