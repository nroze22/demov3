import { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage } from 'react-konva';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/hooks/use-toast';
import { generatePosterContent } from '@/lib/marketing-generators/poster';
import { ImageLibrary } from './ImageLibrary';
import { ChromePicker } from 'react-color';
import useImage from 'use-image';
import {
  Type,
  Image as ImageIcon,
  Layout,
  Settings,
  Save,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Wand2,
  Loader2,
} from 'lucide-react';

// Constants for standard poster sizes
const POSTER_SIZES = {
  'letter': { width: 2550, height: 3300 }, // 8.5" x 11" at 300 DPI
  'tabloid': { width: 3300, height: 5100 }, // 11" x 17" at 300 DPI
  'a3': { width: 3508, height: 4961 }, // A3 at 300 DPI
  'custom': { width: 3300, height: 5100 } // Default custom size
};

interface PosterElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  fill?: string;
  url?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  locked?: boolean;
  opacity?: number;
  strokeWidth?: number;
  stroke?: string;
  align?: 'left' | 'center' | 'right';
  draggable?: boolean;
  zIndex?: number;
}

interface PosterDesignerProps {
  studyDetails: any;
  onSave: (elements: PosterElement[]) => void;
}

const URLImage = ({ url, ...props }: any) => {
  const [image] = useImage(url);
  return <KonvaImage image={image} {...props} />;
};

