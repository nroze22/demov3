import { jsPDF } from 'jspdf';
import { BROCHURE_DIMENSIONS, exportSettings } from './templates/brochure-templates';

interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg';
  quality?: number;
  bleed?: boolean;
  marks?: boolean;
  colorSpace?: 'RGB' | 'CMYK';
}

export async function exportBrochure(
  stageRef: any,
  options: ExportOptions = { format: 'pdf' }
) {
  const { format, quality, bleed, marks, colorSpace } = {
    ...exportSettings[options.format],
    ...options
  };

  const stage = stageRef.current;
  if (!stage) return;

  // Get stage dimensions
  const { width, height } = BROCHURE_DIMENSIONS.letter;

  // Create PDF with proper dimensions
  const pdf = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height]
  });

  // Convert stage to data URL
  const dataURL = stage.toDataURL({
    pixelRatio: 2,
    mimeType: format === 'jpg' ? 'image/jpeg' : 'image/png',
    quality: quality || 1
  });

  // Add bleed marks if requested
  if (marks) {
    addCropMarks(pdf, width, height);
  }

  // Add the stage content
  pdf.addImage(dataURL, format.toUpperCase(), 0, 0, width, height);

  // Download the PDF
  pdf.save('brochure.pdf');
}

export async function exportPoster(
  stageRef: any,
  options: ExportOptions = { format: 'pdf' }
) {
  // Similar to exportBrochure but with poster-specific settings
  // Implementation here...
}

function addCropMarks(pdf: jsPDF, width: number, height: number) {
  const markLength = 24; // Length of crop marks in pixels
  const offset = 12; // Offset from edge in pixels

  // Top-left marks
  pdf.line(0, offset, markLength, offset); // Horizontal
  pdf.line(offset, 0, offset, markLength); // Vertical

  // Top-right marks
  pdf.line(width - markLength, offset, width, offset); // Horizontal
  pdf.line(width - offset, 0, width - offset, markLength); // Vertical

  // Bottom-left marks
  pdf.line(0, height - offset, markLength, height - offset); // Horizontal
  pdf.line(offset, height - markLength, offset, height); // Vertical

  // Bottom-right marks
  pdf.line(width - markLength, height - offset, width, height - offset); // Horizontal
  pdf.line(width - offset, height - markLength, width - offset, height); // Vertical
}

export function downloadImage(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}