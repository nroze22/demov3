import type { PresentationSlide } from './types';

export const presentationTemplates = {
  protocolOverview: {
    title: 'Protocol Overview Training',
    slides: [
      {
        id: 'title',
        type: 'title',
        content: {
          title: '[Study Title]',
          subtitle: 'Protocol Overview Training',
          presenter: '[Presenter Name]',
          date: '[Current Date]'
        }
      },
      {
        id: 'objectives',
        type: 'bullets',
        content: {
          title: 'Learning Objectives',
          bullets: [
            'Understand the study background and rationale',
            'Review key study design elements',
            'Identify critical inclusion/exclusion criteria',
            'Understand study procedures and assessments',
            'Review safety monitoring requirements'
          ]
        }
      },
      {
        id: 'background',
        type: 'content',
        content: {
          title: 'Study Background',
          sections: [
            {
              title: 'Disease Overview',
              content: '[Disease/Condition Background]'
            },
            {
              title: 'Current Treatment Landscape',
              content: '[Current Treatment Options]'
            },
            {
              title: 'Study Rationale',
              content: '[Why This Study is Important]'
            }
          ]
        }
      }
    ]
  },
  safetyReporting: {
    title: 'Safety Reporting Training',
    slides: [
      {
        id: 'title',
        type: 'title',
        content: {
          title: 'Safety Reporting Requirements',
          subtitle: 'Training for Study Team Members',
          presenter: '[Presenter Name]',
          date: '[Current Date]'
        }
      },
      {
        id: 'definitions',
        type: 'definitions',
        content: {
          title: 'Key Definitions',
          terms: [
            {
              term: 'Adverse Event (AE)',
              definition: 'Any untoward medical occurrence in a study participant'
            },
            {
              term: 'Serious Adverse Event (SAE)',
              definition: 'An AE that meets serious criteria (death, life-threatening, etc.)'
            }
          ]
        }
      }
    ]
  }
};

export const slideTemplates = {
  title: `
<section class="title-slide">
  <h1>{{title}}</h1>
  <h3>{{subtitle}}</h3>
  <div class="presenter">{{presenter}}</div>
  <div class="date">{{date}}</div>
</section>
  `,
  bullets: `
<section class="content-slide">
  <h2>{{title}}</h2>
  <ul>
    {{#each bullets}}
    <li>{{this}}</li>
    {{/each}}
  </ul>
</section>
  `,
  content: `
<section class="content-slide">
  <h2>{{title}}</h2>
  {{#each sections}}
  <div class="section">
    <h3>{{title}}</h3>
    <p>{{content}}</p>
  </div>
  {{/each}}
</section>
  `,
  definitions: `
<section class="definitions-slide">
  <h2>{{title}}</h2>
  <dl>
    {{#each terms}}
    <dt>{{term}}</dt>
    <dd>{{definition}}</dd>
    {{/each}}
  </dl>
</section>
  `
};