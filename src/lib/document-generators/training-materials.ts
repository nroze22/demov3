import { generateWithGPT4 } from '../gpt';

export interface TrainingModule {
  id: string;
  title: string;
  type: 'presentation' | 'document' | 'quiz' | 'video_script';
  content: string;
  status: 'draft' | 'in_review' | 'approved';
  version: number;
  targetAudience: string[];
  objectives: string[];
  duration: number;
  lastModified: Date;
  createdBy: {
    name: string;
    avatar?: string;
  };
  versions: Array<{
    id: string;
    version: number;
    createdAt: Date;
    createdBy: {
      name: string;
      avatar?: string;
    };
    status: 'draft' | 'in_review' | 'approved';
  }>;
  collaborators: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
}

interface StudyDetails {
  title: string;
  phase: string;
  type: string;
  primaryObjective: string;
  procedures: string[];
  endpoints: string[];
  safetyConsiderations: string[];
}

const trainingPrompts = {
  protocolOverview: (details: StudyDetails) => `
Create a comprehensive protocol training presentation for:

Study: ${details.title}
Phase: ${details.phase}
Type: ${details.type}

Include the following sections:
1. Study Background and Rationale
2. Study Design Overview
3. Study Population
4. Study Procedures
5. Safety Assessments
6. Data Collection
7. Protocol Compliance
8. Key Points for Study Success

Format as a presentation with clear slides, bullet points, and speaker notes.`,

  safetyReporting: (details: StudyDetails) => `
Create safety reporting training materials for:

Study: ${details.title}
Phase: ${details.phase}

Cover:
1. Adverse Event Definitions
2. Reporting Requirements and Timelines
3. Assessment of Causality
4. Documentation Requirements
5. Safety Monitoring Procedures
6. Case Studies and Examples

Include practical examples and decision trees for AE assessment.`,

  informedConsent: (details: StudyDetails) => `
Create informed consent process training for:

Study: ${details.title}

Include:
1. Informed Consent Requirements
2. Documentation Process
3. Common Challenges
4. Special Populations Considerations
5. Re-consent Requirements
6. Role-play Scenarios
7. Documentation Tips

Provide practical examples and best practices.`,

  dataCollection: (details: StudyDetails) => `
Create CRF completion and data collection training for:

Study: ${details.title}

Cover:
1. CRF Overview
2. Source Documentation Requirements
3. Common Errors and How to Avoid Them
4. Query Resolution Process
5. Data Quality Tips
6. Timeline Requirements
7. Practical Exercises

Include examples of correctly completed CRFs and common pitfalls.`,

  assessmentQuiz: (details: StudyDetails) => `
Create a comprehensive assessment quiz covering:

1. Protocol Knowledge
2. Safety Reporting
3. Informed Consent
4. Data Collection
5. GCP Compliance

Include:
- Multiple choice questions
- True/False questions
- Case scenarios
- Practical application questions

Provide detailed explanations for correct answers.`,
};

export async function generateTrainingMaterials(
  studyDetails: StudyDetails,
  moduleType: string,
  onProgress: (progress: number) => void
): Promise<TrainingModule> {
  const baseModule: TrainingModule = {
    id: `training-${Date.now()}`,
    title: '',
    type: 'document',
    content: '',
    status: 'draft',
    version: 1,
    targetAudience: [],
    objectives: [],
    duration: 0,
    lastModified: new Date(),
    createdBy: {
      name: 'System Generator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=System'
    },
    versions: [],
    collaborators: [
      { name: 'John Smith', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
      { name: 'Sarah Johnson', role: 'Reviewer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
    ]
  };

  try {
    // Simulate progressive generation
    const steps = ['Analyzing requirements', 'Creating outline', 'Generating content', 'Adding examples', 'Finalizing'];
    
    for (let i = 0; i < steps.length; i++) {
      onProgress((i + 1) * 20);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    let prompt = '';
    let title = '';
    let audience: string[] = [];
    let duration = 0;

    switch (moduleType) {
      case 'protocol':
        prompt = trainingPrompts.protocolOverview(studyDetails);
        title = 'Protocol Overview Training';
        audience = ['Investigators', 'Study Coordinators', 'Research Staff'];
        duration = 60;
        break;
      case 'safety':
        prompt = trainingPrompts.safetyReporting(studyDetails);
        title = 'Safety Reporting Training';
        audience = ['Investigators', 'Study Coordinators', 'Safety Monitors'];
        duration = 45;
        break;
      case 'consent':
        prompt = trainingPrompts.informedConsent(studyDetails);
        title = 'Informed Consent Training';
        audience = ['Investigators', 'Study Coordinators'];
        duration = 30;
        break;
      case 'data':
        prompt = trainingPrompts.dataCollection(studyDetails);
        title = 'Data Collection Training';
        audience = ['Study Coordinators', 'Data Managers'];
        duration = 45;
        break;
      case 'assessment':
        prompt = trainingPrompts.assessmentQuiz(studyDetails);
        title = 'Knowledge Assessment';
        audience = ['All Study Staff'];
        duration = 30;
        break;
    }

    const content = await generateWithGPT4([
      { role: 'system', content: 'You are an expert in creating clinical trial training materials.' },
      { role: 'user', content: prompt }
    ]);

    return {
      ...baseModule,
      title,
      content: content || 'Failed to generate content',
      targetAudience: audience,
      duration,
      objectives: [
        'Understand key protocol requirements',
        'Implement proper procedures',
        'Maintain compliance with regulations',
        'Ensure data quality and integrity'
      ],
      versions: [
        {
          id: `v1-${Date.now()}`,
          version: 1,
          createdAt: new Date(),
          createdBy: {
            name: 'System Generator',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=System'
          },
          status: 'draft'
        }
      ]
    };
  } catch (error) {
    throw new Error('Failed to generate training materials');
  }
}