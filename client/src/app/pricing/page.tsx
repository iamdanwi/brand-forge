'use client';

import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useState } from 'react';

export default function PricingPage() {
  const { userId, isSignedIn } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: string) => {
    if (!isSignedIn) {
      window.location.href = '/sign-in';
      return;
    }
    
    setLoading(plan);
    try {
      const response = await axios.post('http://localhost:5001/api/billing/create-checkout-session', {
        plan,
        userId,
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-google font-bold text-slate-800">BrandForge</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-blue-600">Pricing</Link>
            {isSignedIn ? (
                <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                </Link>
            ) : (
                <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-google font-bold text-slate-900 mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your brand's needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-500 mt-4">Perfect for trying out BrandForge.</p>
            </div>
            <Button className="w-full mb-8" variant="outline" asChild>
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                    {isSignedIn ? "Go to Dashboard" : "Get Started"}
                </Link>
            </Button>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-green-500 shrink-0" />
                <span>3 Brand Analyses</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-green-500 shrink-0" />
                <span>Basic Brand DNA</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-green-500 shrink-0" />
                <span>10 Content Generations/mo</span>
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 shadow-lg relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">$29</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-500 mt-4">For growing brands and creators.</p>
            </div>
            <Button 
                className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleUpgrade('pro')}
                disabled={!!loading}
            >
              {loading === 'pro' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upgrade to Pro
            </Button>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-blue-600 shrink-0" />
                <span><strong>Unlimited</strong> Brand Analyses</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-blue-600 shrink-0" />
                <span><strong>Advanced</strong> Brand DNA (Tone, Visuals)</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-blue-600 shrink-0" />
                <span><strong>Unlimited</strong> Content Generation</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-blue-600 shrink-0" />
                <span>Multi-platform Content (IG, LinkedIn, etc.)</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-blue-600 shrink-0" />
                <span>Visual Prompts & Ideas</span>
              </li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">$99</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-500 mt-4">For agencies and large teams.</p>
            </div>
            <Button 
                className="w-full mb-8" 
                variant="outline"
                onClick={() => handleUpgrade('enterprise')}
                disabled={!!loading}
            >
              {loading === 'enterprise' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Contact Sales / Upgrade
            </Button>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-purple-600 shrink-0" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-purple-600 shrink-0" />
                <span><strong>API Access</strong></span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-purple-600 shrink-0" />
                <span>Team Collaboration</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <Check className="h-5 w-5 text-purple-600 shrink-0" />
                <span>Priority Support</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
