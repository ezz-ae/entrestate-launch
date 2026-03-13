import { useState, useEffect } from "react"
import { Monitor, Smartphone, Tablet, Send, Sparkles, X, ChevronRight, Layout, Palette, Type, Database, CreditCard, CheckCircle2, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SiteBuilderProps {
  initialUrl: string
  productTitle: string
}

export function SiteBuilder({ initialUrl, productTitle }: SiteBuilderProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<"chat" | "data" | "checkout">("chat")
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildProgress, setBuildProgress] = useState(0)
  const [chatInput, setChatInput] = useState("")
  const [userData, setUserData] = useState({
    brokerageName: "",
    location: "",
    specialty: "",
    contactEmail: "",
    whatsApp: "",
    // Bio-specific fields
    fullName: "",
    bio: "",
    socialLinks: { instagram: "", linkedin: "" }
  })
  
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: `Hi! I'm your Mashroi AI assistant. I'm ready to build your ${productTitle} site. Should we start by collecting your details, or do you want to jump straight into customization?` }
  ])

  const isBioLink = productTitle.toLowerCase().includes("bio")

  // Simulate build progress
  useEffect(() => {
    if (isBuilding) {
      const interval = setInterval(() => {
        setBuildProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsBuilding(false)
            return 100
          }
          return prev + 5
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isBuilding])

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    
    const newMessages = [...messages, { role: "user" as const, content: chatInput }]
    setMessages(newMessages)
    setChatInput("")

    setIsBuilding(true)
    setBuildProgress(0)

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: `Done! I've updated the ${productTitle} ${isBioLink ? "Personal Hub" : "template"} based on your request. I've also optimized the ${isBioLink ? "social links and bio section" : "lead capture and listings"} for conversion.` 
      }])
    }, 2000)
  }

  const handleDataUpdate = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
    // Automatically trigger a small build simulation when important data is added
    if (value.length > 5 && !isBuilding) {
      setIsBuilding(true)
      setBuildProgress(0)
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "ai", 
          content: `I've detected your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is "${value}". I'm automatically updating the page copy and SEO tags to reflect this change.` 
        }])
      }, 1500)
    }
  }

  const handleFinalize = () => {
    setActiveTab("checkout")
  }

  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const handlePurchase = async () => {
    setIsProcessingPayment(true)
    try {
      const response = await fetch('/api/payments/paypal/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: productTitle.toLowerCase().includes("bio") ? "699" : "2399",
          productTitle 
        }),
      });
      const { approvalUrl } = await response.json();
      if (approvalUrl) {
        window.location.href = approvalUrl;
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="relative flex h-[850px] w-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-neutral-950 shadow-2xl">
      {/* Builder Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 bg-neutral-900/50 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 p-1.5 transition-transform hover:rotate-12">
            <Sparkles className="h-full w-full text-black" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Mashroi AI Builder</h3>
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-widest text-lime-400/80">Editing: {productTitle}</p>
              {isBuilding && (
                <div className="flex items-center gap-1.5 ml-2">
                  <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-lime-400 transition-all duration-300" style={{ width: `${buildProgress}%` }} />
                  </div>
                  <span className="text-[9px] text-lime-400 font-bold animate-pulse">BUILDING...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="hidden items-center gap-1 rounded-full bg-black/40 p-1 md:flex">
          {[
            { id: "desktop", icon: Monitor },
            { id: "tablet", icon: Tablet },
            { id: "mobile", icon: Smartphone }
          ].map((device) => (
            <button
              key={device.id}
              onClick={() => setViewMode(device.id as any)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                viewMode === device.id ? "bg-white text-black shadow-lg" : "text-neutral-400 hover:text-white"
              )}
            >
              <device.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 mr-4 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight">AI Active</span>
          </div>
          <Button 
            onClick={handleFinalize}
            className="rounded-full bg-lime-400 px-6 text-xs font-black text-black hover:bg-lime-300 transition-all hover:scale-105 active:scale-95"
          >
            Finalize & Launch
          </Button>
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Main Preview Area (Canvas) */}
        <div className="flex flex-1 flex-col items-center justify-center bg-neutral-900/30 p-4 md:p-10">
          <div 
            className={cn(
              "relative h-full overflow-hidden rounded-3xl border border-white/10 bg-black transition-all duration-700 shadow-[0_60px_120px_rgba(0,0,0,0.7)]",
              viewMode === "desktop" && "w-full",
              viewMode === "tablet" && "max-w-[768px] w-full",
              viewMode === "mobile" && "max-w-[390px] w-full border-[12px] border-neutral-800 rounded-[48px]"
            )}
          >
            {/* Status Overlays */}
            {isBuilding && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative h-20 w-20">
                    <Loader2 className="h-full w-full text-lime-400 animate-spin opacity-20" />
                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-lime-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">AI is optimizing your site...</h4>
                    <p className="text-sm text-neutral-400 mt-1 italic">Generating SEO metadata and responsive layouts</p>
                  </div>
                  <div className="w-64 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                    <div className="h-full bg-lime-400 transition-all duration-500 ease-out" style={{ width: `${buildProgress}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* Browser chrome for desktop/tablet */}
            {viewMode !== "mobile" && (
              <div className="flex h-8 items-center gap-1.5 border-b border-white/10 bg-neutral-900 px-4">
                <div className="h-2 w-2 rounded-full bg-red-500/50" />
                <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                <div className="h-2 w-2 rounded-full bg-green-500/50" />
                <div className="ml-4 flex h-4 flex-1 items-center rounded-md bg-black/30 px-3 text-[9px] text-neutral-500">
                  {userData.brokerageName ? `${userData.brokerageName.toLowerCase().replace(/ /g, '-')}.mashroi.com` : `preview-${productTitle.toLowerCase().replace(/ /g, '-')}.mashroi.com`}
                </div>
              </div>
            )}

            <iframe 
              src={initialUrl} 
              className={cn(
                "h-full w-full border-none transition-opacity duration-500",
                isBuilding ? "opacity-30 grayscale blur-[2px]" : "opacity-100"
              )}
              title="Site Preview"
            />
          </div>
          
          <div className="mt-6 flex items-center gap-6 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-lime-400" /> Auto-Saving</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-lime-400" /> SSL Active</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-lime-400" /> SEO Optimized</span>
          </div>
        </div>

        {/* Builder Sidebar */}
        <div 
          className={cn(
            "absolute inset-y-0 right-0 z-40 w-[340px] border-l border-white/10 bg-neutral-950/95 backdrop-blur-3xl transition-transform duration-500 md:relative md:translate-x-0",
            !isAiPanelOpen && "translate-x-full md:hidden"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Tabs */}
            <div className="grid grid-cols-3 border-b border-white/5">
              {[
                { id: "chat", icon: Sparkles, label: "AI Chat" },
                { id: "data", icon: Database, label: "Content" },
                { id: "checkout", icon: CreditCard, label: "Launch" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-4 transition-all border-b-2",
                    activeTab === tab.id 
                      ? "border-lime-400 bg-lime-400/5 text-white" 
                      : "border-transparent text-neutral-500 hover:text-neutral-300"
                  )}
                >
                  <tab.icon className={cn("h-4 w-4", activeTab === tab.id && "text-lime-400")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === "chat" && (
                <div className="flex h-full flex-col">
                  {/* Chat History */}
                  <div className="flex-1 space-y-4 p-6">
                    {messages.map((msg, i) => (
                      <div key={i} className={cn("flex flex-col animate-fade-up", msg.role === "user" ? "items-end" : "items-start")}>
                        <div 
                          className={cn(
                            "max-w-[90%] rounded-2xl p-4 text-sm leading-relaxed",
                            msg.role === "user" 
                              ? "bg-lime-400 text-black font-bold rounded-tr-none shadow-lg" 
                              : "bg-white/5 text-neutral-200 border border-white/10 rounded-tl-none"
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-6 bg-neutral-950/50 border-t border-white/5">
                    <div className="relative">
                      <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                        placeholder="e.g. 'Change primary color to gold'"
                        className="w-full resize-none rounded-2xl border border-white/10 bg-black/50 p-4 pr-12 text-sm text-white placeholder:text-neutral-700 focus:border-lime-400/50 focus:outline-none transition-all"
                        rows={3}
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim() || isBuilding}
                        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "data" && (
                <div className="p-6 space-y-6 animate-fade-up">
                  <div className="rounded-2xl bg-lime-400/10 p-4 border border-lime-400/20">
                    <p className="text-xs text-lime-300 font-medium flex items-center gap-2">
                      <Info className="h-3 w-3" />
                      AI uses this data to customize your site content and SEO automatically.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {isBioLink ? (
                      <>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Full Name</Label>
                          <Input 
                            value={userData.fullName}
                            onChange={(e) => handleDataUpdate("fullName", e.target.value)}
                            placeholder="e.g. John Doe"
                            className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-lime-400/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Short Bio</Label>
                          <textarea 
                            value={userData.bio}
                            onChange={(e) => handleDataUpdate("bio", e.target.value)}
                            placeholder="e.g. Expert in Dubai Marina luxury villas..."
                            className="w-full h-24 bg-white/5 border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-1 focus:ring-lime-400/50 outline-none resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">WhatsApp Number</Label>
                          <Input 
                            value={userData.whatsApp}
                            onChange={(e) => handleDataUpdate("whatsApp", e.target.value)}
                            placeholder="e.g. +971 50 123 4567"
                            className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-lime-400/50"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Brokerage Name</Label>
                          <Input 
                            value={userData.brokerageName}
                            onChange={(e) => handleDataUpdate("brokerageName", e.target.value)}
                            placeholder="e.g. Skyline Properties"
                            className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-lime-400/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Service Area</Label>
                          <Input 
                            value={userData.location}
                            onChange={(e) => handleDataUpdate("location", e.target.value)}
                            placeholder="e.g. Dubai Marina, Business Bay"
                            className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-lime-400/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Specialty</Label>
                          <Input 
                            value={userData.specialty}
                            onChange={(e) => handleDataUpdate("specialty", e.target.value)}
                            placeholder="e.g. Off-plan Luxury Villas"
                            className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-lime-400/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">WhatsApp Number</Label>
                          <Input 
                            value={userData.whatsApp}
                            onChange={(e) => handleDataUpdate("whatsApp", e.target.value)}
                            placeholder="e.g. +971 50 123 4567"
                            className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-lime-400/50"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => { setIsBuilding(true); setActiveTab("chat"); }}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 py-6"
                  >
                    Sync with AI
                  </Button>
                </div>
              )}

              {activeTab === "checkout" && (
                <div className="p-6 space-y-8 animate-fade-up">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-400/20 mb-4">
                      <CheckCircle2 className="h-8 w-8 text-lime-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white">Your site is ready!</h4>
                    <p className="text-sm text-neutral-400 mt-2">Just one step away from launching on your custom domain.</p>
                  </div>

                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-sm text-neutral-400">Template</span>
                      <span className="text-sm font-bold text-white">{productTitle}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-sm text-neutral-400">Hosting & SSL</span>
                      <span className="text-sm font-bold text-lime-400">Included</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-base font-bold text-white">Total</span>
                      <span className="text-2xl font-black text-white">AED 2,399</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePurchase}
                    disabled={isProcessingPayment}
                    className="w-full rounded-full bg-lime-400 py-8 text-lg font-black text-black hover:bg-lime-300 shadow-[0_0_40px_rgba(132,204,22,0.3)] transition-all hover:scale-[1.02]"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : "Purchase & Go Live"}
                  </Button>
                  
                  <p className="text-[10px] text-center text-neutral-500 uppercase tracking-widest">Secure Checkout via PayPal / Stripe</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
