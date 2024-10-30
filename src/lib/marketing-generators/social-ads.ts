import { generateWithGPT4 } from '../gpt';

interface SocialAdContent {
  facebook: {
    headlines: string[];
    descriptions: string[];
    callToAction: string;
    imagePrompts: string[];
    targetAudience: {
      demographics: string[];
      interests: string[];
      behaviors: string[];
    };
  };
  targeting: {
    ageRange: { min: number; max: number };
    gender: string[];
    locations: string[];
    interests: string[];
  };
}

export async function generateSocialAdContent(studyDetails: any): Promise<SocialAdContent> {
  const systemPrompt = `You are an expert in creating compliant and effective social media ad content for clinical trial recruitment.
Create Facebook ad content based on the following study details:

Study Title: ${studyDetails.title}
Phase: ${studyDetails.phase}
Type: ${studyDetails.type}
Primary Objective: ${studyDetails.primaryObjective}

The content should:
1. Be engaging and clear
2. Maintain IRB/regulatory compliance
3. Include multiple headline/description variations
4. Suggest appropriate targeting options
5. Include image description prompts

Format the response as a JSON object matching the SocialAdContent interface.`;

  const response = await generateWithGPT4([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Generate compliant and effective social media ad content.' }
  ]);

  if (!response) {
    throw new Error('Failed to generate social ad content');
  }

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse social ad content:', error);
    // Return fallback content
    return {
      facebook: {
        headlines: [
          'Research Study Seeking Participants',
          'Join Our Clinical Research Study',
          'Volunteer for Medical Research'
        ],
        descriptions: [
          'Participate in an important medical research study. Compensation provided for time and travel.',
          'Help advance medical science. Study-related care at no cost to qualified participants.'
        ],
        callToAction: 'Learn More',
        imagePrompts: [
          'Professional medical research setting with modern equipment',
          'Diverse group of healthcare professionals in clinical setting'
        ],
        targetAudience: {
          demographics: ['Adults 18-65', 'Health-conscious individuals'],
          interests: ['Healthcare', 'Medical research', 'Clinical trials'],
          behaviors: ['Health information seekers']
        }
      },
      targeting: {
        ageRange: { min: 18, max: 65 },
        gender: ['all'],
        locations: ['United States'],
        interests: ['Healthcare', 'Medical research', 'Clinical trials']
      }
    };
  }
}