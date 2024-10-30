import { PosterTemplate } from '../types';

export const posterTemplates: PosterTemplate[] = [
  {
    id: 'modern-medical',
    name: 'Modern Medical',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    description: 'Clean, professional design with emphasis on medical expertise',
    size: 'letter',
    layout: {
      header: { height: 0.2, background: 'linear-gradient(135deg, #2563eb, #1e40af)' },
      body: { height: 0.6 },
      footer: { height: 0.2, background: '#f8fafc' }
    },
    elements: [
      {
        id: 'title',
        type: 'text',
        x: 0.5,
        y: 0.1,
        content: '[Study Title]',
        style: {
          fontSize: 72,
          fontFamily: 'Inter',
          fill: '#ffffff',
          align: 'center',
          fontWeight: 'bold'
        }
      },
      {
        id: 'subtitle',
        type: 'text',
        x: 0.5,
        y: 0.15,
        content: 'Research Study Participants Needed',
        style: {
          fontSize: 36,
          fontFamily: 'Inter',
          fill: '#ffffff',
          align: 'center'
        }
      },
      {
        id: 'eligibility-title',
        type: 'text',
        x: 0.1,
        y: 0.3,
        content: 'You May Qualify If You:',
        style: {
          fontSize: 32,
          fontFamily: 'Inter',
          fill: '#1e40af',
          align: 'left',
          fontWeight: 'bold'
        }
      },
      {
        id: 'eligibility-list',
        type: 'list',
        x: 0.1,
        y: 0.35,
        style: {
          fontSize: 24,
          fontFamily: 'Inter',
          fill: '#334155',
          spacing: 1.5,
          bulletColor: '#2563eb'
        }
      },
      {
        id: 'study-details',
        type: 'text',
        x: 0.1,
        y: 0.6,
        content: 'Study Details:',
        style: {
          fontSize: 32,
          fontFamily: 'Inter',
          fill: '#1e40af',
          align: 'left',
          fontWeight: 'bold'
        }
      },
      {
        id: 'details-list',
        type: 'list',
        x: 0.1,
        y: 0.65,
        style: {
          fontSize: 24,
          fontFamily: 'Inter',
          fill: '#334155',
          spacing: 1.5,
          bulletColor: '#2563eb'
        }
      },
      {
        id: 'contact',
        type: 'text',
        x: 0.5,
        y: 0.85,
        content: 'Contact Us Today',
        style: {
          fontSize: 36,
          fontFamily: 'Inter',
          fill: '#1e40af',
          align: 'center',
          fontWeight: 'bold'
        }
      },
      {
        id: 'contact-details',
        type: 'text',
        x: 0.5,
        y: 0.9,
        content: 'Phone: (555) 123-4567\nEmail: research@example.com',
        style: {
          fontSize: 24,
          fontFamily: 'Inter',
          fill: '#334155',
          align: 'center'
        }
      }
    ]
  },
  {
    id: 'professional-clinical',
    name: 'Professional Clinical',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
    description: 'Sophisticated design for clinical research',
    size: 'letter',
    layout: {
      sidebar: { width: 0.35, background: '#1e40af' },
      main: { width: 0.65, background: '#ffffff' }
    },
    elements: [
      {
        id: 'logo',
        type: 'image',
        x: 0.05,
        y: 0.05,
        width: 0.25,
        height: 0.1,
        placeholder: '[Institution Logo]'
      },
      {
        id: 'title',
        type: 'text',
        x: 0.4,
        y: 0.1,
        content: '[Study Title]',
        style: {
          fontSize: 64,
          fontFamily: 'Inter',
          fill: '#1e3a8a',
          align: 'left',
          fontWeight: 'bold'
        }
      },
      {
        id: 'sidebar-content',
        type: 'list',
        x: 0.05,
        y: 0.25,
        style: {
          fontSize: 24,
          fontFamily: 'Inter',
          fill: '#ffffff',
          spacing: 2,
          bulletColor: '#60a5fa'
        }
      },
      {
        id: 'main-content',
        type: 'text',
        x: 0.4,
        y: 0.3,
        content: 'Study Overview',
        style: {
          fontSize: 32,
          fontFamily: 'Inter',
          fill: '#1e3a8a',
          align: 'left',
          fontWeight: 'bold'
        }
      }
    ]
  },
  {
    id: 'minimalist-research',
    name: 'Minimalist Research',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69',
    description: 'Clean, minimalist design with focus on readability',
    size: 'letter',
    layout: {
      background: '#ffffff',
      accent: { height: 0.1, background: '#2563eb' }
    },
    elements: [
      {
        id: 'accent-bar',
        type: 'shape',
        shape: 'rectangle',
        x: 0,
        y: 0,
        width: 1,
        height: 0.1,
        fill: '#2563eb'
      },
      {
        id: 'title',
        type: 'text',
        x: 0.5,
        y: 0.2,
        content: '[Study Title]',
        style: {
          fontSize: 72,
          fontFamily: 'Inter',
          fill: '#1e3a8a',
          align: 'center',
          fontWeight: 'bold'
        }
      }
    ]
  }
];

export const posterLayouts = {
  'letter': { width: 2550, height: 3300 }, // 8.5" x 11" at 300dpi
  'tabloid': { width: 3300, height: 5100 }, // 11" x 17" at 300dpi
  'a3': { width: 3508, height: 4961 }, // A3 at 300dpi
  'custom': { width: 3300, height: 5100 } // Default custom size
};

export const posterElements = {
  shapes: [
    { id: 'rectangle', name: 'Rectangle' },
    { id: 'circle', name: 'Circle' },
    { id: 'line', name: 'Line' }
  ],
  decorative: [
    { id: 'medical-icons', name: 'Medical Icons' },
    { id: 'research-symbols', name: 'Research Symbols' },
    { id: 'scientific-elements', name: 'Scientific Elements' }
  ]
};

export const posterStyles = {
  fonts: [
    'Inter',
    'Roboto',
    'Playfair Display',
    'Montserrat',
    'Open Sans'
  ],
  colors: {
    primary: ['#2563eb', '#1e40af', '#1e3a8a'],
    secondary: ['#64748b', '#475569', '#334155'],
    accent: ['#60a5fa', '#3b82f6', '#2563eb'],
    background: ['#ffffff', '#f8fafc', '#f1f5f9']
  },
  effects: {
    shadows: [
      { name: 'None', value: 'none' },
      { name: 'Light', value: '0 2px 4px rgba(0,0,0,0.1)' },
      { name: 'Medium', value: '0 4px 6px rgba(0,0,0,0.1)' },
      { name: 'Strong', value: '0 8px 16px rgba(0,0,0,0.1)' }
    ],
    gradients: [
      { 
        name: 'Blue Professional',
        value: 'linear-gradient(135deg, #2563eb, #1e40af)'
      },
      {
        name: 'Subtle Light',
        value: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
      }
    ]
  }
};

export const posterGuides = {
  grid: {
    size: 20,
    color: '#e2e8f0',
    opacity: 0.5
  },
  smartGuides: {
    color: '#2563eb',
    thickness: 1,
    snapDistance: 5
  }
};

export const exportSettings = {
  pdf: {
    dpi: 300,
    colorSpace: 'CMYK',
    bleed: 0.125, // inches
    marks: true
  },
  png: {
    dpi: 300,
    colorSpace: 'RGB',
    quality: 1
  },
  jpg: {
    dpi: 300,
    colorSpace: 'RGB',
    quality: 0.92
  }
};