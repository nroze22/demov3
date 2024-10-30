interface ExtractedData {
  title?: string;
  phase?: string;
  type?: string;
  therapeuticArea?: string;
  indication?: string;
  patientCount?: string;
  duration?: string;
}

interface ProcessedDocument {
  extractedData: ExtractedData;
  content: string;
  fileName: string;
}

export async function processDocument(file: File): Promise<ProcessedDocument> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const extractedData = await extractDataFromContent(content);
        
        resolve({
          extractedData,
          content,
          fileName: file.name
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

export function mergeDocumentData(existingData: ExtractedData, newData: ExtractedData): ExtractedData {
  return {
    title: newData.title || existingData.title,
    phase: newData.phase || existingData.phase,
    type: newData.type || existingData.type,
    therapeuticArea: newData.therapeuticArea || existingData.therapeuticArea,
    indication: newData.indication || existingData.indication,
    patientCount: newData.patientCount || existingData.patientCount,
    duration: newData.duration || existingData.duration
  };
}

async function extractDataFromContent(content: string): Promise<ExtractedData> {
  const extractedData: ExtractedData = {};

  // Extract study title
  const titleMatch = content.match(/(?:study|protocol)\s+title:\s*([^\n]+)/i);
  if (titleMatch) {
    extractedData.title = titleMatch[1].trim();
  }

  // Extract phase
  const phaseMatch = content.match(/phase\s*(?::|is)?\s*((?:I{1,3}V?|[1-4])|N\/A)/i);
  if (phaseMatch) {
    extractedData.phase = phaseMatch[1].trim();
  }

  // Extract study type
  const typeMatch = content.match(/(?:study\s+)?type:\s*([^\n]+)/i);
  if (typeMatch) {
    extractedData.type = typeMatch[1].trim();
  }

  // Extract therapeutic area
  const areaMatch = content.match(/(?:therapeutic|disease)\s+area:\s*([^\n]+)/i);
  if (areaMatch) {
    extractedData.therapeuticArea = areaMatch[1].trim();
  }

  // Extract indication
  const indicationMatch = content.match(/(?:primary\s+)?indication:\s*([^\n]+)/i);
  if (indicationMatch) {
    extractedData.indication = indicationMatch[1].trim();
  }

  // Extract patient count
  const patientMatch = content.match(/(?:sample\s+size|number\s+of\s+patients|target\s+enrollment):\s*(\d+)/i);
  if (patientMatch) {
    extractedData.patientCount = patientMatch[1].trim();
  }

  // Extract duration
  const durationMatch = content.match(/(?:study\s+)?duration:\s*(\d+\s*(?:months?|weeks?|years?))/i);
  if (durationMatch) {
    extractedData.duration = durationMatch[1].trim();
  }

  return extractedData;
}