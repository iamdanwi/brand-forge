'useclient';
'use client';

import { useEffect, useState } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, ArrowRight, Loader2, Sparkles, LayoutGrid, BarChart3, Zap, Target, ImageIcon } from 'lucide-react';
import UsageMeter from '@/components/UsageMeter';

interface Brand {
  _id: string;
  brandName: string;
  url: string;
  createdAt: string;
  colors: string[];
}

export default function Dashboard() {
  const { getToken, userId } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const token = await getToken();
        const [brandsRes, usageRes] = await Promise.all([
            axios.get(`http://localhost:5001/api/brand/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:5001/api/brand/usage', {
                headers: { Authorization: `Bearer ${token}` }
            })
        ]);
        setBrands(brandsRes.data);
        setUsageData(usageRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { usage, plan } = usageData || { usage: { analysisCount: 0, contentGenCount: 0 }, plan: 'free' };
  const isFree = plan === 'free';
  const analysisLimit = isFree ? 3 : '∞';
  const contentLimit = isFree ? 10 : '∞';

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2 font-light">Overview of your brand ecosystem and performance.</p>
        </div>
        <Link href="/analyze">
            <Button className="h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm px-6">
                <Plus className="mr-2 h-4 w-4" /> New Analysis
            </Button>
        </Link>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border shadow-none bg-card rounded-xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Brands</p>
                    <h3 className="text-3xl font-light text-foreground mt-1">{brands.length}</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <LayoutGrid className="h-5 w-5" />
                </div>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min((brands.length / 10) * 100, 100)}%` }} />
            </div>
        </Card>

        <Card className="border border-border shadow-none bg-card rounded-xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Analyses Used</p>
                    <h3 className="text-3xl font-light text-foreground mt-1">{usage.analysisCount} <span className="text-lg text-muted-foreground">/ {analysisLimit}</span></h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <BarChart3 className="h-5 w-5" />
                </div>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${isFree ? Math.min((usage.analysisCount / 3) * 100, 100) : 0}%` }} />
            </div>
        </Card>

        <Card className="border border-border shadow-none bg-card rounded-xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Content Generated</p>
                    <h3 className="text-3xl font-light text-foreground mt-1">{usage.contentGenCount} <span className="text-lg text-muted-foreground">/ {contentLimit}</span></h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Zap className="h-5 w-5" />
                </div>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${isFree ? Math.min((usage.contentGenCount / 10) * 100, 100) : 0}%` }} />
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content: Recent Brands */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-light text-foreground">Recent Brands</h2>
                <Link href="/analyses" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            
            {brands.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-card/50 text-center">
                    <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                        <Plus className="h-6 w-6 text-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No brands yet</h3>
                    <p className="text-muted-foreground max-w-sm text-sm mb-6">
                        Start by analyzing your first brand URL to unlock insights.
                    </p>
                    <Link href="/analyze">
                        <Button className="h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6">
                            Create your first brand
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {brands.slice(0, 4).map((brand) => (
                        <Card key={brand._id} className="group border border-border shadow-none bg-card rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300">
                            <CardHeader className="p-6 pb-4 flex flex-row items-center gap-4 space-y-0">
                                <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center text-lg font-bold text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {brand.brandName.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <CardTitle className="text-lg font-medium truncate">{brand.brandName}</CardTitle>
                                    <CardDescription className="text-xs truncate">{brand.url}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <div className="flex gap-2 mb-6">
                                    {brand.colors.slice(0, 3).map((color, i) => (
                                        <div key={i} className="h-6 w-6 rounded-full border border-border/50 shadow-sm" style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                                <Link href={`/dashboard/${brand._id}`}>
                                    <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>

        {/* Sidebar: Quick Actions & Plan */}
        <div className="space-y-8">
            {/* Plan Status */}
             <Card className="border border-border shadow-none bg-card rounded-xl overflow-hidden">
                <CardHeader className="bg-secondary/30 border-b border-border/50 p-6">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Current Plan
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-light capitalize">{plan} Plan</span>
                        {isFree && <span className="text-xs bg-secondary px-2 py-1 rounded-md text-muted-foreground">Basic</span>}
                    </div>
                    {isFree && (
                        <>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                Unlock advanced AI analysis, unlimited generations, and team collaboration.
                            </p>
                            <Button variant="secondary" className="w-full rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 border-0">
                                Upgrade to Pro
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
                <Link href="/campaigns">
                    <Button variant="outline" className="w-full justify-start h-12 rounded-lg border-border hover:bg-secondary/50 hover:text-primary transition-colors">
                        <Target className="mr-3 h-4 w-4" /> Generate Campaign
                    </Button>
                </Link>
                <Link href="/studio">
                    <Button variant="outline" className="w-full justify-start h-12 rounded-lg border-border hover:bg-secondary/50 hover:text-primary transition-colors">
                        <ImageIcon className="mr-3 h-4 w-4" /> Image Studio
                    </Button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
