import { generateWithGPT4 } from '../gpt';
import type { ECRFForm, ECRFSection, ECRFField, FormAnalysis } from './types';

interface StudyDetails {
  title: string;
  phase: string;
  type: string;
  therapeuticArea: string;
  primaryObjective: string;
  endpoints: string[];
  procedures: string[];
  population: {
    inclusion: string[];
    exclusion: string[];
  };
}

export async function generateECRFSuggestions(studyDetails: StudyDetails): Promise<ECRFForm[]> {
  const systemPrompt = `You are an expert in clinical trial eCRF design with extensive experience in EDC systems and clinical data management. Create comprehensive eCRF forms for:

Study Title: ${studyDetails.title}
Phase: ${studyDetails.phase}
Type: ${studyDetails.type}
Therapeutic Area: ${studyDetails.therapeuticArea}

The eCRF should:
1. Capture all essential study data
2. Follow CDASH standards where applicable
3. Include appropriate validations
4. Be optimized for data entry efficiency
5. Include conditional logic where appropriate
6. Support the study endpoints:
${studyDetails.endpoints.map(e => `- ${e}`).join('\n')}

Format the response as a JSON object matching the ECRFForm interface.`;

  try {
    const response = await generateWithGPT4([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate optimized eCRF forms for this study.' }
    ]);

    if (!response) {
      throw new Error('No response from GPT');
    }

    const forms = JSON.parse(response);
    return Array.isArray(forms) ? forms : [forms];
  } catch (error) {
    console.error('Failed to generate eCRF suggestions:', error);
    
    // Return a basic template as fallback
    return [generateBasicTemplate(studyDetails)];
  }
}

export async function simulateFormData(form: ECRFForm, sampleSize: number = 100): Promise<any[]> {
  const systemPrompt = `You are an expert in clinical trial data simulation. Generate realistic sample data for this eCRF:

Form Structure: ${JSON.stringify(form, null, 2)}

Generate ${sampleSize} realistic patient records that:
1. Follow all form validation rules
2. Include common data entry patterns
3. Simulate real-world data distributions
4. Include edge cases and potential issues
5. Reflect typical clinical trial data patterns

Format the response as a JSON array of records.`;

  try {
    const response = await generateWithGPT4([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate simulated patient data.' }
    ]);

    if (!response) {
      throw new Error('No response from GPT');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to simulate form data:', error);
    return [];
  }
}

export async function analyzeFormPerformance(form: ECRFForm, sampleData: any[]): Promise<FormAnalysis> {
  const systemPrompt = `You are an expert in clinical trial form optimization and data quality analysis. Analyze this eCRF and sample data:

Form: ${JSON.stringify(form, null, 2)}
Sample Data: ${JSON.stringify(sampleData.slice(0, 10), null, 2)}

Provide comprehensive analysis including:
1. Form completion efficiency
2. Data quality metrics
3. Potential improvements
4. Validation suggestions
5. Structural optimizations
6. Compliance considerations

Format the response as a JSON object matching the FormAnalysis interface.`;

  try {
    const response = await generateWithGPT4([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Analyze form performance and provide recommendations.' }
    ]);

    if (!response) {
      throw new Error('No response from GPT');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to analyze form performance:', error);
    return {
      score: 0,
      suggestions: [],
      performance: {
        completionTime: 0,
        errorRate: 0,
        missingDataRate: 0
      },
      dataQuality: {
        consistency: 0,
        completeness: 0,
        accuracy: 0
      }
    };
  }
}

function generateBasicTemplate(studyDetails: StudyDetails): ECRFForm {
  const now = new Date();
  
  return {
    id: `form-${Date.now()}`,
    title: `${studyDetails.title} - Main CRF`,
    description: 'Basic electronic Case Report Form',
    version: '1.0',
    status: 'draft',
    sections: [
      {
        id: 'demographics',
        title: 'Demographics',
        fields: [
          {
            id: 'subject-id',
            type: 'text',
            label: 'Subject ID',
            name: 'subjectId',
            required: true,
            validation: {
              pattern: '^[A-Z0-9]{3,10}$'
            }
          },
          {
            id: 'date-of-birth',
            type: 'date',
            label: 'Date of Birth',
            name: 'dateOfBirth',
            required: true
          },
          {
            id: 'gender',
            type: 'select',
            label: 'Gender',
            name: 'gender',
            required: true,
            options: [
              { label: 'Male', value: 'M' },
              { label: 'Female', value: 'F' },
              { label: 'Other', value: 'O' }
            ]
          }
        ]
      },
      {
        id: 'eligibility',
        title: 'Eligibility Criteria',
        fields: [
          {
            id: 'inclusion-criteria',
            type: 'checkbox',
            label: 'Inclusion Criteria Met',
            name: 'inclusionCriteria',
            required: true
          },
          {
            id: 'exclusion-criteria',
            type: 'checkbox',
            label: 'Exclusion Criteria Confirmed',
            name: 'exclusionCriteria',
            required: true
          }
        ]
      }
    ],
    validation: {
      rules: [
        {
          id: 'age-check',
          description: 'Subject must be within eligible age range',
          condition: 'age >= 18 && age <= 75',
          severity: 'error'
        }
      ]
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: 'System',
      updatedBy: 'System'
    }
  };
}