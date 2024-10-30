export const recruitmentTemplates = {
  print: {
    flyer: `
# [Study Title]

## Are You Eligible for This Research Study?

We're seeking participants for a clinical research study investigating [brief description].

### You May Qualify If You:
[inclusion_criteria]

### Study Involves:
- [duration] study duration
- [visits] clinic visits
- Compensation available for time and travel
- No-cost study-related medical care

### Location:
[site_name]
[site_address]

Contact us to learn more:
Phone: [phone]
Email: [email]

IRB#: [irb_number]
    `,
    brochure: `
Making a Difference in Medical Research

[Study Title]

## About the Study
[study_description]

## Why Participate?
- Contribute to medical advancement
- Access to potential new treatments
- Expert medical care at no cost
- Compensation for time and travel

## What to Expect
[study_procedures]

## Is This Study Right for You?
[eligibility_criteria]

Contact Our Research Team:
[contact_details]
    `,
  },
  digital: {
    webpage: `
<section class="hero">
  <h1>[Study Title]</h1>
  <p class="lead">Seeking participants for an important clinical research study</p>
</section>

<section class="study-info">
  <h2>About the Study</h2>
  [study_description]
  
  <h2>Eligibility</h2>
  <ul>
    [eligibility_list]
  </ul>
  
  <h2>Benefits of Participation</h2>
  <ul>
    [benefits_list]
  </ul>
</section>

<section class="cta">
  <h2>Interested in Participating?</h2>
  <p>Contact us today to learn more about joining this study.</p>
  [contact_form]
</section>
    `,
    landingPage: `
<main class="study-landing">
  <header>
    <h1>Join Our Clinical Research Study</h1>
    <p>[tagline]</p>
  </header>
  
  <section class="key-points">
    [study_highlights]
  </section>
  
  <section class="qualification">
    <h2>Do You Qualify?</h2>
    [qualification_checklist]
  </section>
  
  <section class="next-steps">
    [call_to_action]
  </section>
</main>
    `,
  },
  social: {
    facebook: [
      "🔬 Seeking participants for a clinical research study\n[study_brief]\n#ClinicalResearch #[condition]Research",
      "📋 Could you qualify for our research study?\n[key_criteria]\nLearn more: [link]",
      "💡 Interested in advancing medical research?\n[participation_benefits]\nContact us: [contact]",
    ],
    twitter: [
      "Join our clinical research study on [condition]. You may qualify if [criteria]. #MedicalResearch",
      "Help advance medical science! Now enrolling participants for [study_type]. Details: [link]",
      "Looking for study participants! Compensation available for qualified individuals. #ClinicalTrial",
    ],
    instagram: [
      {
        caption: "🔬 Be part of groundbreaking research\n\n[study_description]\n\n#ClinicalResearch #[condition] #MedicalScience",
        imagePrompt: "Professional medical research setting with modern laboratory or clinical environment",
      },
      {
        caption: "💪 Make a difference in medical advancement\n\n[participation_details]\n\n#ResearchStudy #Healthcare #Innovation",
        imagePrompt: "Diverse group of people in a medical setting, representing study participants",
      },
    ],
  },
  email: {
    initialOutreach: `
Subject: Invitation to Participate in [Study Title] Research Study

Dear [Healthcare Provider/Potential Participant],

I hope this email finds you well. I am writing to inform you about an ongoing clinical research study that may be of interest [to your patients/to you].

Study Overview:
[study_brief_description]

Key Eligibility Criteria:
[eligibility_bullets]

Participation Involves:
[participation_details]

Compensation:
[compensation_details]

If you [have patients who/believe you] may qualify for this study, please contact us:
[contact_information]

Thank you for your time and consideration.

Best regards,
[study_team_contact]
    `,
    followUp: `
Subject: Following Up: [Study Title] Research Opportunity

Dear [Name],

I wanted to follow up regarding the clinical research study I previously mentioned. We are still seeking qualified participants, and I thought this might be a good opportunity [for your patients/for you].

Quick Study Facts:
[key_study_points]

Next Steps:
[action_items]

Please let me know if you have any questions or would like to discuss this further.

Best regards,
[study_team_contact]
    `,
  },
};