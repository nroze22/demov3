import { BrochureTemplate } from '../types';

// Standard brochure dimensions at 300 DPI
export const BROCHURE_DIMENSIONS = {
  letter: {
    width: 2550, // 8.5" x 300dpi
    height: 3300, // 11" x 300dpi
    panels: {
      width: 850 // Each panel width (trifold)
    }
  },
  legal: {
    width: 2550,
    height: 4200, // 14" x 300dpi
    panels: {
      width: 850
    }
  },
  a4: {
    width: 2480,
    height: 3508,
    panels: {
      width: 827
    }
  }
};

export const brochureTemplates: BrochureTemplate[] = [
  {
    id: 'clinical-modern',
    name: 'Modern Clinical',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    description: 'Clean, professional design for clinical studies',
    size: 'letter',
    layout: {
      front: {
        background: '#ffffff',
        elements: [
          {
            id: 'title',
            type: 'text',
            x: 425, // Centered in first panel
            y: 200,
            width: 700,
            content: '[Study Title]',
            style: {
              fontSize: 48,
              fontFamily: 'Inter',
              fill: '#1e40af',
              align: 'center'
            }
          },
          {
            id: 'subtitle',
            type: 'text',
            x: 425,
            y: 300,
            width: 700,
            content: 'Research Study Information',
            style: {
              fontSize: 24,
              fontFamily: 'Inter',
              fill: '#64748b',
              align: 'center'
            }
          },
          {
            id: 'hero-image',
            type: 'image',
            x: 150,
            y: 400,
            width: 550,
            height: 400,
            placeholder: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d'
          }
        ]
      },
      inside: {
        background: '#ffffff',
        elements: [
          {
            id: 'study-overview',
            type: 'text',
            x: 50,
            y: 100,
            width: 750,
            content: 'Study Overview',
            style: {
              fontSize: 32,
              fontFamily: 'Inter',
              fill: '#1e40af',
              align: 'left'
            }
          },
          {
            id: 'eligibility',
            type: 'text',
            x: 850,
            y: 100,
            width: 750,
            content: 'Eligibility Criteria',
            style: {
              fontSize: 32,
              fontFamily: 'Inter',
              fill: '#1e40af',
              align: 'left'
            }
          },
          {
            id: 'participation',
            type: 'text',
            x: 1650,
            y: 100,
            width: 750,
            content: 'Study Participation',
            style: {
              fontSize: 32,
              fontFamily: 'Inter',
              fill: '#1e40af',
              align: 'left'
            }
          }
        ]
      },
      back: {
        background: '#f8fafc',
        elements: [
          {
            id: 'contact',
            type: 'text',
            x: 425,
            y: 200,
            width: 700,
            content: 'Contact Information',
            style: {
              fontSize: 36,
              fontFamily: 'Inter',
              fill: '#1e40af',
              align: 'center'
            }
          },
          {
            id: 'logo',
            type: 'image',
            x: 300,
            y: 400,
            width: 250,
            height: 100,
            placeholder: '[Institution Logo]'
          }
        ]
      }
    }
  },
  {
    id: 'medical-professional',
    name: 'Professional Medical',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
    description: 'Professional design for healthcare institutions',
    size: 'letter',
    layout: {
      front: {
        background: '#ffffff',
        elements: [
          {
            id: 'header-bar',
            type: 'shape',
            shape: 'rectangle',
            x: 0,
            y: 0,
            width: 850,
            height: 200,
            fill: '#1e40af'
          },
          {
            id: 'title',
            type: 'text',
            x: 425,
            y: 100,
            width: 700,
            content: '[Study Title]',
            style: {
              fontSize: 48,
              fontFamily: 'Inter',
              fill: '#ffffff',
              align: 'center'
            }
          }
        ]
      },
      inside: {
        background: '#ffffff',
        elements: []
      },
      back: {
        background: '#f8fafc',
        elements: []
      }
    }
  }
];

// Guide markers for trifold layout
export const foldGuides = {
  letter: [
    { x: 850, orientation: 'vertical' },
    { x: 1700, orientation: 'vertical' }
  ],
  legal: [
    { x: 850, orientation: 'vertical' },
    { x: 1700, orientation: 'vertical' }
  ],
  a4: [
    { x: 827, orientation: 'vertical' },
    { x: 1654, orientation: 'vertical' }
  ]
};

// Export settings for different formats
export const exportSettings = {
  pdf: {
    dpi: 300,
    bleed: 0.125, // inches
    marks: true, // crop marks
    colorSpace: 'CMYK'
  },
  png: {
    dpi: 300,
    colorSpace: 'RGB'
  },
  jpg: {
    dpi: 300,
    quality: 0.92,
    colorSpace: 'RGB'
  }
};