'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useEntitlements } from '@/hooks/use-entitlements';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBrochure } from '@/context/BrochureContext';
import { handleOnboarding } from '@/lib/onboarding-handler';
import { availableTemplates, type SiteTemplate } from '@/lib/templates';
import type { ProjectData, SitePage } from '@/lib/types';
import { PageBuilder } from '@/components/page-builder';
import { TemplateLibrary } from '@/components/template-library';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  FileText,
  ArrowLeft,
  RefreshCw,
  Save,
  CheckCircle2,
  UploadCloud,
  Sparkles,
  Library,
  LayoutTemplate,
} from 'lucide-react';

const TEMPLATE_ALIASES: Record<string, { id?: string; intent?: 'brochure' }> = {
  'brochure-to-web': { intent: 'brochure' },
  'off-plan-brokerage': { id: 'offplan_brokerage_website' },
  'investor-roi-tracker': { id: 'listing_portal_market_data' },
  roadshow: { id: 'template-roadshow' },
  'map-focused': { id: 'template-map-focused' },
  'ads-launch': { id: 'template-ads-launch' },
};

const normalizeTemplateKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const clonePage = (page: SitePage) => JSON.parse(JSON.stringify(page)) as SitePage;

const resolveTemplateSelection = (rawId: string) => {
  const key = rawId.trim().toLowerCase();
  const alias = TEMPLATE_ALIASES[key];

  if (alias?.intent === 'brochure') {
    return { intent: 'brochure' as const, template: null as SiteTemplate | null };
  }

  const candidateIds = [rawId, key, alias?.id].filter(Boolean) as string[];
  for (const id of candidateIds) {
    const template = availableTemplates.find((item) => item.id === id);
    if (template) return { intent: 'template' as const, template };
  }

  const normalized = normalizeTemplateKey(key);
  const template =
    availableTemplates.find((item) => normalizeTemplateKey(item.id) === normalized) ||
    availableTemplates.find(
      (item) =>
        normalizeTemplateKey(item.id).includes(normalized) ||
        normalized.includes(normalizeTemplateKey(item.id))
    );

  return { intent: template ? 'template' as const : null, template: template ?? null };
};

const buildProjectTemplate = (project: ProjectData): SiteTemplate => {
  const heroImage =
    (project.images?.length ? project.images[0] : undefined) ||
    project.brochureUrl ||
    project.publicUrl ||
    undefined;
  const page: SitePage = {
    id: `project-${project.id}`,
    title: project.name,
    brochureUrl: project.brochureUrl || '',
    blocks: [
      {
        blockId: `hero-${project.id}`,
        type: 'hero',
        order: 0,
        data: {
          headline: project.name,
          subtext:
            project.description?.short ||
            project.description?.full ||
            'Explore this exclusive launching opportunity.',
          ctaText: 'Download Brochure',
          backgroundImage: heroImage,
        },
      },
      {
        blockId: `detail-${project.id}`,
        type: 'project-detail',
        order: 1,
        data: {
          projectName: project.name,
          developer: project.developer,
          description: project.description?.full || project.description?.short || '',
          features: project.features?.slice(0, 6) || [],
          brochureUrl: project.brochureUrl,
          locationMapUrl: project.location?.mapQuery
            ? `https://www.google.com/maps/search/${encodeURIComponent(project.location.mapQuery)}`
            : undefined,
          imageUrl: heroImage,
          stats: [
            {
              label: 'Starting Price',
              value: project.price?.label || 'Price on request',
            },
            {
              label: 'Handover',
              value: project.handover && project.handover.quarter && project.handover.year
                ? `Q${project.handover.quarter} ${project.handover.year}`
                : 'TBD',
            },
            {
              label: 'ROI',
              value: project.performance?.roi ? `${project.performance.roi}% ROI` : 'Estimates vary',
            },
          ],
        },
      },
    ],
    canonicalListings: [project.id],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: {
      title: project.name,
      description: project.description?.short || project.name,
      keywords: project.tags || [],
    },
  };

  return {
    id: `project-template-${project.id}`,
    name: project.name,
    siteType: 'custom',
    pages: [page],
  };
};

