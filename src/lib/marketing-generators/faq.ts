import { generateWithGPT4 } from '../gpt';

interface FaqContent {
  title: string;
  introduction: string;
  sections: {
    title: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  }[];
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
}

export async function generateFaqContent(studyDetails: any): Promise<FaqContent> {
  const systemPrompt = `You are an expert in creating clear and informative FAQ sheets for clinical trials.
Create comprehensive FAQ content based on the following study details:

Study Title: ${studyDetails.title}
Phase: ${studyDetails.phase}
Type: ${studyDetails.type}
Primary Objective: ${studyDetails.primaryObjective}

The content should:
1. Address common participant questions
2. Be written in clear, accessible language
3. Cover study procedures, expectations, and benefits
4. Include safety and confidentiality information
5. Maintain regulatory compliance

Format the response as a JSON object matching the FaqContent interface.`;

  const response = await generateWithGPT4([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Generate comprehensive FAQ content that is clear and compliant.' }
  ]);

  if (!response) {
    throw new Error('Failed to generate FAQ content');
  }

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse FAQ content:', error);
    // Return fallback content
    return {
      title: `Frequently Asked Questions: ${studyDetails.title}`,
      introduction: 'This document provides answers to common questions about our research study.',
      sections: [
        {
          title: 'About the Study',
          questions: [
            {
              question: 'What is the purpose of this study?',
              answer: studyDetails.primaryObjective || 'To advance medical knowledge and potential treatments.'
            },
            {
              question: 'How long will the study last?',
              answer: 'The study duration will be determined based on individual participant factors.'
            }
          ]
        },
        {
          title: 'Participation',
          questions: [
            {
              question: 'Who can participate?',
              answer: 'Eligibility will be determined during the screening process.'
            },
            {
              question: 'What are the benefits of participating?',
              answer: 'Participants may receive study-related medical care at no cost.'
            }
          ]
        }
      ],
      contactInfo: {
        phone: '(555) 123-4567',
        email: 'study@example.com'
      }
    };
  }
}