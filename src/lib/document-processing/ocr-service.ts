import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import natural from 'natural';
import nlp from 'compromise';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Initialize Tesseract worker
let ocrWorker: Tesseract.Worker | null = null;

async function getOCRWorker() {
  if (!ocrWorker) {
    ocrWorker = await createWorker('eng');
  }
  return ocrWorker;
}

export async function processDocument(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    return processPDF(file);
  } else if (file.type.startsWith('image/')) {
    return processImage(file);
  } else {
    return processText(file);
  }
}

async function processPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';

    // If the page has little or no text, it might be scanned - use OCR
    if (pageText.trim().length < 100) {
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const imageData = canvas.toDataURL('image/png');
        const ocrText = await processImage(
          await (await fetch(imageData)).blob() as File
        );
        fullText += ocrText + '\n';
      }
    }
  }

  return fullText;
}

async function processImage(file: File): Promise<string> {
  const worker = await getOCRWorker();
  const result = await worker.recognize(file);
  return result.data.text;
}

async function processText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function extractEntities(text: string) {
  const doc = nlp(text);
  
  // Extract dates
  const dates = doc.dates().json();
  
  // Extract numbers and measurements
  const numbers = doc.numbers().json();
  
  // Extract medical terms using natural
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  
  // Use compromise for named entity recognition
  const people = doc.people().json();
  const places = doc.places().json();
  const organizations = doc.organizations().json();

  return {
    dates,
    numbers,
    tokens,
    people,
    places,
    organizations
  };
}

export function preprocessText(text: string): string {
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Normalize dates
  text = text.replace(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/g, '$1/$2/$3');
  
  // Normalize phone numbers
  text = text.replace(/(\d{3})[.-]?(\d{3})[.-]?(\d{4})/g, '($1) $2-$3');
  
  // Expand common medical abbreviations
  const abbreviations: { [key: string]: string } = {
    'pt': 'patient',
    'dx': 'diagnosis',
    'hx': 'history',
    'rx': 'prescription',
    'tx': 'treatment'
  };
  
  Object.entries(abbreviations).forEach(([abbr, full]) => {
    text = text.replace(new RegExp(`\\b${abbr}\\b`, 'gi'), full);
  });

  return text;
}