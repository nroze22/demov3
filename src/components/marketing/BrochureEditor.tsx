import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ChromePicker } from 'react-color';
import { Stage, Layer, Rect, Text } from 'react-konva';
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
} from 'lucide-react';
import { ImageLibrary } from './ImageLibrary';

interface BrochureEditorProps {
  studyDetails: any;
  onSave: (content: any) => void;
}

export function BrochureEditor({ studyDetails, onSave }: BrochureEditorProps) {
  const [activeTab, setActiveTab] = useState('text');
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState('#000000');
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);

  const BROCHURE_WIDTH = 2550; // 8.5" at 300dpi
  const BROCHURE_HEIGHT = 3300; // 11" at 300dpi
  const PANEL_WIDTH = BROCHURE_WIDTH / 3;

  const addText = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      x: BROCHURE_WIDTH / 2,
      y: BROCHURE_HEIGHT / 2,
      fontSize: 48,
      fontFamily: 'Arial',
      fill: color,
      align: 'center',
      draggable: true,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };

  const updateElement = (id: string, updates: any) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(null);
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
      setElements([...elements, newElement]);
      setSelectedElement(newElement);
    }
  };

  const addImage = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const newElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          x: BROCHURE_WIDTH / 2,
          y: BROCHURE_HEIGHT / 2,
          width: img.width,
          height: img.height,
          url: e.target?.result,
          draggable: true,
        };
        setElements([...elements, newElement]);
        setSelectedElement(newElement);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const exportToPDF = () => {
    // Implement PDF export logic
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    const lines = [];
    // Vertical lines
    for (let i = 0; i <= BROCHURE_WIDTH; i += gridSize) {
      lines.push(
        <Rect
          key={`v${i}`}
          x={i}
          y={0}
          width={1}
          height={BROCHURE_HEIGHT}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }
    // Horizontal lines
    for (let i = 0; i <= BROCHURE_HEIGHT; i += gridSize) {
      lines.push(
        <Rect
          key={`h${i}`}
          x={0}
          y={i}
          width={BROCHURE_WIDTH}
          height={1}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }
    return lines;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setScale(s => Math.max(0.1, s - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => setScale(s => Math.min(2, s + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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

              {selectedElement?.type === 'text' && (
                <div className="space-y-4">
                  <Input
                    value={selectedElement.content}
                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                    placeholder="Enter text"
                  />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle?.includes('bold') ? 
                          selectedElement.fontStyle.replace('bold', '') : 
                          `${selectedElement.fontStyle || ''} bold`
                      })}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle?.includes('italic') ? 
                          selectedElement.fontStyle.replace('italic', '') : 
                          `${selectedElement.fontStyle || ''} italic`
                      })}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateElement(selectedElement.id, {
                        align: selectedElement.align === 'left' ? 'center' : 
                          selectedElement.align === 'center' ? 'right' : 'left'
                      })}
                    >
                      {selectedElement.align === 'left' ? <AlignLeft className="h-4 w-4" /> :
                       selectedElement.align === 'center' ? <AlignCenter className="h-4 w-4" /> :
                       <AlignRight className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Font Size</label>
                    <Slider
                      value={[selectedElement.fontSize || 48]}
                      min={12}
                      max={144}
                      step={1}
                      onValueChange={([value]) => 
                        updateElement(selectedElement.id, { fontSize: value })
                      }
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
                          style={{ backgroundColor: selectedElement.fill }}
                        />
                        {selectedElement.fill}
                      </Button>
                      {showColorPicker && (
                        <div className="absolute z-10 mt-2">
                          <ChromePicker
                            color={selectedElement.fill}
                            onChange={(color) => {
                              updateElement(selectedElement.id, { fill: color.hex });
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
              <ImageLibrary onSelect={(image) => {
                const newElement = {
                  id: `image-${Date.now()}`,
                  type: 'image',
                  x: BROCHURE_WIDTH / 2,
                  y: BROCHURE_HEIGHT / 2,
                  width: 300,
                  height: 200,
                  url: image.url,
                  draggable: true,
                };
                setElements([...elements, newElement]);
                setSelectedElement(newElement);
              }} />
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
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Canvas */}
        <div className="col-span-3">
          <Card className="p-4 overflow-auto bg-gray-100">
            <Stage
              width={BROCHURE_WIDTH * scale}
              height={BROCHURE_HEIGHT * scale}
              scale={{ x: scale, y: scale }}
            >
              <Layer>
                {/* Background */}
                <Rect
                  width={BROCHURE_WIDTH}
                  height={BROCHURE_HEIGHT}
                  fill="white"
                />

                {/* Grid */}
                {renderGrid()}

                {/* Elements */}
                {elements.map((element) => {
                  if (element.type === 'text') {
                    return (
                      <Text
                        key={element.id}
                        {...element}
                        onClick={() => setSelectedElement(element)}
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