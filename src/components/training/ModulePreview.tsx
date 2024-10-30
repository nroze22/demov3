import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PresentationViewer } from './PresentationViewer';
import { QuizViewer } from './QuizViewer';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Download,
  Share2,
} from 'lucide-react';

interface ModulePreviewProps {
  type: 'presentation' | 'quiz' | 'document';
  content: any;
  onComplete?: (data: any) => void;
}

export function ModulePreview({ type, content, onComplete }: ModulePreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSlideChange = (indexh: number) => {
    setCurrentSlide(indexh);
    setProgress((indexh / (content.totalSlides - 1)) * 100);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {type === 'presentation' ? 'Slides' : 'Quiz'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {type === 'presentation' ? `${currentSlide + 1} of ${content.totalSlides}` : '10 questions'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {type === 'presentation' && (
        <>
          <PresentationViewer
            content={content.html}
            onSlideChange={handleSlideChange}
          />
          
          <div className="mt-6 space-y-4">
            <Progress value={progress} className="h-1" />
            
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button onClick={togglePlayback}>
                {isPlaying ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button variant="outline" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {type === 'quiz' && (
        <QuizViewer
          definition={content}
          onComplete={onComplete}
        />
      )}
    </Card>
  );
}