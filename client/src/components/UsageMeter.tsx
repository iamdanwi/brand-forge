'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface UsageData {
  usage: {
    analysisCount: number;
    contentGenCount: number;
  };
  plan: string;
}

export default function UsageMeter() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/brand/usage');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (loading) return <div className="h-24 flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;
  if (!data) return null;

  const { usage, plan } = data;
  const isFree = plan === 'free';

  // Limits
  const analysisLimit = isFree ? 3 : Infinity;
  const contentLimit = isFree ? 10 : Infinity;

  // Percentages
  const analysisPercent = isFree ? Math.min((usage.analysisCount / analysisLimit) * 100, 100) : 0;
  const contentPercent = isFree ? Math.min((usage.contentGenCount / contentLimit) * 100, 100) : 0;

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider flex justify-between items-center">
          <span>Monthly Usage</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isFree ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
            {plan.toUpperCase()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analysis Usage */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <BarChart3 className="h-4 w-4" /> Brand Analyses
            </span>
            <span className="font-medium text-slate-900">
              {usage.analysisCount} / {isFree ? analysisLimit : '∞'}
            </span>
          </div>
          {isFree && <Progress value={analysisPercent} className="h-2" />}
        </div>

        {/* Content Usage */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <Zap className="h-4 w-4" /> Content Generations
            </span>
            <span className="font-medium text-slate-900">
              {usage.contentGenCount} / {isFree ? contentLimit : '∞'}
            </span>
          </div>
          {isFree && <Progress value={contentPercent} className="h-2" />}
        </div>

        {isFree && (
          <Link href="/pricing">
            <Button variant="outline" size="sm" className="w-full mt-2 text-blue-600 border-blue-200 hover:bg-blue-50">
              Upgrade to Pro
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
