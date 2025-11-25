'use client';

import { Button } from '@/components/ui/button';
import { UserProfile, useAuth } from '@clerk/nextjs';
// import ApiKeyManager from '@/components/ApiKeyManager';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

export default function SettingsPage() {
  const { userId } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <main className="max-w-5xl mx-auto py-8 space-y-12">
        <div className="mb-8">
            <h1 className="text-3xl font-google font-bold text-slate-900 dark:text-white">Settings</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences.</p>
        </div>
        <section>
            <h2 className="text-2xl font-google text-slate-800 mb-6">Subscription</h2>
            <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-slate-900">Current Plan</h3>
                        <p className="text-sm text-slate-500">Manage your billing and subscription.</p>
                    </div>
                    <Button variant="outline" onClick={async () => {
                        try {
                            const res = await axios.post('http://localhost:5001/api/billing/portal', { userId });
                            window.location.href = res.data.url;
                        } catch (e) {
                            console.error(e);
                            alert('Error opening billing portal');
                        }
                    }}>
                        Manage Subscription
                    </Button>
                </CardContent>
            </Card>
        </section>

        {/* <section>
            <h2 className="text-2xl font-google text-slate-800 mb-6">Developer Settings</h2>
            <ApiKeyManager />
        </section> */}

        <section className="flex justify-center">
             <UserProfile routing="hash" />
        </section>
      </main>
    </div>
  );
}
