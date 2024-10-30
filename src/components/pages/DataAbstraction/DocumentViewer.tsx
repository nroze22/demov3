import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface DocumentViewerProps {
  content: string | null;
  extractedData: any;
}

export function DocumentViewer({ content, extractedData }: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && extractedData) {
      // Highlight extracted fields in the document
      Object.entries(extractedData).forEach(([field, value]) => {
        if (typeof value === 'string' && value.length > 0) {
          const text = containerRef.current?.innerHTML || '';
          const highlightedText = text.replace(
            new RegExp(value, 'gi'),
            `<span class="bg-primary/20 text-primary rounded px-1">$&</span>`
          );
          if (containerRef.current) {
            containerRef.current.innerHTML = highlightedText;
          }
        }
      });
    }
  }, [content, extractedData]);

  if (!content) {
    return (
      <Card className="h-full p-6 flex items-center justify-center text-muted-foreground">
        No document loaded
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-16rem)]">
      <ScrollArea className="h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 font-mono text-sm whitespace-pre-wrap"
          ref={containerRef}
        >
          {content}
        </motion.div>
      </ScrollArea>
    </Card>
  );
}