export function PosterDesigner({ studyDetails, onSave }: PosterDesignerProps) {
  const [posterSize, setPosterSize] = useState<keyof typeof POSTER_SIZES>('letter');
  const [elements, setElements] = useState<PosterElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(0.2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState('#000000');
  const [history, setHistory] = useState<PosterElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const { toast } = useToast();

  const addToHistory = (newElements: PosterElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const content = await generatePosterContent(studyDetails);
      
      const newElements = [
        {
          id: 'title',
          type: 'text' as const,
          x: POSTER_SIZES[posterSize].width / 2,
          y: 200,
          content: content.title,
          fontSize: 120,
          fontFamily: 'Arial',
          fill: content.suggestedColors.primary,
          align: 'center',
          draggable: true,
          zIndex: 1
        },
        {
          id: 'subtitle',
          type: 'text' as const,
          x: POSTER_SIZES[posterSize].width / 2,
          y: 400,
          content: content.subtitle,
          fontSize: 72,
          fontFamily: 'Arial',
          fill: content.suggestedColors.secondary,
          align: 'center',
          draggable: true,
          zIndex: 2
        },
        ...content.keyPoints.map((point, index) => ({
          id: `point-${index}`,
          type: 'text' as const,
          x: 300,
          y: 600 + (index * 150),
          content: `• ${point}`,
          fontSize: 48,
          fontFamily: 'Arial',
          fill: '#333333',
          align: 'left',
          draggable: true,
          zIndex: 3 + index
        })),
        {
          id: 'contact',
          type: 'text' as const,
          x: POSTER_SIZES[posterSize].width / 2,
          y: POSTER_SIZES[posterSize].height - 300,
          content: content.contactInfo,
          fontSize: 48,
          fontFamily: 'Arial',
          fill: '#000000',
          align: 'center',
          draggable: true,
          zIndex: 10
        }
      ];

      setElements(newElements);
      addToHistory(newElements);

      toast({
        title: 'Content Generated',
        description: 'Your poster content is ready for customization',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate poster content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addText = () => {
    const newElement: PosterElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: POSTER_SIZES[posterSize].width / 2,
      y: POSTER_SIZES[posterSize].height / 2,
      content: 'New Text',
      fontSize: 48,
      fontFamily: 'Arial',
      fill: color,
      align: 'center',
      draggable: true,
      zIndex: elements.length
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedId(newElement.id);
  };

  const addImage = async (file: File) => {
    const url = URL.createObjectURL(file);
    
    // Create a promise to get image dimensions
    const getDimensions = () => {
      return new Promise<{width: number, height: number}>((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          });
        };
        img.onerror = reject;
        img.src = url;
      });
    };

    try {
      const dimensions = await getDimensions();
      
      const newElement: PosterElement = {
        id: `image-${Date.now()}`,
        type: 'image',
        x: POSTER_SIZES[posterSize].width / 2,
        y: POSTER_SIZES[posterSize].height / 2,
        width: dimensions.width,
        height: dimensions.height,
        url,
        draggable: true,
        zIndex: elements.length
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      setSelectedId(newElement.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load image',
        variant: 'destructive'
      });
    }
  };

  const updateElement = (id: string, updates: Partial<PosterElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    addToHistory(newElements);
    setSelectedId(null);
  };

  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      setSelectedId(newElement.id);
    }
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    const lines = [];
    // Vertical lines
    for (let i = 0; i <= POSTER_SIZES[posterSize].width; i += gridSize) {
      lines.push(
        <Rect
          key={`v${i}`}
          x={i}
          y={0}
          width={1}
          height={POSTER_SIZES[posterSize].height}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }
    // Horizontal lines
    for (let i = 0; i <= POSTER_SIZES[posterSize].height; i += gridSize) {
      lines.push(
        <Rect
          key={`h${i}`}
          x={0}
          y={i}
          width={POSTER_SIZES[posterSize].width}
          height={1}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }
    return lines;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setScale(s => Math.max(0.1, s - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => setScale(s => Math.min(2, s + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
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
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
          <Button onClick={() => onSave(elements)}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Tools Panel */}
        <Card className="p-4">
          <Tabs defaultValue="text">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="text">
                <Type className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="layout">
                <Layout className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <Button onClick={addText} className="w-full">
                <Type className="h-4 w-4 mr-2" />
                Add Text
              </Button>

              {selectedId && elements.find(el => el.id === selectedId)?.type === 'text' && (
                <div className="space-y-4">
                  <Input
                    value={elements.find(el => el.id === selectedId)?.content}
                    onChange={(e) => updateElement(selectedId, { content: e.target.value })}
                    placeholder="Enter text"
                  />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const element = elements.find(el => el.id === selectedId);
                        if (element) {
                          updateElement(selectedId, {
                            fontStyle: element.fontStyle?.includes('bold') ? 
                              element.fontStyle.replace('bold', '') : 
                              `${element.fontStyle || ''} bold`
                          });
                        }
                      }}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const element = elements.find(el => el.id === selectedId);
                        if (element) {
                          updateElement(selectedId, {
                            fontStyle: element.fontStyle?.includes('italic') ? 
                              element.fontStyle.replace('italic', '') : 
                              `${element.fontStyle || ''} italic`
                          });
                        }
                      }}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const element = elements.find(el => el.id === selectedId);
                        if (element) {
                          updateElement(selectedId, {
                            align: element.align === 'left' ? 'center' : 
                              element.align === 'center' ? 'right' : 'left'
                          });
                        }
                      }}
                    >
                      {elements.find(el => el.id === selectedId)?.align === 'left' ? (
                        <AlignLeft className="h-4 w-4" />
                      ) : elements.find(el => el.id === selectedId)?.align === 'center' ? (
                        <AlignCenter className="h-4 w-4" />
                      ) : (
                        <AlignRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Font Size</label>
                    <Slider
                      value={[elements.find(el => el.id === selectedId)?.fontSize || 48]}
                      min={12}
                      max={144}
                      step={1}
                      onValueChange={([value]) => updateElement(selectedId, { fontSize: value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Color</label>
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      >
                        <div
                          className="w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: elements.find(el => el.id === selectedId)?.fill }}
                        />
                        {elements.find(el => el.id === selectedId)?.fill}
                      </Button>
                      {showColorPicker && (
                        <div className="absolute z-10 mt-2">
                          <ChromePicker
                            color={elements.find(el => el.id === selectedId)?.fill}
                            onChange={(color) => {
                              updateElement(selectedId, { fill: color.hex });
                              setColor(color.hex);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="images">
              <div className="space-y-4">
                <Button className="w-full" onClick={() => document.getElementById('image-upload')?.click()}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      addImage(e.target.files[0]);
                    }
                  }}
                />

                <ImageLibrary
                  onSelect={(image) => {
                    const newElement: PosterElement = {
                      id: `image-${Date.now()}`,
                      type: 'image',
                      x: POSTER_SIZES[posterSize].width / 2,
                      y: POSTER_SIZES[posterSize].height / 2,
                      width: 300,
                      height: 200,
                      url: image.url,
                      draggable: true,
                      zIndex: elements.length
                    };
                    const newElements = [...elements, newElement];
                    setElements(newElements);
                    addToHistory(newElements);
                    setSelectedId(newElement.id);
                  }}
                  maxHeight="400px"
                />
              </div>
            </TabsContent>

            <TabsContent value="layout">
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <Grid className="h-4 w-4 mr-2" />
                  {showGrid ? 'Hide Grid' : 'Show Grid'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSnapToGrid(!snapToGrid)}
                >
                  {snapToGrid ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
                  {snapToGrid ? 'Snap to Grid' : 'Free Movement'}
                </Button>

                <div>
                  <label className="text-sm font-medium">Grid Size</label>
                  <Slider
                    value={[gridSize]}
                    min={10}
                    max={50}
                    step={5}
                    onValueChange={([value]) => setGridSize(value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Canvas */}
        <div className="col-span-3">
          <Card className="p-4 overflow-auto bg-gray-100">
            <Stage
              width={POSTER_SIZES[posterSize].width * scale}
              height={POSTER_SIZES[posterSize].height * scale}
              scale={{ x: scale, y: scale }}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) {
                  setSelectedId(null);
                }
              }}
            >
              <Layer>
                {/* Background */}
                <Rect
                  width={POSTER_SIZES[posterSize].width}
                  height={POSTER_SIZES[posterSize].height}
                  fill="white"
                  shadowColor="rgba(0, 0, 0, 0.15)"
                  shadowBlur={20}
                  shadowOffset={{ x: 5, y: 5 }}
                />

                {/* Grid */}
                {renderGrid()}

                {/* Elements */}
                {elements
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map((element) => {
                    if (element.type === 'text') {
                      return (
                        <Text
                          key={element.id}
                          {...element}
                          onClick={() => setSelectedId(element.id)}
                          onTap={() => setSelectedId(element.id)}
                          onDragEnd={(e) => {
                            const pos = e.target.position();
                            if (snapToGrid) {
                              pos.x = Math.round(pos.x / gridSize) * gridSize;
                              pos.y = Math.round(pos.y / gridSize) * gridSize;
                            }
                            updateElement(element.id, pos);
                          }}
                        />
                      );
                    }
                    if (element.type === 'image') {
                      return (
                        <URLImage
                          key={element.id}
                          {...element}
                          onClick={() => setSelectedId(element.id)}
                          onTap={() => setSelectedId(element.id)}
                          onDragEnd={(e) => {
                            const pos = e.target.position();
                            if (snapToGrid) {
                              pos.x = Math.round(pos.x / gridSize) * gridSize;
                              pos.y = Math.round(pos.y / gridSize) * gridSize;
                            }
                            updateElement(element.id, pos);
                          }}
                        />
                      );
                    }
                    return null;
                  })}
              </Layer>
            </Stage>
          </Card>
        </div>
      </div>
    </div>
  );
}