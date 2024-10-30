export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'list';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  shape?: 'rectangle' | 'circle' | 'line';
  rotation?: number;
  opacity?: number;
  locked?: boolean;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    align?: 'left' | 'center' | 'right';
    spacing?: number;
    bulletColor?: string;
    shadow?: string;
    gradient?: string;
    cornerRadius?: number;
  };
  effects?: {
    shadow?: {
      color: string;
      blur: number;
      offsetX: number;
      offsetY: number;
    };
    gradient?: {
      type: 'linear' | 'radial';
      stops: Array<{ offset: number; color: string }>;
      angle?: number;
    };
    blur?: number;
    opacity?: number;
  };
  constraints?: {
    locked?: boolean;
    aspectRatio?: boolean;
    rotation?: boolean;
  };
  metadata?: {
    name?: string;
    tags?: string[];
    createdAt?: Date;
    modifiedAt?: Date;
  };
}

export interface LayoutSection {
  width?: number;
  height?: number;
  background?: string;
  padding?: number;
  border?: {
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
  effects?: {
    shadow?: string;
    gradient?: string;
  };
}

export interface PosterTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  size: 'letter' | 'tabloid' | 'a3' | 'custom';
  layout: {
    [key: string]: LayoutSection;
  };
  elements: DesignElement[];
  category?: string;
  tags?: string[];
  metadata?: {
    author?: string;
    created?: Date;
    modified?: Date;
    version?: string;
  };
}

export interface CanvasState {
  selectedElements: string[];
  zoom: number;
  pan: { x: number; y: number };
  history: {
    undo: any[];
    redo: any[];
  };
  guides: {
    vertical: number[];
    horizontal: number[];
  };
  grid: {
    enabled: boolean;
    size: number;
    snap: boolean;
  };
}

export interface DesignHistory {
  timestamp: number;
  elements: DesignElement[];
  type: 'add' | 'remove' | 'modify' | 'reorder';
  elementIds: string[];
}

export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg';
  dpi: number;
  colorSpace: 'RGB' | 'CMYK';
  quality?: number;
  bleed?: boolean;
  marks?: boolean;
}