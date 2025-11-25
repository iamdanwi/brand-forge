import BrandAnalyzer from '@/components/BrandAnalyzer';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="z-10 max-w-3xl w-full flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4 relative">
            <div className="absolute top-0 right-0 -mt-2 -mr-2">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-google font-medium text-slate-900 tracking-tight">
            BrandForge
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
            Your AI-powered branding assistant. Extract DNA from any website and generate on-brand content in seconds.
          </p>
        </div>

        <div className="flex gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <Button className="rounded-full px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all hover:scale-105">
                Get Started
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-slate-200 text-slate-600 hover:bg-slate-50">
                View Pricing
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button className="rounded-full px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all hover:scale-105">
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>
        
        <div className="flex gap-8 text-sm text-slate-400 font-medium">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            AI Analysis
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Brand DNA
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            Content Gen
          </span>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-5xl mt-32 mb-20">
        <h2 className="text-3xl font-google font-medium text-center text-slate-900 mb-12">Everything you need to build your brand</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-2">Brand DNA Extraction</h3>
            <p className="text-slate-500">Instantly analyze any website to extract colors, fonts, tone of voice, and visual style.</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-2">AI Content Generation</h3>
            <p className="text-slate-500">Generate on-brand social media captions, campaign ideas, and visual prompts in seconds.</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-2">Dashboard & History</h3>
            <p className="text-slate-500">Save multiple brand profiles and access your generation history anytime.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
