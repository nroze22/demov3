import { generateWithGPT4 } from './gpt';

export interface AnalysisResult {
  score: {
    overall: number;
    categories: {
      design: number;
      feasibility: number;
      safety: number;
      operational: number;
      regulatory: number;
    };
  };
  suggestions: Array<{
    id: string;
    type: 'error' | 'warning' | 'improvement';
    issue: string;
    recommendation: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: 'design' | 'feasibility' | 'safety' | 'operational' | 'regulatory';
  }>;
  timeline: {
    estimated: string;
    phases: {
      startup: { duration: string; progress: number; milestones: string[] };
      enrollment: { duration: string; progress: number; milestones: string[] };
      treatment: { duration: string; progress: number; milestones: string[] };
      followup: { duration: string; progress: number; milestones: string[] };
      closeout: { duration: string; progress: number; milestones: string[] };
    };
    potentialDelays: string[];
    criticalPath: string[];
  };
  statistics: {
    sampleSize: {
      total: number;
      perArm: number[];
      powerAnalysis: {
        power: number;
        effectSize: number;
        significance: number;
        dropoutRate: number;
      };
    };
    endpoints: {
      primary: {
        name: string;
        type: string;
        timing: string;
        analysis: string;
      };
      secondary: Array<{
        name: string;
        type: string;
        timing: string;
      }>;
    };
    populations: {
      itt: string;
      pp: string;
      safety: string;
    };
  };
}

export async function analyzeProtocol(content: string): Promise<AnalysisResult> {
  if (!content?.trim()) {
    throw new Error('Protocol content is empty');
  }

  const systemPrompt = `You are an expert clinical trial protocol analyzer. Analyze the provided protocol content and provide a detailed analysis including:

1. Overall quality score (0-100) and category scores
2. Key suggestions for improvement
3. Timeline estimation with phases
4. Statistical considerations
5. Population definitions

Format your response as a valid JSON object matching the AnalysisResult interface with the following structure:
{
  "score": {
    "overall": number,
    "categories": {
      "design": number,
      "feasibility": number,
      "safety": number,
      "operational": number,
      "regulatory": number
    }
  },
  "suggestions": [
    {
      "id": string,
      "type": "error" | "warning" | "improvement",
      "issue": string,
      "recommendation": string,
      "priority": "critical" | "high" | "medium" | "low",
      "category": "design" | "feasibility" | "safety" | "operational" | "regulatory"
    }
  ],
  "timeline": {
    "estimated": string,
    "phases": {
      "startup": { "duration": string, "progress": number, "milestones": string[] },
      "enrollment": { "duration": string, "progress": number, "milestones": string[] },
      "treatment": { "duration": string, "progress": number, "milestones": string[] },
      "followup": { "duration": string, "progress": number, "milestones": string[] },
      "closeout": { "duration": string, "progress": number, "milestones": string[] }
    },
    "potentialDelays": string[],
    "criticalPath": string[]
  },
  "statistics": {
    "sampleSize": {
      "total": number,
      "perArm": number[],
      "powerAnalysis": {
        "power": number,
        "effectSize": number,
        "significance": number,
        "dropoutRate": number
      }
    },
    "endpoints": {
      "primary": {
        "name": string,
        "type": string,
        "timing": string,
        "analysis": string
      },
      "secondary": [
        {
          "name": string,
          "type": string,
          "timing": string
        }
      ]
    },
    "populations": {
      "itt": string,
      "pp": string,
      "safety": string
    }
  }
}`;

  try {
    const response = await generateWithGPT4([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this protocol content:\n\n${content}` }
    ]);

    if (!response) {
      throw new Error('No response received from analysis service');
    }

    try {
      const parsedResponse = JSON.parse(response);
      
      // Validate required fields
      if (!parsedResponse.score?.overall || !Array.isArray(parsedResponse.suggestions)) {
        throw new Error('Invalid response format: missing required fields');
      }

      return parsedResponse;
    } catch (parseError) {
      console.error('Failed to parse protocol analysis:', parseError);
      
      // Return a fallback analysis result
      return {
        score: {
          overall: 0,
          categories: {
            design: 0,
            feasibility: 0,
            safety: 0,
            operational: 0,
            regulatory: 0
          }
        },
        suggestions: [{
          id: 'error-1',
          type: 'error',
          issue: 'Failed to analyze protocol',
          recommendation: 'Please try again or contact support',
          priority: 'high',
          category: 'operational'
        }],
        timeline: {
          estimated: 'N/A',
          phases: {
            startup: { duration: 'N/A', progress: 0, milestones: [] },
            enrollment: { duration: 'N/A', progress: 0, milestones: [] },
            treatment: { duration: 'N/A', progress: 0, milestones: [] },
            followup: { duration: 'N/A', progress: 0, milestones: [] },
            closeout: { duration: 'N/A', progress: 0, milestones: [] }
          },
          potentialDelays: [],
          criticalPath: []
        },
        statistics: {
          sampleSize: {
            total: 0,
            perArm: [],
            powerAnalysis: {
              power: 0,
              effectSize: 0,
              significance: 0.05,
              dropoutRate: 0
            }
          },
          endpoints: {
            primary: {
              name: 'N/A',
              type: 'N/A',
              timing: 'N/A',
              analysis: 'N/A'
            },
            secondary: []
          },
          populations: {
            itt: 'N/A',
            pp: 'N/A',
            safety: 'N/A'
          }
        }
      };
    }
  } catch (error) {
    console.error('Protocol analysis error:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze protocol');
  }
}