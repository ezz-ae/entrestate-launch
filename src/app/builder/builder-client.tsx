'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBrochure } from '@/context/BrochureContext';
import { handleOnboarding } from '@/lib/onboarding-handler';
import { availableTemplates, type SiteTemplate } from '@/lib/templates';
import type { SitePage } from '@/lib/types';
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

export default function BuilderPage() {
  const { brochureFile, setBrochureFile } = useBrochure();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPromptRef = useRef<string | null>(null);

  const templateParam = (searchParams?.get('template') ?? '').trim();
  const promptParam = (searchParams?.get('prompt') ?? '').trim();

  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [editableData, setEditableData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [builderTemplate, setBuilderTemplate] = useState<SiteTemplate | null>(null);
  const [builderPage, setBuilderPage] = useState<SitePage | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [promptDraft, setPromptDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [builderError, setBuilderError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const runAnalysis = async () => {
    if (!brochureFile) return;

    setStatus('processing');

    try {
      const formData = new FormData();
      formData.append('file', brochureFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Analysis Result:', data);
      setAnalysisResult(data);
      setEditableData(data.analysis);
      setStatus('ready');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!brochureFile) return;
    setStatus('idle');
    setAnalysisResult(null);
    setEditableData(null);
  }, [brochureFile]);

  useEffect(() => {
    if (brochureFile && status === 'idle') {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brochureFile, status]);

  useEffect(() => {
    if (brochureFile) return;

    if (promptParam) {
      setPromptDraft(promptParam);
      if (lastPromptRef.current !== promptParam) {
        lastPromptRef.current = promptParam;
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
  }, [brochureFile, promptParam, templateParam]);

  const handleBrochureSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
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
    setBuilderTemplate(template);
    setBuilderPage(clonePage(template.pages[0]));
    setBuilderError(null);
    setNotice(null);
    setShowTemplates(false);
    router.replace(`/builder?template=${template.id}`);
  };

  const handleStartOver = () => {
    setBuilderTemplate(null);
    setBuilderPage(null);
    setSelectedBlockId(null);
    setPromptDraft('');
    setBuilderError(null);
    setNotice(null);
    setShowTemplates(false);
    router.replace('/builder');
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

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleBrochureSelect}
        />

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
              <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
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
      </div>
    </div>
  );
}
