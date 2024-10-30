import { fabric } from 'fabric';
import { PosterTemplate, BrochureTemplate } from './types';

export class TemplatePreview {
  private canvas: fabric.Canvas;
  private scale: number;

  constructor(canvasId: string, width: number, height: number, scale = 0.2) {
    this.canvas = new fabric.Canvas(canvasId, {
      width: width * scale,
      height: height * scale,
      backgroundColor: '#ffffff'
    });
    this.scale = scale;
  }

  async loadPosterTemplate(template: PosterTemplate) {
    this.canvas.clear();

    // Apply layout background sections
    Object.entries(template.layout).forEach(([key, section]) => {
      const { width, height, background } = section;
      if (background) {
        this.canvas.add(new fabric.Rect({
          left: 0,
          top: 0,
          width: width! * this.canvas.width!,
          height: height! * this.canvas.height!,
          fill: background,
          selectable: false
        }));
      }
    });

    // Add template elements
    for (const element of template.elements) {
      await this.addElement(element);
    }

    this.canvas.renderAll();
  }

  async loadBrochureTemplate(template: BrochureTemplate, panel: 'front' | 'inside' | 'back') {
    this.canvas.clear();
    
    const elements = template.panels[panel];
    for (const element of elements) {
      await this.addElement(element);
    }

    this.canvas.renderAll();
  }

  private async addElement(element: any) {
    switch (element.type) {
      case 'text':
        const text = new fabric.Text(element.content, {
          left: element.x * this.canvas.width!,
          top: element.y * this.canvas.height!,
          fontSize: element.style?.fontSize! * this.scale,
          fontFamily: element.style?.fontFamily,
          fill: element.style?.fill,
          textAlign: element.style?.align,
          selectable: false
        });
        this.canvas.add(text);
        break;

      case 'image':
        if (element.url) {
          fabric.Image.fromURL(element.url, (img) => {
            img.set({
              left: element.x * this.canvas.width!,
              top: element.y * this.canvas.height!,
              scaleX: (element.width || 0.2) * this.scale,
              scaleY: (element.height || 0.2) * this.scale,
              selectable: false
            });
            this.canvas.add(img);
          });
        }
        break;

      case 'shape':
        // Add shape handling
        break;
    }
  }

  setScale(scale: number) {
    this.scale = scale;
    this.canvas.setZoom(scale);
    this.canvas.renderAll();
  }

  destroy() {
    this.canvas.dispose();
  }
}