import { StudyDetails } from '../types';

export const trainingPrompts = {
  protocolOverview: (details: StudyDetails) => `You are an expert clinical research trainer with extensive experience in protocol training. Create comprehensive protocol training content for:

Study Details:
- Title: ${details.title}
- Phase: ${details.phase}
- Type: ${details.type}
- Therapeutic Area: ${details.therapeuticArea}
- Indication: ${details.indication}
- Duration: ${details.duration}
- Target Enrollment: ${details.patientCount} participants

Create training content that includes:

1. Study Background (25%)
   - Disease/condition overview
   - Current treatment landscape
   - Study rationale
   - Scientific basis
   - Unmet medical need

2. Study Design (30%)
   - Study objectives
   - Trial design and methodology
   - Treatment arms and randomization
   - Key inclusion/exclusion criteria
   - Study procedures and assessments
   - Visit schedule

3. Safety Considerations (25%)
   - Safety monitoring requirements
   - Adverse event reporting
   - Risk mitigation strategies
   - Subject discontinuation criteria
   - Emergency procedures

4. Operational Requirements (20%)
   - Documentation requirements
   - Data collection procedures
   - Quality control measures
   - Regulatory compliance
   - Site responsibilities

Format the content as a JSON object with:
{
  "title": string,
  "version": string,
  "slides": Array<{
    type: "title" | "content" | "bullets" | "image",
    content: {
      title: string,
      subtitle?: string,
      bullets?: string[],
      body?: string,
      notes?: string,
      imagePrompt?: string
    }
  }>,
  "assessmentQuestions": Array<{
    question: string,
    type: "multiple-choice" | "true-false",
    options?: string[],
    correctAnswer: string | number,
    explanation: string
  }>,
  "handouts": Array<{
    title: string,
    content: string,
    type: "reference" | "worksheet" | "summary"
  }>
}

Ensure content:
- Uses clear, professional language
- Follows adult learning principles
- Includes practical examples
- Incorporates knowledge checks
- Provides detailed speaker notes
- Maintains scientific accuracy`,

  safetyReporting: (details: StudyDetails) => `You are an expert in clinical research safety training. Create comprehensive safety reporting training for:

Study Details:
- Title: ${details.title}
- Phase: ${details.phase}
- Type: ${details.type}
- Therapeutic Area: ${details.therapeuticArea}

Create detailed training on:

1. Safety Definitions (20%)
   - Adverse Event (AE) definitions
   - Serious Adverse Event (SAE) criteria
   - Severity vs. seriousness
   - Causality assessment
   - Expected vs. unexpected events

2. Reporting Requirements (30%)
   - Reporting timelines
   - Documentation requirements
   - Follow-up procedures
   - Regulatory obligations
   - Safety updates

3. Case Scenarios (30%)
   - Real-world examples
   - Complex cases
   - Decision trees
   - Common pitfalls
   - Best practices

4. Safety Monitoring (20%)
   - Safety oversight
   - Risk management
   - Subject protection
   - Safety communications
   - Documentation

Format as interactive training with:
- Detailed slides
- Case studies
- Decision exercises
- Assessment questions
- Reference materials

Include practical exercises and real-world examples.`,

  informedConsent: (details: StudyDetails) => `You are an expert in informed consent training for clinical research. Create comprehensive consent process training for:

Study Details:
- Title: ${details.title}
- Phase: ${details.phase}
- Type: ${details.type}
- Population: ${details.targetPopulation}

Create training content covering:

1. Consent Principles (20%)
   - Ethical foundations
   - Regulatory requirements
   - Elements of valid consent
   - Voluntary participation
   - Subject rights

2. Consent Process (30%)
   - Initial discussion
   - Document review
   - Answering questions
   - Assessment of understanding
   - Documentation requirements

3. Special Situations (25%)
   - Vulnerable populations
   - Language barriers
   - Emergency situations
   - Re-consent requirements
   - Legal representatives

4. Common Challenges (25%)
   - Therapeutic misconception
   - Complex procedures
   - Time constraints
   - Cultural considerations
   - Documentation issues

Include:
- Role-play scenarios
- Common pitfalls
- Best practices
- Documentation examples
- Quality metrics`,

  dataCollection: (details: StudyDetails) => `You are an expert in clinical research data collection and management. Create comprehensive CRF completion training for:

Study Details:
- Title: ${details.title}
- Phase: ${details.phase}
- Type: ${details.type}
- Key Endpoints: ${details.endpoints}

Create training content covering:

1. Data Quality Principles (20%)
   - ALCOA principles
   - Source documentation
   - Data integrity
   - Quality control
   - Error prevention

2. CRF Completion (30%)
   - Field-by-field guidance
   - Required vs. optional fields
   - Skip patterns
   - Calculations
   - Edit checks

3. Common Errors (25%)
   - Typical mistakes
   - Prevention strategies
   - Correction procedures
   - Documentation requirements
   - Quality metrics

4. Query Resolution (25%)
   - Query types
   - Response requirements
   - Timeline management
   - Documentation
   - Best practices

Include:
- Hands-on exercises
- Real CRF examples
- Error scenarios
- Quality metrics
- Reference guides`,

  assessmentQuiz: (details: StudyDetails, moduleType: string) => `You are an expert in clinical research assessment development. Create a comprehensive knowledge assessment for:

Training Type: ${moduleType}
Study Details:
- Title: ${details.title}
- Phase: ${details.phase}
- Type: ${details.type}

Create an assessment that:
1. Covers all key learning objectives
2. Tests different knowledge levels
3. Includes practical applications
4. Provides detailed feedback
5. Measures competency

Format as JSON with:
{
  "title": string,
  "description": string,
  "passingScore": number,
  "timeLimit": number,
  "questions": Array<{
    type: "multiple-choice" | "true-false" | "matching",
    question: string,
    options?: string[],
    correctAnswer: string | number,
    explanation: string,
    points: number
  }>,
  "feedback": {
    "pass": string,
    "fail": string,
    "remediation": string
  }
}

Include:
- Scenario-based questions
- Application of concepts
- Critical thinking items
- Clear explanations
- Remediation guidance`
};