import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentEditor } from '@/components/shared/DocumentEditor';
import { generateFaqContent } from '@/lib/marketing-generators/faq';
import { useToast } from '@/lib/hooks/use-toast';
import {
  FileText,
  Download,
  Save,
  Loader2,
  Share2,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface FaqGeneratorProps {
  studyDetails: any;
  onSave: (content: string) => void;
}

export function FaqGenerator({ studyDetails, onSave }: FaqGeneratorProps) {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const faqContent = await generateFaqContent(studyDetails);
      
      // Transform FAQ content into formatted HTML
      const formattedContent = `
        <h1>${faqContent.title}</h1>
        <p>${faqContent.introduction}</p>
        ${faqContent.sections.map(section => `
          <h2>${section.title}</h2>
          ${section.questions.map(q => `
            <h3>${q.question}</h3>
            <p>${q.answer}</p>
          `).join('')}
        `).join('')}
        <div class="contact-info">
          <h2>Contact Information</h2>
          <p>Phone: ${faqContent.contactInfo.phone}</p>
          <p>Email: ${faqContent.contactInfo.email}</p>
          ${faqContent.contactInfo.website ? `<p>Website: ${faqContent.contactInfo.website}</p>` : ''}
        </div>
      `;

      setContent(formattedContent);
      toast({
        title: 'FAQ Generated',
        description: 'Your FAQ content is ready for review',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate FAQ content',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPdf = async () => {
    const doc = new jsPDF();
    doc.html(content, {
      callback: function (doc) {
        doc.save('study-faq.pdf');
      },
      x: 10,
      y: 10
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Study FAQ Sheet</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={generateContent}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate FAQ
              </>
            )}
          </Button>
          <Button variant="outline" onClick={exportToPdf}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={() => onSave(content)}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <DocumentEditor
        content={content}
        onChange={setContent}
      />
    </Card>
  );
}