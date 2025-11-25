'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Upload, Image as ImageIcon, X, Sparkles, Bot, User } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'sonner';

type Message = {
  role: 'user' | 'ai';
  type: 'text' | 'image';
  content: string;
};

export default function StudioPage() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', type: 'text', content: "Hello! I'm your AI Creative Assistant. I can generate images, edit them, or answer questions about your brand assets. Try uploading an image or asking me to create something!" }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Base64
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if ((!input.trim() && !selectedImage) || loading) return;

    const userMessage: Message = {
      role: 'user',
      type: selectedImage ? 'image' : 'text', // Simplified for display, actually multimodal
      content: input
    };
    
    // If image is attached, we might want to show it in the chat
    const displayMessages: Message[] = [];
    if (selectedImage) {
        displayMessages.push({ role: 'user' as const, type: 'image' as const, content: selectedImage });
    }
    if (input.trim()) {
        displayMessages.push({ role: 'user' as const, type: 'text' as const, content: input });
    }

    setMessages(prev => [...prev, ...displayMessages]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null); // Clear after sending
    setLoading(true);

    try {
      const token = await getToken();
      const res = await axios.post('http://localhost:5001/api/image/unified', {
        prompt: input,
        image: currentImage,
        history: messages.map(m => ({ role: m.role, content: m.content })) // Basic history
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = res.data;
      
      setMessages(prev => [...prev, {
        role: 'ai',
        type: result.type,
        content: result.content
      }]);

    } catch (error) {
      console.error(error);
      toast.error('Failed to process your request.');
      setMessages(prev => [...prev, { role: 'ai', type: 'text', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] py-6 px-4 flex flex-col gap-6">
      <div className="flex-none">
        <h1 className="text-3xl font-light text-foreground tracking-tight">Creative Studio</h1>
        <p className="text-muted-foreground mt-1 font-light">Collaborate with AI to create and refine your brand assets.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border border-border shadow-none bg-card rounded-xl">
        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`flex-none h-8 w-8 rounded-full flex items-center justify-center ${
                msg.role === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}>
                {msg.role === 'ai' ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              {/* Content */}
              <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.type === 'text' ? (
                  <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-secondary/50 text-foreground rounded-tl-sm border border-border/50'
                  }`}>
                    {msg.content}
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-background">
                    <img src={msg.content} alt="Content" className="max-w-sm w-full h-auto" />
                    {msg.role === 'ai' && (
                        <div className="p-2 bg-secondary/30 flex justify-end">
                             <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => window.open(msg.content, '_blank')}>
                                Download
                             </Button>
                        </div>
                    )}
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
          {selectedImage && (
            <div className="mb-4 flex items-center gap-3 p-2 bg-secondary/30 rounded-lg w-fit border border-border/50">
              <div className="h-12 w-12 rounded overflow-hidden bg-background">
                <img src={selectedImage} alt="Selected" className="h-full w-full object-cover" />
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => setSelectedImage(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div className="flex gap-3 items-end">
            <div className="flex-none">
                <Input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="chat-image-upload"
                    onChange={handleImageUpload}
                />
                <label htmlFor="chat-image-upload">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center cursor-pointer transition-colors border border-border ${
                        selectedImage ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}>
                        <ImageIcon className="h-5 w-5" />
                    </div>
                </label>
            </div>
            
            <Input 
              placeholder="Describe an image to generate, or upload one to edit..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="flex-1 h-12 rounded-xl bg-secondary/30 border-transparent hover:bg-secondary/50 focus-visible:ring-primary px-4 transition-all"
            />
            
            <Button 
                onClick={handleSubmit} 
                disabled={(!input.trim() && !selectedImage) || loading} 
                className="h-12 w-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shrink-0 p-0 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
