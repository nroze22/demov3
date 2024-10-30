import { recruitmentTemplates } from './recruitment-templates';
import { generateWithGPT4 } from './gpt';

interface StudyInfo {
  title: string;
  targetPopulation: string;
  inclusionCriteria: string;
  compensation?: string;
  duration?: string;
  location?: string;
  contactInfo?: string;
}

export async function generateRecruitmentContent(
  type: 'print' | 'digital' | 'social' | 'email',
  subtype: string,
  studyInfo: StudyInfo
): Promise<string> {
  const template = getTemplate(type, subtype);
  const systemPrompt = `You are an expert in clinical trial recruitment and marketing. 
Create compelling, professional, and compliant recruitment content for the following study:

Study Title: ${studyInfo.title}
Target Population: ${studyInfo.targetPopulation}
Key Inclusion Criteria: ${studyInfo.inclusionCriteria}

Guidelines:
- Content must be engaging and accessible to the target audience
- Maintain compliance with regulatory requirements
- Avoid promotional or biased language
- Include clear calls to action
- Keep messaging concise and focused
- Emphasize the scientific and medical nature of the research
- Do not make claims about efficacy or outcomes
- Include required regulatory elements (IRB number, etc.)`;

  const userPrompt = `Using the following template as a guide, create recruitment content for ${type} format:

${template}

Adapt the template to create compelling content while maintaining compliance and professional tone.
Replace placeholder text with appropriate content based on the study information provided.`;

  const response = await generateWithGPT4([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  return response || 'Failed to generate content';
}

function getTemplate(type: string, subtype: string): string {
  return recruitmentTemplates[type]?.[subtype] || '';
}

export async function generateSocialMediaCampaign(studyInfo: StudyInfo) {
  const platforms = ['facebook', 'twitter', 'instagram'];
  const campaign = await Promise.all(
    platforms.map(async (platform) => {
      const posts = await generateWithGPT4([
        {
          role: 'system',
          content: `Create a series of social media posts for ${platform} to recruit participants for a clinical trial. 
Posts should be engaging, compliant, and appropriate for the platform's format and audience.`,
        },
        {
          role: 'user',
          content: `Create 3 posts for ${platform} about this study:
Study: ${studyInfo.title}
Population: ${studyInfo.targetPopulation}
Criteria: ${studyInfo.inclusionCriteria}`,
        },
      ]);

      return {
        platform,
        posts: posts?.split('\n\n') || [],
      };
    })
  );

  return campaign;
}

export async function generateEmailTemplates(studyInfo: StudyInfo) {
  const templates = ['initialOutreach', 'followUp'];
  const emails = await Promise.all(
    templates.map(async (template) => {
      const content = await generateWithGPT4([
        {
          role: 'system',
          content: 'Create professional and compliant email templates for clinical trial recruitment.',
        },
        {
          role: 'user',
          content: `Create a ${template} email template for:
Study: ${studyInfo.title}
Population: ${studyInfo.targetPopulation}
Criteria: ${studyInfo.inclusionCriteria}`,
        },
      ]);

      return {
        type: template,
        content: content || '',
      };
    })
  );

  return emails;
}