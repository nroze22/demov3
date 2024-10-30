import { QuizDefinition } from './types';

export const quizTemplates: Record<string, QuizDefinition> = {
  protocolKnowledge: {
    title: 'Protocol Knowledge Assessment',
    description: 'Test your understanding of the study protocol',
    showProgressBar: 'top',
    showQuestionNumbers: true,
    completedHtml: '<h4>Congratulations!</h4><p>You have completed the assessment.</p>',
    pages: [
      {
        name: 'studyDesign',
        elements: [
          {
            type: 'radiogroup',
            name: 'studyPhase',
            title: 'What is the phase of this clinical trial?',
            isRequired: true,
            choices: [
              'Phase I',
              'Phase II',
              'Phase III',
              'Phase IV'
            ],
            correctAnswer: '' // Filled dynamically
          }
        ]
      }
    ],
    calculatedValues: [
      {
        name: 'score',
        expression: '{correctCount}/{totalCount}*100'
      }
    ],
    triggers: [
      {
        type: 'complete',
        expression: '{score} >= 80',
        setToName: 'passed',
        setValue: true
      }
    ]
  },
  safetyReporting: {
    title: 'Safety Reporting Assessment',
    description: 'Verify your understanding of safety reporting requirements',
    showProgressBar: 'top',
    showQuestionNumbers: true,
    pages: [
      {
        name: 'definitions',
        elements: [
          {
            type: 'radiogroup',
            name: 'saeDefinition',
            title: 'Which of the following defines a Serious Adverse Event (SAE)?',
            isRequired: true,
            choices: [
              'Any adverse event that is unexpected',
              'Any adverse event that results in hospitalization or death',
              'Any adverse event that is mild in severity',
              'Any adverse event that resolves spontaneously'
            ],
            correctAnswer: 'Any adverse event that results in hospitalization or death'
          }
        ]
      }
    ]
  }
};