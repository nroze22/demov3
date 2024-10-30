import { useEffect, useRef, useState } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Grid2x2,
  SkipBack,
  SkipForward,
  Clock,
  Eye,
  MessageSquare,
  Download,
  Share2,
} from 'lucide-react';

interface PresentationViewerProps {
  content: string;
  onSlideChange?: (indexh: number, indexv: number) => void;
  duration?: number;
}

export function PresentationViewer({ content, onSlideChange, duration = 30 }: PresentationViewerProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<Reveal.Api | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [speakerNotes, setSpeakerNotes] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (deckRef.current && !revealRef.current) {
      revealRef.current = new Reveal(deckRef.current, {
        embedded: true,
        hash: false,
        controls: false,
        progress: false,
        transition: 'slide',
        width: '100%',
        height: '100%',
        margin: 0.1,
        slideNumber: true,
        showNotes: false,
        autoPlayMedia: true,
        preloadIframes: true,
        autoSlide: 0,
        plugins: [] // Add plugins as needed
      });

      revealRef.current.initialize().then(() => {
        if (onSlideChange) {
          revealRef.current?.on('slidechanged', (event) => {
            const { indexh, indexv } = event;
            onSlideChange(indexh, indexv);
            setCurrentSlide(indexh);
            updateSpeakerNotes();
          });
        }

        // Get total slides after initialization
        setTotalSlides(revealRef.current?.getTotalSlides() || 0);
      });
    }

    return () => {
      revealRef.current?.destroy();
      revealRef.current = null;
    };
  }, [onSlideChange]);

  useEffect(() => {
    if (revealRef.current && content) {
      deckRef.current!.querySelector('.slides')!.innerHTML = content;
      revealRef.current.sync();
      revealRef.current.slide(0, 0, 0);
      setTotalSlides(revealRef.current.getTotalSlides());
    }
  }, [content]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= duration * 60) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const updateSpeakerNotes = () => {
    const currentSlideElement = deckRef.current?.querySelector('.present');
    const notes = currentSlideElement?.querySelector('aside.notes')?.innerHTML || '';
    setSpeakerNotes(notes);
  };

  const handlePrevious = () => {
    revealRef.current?.prev();
  };

  const handleNext = () => {
    revealRef.current?.next();
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await deckRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      revealRef.current?.configure({ autoSlide: 5000 }); // 5 seconds per slide
    } else {
      revealRef.current?.configure({ autoSlide: 0 });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Slide {currentSlide + 1} of {totalSlides}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTime(elapsedTime)} / {duration}:00
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
            <Grid2x2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Card className="relative overflow-hidden">
        <div 
          ref={deckRef}
          className="reveal"
          style={{ 
            height: isFullscreen ? '100vh' : '600px',
            background: 'white' 
          }}
        >
          <div className="slides">
            {/* Content will be injected here */}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => revealRef.current?.slide(0)}
            className="bg-white/90 hover:bg-white"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="bg-white/90 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={togglePlayback}
            className="bg-white/90 hover:bg-white"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="bg-white/90 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => revealRef.current?.slide(totalSlides - 1)}
            className="bg-white/90 hover:bg-white"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4" />
            <h3 className="font-medium">Speaker Notes</h3>
          </div>
          <ScrollArea className="h-[100px]">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: speakerNotes }} />
          </ScrollArea>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4" />
            <h3 className="font-medium">Comments</h3>
          </div>
          <ScrollArea className="h-[100px]">
            <p className="text-sm text-muted-foreground">No comments yet</p>
          </ScrollArea>
        </Card>
      </div>

      {showGrid && (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <Card
              key={index}
              className={`p-2 cursor-pointer hover:ring-2 hover:ring-primary ${
                currentSlide === index ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => revealRef.current?.slide(index)}
            >
              <div className="aspect-video bg-muted flex items-center justify-center text-xs">
                Slide {index + 1}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}