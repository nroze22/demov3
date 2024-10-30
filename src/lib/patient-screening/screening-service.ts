import { generateWithGPT4 } from '../gpt';
import { ScreeningCriteria, ExtractedPatient, ScreeningStats } from './types';

// Helper function to read file content
async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

// Process a single document and extract patient information
export async function processDocument(
  file: File,
  criteria: ScreeningCriteria
): Promise<ExtractedPatient | null> {
  const content = await readFileContent(file);
  
  // First pass: Extract structured patient data
  const extractionPrompt = `You are an expert medical data analyst. Extract patient information from this medical document.
Focus ONLY on information relevant to these criteria:

${JSON.stringify(criteria, null, 2)}

CRITICAL: Return ONLY a valid JSON object. Do not include ANY explanatory text before or after the JSON.
The response must start with '{' and end with '}'.

Required JSON structure:
{
  "demographics": {
    "firstName": string,
    "lastName": string,
    "dateOfBirth": string,
    "age": number,
    "gender": string
  },
  "conditions": [{
    "name": string,
    "date": string,
    "status": string,
    "confidence": number,
    "source": { "location": { "start": number, "end": number } }
  }],
  "labValues": [{
    "name": string,
    "value": number,
    "unit": string,
    "date": string,
    "confidence": number,
    "source": { "location": { "start": number, "end": number } }
  }],
  "medications": [{
    "name": string,
    "dosage": string,
    "frequency": string,
    "startDate": string,
    "endDate": string,
    "confidence": number,
    "source": { "location": { "start": number, "end": number } }
  }]
}`;

  try {
    const extractedData = await generateWithGPT4([
      { role: 'system', content: extractionPrompt },
      { role: 'user', content: content }
    ]);

    if (!extractedData) return null;

    // Strict JSON cleaning
    const jsonStr = extractedData.trim()
      .replace(/^[^{]*/, '') // Remove anything before first {
      .replace(/[^}]*$/, '') // Remove anything after last }
      .replace(/```json/g, '') // Remove markdown code blocks
      .replace(/```/g, '');

    const patientData = JSON.parse(jsonStr);

    // Second pass: Evaluate criteria matches with strict JSON formatting
    const matchingPrompt = `You are an expert clinical trial coordinator. Evaluate how well this patient matches the study criteria.
Consider ONLY factual evidence, not assumptions.

Patient Data:
${JSON.stringify(patientData, null, 2)}

Study Criteria:
${JSON.stringify(criteria, null, 2)}

CRITICAL: Return ONLY a valid JSON object. Do not include ANY explanatory text.
The response must start with '{' and end with '}'.

Required JSON structure:
{
  "criteriaMatches": [{
    "criteriaId": string,
    "matched": boolean,
    "confidence": number,
    "sourceEvidence": [{
      "text": string,
      "location": { "start": number, "end": number },
      "confidence": number
    }]
  }],
  "matchScore": number
}`;

    const matchingResult = await generateWithGPT4([
      { role: 'system', content: matchingPrompt },
      { role: 'user', content: JSON.stringify(patientData) }
    ]);

    if (!matchingResult) return null;

    // Clean JSON response
    const matchJsonStr = matchingResult.trim()
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .replace(/```json/g, '')
      .replace(/```/g, '');

    const matches = JSON.parse(matchJsonStr);

    return {
      id: `patient-${Date.now()}`,
      sourceDocuments: [{
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type,
        content,
        extractedFields: []
      }],
      ...patientData,
      ...matches
    };
  } catch (error) {
    console.error('Error processing document:', error);
    return null;
  }
}

// Process multiple documents
export async function processDocuments(
  files: File[],
  criteria: ScreeningCriteria
): Promise<ExtractedPatient[]> {
  const results = await Promise.all(
    files.map(file => processDocument(file, criteria))
  );
  
  return results.filter((result): result is ExtractedPatient => result !== null);
}

// Calculate screening statistics
export function calculateScreeningStats(patients: ExtractedPatient[]): ScreeningStats {
  const totalPatients = patients.length;
  const matchingPatients = patients.filter(p => p.matchScore >= 0.8).length;
  const partialMatches = patients.filter(p => p.matchScore >= 0.5 && p.matchScore < 0.8).length;

  return {
    totalProcessed: totalPatients,
    matchingCriteria: matchingPatients,
    partialMatches,
    averageMatchScore: patients.reduce((sum, p) => sum + p.matchScore, 0) / totalPatients,
    processingTime: Date.now(),
    criteriaMatchBreakdown: patients.reduce((acc, patient) => {
      patient.criteriaMatches.forEach(match => {
        if (!acc[match.criteriaId]) {
          acc[match.criteriaId] = { matched: 0, total: totalPatients };
        }
        if (match.matched) {
          acc[match.criteriaId].matched++;
        }
      });
      return acc;
    }, {} as Record<string, { matched: number; total: number }>)
  };
}

// Rank patients by match score
export function rankPatients(patients: ExtractedPatient[]): ExtractedPatient[] {
  return [...patients].sort((a, b) => b.matchScore - a.matchScore);
}