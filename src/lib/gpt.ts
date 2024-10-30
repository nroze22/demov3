import { toast } from '@/lib/hooks/use-toast';

const GPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export interface GPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateWithGPT4(
  messages: GPTMessage[],
  temperature: number = 0.7
): Promise<string | null> {
  const apiKey = localStorage.getItem('openai-api-key');
  
  if (!apiKey) {
    toast({
      title: 'API Key Required',
      description: 'Please add your OpenAI API key in settings',
      variant: 'destructive',
    });
    return null;
  }

  try {
    const response = await fetch(GPT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate content');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    toast({
      title: 'Generation Failed',
      description: error instanceof Error ? error.message : 'Failed to generate content',
      variant: 'destructive',
    });
    return null;
  }
}