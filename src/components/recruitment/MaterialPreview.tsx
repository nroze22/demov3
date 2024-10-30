import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, ExternalLink } from 'lucide-react';
import { toast } from '@/lib/hooks/use-toast';

interface MaterialPreviewProps {
  title: string;
  content: string;
  type: string;
  onDownload: () => void;
  onCopy: () => void;
  previewUrl?: string;
}

export function MaterialPreview({
  title,
  content,
  type,
  onDownload,
  onCopy,
  previewUrl,
}: MaterialPreviewProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
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
          {previewUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(previewUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
        </div>
      </div>
      <Textarea
        value={content}
        readOnly
        className="min-h-[200px] font-mono text-sm"
      />
      {type === 'social' && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Best Practices</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Best time to post: Tuesday-Thursday, 10am-3pm</li>
            <li>• Use relevant hashtags for better reach</li>
            <li>• Include a clear call-to-action</li>
            <li>• Keep messaging consistent across platforms</li>
          </ul>
        </div>
      )}
    </Card>
  );
}