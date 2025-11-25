'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import BrandDNA from '@/components/BrandDNA';
import ContentGenerator from '@/components/ContentGenerator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth, UserButton } from '@clerk/nextjs';

export default function Dashboard() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`http://localhost:5001/api/brand/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load brand profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, getToken]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || 'Profile not found'}</p>
        <Link href="/">
          <Button variant="outline">Go Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <main className="max-w-5xl mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-google font-bold text-slate-900 dark:text-white">
                {profile ? (profile as any).brandName : 'Brand Details'}
            </h1>
            <Link href="/dashboard">
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </Link>
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <BrandDNA profile={profile} />
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <ContentGenerator brandProfile={profile} />
        </div>
      </main>
    </div>
  );
}
