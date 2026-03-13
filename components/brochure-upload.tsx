"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, FileText, Loader2, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BrochureUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0])
      setStatus("uploading")
      
      // Simulate upload and analysis
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setStatus("analyzing")
            setTimeout(() => setStatus("success"), 2000)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  })

  const reset = () => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
  }

  return (
    <section id="brochure-upload" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white sm:text-5xl mb-4">Brochure-to-Landing AI</h2>
          <p className="text-neutral-400 text-lg">
            Upload your property brochure (PDF) and our AI will analyze its content, imagery, and branding to generate a high-converting landing page.
          </p>
        </div>

        <div className="relative rounded-[32px] border border-white/10 bg-neutral-900/50 p-8 backdrop-blur-2xl shadow-2xl">
          {!file ? (
            <div
              {...getRootProps()}
              className={`relative flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-700 bg-neutral-900/50 text-center transition-all hover:border-lime-400/50 hover:bg-lime-400/5 ${
                isDragActive && "border-lime-400 bg-lime-400/10"
              }`}
            >
              <input {...getInputProps()} />
              <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent pointer-events-none" />
              <UploadCloud className="h-12 w-12 text-neutral-500 mb-4 transition-transform group-hover:scale-110" />
              <h3 className="text-xl font-bold text-white">Drop your brochure here</h3>
              <p className="text-sm text-neutral-500">or click to browse (PDF only)</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <FileText className="h-8 w-8 text-lime-400" />
                <div>
                  <p className="font-bold text-white text-left">{file.name}</p>
                  <p className="text-xs text-neutral-400 text-left">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              {status === "uploading" && (
                <div className="mt-8">
                  <p className="text-lime-300 font-semibold mb-2">Uploading...</p>
                  <div className="w-full bg-white/10 rounded-full h-2.5 border border-white/5">
                    <div className="bg-lime-400 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}
              
              {status === "analyzing" && (
                <div className="mt-8 flex items-center justify-center gap-3 text-lg font-semibold text-blue-400 animate-pulse">
                  <Sparkles className="h-5 w-5" />
                  AI is analyzing content, branding, and imagery...
                </div>
              )}

              {status === "success" && (
                <div className="mt-8 text-center rounded-2xl bg-lime-400/10 p-6 border border-lime-400/20">
                  <CheckCircle2 className="h-12 w-12 text-lime-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">Analysis Complete!</h3>
                  <p className="text-neutral-300 mt-2 mb-6">Your high-converting landing page is ready to be finalized in the builder.</p>
                  <Button className="rounded-full bg-lime-400 text-black font-bold px-8 py-6 text-lg hover:bg-lime-300">
                    Finalize in AI Builder
                  </Button>
                </div>
              )}
              
              <Button onClick={reset} variant="link" className="text-neutral-500 mt-6 text-xs">Upload a different file</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
