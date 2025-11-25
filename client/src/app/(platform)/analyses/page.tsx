'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight, Globe, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Brand {
  _id: string;
  brandName: string;
  url: string;
  createdAt: string;
  colors: string[];
}

export default function AnalysesPage() {
  const { userId, isLoaded, getToken } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      if (!userId) return;
      try {
        const token = await getToken();
        const response = await axios.get(`http://localhost:5001/api/brand/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchBrands();
    }
  }, [userId, isLoaded, getToken]);

  const filteredBrands = brands.filter(brand => 
    brand.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-google font-medium text-foreground tracking-tight">Analyses History</h2>
          <p className="text-lg text-muted-foreground mt-1">View and manage your past brand analyses.</p>
        </div>
        <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search brands..." 
                className="pl-10 h-12 rounded-xl bg-secondary/30 border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <Card className="border-0 shadow-sm bg-card rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-secondary/30">
                        <tr>
                            <th className="text-left py-4 px-6 font-medium text-muted-foreground">Brand Name</th>
                            <th className="text-left py-4 px-6 font-medium text-muted-foreground hidden md:table-cell">Website URL</th>
                            <th className="text-left py-4 px-6 font-medium text-muted-foreground hidden lg:table-cell">Date Analyzed</th>
                            <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {filteredBrands.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-muted-foreground">
                                    No analyses found. <Link href="/analyze" className="text-primary hover:underline">Start a new analysis</Link>
                                </td>
                            </tr>
                        ) : (
                            filteredBrands.map((brand) => (
                                <tr key={brand._id} className="group hover:bg-secondary/10 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full shadow-sm ring-2 ring-background flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: brand.colors?.[0] || '#6366f1' }}>
                                                {brand.brandName?.charAt(0) || 'B'}
                                            </div>
                                            <span className="font-medium text-foreground">{brand.brandName || 'Untitled Brand'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 hidden md:table-cell">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Globe className="h-4 w-4" />
                                            <span className="truncate max-w-[200px]">{brand.url}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 hidden lg:table-cell">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(brand.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <Link href={`/dashboard/${brand._id}`}>
                                            <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary">
                                                View Details
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
