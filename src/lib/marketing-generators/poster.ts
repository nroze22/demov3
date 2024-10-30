import { generateWithGPT4 } from '../gpt';

export interface PosterContent {
  title: string;
  subtitle: string;
  keyPoints: string[];
  contactInfo: string;
  suggestedColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  suggestedImages: string[];
}

export async function generatePosterContent(studyDetails: any): Promise<PosterContent> {
  const systemPrompt = `You are an expert in creating compelling clinical trial recruitment posters.
Create engaging and compliant content for a recruitment poster based on the following study details:

Study Title: ${studyDetails.title || 'Clinical Research Study'}
Phase: ${studyDetails.phase || 'N/A'}
Type: ${studyDetails.type || 'Clinical Trial'}
Primary Objective: ${studyDetails.primaryObjective || 'To advance medical knowledge'}

The content should:
1. Be clear and engaging
2. Maintain IRB/regulatory compliance
3. Include key participant benefits
4. Have a clear call to action
5. Use appropriate medical terminology

Format the response as a JSON object matching the PosterContent interface.`;

  try {
    const response = await generateWithGPT4([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate compliant and effective recruitment poster content.' }
    ]);

    if (!response) {
      throw new Error('No content generated');
    }

    try {
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse poster content:', parseError);
      // Return fallback content that matches the expected interface
      return {
        title: studyDetails.title || 'Research Study Participants Needed',
        subtitle: 'Join Our Clinical Research Study',
        keyPoints: [
          'Seeking volunteers for an important medical research study',
          'Compensation provided for time and travel',
          'No-cost study-related medical care',
          'Must be 18 years or older'
        ],
        contactInfo: 'Contact us to learn more: (555) 123-4567',
        suggestedColors: {
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#60a5fa'
        },
        suggestedImages: [
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
          'https://images.unsplash.com/photo-1579684385127-1ef15d508118'
        ]
      };
    }
  } catch (error) {
    console.error('Failed to generate poster content:', error);
    // Return default content if generation fails
    return {
      title: studyDetails.title || 'Research Study Participants Needed',
      subtitle: 'Join Our Clinical Research Study',
      keyPoints: [
        'Seeking volunteers for an important medical research study',
        'Compensation provided for time and travel',
        'No-cost study-related medical care',
        'Must be 18 years or older'
      ],
      contactInfo: 'Contact us to learn more: (555) 123-4567',
      suggestedColors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#60a5fa'
      },
      suggestedImages: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118'
      ]
    };
  }
}