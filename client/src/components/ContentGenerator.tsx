'use client';

import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Copy, Check, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@clerk/nextjs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

interface ContentGeneratorProps {
  brandProfile: any;
}

export default function ContentGenerator({ brandProfile }: ContentGeneratorProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{ type: string; content: string } | null>(null);
  const [platform, setPlatform] = useState('instagram');
  const [copied, setCopied] = useState(false);
  const { userId, getToken } = useAuth();

  const generate = async (type: string) => {
    setLoading(type);
    try {
      const token = await getToken();
      const response = await axios.post(`/api/brand/${brandProfile._id}/generate`, {
        contentType: type,
        platform,
        userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGeneratedContent({ type, content: response.data.content });
      toast.success('Content generated successfully!');
    } catch (error: any) {
      console.error('Generation failed:', error);
      if (error.response?.status === 403) {
        toast.error(error.response.data.message || 'Limit reached. Please upgrade.');
      } else {
        toast.error('Failed to generate content. Please try again.');
      }
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard');
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer rounded-[2rem] overflow-hidden group" onClick={() => generate('captions')}>
          <CardHeader className="pb-2 pt-8 px-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-medium text-foreground">Social Captions</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">Generate engaging captions for your posts.</p>
            <Button className="w-full rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-xl transition-all" disabled={!!loading}>
              {loading === 'captions' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer rounded-[2rem] overflow-hidden group" onClick={() => generate('ideas')}>
          <CardHeader className="pb-2 pt-8 px-8">
            <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-secondary-foreground" />
            </div>
            <CardTitle className="text-xl font-medium text-foreground">Content Ideas</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">Get creative ideas for your next campaign.</p>
            <Button variant="secondary" className="w-full rounded-full shadow-sm" disabled={!!loading}>
              {loading === 'ideas' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-accent/20 hover:bg-accent/30 transition-colors cursor-pointer rounded-[2rem] overflow-hidden group" onClick={() => generate('ads')}>
          <CardHeader className="pb-2 pt-8 px-8">
            <div className="h-12 w-12 rounded-2xl bg-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle className="text-xl font-medium text-foreground">Ad Copy & Flyers</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">Generate headlines, body copy, and flyer concepts.</p>
            <Button variant="outline" className="w-full rounded-full border-accent/50 hover:bg-accent/20" disabled={!!loading}>
              {loading === 'ads' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl w-fit">
        <label className="text-sm font-medium text-foreground pl-2">Platform:</label>
        <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-[180px] rounded-xl bg-background border-0 shadow-sm">
                <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="instagram" className="rounded-lg my-1 cursor-pointer">Instagram</SelectItem>
                <SelectItem value="linkedin" className="rounded-lg my-1 cursor-pointer">LinkedIn</SelectItem>
                <SelectItem value="twitter" className="rounded-lg my-1 cursor-pointer">Twitter / X</SelectItem>
                <SelectItem value="facebook" className="rounded-lg my-1 cursor-pointer">Facebook</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {generatedContent && (
        <Card className="border-0 shadow-sm bg-card rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="flex flex-row items-center justify-between bg-secondary/30 border-b border-border/10 pb-6 pt-8 px-8">
            <CardTitle className="text-xl font-medium text-foreground">
              Generated {generatedContent.type === 'captions' ? 'Caption' : generatedContent.type === 'ideas' ? 'Ideas' : 'Ad Copy & Flyer'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full px-4">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </CardHeader>
          <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {generatedContent.content}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
