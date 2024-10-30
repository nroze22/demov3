import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Image, Group } from 'react-konva';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { CanvasState, DesignElement } from '@/lib/marketing/types';
import { LayoutManager } from '@/lib/marketing/layout-tools';
import { exportToPdf, downloadImage } from '@/lib/marketing/export-utils';
import {
  ZoomIn,
  ZoomOut,
  Grid,
  Lock,
  Unlock,
  Move,
  MousePointer,
  Type,
  Image as ImageIcon,
  Square,
  Save,
  Download,
  Undo,
  Redo,
  Copy,
  Trash,
} from 'lucide-react';

interface DesignCanvasProps {
  width: number;
  height: number;
  elements: DesignElement[];
  onElementsChange: (elements: DesignElement[]) => void;
  onSelect: (elementId: string | null) => void;
  selectedId: string | null;
}

export function DesignCanvas({
  width,
  height,
  elements,
  onElementsChange,
  onSelect,
  selectedId
}: DesignCanvasProps) {
  const stageRef = useRef<any>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    selectedElements: [],
    zoom: 1,
    pan: { x: 0, y: 0 },
    history: { undo: [], redo: [] },
    guides: { vertical: [], horizontal: [] },
    grid: { enabled: true, size: 20, snap: true }
  });

  const [layoutManager] = useState(() => new LayoutManager(stageRef.current));

  useEffect(() => {
    layoutManager.setGridSettings(canvasState.grid);
  }, [canvasState.grid, layoutManager]);

  const handleElementDrag = (id: string, event: any) => {
    const { x, y } = event.target.position();
    const updatedElements = elements.map(el =>
      el.id === id ? { ...el, x, y } : el
    );
    onElementsChange(updatedElements);
  };

  const handleElementTransform = (id: string, event: any) => {
    const node = event.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();

    const updatedElements = elements.map(el =>
      el.id === id
        ? {
            ...el,
            width: el.width ? el.width * scaleX : undefined,
            height: el.height ? el.height * scaleY : undefined,
            rotation,
            x: node.x(),
            y: node.y()
          }
        : el
    );
    onElementsChange(updatedElements);
  };

  const handleZoom = (delta: number) => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(3, prev.zoom + delta))
    }));
  };

  const handleExport = async (format: 'pdf' | 'png' | 'jpg') => {
    if (format === 'pdf') {
      await exportToPdf(stageRef.current, {
        format: 'pdf',
        dpi: 300,
        bleed: true,
        marks: true,
        colorSpace: 'CMYK'
      });
    } else {
      const dataUrl = stageRef.current.toDataURL({
        pixelRatio: 3,
        mimeType: `image/${format}`
      });
      downloadImage(dataUrl, `design.${format}`);
    }
  };

  const handleUndo = () => {
    if (canvasState.history.undo.length === 0) return;
    const previousState = canvasState.history.undo[canvasState.history.undo.length - 1];
    onElementsChange(previousState);
    setCanvasState(prev => ({
      ...prev,
      history: {
        undo: prev.history.undo.slice(0, -1),
        redo: [...prev.history.redo, elements]
      }
    }));
  };

  const handleRedo = () => {
    if (canvasState.history.redo.length === 0) return;
    const nextState = canvasState.history.redo[canvasState.history.redo.length - 1];
    onElementsChange(nextState);
    setCanvasState(prev => ({
      ...prev,
      history: {
        undo: [...prev.history.undo, elements],
        redo: prev.history.redo.slice(0, -1)
      }
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(-0.1)}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-16 text-center">
            {Math.round(canvasState.zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(0.1)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCanvasState(prev => ({
              ...prev,
              grid: { ...prev.grid, enabled: !prev.grid.enabled }
            }))}
          >
            <Grid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCanvasState(prev => ({
              ...prev,
              grid: { ...prev.grid, snap: !prev.grid.snap }
            }))}
          >
            {canvasState.grid.snap ? (
              <Lock className="h-4 w-4 mr-2" />
            ) : (
              <Unlock className="h-4 w-4 mr-2" />
            )}
            Snap
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={canvasState.history.undo.length === 0}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={canvasState.history.redo.length === 0}
          >
            <Redo className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-8 bg-gray-100 min-h-full">
          <Stage
            ref={stageRef}
            width={width}
            height={height}
            scaleX={canvasState.zoom}
            scaleY={canvasState.zoom}
            onMouseDown={e => {
              if (e.target === e.target.getStage()) {
                onSelect(null);
              }
            }}
          >
            <Layer>
              {/* Background */}
              <Rect
                width={width}
                height={height}
                fill="white"
                shadowColor="rgba(0,0,0,0.15)"
                shadowBlur={20}
                shadowOffset={{ x: 5, y: 5 }}
              />

              {/* Grid */}
              {canvasState.grid.enabled && (
                <Group>
                  {/* Render grid lines */}
                </Group>
              )}

              {/* Design Elements */}
              {elements.map(element => {
                switch (element.type) {
                  case 'text':
                    return (
                      <Text
                        key={element.id}
                        {...element}
                        draggable
                        onClick={() => onSelect(element.id)}
                        onDragEnd={(e) => handleElementDrag(element.id, e)}
                        onTransformEnd={(e) => handleElementTransform(element.id, e)}
                      />
                    );
                  case 'image':
                    return (
                      <Image
                        key={element.id}
                        {...element}
                        draggable
                        onClick={() => onSelect(element.id)}
                        onDragEnd={(e) => handleElementDrag(element.id, e)}
                        onTransformEnd={(e) => handleElementTransform(element.id, e)}
                      />
                    );
                  // Add other element types...
                  default:
                    return null;
                }
              })}
            </Layer>
          </Stage>
        </div>
      </ScrollArea>
    </div>
  );
}