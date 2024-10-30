import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DocumentCardProps {
  title: string;
  content: string;
  onDownload: () => void;
}

export function DocumentCard({ title, content, onDownload }: DocumentCardProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy content',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <Textarea
        value={content}
        readOnly
        className="min-h-[200px] font-mono text-sm"
      />
    </Card>
  );
}