// Presentation Types
export interface PresentationSlide {
  id: string;
  type: 'title' | 'bullets' | 'content' | 'definitions';
  content: {
    title: string;
    subtitle?: string;
    presenter?: string;
    date?: string;
    bullets?: string[];
    sections?: Array<{
      title: string;
      content: string;
    }>;
    terms?: Array<{
      term: string;
      definition: string;
    }>;
  };
}

export interface Presentation {
  title: string;
  slides: PresentationSlide[];
}

// Quiz Types
export interface QuizQuestion {
  type: 'radiogroup' | 'checkbox' | 'text';
  name: string;
  title: string;
  isRequired?: boolean;
  choices?: string[];
  correctAnswer?: string | string[];
}

export interface QuizPage {
  name: string;
  elements: QuizQuestion[];
}

export interface QuizDefinition {
  title: string;
  description: string;
  showProgressBar?: 'top' | 'bottom' | 'none';
  showQuestionNumbers?: boolean;
  completedHtml?: string;
  pages: QuizPage[];
  calculatedValues?: Array<{
    name: string;
    expression: string;
  }>;
  triggers?: Array<{
    type: string;
    expression: string;
    setToName: string;
    setValue: boolean;
  }>;
}