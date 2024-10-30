import { generateWithGPT4 } from '../gpt';
import { trainingPrompts } from './content-prompts';
import type { TrainingModule } from '../document-generators/training-materials';

export async function generateTrainingContent(
  studyDetails: any,
  moduleType: string,
  format: string
): Promise<TrainingModule> {
  let prompt;
  switch (moduleType) {
    case 'protocol':
      prompt = trainingPrompts.protocolOverview(studyDetails);
      break;
    case 'safety':
      prompt = trainingPrompts.safetyReporting(studyDetails);
      break;
    case 'consent':
      prompt = trainingPrompts.informedConsent(studyDetails);
      break;
    case 'data':
      prompt = trainingPrompts.dataCollection(studyDetails);
      break;
    default:
      throw new Error('Invalid module type');
  }

  try {
    const content = await generateWithGPT4([
      { role: 'system', content: prompt },
      { role: 'user', content: `Generate ${format} training content for ${moduleType} training.` }
    ]);

    if (!content) {
      throw new Error('No content generated');
    }

    const parsedContent = JSON.parse(content);

    // Create assessment if needed
    let assessment = null;
    if (format === 'quiz' || parsedContent.assessmentQuestions) {
      const quizPrompt = trainingPrompts.assessmentQuiz(studyDetails, moduleType);
      assessment = await generateWithGPT4([
        { role: 'system', content: quizPrompt },
        { role: 'user', content: 'Generate assessment questions based on the training content.' }
      ]);
    }

    return {
      id: `training-${Date.now()}`,
      title: parsedContent.title,
      type: format as 'presentation' | 'document' | 'quiz',
      content: format === 'quiz' ? assessment : content,
      status: 'draft',
      version: 1,
      targetAudience: studyDetails.targetAudience || [],
      objectives: parsedContent.objectives || [],
      duration: parsedContent.duration || 30,
      lastModified: new Date(),
      createdBy: {
        name: 'AI Generator',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AI'
      },
      versions: [{
        id: `v1-${Date.now()}`,
        version: 1,
        createdAt: new Date(),
        createdBy: {
          name: 'AI Generator',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AI'
        },
        status: 'draft'
      }],
      collaborators: []
    };
  } catch (error) {
    console.error('Failed to generate training content:', error);
    throw error;
  }
}