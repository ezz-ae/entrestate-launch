import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions — Mashroi",
  description: "Terms and conditions for Mashroi website templates and AI builder.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.1),rgba(0,0,0,0))]" />
        </div>
        
        <div className="container relative mx-auto px-4 max-w-4xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-neutral-900/40 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
            <div className="relative space-y-12">
              <header className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300/80">Legal</p>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Terms and Conditions</h1>
                <p className="text-neutral-400 text-lg leading-relaxed">
                  Welcome to Mashroi. By accessing our website, you agree to these terms and conditions. Please read
                  them carefully.
                </p>
              </header>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
                <p className="text-neutral-300">
                  These Terms and Conditions govern your use of the Mashroi website and services. By using our
                  website, you accept these Terms in full.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">2. Intellectual Property Rights</h2>
                <p className="text-neutral-300">
                  Unless otherwise stated, Mashroi owns all the project files. This includes all electronic files,
                  drawings, source files, and any materials provided to the client, which remain the sole property of
                  Mashroi, even if shared.
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-400">
                  <li>You must not republish material from this site.</li>
                  <li>
                    You must not reproduce, duplicate, or copy material for commercial purposes without permission.
                  </li>
                  <li>You must not edit or modify any content without consent.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">3. Acceptable Use</h2>
                <p className="text-neutral-300">
                  You must not use this website in any way that causes, or may cause, damage to the website or
                  impairment of the availability or accessibility of the website.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">
                  4. Limitation of Liability
                </h2>
                <p className="text-neutral-300">
                  Mashroi will not be liable for any direct, indirect, or consequential loss or damage arising under
                  these Terms or in connection with our website or services. The perceived quality, style, or
                  suitability of content created by us remains subjective and cannot be used as grounds to increase
                  scope of work. Revisions are strictly governed by our <Link href="/revisions" className="text-lime-300 underline">revision policy</Link>.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">5. Changes to These Terms</h2>
                <p className="text-neutral-300">
                  We may revise these Terms from time to time. The revised Terms will apply from the date of
                  publication on this site.
                </p>
              </section>

              <section className="space-y-3 border-t border-white/5 pt-8">
                <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
                <p className="text-neutral-300">If you have any questions about these Terms, please contact us at:</p>
                <p className="text-lime-300 font-bold">
                  Email: <a href="mailto:hello@mashroi.com" className="underline underline-offset-4">hello@mashroi.com</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </main>
  )
}
