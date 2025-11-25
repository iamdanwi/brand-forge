'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Copy, Check, Send, Bot, User, BrainCircuit } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Brand {
  _id: string;
  brandName: string;
}

interface CampaignStrategy {
  campaignTitle: string;
  concept: string;
  contentPillars: string[];
  channels: {
    name: string;
    strategy: string;
    contentIdeas: string[];
  }[];
  timeline: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: any;
    type: 'text' | 'strategy';
    timestamp: Date;
}

export default function CampaignsPage() {
  const { getToken, userId } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form State (Composer)
  const [selectedBrand, setSelectedBrand] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      if (!userId) return;
      try {
        const token = await getToken();
        const res = await axios.get(`http://localhost:5001/api/brand/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setBrands(res.data);
      } catch (error) {
        console.error('Failed to fetch brands');
      }
    };
    fetchBrands();
  }, [userId, getToken]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleGenerate = async () => {
    if (!selectedBrand || !targetAudience || !goal) {
        toast.error('Please fill in all fields');
        return;
    }

    const brandName = brands.find(b => b._id === selectedBrand)?.brandName || 'Unknown Brand';

    // Add User Message
    const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        type: 'text',
        content: { brandName, targetAudience, goal },
        timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);
    
    // Clear inputs
    setTargetAudience('');
    setGoal('');

    try {
      const token = await getToken();
      const res = await axios.post('http://localhost:5001/api/campaign/create', {
        brandId: selectedBrand,
        targetAudience: userMsg.content.targetAudience,
        goal: userMsg.content.goal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          type: 'strategy',
          content: res.data,
          timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      toast.error('Failed to generate campaign');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="w-full h-[calc(100vh-6rem)] py-6 px-4 flex flex-col gap-6">
      <div className="flex-none">
        <h1 className="text-3xl font-light text-foreground tracking-tight">Campaign Studio</h1>
        <p className="text-muted-foreground mt-1 font-light">Architect comprehensive marketing strategies powered by your Brand DNA.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border border-border shadow-none bg-card rounded-xl">
        {/* Chat Area */}
        <div ref={messagesEndRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                        <BrainCircuit className="h-8 w-8 text-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Ready to strategize?</h3>
                    <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                        Select a brand and define your goals below. The AI will generate a comprehensive campaign structure for you.
                    </p>
                </div>
            )}

            {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                    
                    {/* Avatar */}
                    <div className={cn("flex-none h-8 w-8 rounded-full flex items-center justify-center", 
                        msg.role === 'assistant' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    )}>
                        {msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-4 w-4" />}
                    </div>

                    <div className={cn("flex flex-col gap-2 max-w-[85%]", msg.role === 'user' ? "items-end" : "items-start")}>
                        {msg.role === 'user' ? (
                            <div className="px-5 py-3 rounded-2xl text-sm leading-relaxed bg-primary text-primary-foreground rounded-tr-sm">
                                <div className="font-medium mb-1 border-b border-primary-foreground/20 pb-1">{msg.content.brandName}</div>
                                <div className="opacity-90">
                                    <p>Target: {msg.content.targetAudience}</p>
                                    <p>Goal: {msg.content.goal}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-4">
                                {/* Strategy Card */}
                                <Card className="border border-border/60 shadow-sm bg-card rounded-xl overflow-hidden w-full">
                                    <CardHeader className="p-6 pb-4 border-b border-border/40">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <CardTitle className="text-xl font-semibold leading-tight mb-2">{msg.content.campaignTitle}</CardTitle>
                                                <CardDescription className="text-base text-muted-foreground leading-relaxed">"{msg.content.concept}"</CardDescription>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(`${msg.content.campaignTitle}\n\n${msg.content.concept}`, `header-${msg.id}`)} className="h-8 w-8 rounded-md hover:bg-secondary">
                                                {copiedSection === `header-${msg.id}` ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                                Content Pillars
                                            </h4>
                                            <ul className="space-y-2">
                                                {msg.content.contentPillars.map((pillar: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2.5 text-sm">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                        <span className="text-foreground/80 leading-relaxed">{pillar}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                                Timeline
                                            </h4>
                                            <p className="text-sm text-foreground/80 leading-relaxed">{msg.content.timeline}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-sm w-full">
                                    <Tabs defaultValue={msg.content.channels[0]?.name} className="w-full">
                                        <div className="px-4 pt-3 border-b border-border/40 bg-secondary/20">
                                            <TabsList className="h-auto p-0 bg-transparent gap-6">
                                                {msg.content.channels.map((channel: any, i: number) => (
                                                    <TabsTrigger 
                                                        key={i} 
                                                        value={channel.name} 
                                                        className="rounded-none border-b-2 border-transparent px-2 py-2 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
                                                    >
                                                        {channel.name}
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>
                                        </div>
                                        
                                        {msg.content.channels.map((channel: any, i: number) => (
                                            <TabsContent key={i} value={channel.name} className="mt-0 p-6">
                                                <div className="space-y-6">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-sm font-semibold text-foreground">Strategy Overview</h4>
                                                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(channel.strategy, `strategy-${i}-${msg.id}`)} className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                                                                {copiedSection === `strategy-${i}-${msg.id}` ? "Copied" : "Copy"}
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{channel.strategy}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-foreground mb-3">Content Ideas</h4>
                                                        <div className="grid gap-3">
                                                            {channel.contentIdeas.map((idea: string, j: number) => (
                                                                <div key={j} className="text-sm p-3 rounded-lg border border-border/40 bg-secondary/10 flex gap-3 items-start">
                                                                    <span className="text-xs font-mono text-muted-foreground mt-0.5 opacity-70">0{j + 1}</span>
                                                                    <span className="text-foreground/90 leading-relaxed">{idea}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {loading && (
                <div className="flex gap-4">
                   <div className="flex-none h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                     <Sparkles className="h-4 w-4" />
                   </div>
                   <div className="bg-secondary/50 px-5 py-3 rounded-2xl rounded-tl-sm border border-border/50 flex items-center gap-2">
                     <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">Thinking...</span>
                   </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="flex-none p-4 bg-background border-t border-border/50">
            <div className="flex gap-3 items-end">
                <div className="flex-1 flex flex-col gap-2">
                     <div className="flex gap-2">
                        <Select onValueChange={setSelectedBrand} value={selectedBrand}>
                            <SelectTrigger className="w-[180px] h-10 rounded-xl bg-secondary/30 border-transparent hover:bg-secondary/50 focus:ring-0 text-xs font-medium">
                                <SelectValue placeholder="Select Brand" />
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map(b => (
                                    <SelectItem key={b._id} value={b._id} className="text-xs">{b.brandName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input 
                            placeholder="Target Audience" 
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            className="h-10 rounded-xl bg-secondary/30 border-transparent hover:bg-secondary/50 focus-visible:ring-primary px-4 transition-all text-xs"
                        />
                     </div>
                    <Input 
                        placeholder="Describe your campaign goal..." 
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        className="h-12 rounded-xl bg-secondary/30 border-transparent hover:bg-secondary/50 focus-visible:ring-primary px-4 transition-all"
                    />
                </div>
                
                <Button 
                    onClick={handleGenerate} 
                    disabled={loading || !selectedBrand || !goal} 
                    className="h-12 w-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shrink-0 p-0 flex items-center justify-center"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
            </div>
        </div>
      </Card>
    </div>
  );
}
