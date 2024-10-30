import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/lib/hooks/use-toast';
import {
  ArrowLeft,
  Key,
  Save,
  Shield,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

// Changed to named export to match the import in Routes.tsx
export function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai-api-key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your OpenAI API key',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('openai-api-key', apiKey.trim());
    setIsSaved(true);
    toast({
      title: 'Settings Saved',
      description: 'Your API key has been saved securely',
    });
  };

  const handleClearKey = () => {
    localStorage.removeItem('openai-api-key');
    setApiKey('');
    setIsSaved(false);
    toast({
      title: 'API Key Removed',
      description: 'Your API key has been removed',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                API Configuration
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key">OpenAI API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="font-mono"
                    />
                    <Button onClick={handleSaveKey}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    {isSaved && (
                      <Button variant="outline" onClick={handleClearKey}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    )}
                  </div>
                  {isSaved && (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      API key is saved and ready to use
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}