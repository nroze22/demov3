import { StudyDetails } from '../types';

export const marketingPrompts = {
  posterContent: (study: StudyDetails) => `You are a world-class medical communications expert specializing in clinical trial recruitment. Create compelling, compliant poster content for:

Study Details:
- Title: ${study.title}
- Phase: ${study.phase}
- Type: ${study.type}
- Therapeutic Area: ${study.therapeuticArea}
- Indication: ${study.indication}
- Duration: ${study.duration}
- Target Enrollment: ${study.patientCount} participants

Design Requirements:
1. Create a clear, compelling headline that:
   - Captures attention
   - Communicates the study purpose
   - Maintains regulatory compliance
   - Avoids promotional language

2. Generate eligibility criteria bullets that:
   - List key inclusion/exclusion criteria
   - Use clear, accessible language
   - Prioritize most important criteria
   - Maintain scientific accuracy

3. Develop study details section:
   - Study duration and time commitment
   - Number of visits required
   - Compensation information (if applicable)
   - Location details
   - Key procedures/assessments

4. Contact information block:
   - Clear call to action
   - Multiple contact methods
   - Study identifier/reference number
   - IRB approval statement

Format as a JSON object with:
{
  headline: string;
  subheadline: string;
  eligibilityCriteria: string[];
  studyDetails: string[];
  contactInformation: {
    callToAction: string;
    phone: string;
    email: string;
    website?: string;
  };
  regulatoryStatements: string[];
  design: {
    colorScheme: string[];
    suggestedImages: string[];
    layout: string;
  }
}

Ensure all content follows:
- IRB/regulatory guidelines
- Plain language principles (8th-grade reading level)
- Professional medical tone
- Cultural sensitivity
- Accessibility standards`,

  brochureContent: (study: StudyDetails) => `You are an expert in clinical trial communications and patient education. Create comprehensive brochure content for:

Study Details:
- Title: ${study.title}
- Phase: ${study.phase}
- Type: ${study.type}
- Therapeutic Area: ${study.therapeuticArea}
- Indication: ${study.indication}
- Duration: ${study.duration}
- Target Enrollment: ${study.patientCount} participants

Create content for a tri-fold brochure with:

1. Front Panel:
   - Compelling headline
   - Professional subheading
   - Visual focus
   - Institutional branding

2. Inside Panels (3):
   - Study overview
   - Participation details
   - Benefits and risks
   - Eligibility criteria
   - Visit schedule
   - Procedures/assessments
   - Compensation details

3. Back Panel:
   - Contact information
   - Location details
   - IRB statement
   - Study identifiers
   - Legal disclaimers

Format as a JSON object with:
{
  panels: {
    front: {
      headline: string;
      subheadline: string;
      visualSuggestions: string[];
    },
    inside: {
      panel1: {
        title: string;
        content: string[];
      },
      panel2: {
        title: string;
        content: string[];
      },
      panel3: {
        title: string;
        content: string[];
      }
    },
    back: {
      contactInfo: object;
      regulatory: string[];
    }
  },
  design: {
    colorScheme: string[];
    typography: object;
    imageGuidelines: string[];
  }
}

Ensure content:
- Follows regulatory guidelines
- Uses clear, accessible language
- Maintains scientific accuracy
- Provides balanced information
- Supports informed decision-making`,

  socialMediaContent: (study: StudyDetails) => `You are a clinical trial social media marketing expert with deep knowledge of regulatory compliance. Create engaging, compliant social media content for:

Study Details:
- Title: ${study.title}
- Phase: ${study.phase}
- Type: ${study.type}
- Therapeutic Area: ${study.therapeuticArea}
- Indication: ${study.indication}
- Duration: ${study.duration}
- Target Enrollment: ${study.patientCount} participants

Create content for:

1. Facebook:
   - Organic posts
   - Ad copy variations
   - Audience targeting suggestions
   - Image/video recommendations

2. LinkedIn:
   - Professional announcements
   - Investigator outreach
   - Site recruitment
   - Healthcare provider engagement

3. Twitter:
   - Study announcements
   - Awareness posts
   - Community engagement
   - Progress updates

4. Instagram:
   - Visual storytelling
   - Patient journey highlights
   - Site/facility features
   - Team introductions

Format as a JSON object with:
{
  platforms: {
    facebook: {
      posts: Array<{
        copy: string;
        callToAction: string;
        imagePrompt: string;
        targetAudience: string[];
      }>;
    },
    linkedin: Array<Post>;
    twitter: Array<Post>;
    instagram: Array<Post>;
  },
  targeting: {
    demographics: object;
    interests: string[];
    behaviors: string[];
    locations: string[];
  },
  compliance: {
    requiredDisclosures: string[];
    restrictedTerms: string[];
    guidelines: string[];
  }
}

Ensure all content:
- Maintains regulatory compliance
- Uses platform-appropriate tone
- Includes required disclosures
- Avoids promotional language
- Supports proper targeting`,

  emailContent: (study: StudyDetails) => `You are an expert in clinical trial patient engagement and email communications. Create comprehensive email templates for:

Study Details:
- Title: ${study.title}
- Phase: ${study.phase}
- Type: ${study.type}
- Therapeutic Area: ${study.therapeuticArea}
- Indication: ${study.indication}
- Duration: ${study.duration}
- Target Enrollment: ${study.patientCount} participants

Create templates for:

1. Initial Patient Outreach:
   - Clear introduction
   - Study overview
   - Participation benefits
   - Next steps

2. Healthcare Provider Outreach:
   - Professional introduction
   - Study scientific merit
   - Patient referral process
   - Site participation details

3. Follow-up Communications:
   - Screening reminder
   - Additional information
   - FAQ responses
   - Schedule coordination

4. Newsletter Updates:
   - Enrollment progress
   - Study milestones
   - Community impact
   - Participant resources

Format as a JSON object with:
{
  templates: {
    patientOutreach: Array<EmailTemplate>;
    providerOutreach: Array<EmailTemplate>;
    followUp: Array<EmailTemplate>;
    newsletter: Array<EmailTemplate>;
  },
  components: {
    headers: string[];
    footers: string[];
    callsToAction: string[];
    disclaimers: string[];
  },
  segmentation: {
    audiences: string[];
    variables: string[];
    customization: object;
  }
}

Ensure all content:
- Follows email regulations
- Maintains HIPAA compliance
- Uses appropriate tone
- Supports personalization
- Includes required disclosures`
};