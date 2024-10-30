import { generateWithGPT4 } from '../gpt';

interface GenerationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function safeJsonGeneration<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: any,
  fallback: T
): Promise<GenerationResult<T>> {
  try {
    const response = await generateWithGPT4([
      {
        role: 'system',
        content: `${systemPrompt}\n\nIMPORTANT: Your response MUST be valid JSON matching this schema:\n${JSON.stringify(schema, null, 2)}\n\nEnsure all content is properly escaped and formatted.`
      },
      { role: 'user', content: userPrompt }
    ]);

    if (!response) {
      throw new Error('No response from GPT');
    }

    // Attempt to parse JSON with error handling
    try {
      const parsed = JSON.parse(response);
      
      // Validate against schema
      // TODO: Add schema validation
      
      return {
        success: true,
        data: parsed
      };
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw Response:', response);
      
      return {
        success: false,
        error: 'Failed to parse GPT response as JSON',
        data: fallback
      };
    }
  } catch (error) {
    console.error('Generation Error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: fallback
    };
  }
}

export const documentSchemas = {
  coverLetter: {
    type: 'object',
    required: ['title', 'content', 'metadata', 'printSettings'],
    properties: {
      title: { type: 'string' },
      content: {
        type: 'object',
        required: ['header', 'body', 'footer'],
        properties: {
          header: {
            type: 'object',
            required: ['date', 'recipient', 'address'],
            properties: {
              date: { type: 'string' },
              recipient: { type: 'string' },
              address: { type: 'array', items: { type: 'string' } }
            }
          },
          body: {
            type: 'object',
            required: ['greeting', 'paragraphs', 'closing'],
            properties: {
              greeting: { type: 'string' },
              paragraphs: { type: 'array', items: { type: 'string' } },
              closing: { type: 'string' }
            }
          },
          footer: {
            type: 'object',
            required: ['signature', 'name', 'title'],
            properties: {
              signature: { type: 'string' },
              name: { type: 'string' },
              title: { type: 'string' }
            }
          }
        }
      },
      metadata: {
        type: 'object',
        required: ['version', 'author', 'lastModified'],
        properties: {
          version: { type: 'string' },
          author: { type: 'string' },
          lastModified: { type: 'string' }
        }
      },
      printSettings: {
        type: 'object',
        required: ['format', 'margins', 'fonts'],
        properties: {
          format: { type: 'string', enum: ['letter', 'a4'] },
          margins: {
            type: 'object',
            required: ['top', 'right', 'bottom', 'left'],
            properties: {
              top: { type: 'string' },
              right: { type: 'string' },
              bottom: { type: 'string' },
              left: { type: 'string' }
            }
          },
          fonts: {
            type: 'object',
            required: ['header', 'body', 'footer'],
            properties: {
              header: { type: 'string' },
              body: { type: 'string' },
              footer: { type: 'string' }
            }
          }
        }
      }
    }
  },
  
  protocolSummary: {
    type: 'object',
    required: ['title', 'sections', 'metadata', 'printSettings'],
    properties: {
      title: { type: 'string' },
      sections: {
        type: 'array',
        items: {
          type: 'object',
          required: ['heading', 'content', 'subsections'],
          properties: {
            heading: { type: 'string' },
            content: { type: 'string' },
            subsections: {
              type: 'array',
              items: {
                type: 'object',
                required: ['heading', 'content'],
                properties: {
                  heading: { type: 'string' },
                  content: { type: 'string' }
                }
              }
            }
          }
        }
      },
      metadata: {
        type: 'object',
        required: ['version', 'author', 'lastModified'],
        properties: {
          version: { type: 'string' },
          author: { type: 'string' },
          lastModified: { type: 'string' }
        }
      },
      printSettings: {
        type: 'object',
        required: ['format', 'margins', 'fonts'],
        properties: {
          format: { type: 'string', enum: ['letter', 'a4'] },
          margins: {
            type: 'object',
            required: ['top', 'right', 'bottom', 'left'],
            properties: {
              top: { type: 'string' },
              right: { type: 'string' },
              bottom: { type: 'string' },
              left: { type: 'string' }
            }
          },
          fonts: {
            type: 'object',
            required: ['header', 'body', 'footer'],
            properties: {
              header: { type: 'string' },
              body: { type: 'string' },
              footer: { type: 'string' }
            }
          }
        }
      }
    }
  }
};

export const defaultPrintSettings = {
  format: 'letter',
  margins: {
    top: '1in',
    right: '1in',
    bottom: '1in',
    left: '1in'
  },
  fonts: {
    header: 'Arial, sans-serif',
    body: 'Times New Roman, serif',
    footer: 'Arial, sans-serif'
  }
};