import { generateWithGPT4 } from '../gpt';
import { BrochureTemplate } from '../types';

export interface BrochureContent {
  panels: {
    front: {
      headline: string;
      subheadline: string;
      callToAction: string;
      imagePrompts: string[];
      colorScheme: {
        primary: string;
        secondary: string;
        accent: string;
      };
    };
    inside: {
      sections: Array<{
        title: string;
        content: string;
        emphasis?: string;
        visualSuggestion?: string;
      }>;
      keyPoints: string[];
      studyDetails: {
        duration: string;
        visits: string;
        compensation: string;
      };
    };
    back: {
      contactInformation: {
        phone: string;
        email: string;
        website?: string;
        address?: string;
      };
      institutionalLogos?: string[];
      disclaimers: string[];
      regulatoryInfo: string;
    };
  };
  design: {
    typography: {
      headlineFont: string;
      bodyFont: string;
      fontSize: {
        headline: number;
        subheadline: number;
        body: number;
      };
    };
    spacing: {
      margins: string;
      padding: string;
      lineHeight: number;
    };
  };
}

export async function generateBrochureContent(studyDetails: any): Promise<BrochureContent> {
  const systemPrompt = `You are a world-class medical communications expert specializing in clinical trial recruitment materials.
Create compelling, professional, and fully compliant content for a tri-fold brochure based on the following study:

Study Title: ${studyDetails.title || 'Clinical Research Study'}
Phase: ${studyDetails.phase || 'N/A'}
Type: ${studyDetails.type || 'Clinical Trial'}
Primary Objective: ${studyDetails.primaryObjective || 'To advance medical knowledge'}

Essential Guidelines:
1. VOICE & TONE:
   - Professional yet accessible (8th-grade reading level)
   - Empathetic and informative
   - Avoid promotional or persuasive language
   - Focus on factual, balanced information

2. REGULATORY COMPLIANCE:
   - Adhere to FDA/IRB recruitment guidelines
   - Include required regulatory elements
   - Avoid therapeutic claims
   - Maintain neutral, objective language

3. CONTENT STRUCTURE:
   Front Panel:
   - Clear, engaging headline
   - Concise study introduction
   - Professional imagery suggestions
   
   Inside Panels:
   - Logical information flow
   - Clear study procedures
   - Participant expectations
   - Benefits and risks balanced presentation
   
   Back Panel:
   - Clear contact information
   - Required regulatory statements
   - Institutional credentials

4. VISUAL ELEMENTS:
   - Suggest professional, diverse imagery
   - Maintain medical/scientific credibility
   - Color scheme appropriate for medical/clinical context
   - Clear hierarchy of information

Format the response as a JSON object matching the BrochureContent interface.`;

  try {
    const response = await generateWithGPT4([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate comprehensive, compliant brochure content optimized for effective participant recruitment.' }
    ]);

    if (!response) {
      throw new Error('No content generated');
    }

    try {
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse brochure content:', parseError);
      return getFallbackContent(studyDetails);
    }
  } catch (error) {
    console.error('Failed to generate brochure content:', error);
    return getFallbackContent(studyDetails);
  }
}

function getFallbackContent(studyDetails: any): BrochureContent {
  return {
    panels: {
      front: {
        headline: studyDetails.title || 'Research Study Participants Needed',
        subheadline: 'Join Our Clinical Research Study',
        callToAction: 'Learn more about participating in this important research study',
        imagePrompts: [
          'Professional medical research setting with modern equipment',
          'Diverse group of healthcare professionals in clinical setting'
        ],
        colorScheme: {
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#60a5fa'
        }
      },
      inside: {
        sections: [
          {
            title: 'About the Study',
            content: studyDetails.primaryObjective || 'Study details to be provided',
            emphasis: 'Advancing medical knowledge through research',
            visualSuggestion: 'Simple scientific illustration or infographic'
          }
        ],
        keyPoints: [
          'Qualified participants may receive study-related care at no cost',
          'Compensation for time and travel may be available',
          'Your privacy will be protected'
        ],
        studyDetails: {
          duration: 'To be determined',
          visits: 'To be determined',
          compensation: 'Details provided during screening'
        }
      },
      back: {
        contactInformation: {
          phone: '(555) 123-4567',
          email: 'research@example.com'
        },
        disclaimers: [
          'Participation is voluntary',
          'All information will be kept confidential'
        ],
        regulatoryInfo: 'IRB approval information to be added'
      }
    },
    design: {
      typography: {
        headlineFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: {
          headline: 48,
          subheadline: 24,
          body: 16
        }
      },
      spacing: {
        margins: '0.75in',
        padding: '0.5in',
        lineHeight: 1.5
      }
    }
  };
}