import { IrbDocument } from '@/lib/document-generators/irb-materials';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentListProps {
  documents: IrbDocument[];
  selectedId?: string;
  onSelect: (document: IrbDocument) => void;
}

export function DocumentList({ documents, selectedId, onSelect }: DocumentListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Generated Documents</h2>
        <p className="text-sm text-muted-foreground">
          Click a document to view and edit
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {documents.map((doc) => (
            <Button
              key={doc.id}
              variant={selectedId === doc.id ? 'secondary' : 'ghost'}
              className="w-full justify-start h-auto py-3 px-4"
              onClick={() => onSelect(doc)}
            >
              <div className="flex items-start gap-3 w-full">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{doc.title}</span>
                    <Badge variant="outline" className="ml-2">
                      v{doc.version}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(doc.lastModified), 'MMM d, h:mm a')}
                    {doc.status === 'completed' && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </div>

                  {doc.progress < 100 && (
                    <Progress value={doc.progress} className="h-1 mt-2" />
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}