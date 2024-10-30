import { generateWithGPT4 } from '../gpt';

export interface IrbDocument {
  id: string;
  title: string;
  content: string;
  version: number;
  status: 'generating' | 'completed' | 'error';
  progress: number;
  createdAt: Date;
  lastModified: Date;
  approvalStatus: 'draft' | 'pending_review' | 'approved';
  collaborators: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    user: {
      name: string;
      avatar?: string;
    }
  }>;
  versions: Array<{
    id: string;
    version: number;
    createdAt: Date;
    createdBy: {
      name: string;
      avatar?: string;
    };
    status: 'draft' | 'pending_review' | 'approved';
  }>;
}

interface StudyDetails {
  studyTitle: string;
  protocolNumber: string;
  sponsorName: string;
  phase: string;
  studyType: string;
  irbName: string;
  primaryObjective: string;
  secondaryObjectives?: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
  therapeuticArea?: string;
  indication?: string;
  patientCount?: string;
  duration?: string;
}

const documentPrompts = {
  coverLetter: (details: StudyDetails) => `
You are an expert in clinical research regulatory affairs, specializing in IRB submissions. Create a professional, compelling IRB cover letter for:

Study Details:
- Title: ${details.studyTitle}
- Protocol Number: ${details.protocolNumber}
- Sponsor: ${details.sponsorName}
- Phase: ${details.phase}
- Type: ${details.studyType}
${details.therapeuticArea ? `- Therapeutic Area: ${details.therapeuticArea}` : ''}
${details.indication ? `- Indication: ${details.indication}` : ''}

The cover letter should:
1. Follow formal business letter format with proper letterhead and date
2. Address the IRB chairperson professionally
3. Clearly state the submission type and purpose
4. Provide a concise overview of the study
5. List all documents included in the submission package
6. Request IRB review and approval
7. Include investigator contact information
8. Maintain a professional, confident tone

Format the response with:
- Professional letterhead
- Current date
- Clear section breaks
- Proper signature block
- Document reference numbers
- Page numbers

Use formal language appropriate for regulatory submissions while maintaining clarity and professionalism.`,

  protocolSummary: (details: StudyDetails) => `
You are a clinical research protocol expert. Create a comprehensive protocol summary for IRB review of:

Study Details:
- Title: ${details.studyTitle}
- Protocol: ${details.protocolNumber}
- Phase: ${details.phase}
- Primary Objective: ${details.primaryObjective}
${details.secondaryObjectives ? `- Secondary Objectives: ${details.secondaryObjectives}` : ''}
${details.therapeuticArea ? `- Therapeutic Area: ${details.therapeuticArea}` : ''}
${details.indication ? `- Indication: ${details.indication}` : ''}
${details.patientCount ? `- Target Enrollment: ${details.patientCount} participants` : ''}
${details.duration ? `- Study Duration: ${details.duration}` : ''}

Create a detailed summary with these sections:
1. Study Synopsis
   - Clear overview of study design
   - Primary and secondary endpoints
   - Key eligibility criteria

2. Background and Rationale
   - Disease/condition background
   - Current treatment landscape
   - Study intervention rationale
   - Risk-benefit assessment

3. Study Population
   - Detailed inclusion criteria
   - Detailed exclusion criteria
   - Recruitment strategies
   - Sample size justification

4. Study Procedures
   - Visit schedule
   - Required procedures
   - Safety assessments
   - Data collection points

5. Safety Monitoring
   - Safety parameters
   - Adverse event reporting
   - Risk mitigation strategies
   - Data monitoring plan

6. Statistical Considerations
   - Analysis populations
   - Primary analysis methods
   - Sample size calculations
   - Interim analyses

Format with:
- Clear section headers
- Numbered sections and subsections
- Bulleted lists where appropriate
- Tables for complex information
- Cross-references
- Page numbers

Use precise, scientific language while maintaining readability for IRB reviewers.`,

  informedConsent: (details: StudyDetails) => `
You are an expert in creating participant-friendly informed consent documents that meet all regulatory requirements. Create a comprehensive informed consent form following ${details.irbName} guidelines for:

Study Details:
- Title: ${details.studyTitle}
- Protocol: ${details.protocolNumber}
- Sponsor: ${details.sponsorName}
- Phase: ${details.phase}
${details.therapeuticArea ? `- Therapeutic Area: ${details.therapeuticArea}` : ''}
${details.indication ? `- Indication: ${details.indication}` : ''}
${details.duration ? `- Duration: ${details.duration}` : ''}

Create a consent form that includes:

1. Introduction
   - Study purpose
   - Voluntary nature of participation
   - Research vs. treatment distinction

2. Study Procedures
   - Visit schedule and duration
   - Required procedures
   - Participant responsibilities
   - Treatment groups and randomization

3. Risks and Discomforts
   - Known risks
   - Potential risks
   - Risk mitigation measures
   - Reproductive risks if applicable

4. Benefits
   - Potential direct benefits
   - Benefits to society
   - Alternative treatments

5. Costs and Compensation
   - Study-related costs
   - Participant compensation
   - Injury compensation
   - Insurance coverage

6. Confidentiality
   - Data protection measures
   - HIPAA compliance
   - Data sharing policies
   - Record retention

7. Rights and Responsibilities
   - Voluntary participation
   - Right to withdraw
   - New information disclosure
   - Emergency contacts

8. Authorization and Signatures
   - Participant signature block
   - Investigator signature block
   - Witness signature if required
   - Date fields

Format requirements:
- 8th-grade reading level
- Clear headings and subheadings
- Short paragraphs
- Bulleted lists for complex information
- Page numbers and version date
- Signature lines properly formatted

Use clear, simple language while maintaining all required regulatory elements.`,

  recruitmentMaterials: (details: StudyDetails) => `
You are an expert in creating compliant and effective clinical trial recruitment materials. Create a comprehensive set of recruitment materials for:

Study Details:
- Title: ${details.studyTitle}
- Protocol: ${details.protocolNumber}
- Phase: ${details.phase}
${details.therapeuticArea ? `- Therapeutic Area: ${details.therapeuticArea}` : ''}
${details.indication ? `- Indication: ${details.indication}` : ''}
${details.patientCount ? `- Target Enrollment: ${details.patientCount} participants` : ''}
${details.duration ? `- Study Duration: ${details.duration}` : ''}

Create these recruitment materials:

1. Print Advertisement
   - Clear, compelling headline
   - Key eligibility criteria
   - Study purpose
   - Participation requirements
   - Contact information
   - IRB approval statement

2. Participant Brochure
   - Study overview
   - Participation details
   - Benefits of participation
   - Location and contact information
   - Q&A section
   - Professional design elements

3. Screening Script
   - Greeting and introduction
   - Initial eligibility questions
   - Study description
   - Next steps
   - Documentation requirements

4. Digital Media Content
   - Website content
   - Social media posts
   - Email templates
   - Digital ad copy

Format requirements:
- Clear, engaging headlines
- Bulleted lists for readability
- Balanced information presentation
- Compliant language and tone
- Professional design guidelines
- Required regulatory statements

Ensure all materials:
- Maintain regulatory compliance
- Use appropriate reading level
- Avoid coercive language
- Include required elements
- Are culturally sensitive
- Follow IRB guidelines

Use engaging yet professional language while maintaining strict regulatory compliance.`,
};