type ProjectDraft = {
  id: string;
  owner: string;
  status: string;
  title: string;
  prompt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function BuilderPage() {
  const { brochureFile, setBrochureFile } = useBrochure();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPromptRef = useRef<string | null>(null);

  const templateParam = (searchParams?.get('template') ?? '').trim();
  const promptParam = (searchParams?.get('prompt') ?? '').trim();
  const projectParam = (searchParams?.get('project') ?? '').trim();
  const debugMode = searchParams?.get('debug') === '1';

  const [status, setStatus] = useState<'idle' | 'processing' | 'ready' | 'failed'>('idle');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [editableData, setEditableData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);

  const [builderTemplate, setBuilderTemplate] = useState<SiteTemplate | null>(null);
  const [builderPage, setBuilderPage] = useState<SitePage | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [promptDraft, setPromptDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [builderError, setBuilderError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisJobId, setAnalysisJobId] = useState<string | null>(null);
  const activeJobRef = useRef<string | null>(null);
  const { entitlements } = useEntitlements();
  const builderPublishLocked = entitlements?.features.builderPublish.allowed === false;
  const builderPublishReason =
    entitlements?.features.builderPublish.reason ||
    'Publishing drafts requires an eligible Builder or Ads plan.';
  const debugPanel = debugMode ? (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[999] w-72 rounded-2xl border border-white/20 bg-black/70 p-4 text-[11px] text-white/70 backdrop-blur">
      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-2">Builder Debug</div>
      <div className="space-y-1 text-[11px]">
        <div>Project param: {projectParam || '—'}</div>
        <div>Selected project: {selectedProject?.id ?? 'none'}</div>
        <div>Template: {builderTemplate?.id ?? 'none'}</div>
        <div>Blocks: {builderPage?.blocks?.length ?? 0}</div>
        <div>Brochure: {brochureFile ? 'yes' : 'no'}</div>
        <div>Prompt draft: {promptDraft ? 'yes' : 'no'}</div>
        <div>Project loading: {projectLoading ? 'yes' : 'no'}</div>
        <div>Generating: {isGenerating ? 'yes' : 'no'}</div>
        <div>Templates open: {showTemplates ? 'yes' : 'no'}</div>
      </div>
    </div>
  ) : null;

  const createDraft = useCallback(
    async (title?: string, source?: string, prompt?: string) => {
    setDraftLoading(true);
    setDraftError(null);
    try {
      const response = await fetch('/api/projects/create-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title?.trim() || 'New project',
          source,
          prompt: prompt?.trim() || null,
        }),
      });
      const payload = await response.json().catch(() => null);
      const draftPayload = payload?.data?.draft || payload?.draft;
      if (!response.ok || !draftPayload) {
        throw new Error(
          payload?.error?.message ||
            payload?.error ||
            payload?.message ||
            'Draft creation failed'
        );
      }
      setDraft(draftPayload);
      setNotice('Draft ready. Choose how you want to build.');
    } catch (error) {
      console.error('[builder] draft creation failed', error);
      setDraftError(
        'Unable to start a new draft right now. Please retry in a moment.'
      );
    } finally {
      setDraftLoading(false);
    }
    },
    []
  );

  const ensureDraft = useCallback(
    async (source: string, title?: string, prompt?: string) => {
      if (draft || draftLoading) return;
      await createDraft(title, source, prompt);
    },
    [draft, draftLoading, createDraft]
  );

  const runAnalysis = async () => {
    if (!brochureFile) return;

    setStatus('processing');
    setAnalysisError(null);
    setAnalysisJobId(null);

    try {
      const formData = new FormData();
      formData.append('file', brochureFile);

      const response = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        throw new Error(
          payload?.error?.message ||
            payload?.error ||
            payload?.message ||
            'Upload failed'
        );
      }

      const jobId = (payload?.data?.jobId || payload?.jobId) as string | undefined;
      if (!jobId) {
        throw new Error('Upload succeeded but no jobId was returned.');
      }

      setAnalysisJobId(jobId);
      activeJobRef.current = jobId;

      const jobResult = await pollPdfJob(jobId);
      if (!jobResult?.text) {
        throw new Error('PDF analysis completed but no text was extracted.');
      }

      const derived = buildDraftFromText(jobResult.text);
      setAnalysisResult({ jobId, text: jobResult.text });
      setEditableData(derived);
      setStatus('ready');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'PDF analysis failed. Please try again.';
      console.error('Error uploading file:', error);
      setStatus('failed');
      setAnalysisResult(null);
      setEditableData(null);
      setAnalysisError(message);
    }
  };

  const pollPdfJob = async (jobId: string) => {
    const maxAttempts = 30;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (activeJobRef.current !== jobId) {
        return null;
      }
      const response = await fetch(`/api/upload/pdf/status?jobId=${encodeURIComponent(jobId)}`, {
        cache: 'no-store',
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        throw new Error(
          payload?.error?.message ||
            payload?.error ||
            payload?.message ||
            'Failed to read analysis status.'
        );
      }
      const jobData = payload?.data || payload;
      if (jobData.status === 'done') {
        return jobData;
      }
      if (jobData.status === 'failed') {
        throw new Error(jobData.error || 'PDF analysis failed.');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    throw new Error('PDF analysis timed out. Please retry.');
  };

  const buildDraftFromText = (text: string) => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const headline = lines[0]?.slice(0, 120) || 'Untitled Project';
    const description = lines.slice(1, 6).join(' ').slice(0, 600);
    const features = lines
      .slice(6, 16)
      .map((line) => line.replace(/^[-•\\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 7);
    return {
      headline,
      description: description || 'Description pending. Add key highlights or amenities.',
      features,
    };
  };

  useEffect(() => {
    if (!brochureFile) return;
    setStatus('idle');
    setAnalysisResult(null);
    setEditableData(null);
    setAnalysisError(null);
    setAnalysisJobId(null);
    activeJobRef.current = null;
  }, [brochureFile]);

  useEffect(() => {
    if (brochureFile && status === 'idle') {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brochureFile, status]);

  useEffect(() => {
    if (
      builderTemplate ||
      builderPage ||
      brochureFile ||
      projectParam ||
      templateParam ||
      promptParam ||
      draft ||
      draftLoading ||
      draftError
    ) {
      return;
    }
    void createDraft(promptParam || 'New project', 'empty', promptParam);
  }, [
    builderTemplate,
    builderPage,
    brochureFile,
    projectParam,
    templateParam,
    promptParam,
    draft,
    draftLoading,
    draftError,
    createDraft,
  ]);

  useEffect(() => {
    if (brochureFile || projectParam) return;

    if (promptParam) {
      setPromptDraft(promptParam);
      if (lastPromptRef.current !== promptParam) {
        lastPromptRef.current = promptParam;
        void ensureDraft('prompt', 'Prompt draft', promptParam);
        void startFromPrompt(promptParam);
      }
      return;
    }

    if (templateParam) {
      const resolution = resolveTemplateSelection(templateParam);
      if (resolution.intent === 'brochure') {
        setNotice('This blueprint starts from a brochure. Upload a PDF to continue.');
        setShowTemplates(false);
        return;
      }
      if (resolution.template?.pages?.length) {
        void ensureDraft('template', resolution.template.name);
        setBuilderTemplate(resolution.template);
        setBuilderPage(clonePage(resolution.template.pages[0]));
        setBuilderError(null);
        setNotice(null);
        setShowTemplates(false);
        return;
      }

      setNotice('We could not find that template. Choose another from the library.');
      setShowTemplates(true);
      return;
    }

    setNotice(null);
  }, [brochureFile, promptParam, templateParam, projectParam]);

  useEffect(() => {
    if (!projectParam || brochureFile) {
      if (!projectParam) {
        setSelectedProject(null);
      }
      return;
    }

    let cancelled = false;
    setProjectLoading(true);
    setNotice('Loading project details...');

    fetch(`/api/projects/${encodeURIComponent(projectParam)}`, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Project not found');
        const json = await res.json();
        return json?.data ?? null;
      })
      .then((project) => {
        if (cancelled || !project) return;
        void ensureDraft('inventory', project.name);
        const template = buildProjectTemplate(project);
        setBuilderTemplate(template);
        setBuilderPage(clonePage(template.pages[0]));
        setBuilderError(null);
        setSelectedBlockId(null);
        setShowTemplates(false);
        setNotice(`Loaded ${project.name} from inventory.`);
        setSelectedProject(project);
        router.replace(`/builder?project=${project.id}`, { scroll: false });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to load project', error);
        setNotice('Could not load the selected project. Choose another listing or offer feedback.');
        setSelectedProject(null);
      })
      .finally(() => {
        if (!cancelled) {
          setProjectLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectParam, brochureFile, router]);

  const handleBrochureSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    void ensureDraft('brochure', file.name);
    setBrochureFile(file);
  };

  const startFromPrompt = async (prompt: string) => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setIsGenerating(true);
    setBuilderError(null);
    setNotice(null);
    setShowTemplates(false);

    try {
      await ensureDraft('prompt', 'Prompt draft', trimmedPrompt);
      const template = await handleOnboarding(
        { method: 'prompt', 'user-prompt': trimmedPrompt },
        () => {}
      );

      if (!template?.pages?.length) {
        throw new Error('No pages generated');
      }

      setBuilderTemplate(template);
      setBuilderPage(clonePage(template.pages[0]));
      setSelectedBlockId(null);
    } catch (error) {
      console.error('Failed to generate from prompt:', error);
      setBuilderError('We could not generate a draft from that prompt. Try a different prompt or choose a template.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: SiteTemplate) => {
    if (!template.pages?.length) {
      setBuilderError('This template has no pages to edit.');
      return;
    }
    void ensureDraft('template', template.name);
    setBuilderTemplate(template);
    setBuilderPage(clonePage(template.pages[0]));
    setBuilderError(null);
    setNotice(null);
    setShowTemplates(false);
    setSelectedProject(null);
    router.replace(`/builder?template=${template.id}`);
  };

  const handleStartOver = () => {
    setBuilderTemplate(null);
    setBuilderPage(null);
    setSelectedBlockId(null);
    setPromptDraft('');
    setBuilderError(null);
    setNotice('Starting a fresh draft...');
    setShowTemplates(false);
    setSelectedProject(null);
    setProjectLoading(false);
    router.replace('/builder');
    setDraft(null);
    setDraftError(null);
    void createDraft();
  };

  const handleSaveProject = async () => {
    if (!editableData || !analysisResult) return;

    setIsSaving(true);
    try {
      const payload = {
        ...editableData,
        s3_key: analysisResult.s3Key,
        original_filename: analysisResult.name,
      };

      const response = await fetch('/api/save-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save');

      console.log('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (brochureFile) {
    return (
      <div className="min-h-screen bg-black text-white p-6 pt-24">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Project Builder</h1>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{brochureFile.name}</h2>
                <p className="text-zinc-500 font-medium">{(brochureFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
              </div>
            </div>

            {status === 'processing' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-black/20 rounded-2xl border border-white/5">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="text-zinc-400 animate-pulse">Analyzing brochure content...</p>
              </div>
            )}

            {status === 'failed' && (
              <div className="flex flex-col items-center justify-center py-10 space-y-3 bg-red-900/60 rounded-2xl border border-red-500/30">
                <p className="text-sm text-red-100 text-center">
                  {analysisError || 'Analysis could not be completed.'}
                </p>
                <Button
                  onClick={runAnalysis}
                  className="bg-red-500 text-white hover:bg-red-400"
                >
                  Retry analysis
                </Button>
              </div>
            )}

            {status === 'ready' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium">Analysis Complete</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-64 rounded-2xl bg-white/5 border border-white/5 p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Extracted Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={runAnalysis}
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
                        title="Regenerate Analysis"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    {editableData ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Headline</label>
                          <input
                            type="text"
                            value={editableData.headline || ''}
                            onChange={(e) => setEditableData({ ...editableData, headline: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Description</label>
                          <textarea
                            value={editableData.description || ''}
                            onChange={(e) => setEditableData({ ...editableData, description: e.target.value })}
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Features</label>
                          <textarea
                            value={Array.isArray(editableData.features) ? editableData.features.join('\n') : (editableData.features || '')}
                            onChange={(e) => setEditableData({ ...editableData, features: e.target.value.split('\n') })}
                            rows={5}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                          />
                          <p className="text-[10px] text-zinc-600 mt-1">One feature per line</p>
                        </div>

                        <div className="pt-4">
                          <Button
                            onClick={handleSaveProject}
                            disabled={isSaving}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" /> Save Project
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-zinc-500 text-sm">AI extracted content will appear here.</p>
                    )}
                  </div>
                  <div className="h-64 rounded-2xl bg-black/20 border border-white/5 p-6 overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4">Page Preview</h3>
                    {editableData ? (
                      <div className="space-y-3 animate-in fade-in duration-500">
                        <h4 className="text-lg font-bold text-white leading-tight">{editableData.headline || '[Your Headline]'}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{editableData.description || '[Your description will appear here.]'}</p>
                        {editableData.features && editableData.features.length > 0 && editableData.features[0] !== '' && (
                          <ul className="text-xs text-zinc-300 space-y-1 pt-2">
                            {editableData.features.map((feature: string, i: number) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-blue-500 flex-shrink-0" /> {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <p className="text-zinc-500 text-sm">Your live preview will appear here.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
      {debugPanel}
    </div>
  );
}

  if (builderPage) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Builder</p>
              <h1 className="text-xl sm:text-2xl font-bold">
                {builderTemplate?.name ?? 'Custom Draft'}
              </h1>
              <p className="text-xs text-zinc-500">
                {builderTemplate?.siteType ?? 'prompt'} • {builderPage.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="border border-white/10"
                onClick={() => setShowTemplates(true)}
              >
                Browse Templates
              </Button>
              <Button
                variant="ghost"
                className="border border-white/10"
                onClick={handleStartOver}
              >
                Start Over
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <PageBuilder
            page={builderPage}
            onPageUpdate={setBuilderPage}
            selectedBlockId={selectedBlockId}
            onSelectBlock={(block) => setSelectedBlockId(block?.blockId ?? null)}
          />
        </div>
        {debugPanel}
      </div>
    );
  }

  if (showTemplates) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white relative">
      <div className="absolute left-6 top-6 z-20">
        <Button
          variant="ghost"
          className="border border-white/10"
          onClick={() => setShowTemplates(false)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Start
        </Button>
      </div>
      <TemplateLibrary onTemplateSelect={handleTemplateSelect} />
      {debugPanel}
    </div>
  );
}

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Builder</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">Start a new site</h1>
          <p className="text-zinc-400 max-w-2xl text-base sm:text-lg">
            Upload a brochure, describe what you want, or choose a project from inventory. Templates are ready if you want a fast start.
          </p>
        </div>

        {notice && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
            {notice}
          </div>
        )}

        {builderError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            {builderError}
          </div>
        )}

        {builderPublishLocked && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200 font-semibold">Publishing locked</p>
              <p className="text-base font-semibold text-white mt-1">
                {entitlements?.planName || 'Your plan'} cannot publish pages yet.
              </p>
              <p className="text-xs text-amber-100 leading-relaxed">{builderPublishReason}</p>
            </div>
            <Link
              href="/start?intent=upgrade"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-100 border border-amber-200/60 px-3 py-1 rounded-xl hover:bg-amber-500/20 transition"
            >
              View plans
            </Link>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleBrochureSelect}
        />

        {draft && !draftLoading ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <UploadCloud className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Upload a brochure</h3>
              </div>
              <p className="text-sm text-zinc-400">
                Drop a PDF and we will extract the key details to draft your page.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Select PDF
                </Button>
                <span className="text-xs text-zinc-500">PDF only</span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Write what you want</h3>
              </div>
              <p className="text-sm text-zinc-400">
                Describe the project or the style you want. We will draft a page from your prompt.
              </p>
              <Textarea
                value={promptDraft}
                onChange={(event) => setPromptDraft(event.target.value)}
                placeholder="e.g., A luxury off-plan landing page for a Dubai Marina launch with WhatsApp lead capture."
                className="min-h-[120px] bg-black/30 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500/40"
              />
              <Button
                onClick={() => startFromPrompt(promptDraft)}
                disabled={!promptDraft.trim() || isGenerating}
                className="bg-white text-black font-bold hover:bg-zinc-200"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating draft...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate draft
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Library className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold">Pick from inventory</h3>
              </div>
              <p className="text-sm text-zinc-400">
                Choose a project from the market feed and we will prefill the page for you.
              </p>
              <Button asChild className="bg-emerald-500 text-black font-bold hover:bg-emerald-400">
                <Link href="/discover">Browse inventory</Link>
              </Button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                  <LayoutTemplate className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold">Start from a template</h3>
              </div>
              <p className="text-sm text-zinc-400">
                Browse curated layouts designed for off-plan launches, brokerages, and investor funnels.
              </p>
              <Button variant="outline" className="border-white/10 text-white" onClick={() => setShowTemplates(true)}>
                Browse templates
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-zinc-400 space-y-3">
            {draftError ? (
              <>
                <p>{draftError}</p>
                <Button
                  variant="outline"
                  className="border-white/20 text-white"
                  onClick={() => createDraft(promptDraft || 'New project')}
                >
                  Retry Draft
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                <span>Preparing your draft…</span>
              </div>
            )}
          </div>
        )}
        {debugPanel}
      </div>
    </div>
  );
}
