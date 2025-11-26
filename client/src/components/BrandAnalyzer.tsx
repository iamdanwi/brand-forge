'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, Globe, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function BrandAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userId, getToken } = useAuth();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault(); // Keep this for form submission
    if (!url) return;
    if (!userId) {
        toast.error('Please sign in to analyze brands');
        router.push('/sign-in');
        return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post('/api/brand/analyze', { 
        url,
        userId // We still send userId for now, but backend checks token
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Brand analysis complete!');
      router.push(`/dashboard/${response.data._id}`);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      if (error.response?.status === 403) {
        toast.error(error.response.data.message || 'Limit reached. Please upgrade.');
      } else {
        toast.error('Failed to analyze brand. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-0 shadow-sm bg-card rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-secondary/30 pb-8 pt-10 px-10 text-center">
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-google font-medium">Analyze Your Brand</CardTitle>
        <CardDescription className="text-lg mt-2">Enter your website URL to extract your Brand DNA.</CardDescription>
      </CardHeader>
      <CardContent className="p-10">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="url" className="text-base font-medium ml-1">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="h-16 rounded-[1.25rem] bg-secondary/30 border-transparent hover:bg-secondary/50 focus-visible:ring-primary text-lg px-6 transition-colors"
            />
          </div>
          <Button type="submit" className="w-full h-14 rounded-full text-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Brand'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