export async function generateIrbDocuments(
  studyDetails: StudyDetails,
  onProgress: (documentId: string, progress: number) => void
): Promise<IrbDocument[]> {
  const documents: IrbDocument[] = [
    {
      id: 'cover-letter',
      title: 'IRB Cover Letter',
      content: '',
      version: 1,
      status: 'generating',
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      approvalStatus: 'draft',
      collaborators: [
        { name: 'John Smith', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { name: 'Sarah Johnson', role: 'Reviewer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
      ],
      comments: [],
      versions: []
    },
    {
      id: 'protocol-summary',
      title: 'Protocol Summary',
      content: '',
      version: 1,
      status: 'generating',
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      approvalStatus: 'draft',
      collaborators: [
        { name: 'John Smith', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { name: 'Michael Chen', role: 'Editor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' }
      ],
      comments: [],
      versions: []
    },
    {
      id: 'informed-consent',
      title: 'Informed Consent Form',
      content: '',
      version: 1,
      status: 'generating',
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      approvalStatus: 'draft',
      collaborators: [
        { name: 'John Smith', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { name: 'Emily Wilson', role: 'Reviewer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' }
      ],
      comments: [],
      versions: []
    },
    {
      id: 'recruitment-materials',
      title: 'Recruitment Materials',
      content: '',
      version: 1,
      status: 'generating',
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      approvalStatus: 'draft',
      collaborators: [
        { name: 'John Smith', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { name: 'Lisa Martinez', role: 'Editor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' }
      ],
      comments: [],
      versions: []
    }
  ];

  const generateDocument = async (
    doc: IrbDocument,
    prompt: string
  ): Promise<IrbDocument> => {
    try {
      // Simulate progressive generation with multiple steps
      const steps = ['Analyzing requirements', 'Generating content', 'Formatting document', 'Finalizing'];
      for (let i = 0; i < steps.length; i++) {
        onProgress(doc.id, (i + 1) * 25);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const content = await generateWithGPT4([
        { role: 'system', content: 'You are an expert in creating IRB documentation for clinical trials.' },
        { role: 'user', content: prompt }
      ]);

      return {
        ...doc,
        content: content || 'Failed to generate content',
        status: 'completed',
        progress: 100,
        lastModified: new Date(),
        versions: [
          {
            id: `${doc.id}-v1`,
            version: 1,
            createdAt: new Date(),
            createdBy: {
              name: 'John Smith',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
            },
            status: 'draft'
          }
        ]
      };
    } catch (error) {
      return {
        ...doc,
        status: 'error',
        progress: 0
      };
    }
  };

  const generatedDocs = await Promise.all([
    generateDocument(documents[0], documentPrompts.coverLetter(studyDetails)),
    generateDocument(documents[1], documentPrompts.protocolSummary(studyDetails)),
    generateDocument(documents[2], documentPrompts.informedConsent(studyDetails)),
    generateDocument(documents[3], documentPrompts.recruitmentMaterials(studyDetails))
  ]);

  return generatedDocs;
}