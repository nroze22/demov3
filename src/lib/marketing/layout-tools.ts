import { fabric } from 'fabric';

export interface LayoutGuide {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
  color?: string;
}

export interface GridSettings {
  enabled: boolean;
  size: number;
  color: string;
  opacity: number;
  snap: boolean;
  snapThreshold: number;
}

export class LayoutManager {
  private canvas: fabric.Canvas;
  private guides: LayoutGuide[] = [];
  private grid: GridSettings = {
    enabled: true,
    size: 20,
    color: '#cccccc',
    opacity: 0.5,
    snap: true,
    snapThreshold: 10
  };

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.initializeGrid();
    this.initializeGuides();
    this.setupEventListeners();
  }

  private initializeGrid() {
    if (this.grid.enabled) {
      this.canvas.setBackgroundColor(new fabric.Pattern({
        source: this.createGridPattern(),
        repeat: 'repeat'
      }), () => this.canvas.renderAll());
    }
  }

  private createGridPattern(): HTMLCanvasElement {
    const patternCanvas = document.createElement('canvas');
    const ctx = patternCanvas.getContext('2d');
    if (!ctx) return patternCanvas;

    patternCanvas.width = this.grid.size;
    patternCanvas.height = this.grid.size;

    ctx.strokeStyle = this.grid.color;
    ctx.globalAlpha = this.grid.opacity;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.grid.size, 0);
    ctx.lineTo(this.grid.size, this.grid.size);
    ctx.stroke();

    return patternCanvas;
  }

  private initializeGuides() {
    // Add default guides (thirds, center)
    const { width, height } = this.canvas;
    this.addGuide('vertical', width / 3);
    this.addGuide('vertical', (width / 3) * 2);
    this.addGuide('horizontal', height / 3);
    this.addGuide('horizontal', (height / 3) * 2);
  }

  private setupEventListeners() {
    this.canvas.on('object:moving', (e) => {
      if (!e.target || !this.grid.snap) return;

      const obj = e.target;
      const gridSize = this.grid.size;
      const threshold = this.grid.snapThreshold;

      // Snap to grid
      const left = Math.round(obj.left! / gridSize) * gridSize;
      const top = Math.round(obj.top! / gridSize) * gridSize;

      if (Math.abs(obj.left! - left) < threshold) obj.set('left', left);
      if (Math.abs(obj.top! - top) < threshold) obj.set('top', top);

      // Snap to guides
      this.guides.forEach(guide => {
        if (guide.type === 'vertical') {
          if (Math.abs(obj.left! - guide.position) < threshold) {
            obj.set('left', guide.position);
          }
        } else {
          if (Math.abs(obj.top! - guide.position) < threshold) {
            obj.set('top', guide.position);
          }
        }
      });

      obj.setCoords();
    });
  }

  addGuide(type: 'horizontal' | 'vertical', position: number, color = '#ff0000') {
    const guide: LayoutGuide = {
      id: `guide-${Date.now()}`,
      type,
      position,
      color
    };

    this.guides.push(guide);
    this.renderGuide(guide);
  }

  private renderGuide(guide: LayoutGuide) {
    const { width, height } = this.canvas;
    const line = new fabric.Line(
      guide.type === 'horizontal' 
        ? [0, guide.position, width, guide.position]
        : [guide.position, 0, guide.position, height],
      {
        stroke: guide.color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5]
      }
    );

    this.canvas.add(line);
    this.canvas.renderAll();
  }

  setGridSettings(settings: Partial<GridSettings>) {
    this.grid = { ...this.grid, ...settings };
    this.initializeGrid();
  }

  alignObjects(alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') {
    const activeObjects = this.canvas.getActiveObjects();
    if (activeObjects.length < 2) return;

    const bounds = this.canvas._calcObjectsBoundingBox(activeObjects);
    
    activeObjects.forEach(obj => {
      switch (alignment) {
        case 'left':
          obj.set('left', bounds.left);
          break;
        case 'center':
          obj.set('left', bounds.left + bounds.width / 2 - obj.width! * obj.scaleX! / 2);
          break;
        case 'right':
          obj.set('left', bounds.left + bounds.width - obj.width! * obj.scaleX!);
          break;
        case 'top':
          obj.set('top', bounds.top);
          break;
        case 'middle':
          obj.set('top', bounds.top + bounds.height / 2 - obj.height! * obj.scaleY! / 2);
          break;
        case 'bottom':
          obj.set('top', bounds.top + bounds.height - obj.height! * obj.scaleY!);
          break;
      }
      obj.setCoords();
    });

    this.canvas.renderAll();
  }

  distributeObjects(direction: 'horizontal' | 'vertical') {
    const activeObjects = this.canvas.getActiveObjects();
    if (activeObjects.length < 3) return;

    // Sort objects by position
    const sorted = [...activeObjects].sort((a, b) => {
      return direction === 'horizontal' 
        ? (a.left! - b.left!)
        : (a.top! - b.top!);
    });

    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalSpace = direction === 'horizontal'
      ? last.left! - first.left!
      : last.top! - first.top!;
    const spacing = totalSpace / (sorted.length - 1);

    sorted.forEach((obj, i) => {
      if (i === 0 || i === sorted.length - 1) return;

      if (direction === 'horizontal') {
        obj.set('left', first.left! + spacing * i);
      } else {
        obj.set('top', first.top! + spacing * i);
      }
      obj.setCoords();
    });

    this.canvas.renderAll();
  }
}