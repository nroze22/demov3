import { generateWithGPT4 } from './gpt';

interface ExtractedData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  medicalHistory?: string[];
  medications?: string[];
  allergies?: string[];
  confidence: {
    [key: string]: number;
  };
}

const systemPrompt = `You are an expert medical data extraction system. Extract patient information from the provided text with high accuracy. 

Return ONLY a JSON object matching this structure:
{
  "firstName": string,
  "lastName": string,
  "dateOfBirth": string,
  "gender": string,
  "address": string,
  "phone": string,
  "email": string,
  "insuranceProvider": string,
  "insuranceNumber": string,
  "medicalHistory": string[],
  "medications": string[],
  "allergies": string[],
  "confidence": {
    // Confidence score (0-1) for each extracted field
    "firstName": number,
    "lastName": number,
    // etc...
  }
}

Rules:
1. ONLY return valid JSON - no other text
2. Include confidence scores for each field
3. Use null for missing fields
4. Normalize dates to YYYY-MM-DD format
5. Clean and standardize phone numbers
6. Validate email format`;

export async function extractPatientData(text: string): Promise<ExtractedData> {
  try {
    const response = await generateWithGPT4([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Extract patient information from:\n\n${text}` }
    ]);

    if (!response) {
      throw new Error('No response from extraction service');
    }

    // Clean response to ensure valid JSON
    const cleanedResponse = response.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    
    try {
      const extractedData = JSON.parse(cleanedResponse);
      
      // Validate required fields and structure
      if (!extractedData.confidence || typeof extractedData.confidence !== 'object') {
        throw new Error('Invalid response format: missing confidence scores');
      }

      // Ensure all fields have confidence scores
      const requiredFields = [
        'firstName', 'lastName', 'dateOfBirth', 'gender', 'address',
        'phone', 'email', 'insuranceProvider', 'insuranceNumber'
      ];

      for (const field of requiredFields) {
        if (!(field in extractedData.confidence)) {
          extractedData.confidence[field] = 0;
        }
      }

      return extractedData;
    } catch (parseError) {
      console.error('Failed to parse extraction response:', parseError);
      throw new Error('Invalid response format from extraction service');
    }
  } catch (error) {
    console.error('Extraction error:', error);
    
    // Return empty data structure with zero confidence
    return {
      confidence: {
        firstName: 0,
        lastName: 0,
        dateOfBirth: 0,
        gender: 0,
        address: 0,
        phone: 0,
        email: 0,
        insuranceProvider: 0,
        insuranceNumber: 0
      }
    };
  }
}

export async function validateExtraction(extractedData: ExtractedData): Promise<{
  isValid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  // Validate date format
  if (extractedData.dateOfBirth) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(extractedData.dateOfBirth)) {
      errors.push('Invalid date of birth format');
    }
  }

  // Validate email format
  if (extractedData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(extractedData.email)) {
      errors.push('Invalid email format');
    }
  }

  // Validate phone format
  if (extractedData.phone) {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(extractedData.phone)) {
      errors.push('Invalid phone format');
    }
  }

  // Check confidence scores
  const lowConfidenceThreshold = 0.7;
  for (const [field, score] of Object.entries(extractedData.confidence)) {
    if (score < lowConfidenceThreshold && extractedData[field as keyof ExtractedData]) {
      errors.push(`Low confidence for field: ${field}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function formatExtractedData(data: ExtractedData): ExtractedData {
  return {
    ...data,
    // Format phone number
    phone: data.phone?.replace(/[\s-()]/g, '').replace(/^(\+?\d{1,3})?(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3-$4'),
    // Ensure date format
    dateOfBirth: data.dateOfBirth?.split(/[-/]/).map(p => p.padStart(2, '0')).join('-'),
    // Normalize gender
    gender: data.gender?.toLowerCase().startsWith('m') ? 'Male' : 
            data.gender?.toLowerCase().startsWith('f') ? 'Female' : data.gender,
    // Clean email
    email: data.email?.toLowerCase().trim(),
    confidence: data.confidence
  };
}