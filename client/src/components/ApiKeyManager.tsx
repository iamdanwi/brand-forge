'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Copy, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

interface APIKey {
  _id: string;
  name: string;
  key: string;
  lastUsed: string;
  createdAt: string;
}

export default function ApiKeyManager() {
  const { userId } = useAuth();
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  useEffect(() => {
    if (userId) fetchKeys();
  }, [userId]);

  const fetchKeys = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/keys/${userId}`);
      setKeys(response.data);
    } catch (error) {
      console.error('Error fetching keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    try {
      const response = await axios.post('http://localhost:5001/api/keys', {
        userId,
        name: newKeyName,
      });
      setKeys([...keys, response.data]);
      setNewKeyName('');
    } catch (error) {
      console.error('Error creating key:', error);
    } finally {
      setCreating(false);
    }
  };

  const deleteKey = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/keys/${id}`);
      setKeys(keys.filter((k) => k._id !== id));
    } catch (error) {
      console.error('Error deleting key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />;

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <CardTitle className="text-xl font-google text-slate-800">API Keys</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-4">
          <Input
            placeholder="Key Name (e.g. Production App)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <Button onClick={createKey} disabled={creating || !newKeyName.trim()} className="bg-blue-600 text-white">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Create Key
          </Button>
        </div>

        <div className="space-y-4">
          {keys.map((key) => (
            <div key={key._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <h4 className="font-medium text-slate-900">{key.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600 font-mono">
                    {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                  </code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(key.key)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Created: {new Date(key.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteKey(key._id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {keys.length === 0 && (
            <p className="text-center text-slate-500 py-4">No API keys generated yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
