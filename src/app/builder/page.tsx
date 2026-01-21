'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBrochure } from '@/context/BrochureContext';
import { Loader2, FileText, ArrowLeft, RefreshCw, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BuilderPage() {
  const { brochureFile } = useBrochure();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [editableData, setEditableData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      console.log("Analysis Result:", data);
      setAnalysisResult(data);
      setEditableData(data.analysis);
      setStatus('ready');
    } catch (error) {
      console.error('Error uploading file:', error);
      // You might want to set an error state here
    }
  };

  useEffect(() => {
    if (brochureFile && status === 'idle') {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brochureFile]);

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

  if (!brochureFile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
        <div className="text-center space-y-6 max-w-md">
          <p className="text-zinc-400 text-lg">No brochure found. Please upload a file to start.</p>
          <Button 
            onClick={() => router.push('/')}
            className="rounded-full font-bold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back Home
          </Button>
        </div>
      </div>
    );
  }

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
              
              {/* Your Builder UI goes here */}
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
                              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                              <><Save className="mr-2 h-4 w-4" /> Save Project</>
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
                              <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-blue-500 flex-shrink-0" /> {feature}</li>
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