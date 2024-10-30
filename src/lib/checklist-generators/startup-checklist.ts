import { generateWithGPT4 } from '../gpt';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked' | 'not-applicable';
  dueDate?: string;
  assignee?: {
    name: string;
    role: string;
    avatar?: string;
  };
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies?: string[];
  estimatedDuration?: string;
  actualDuration?: string;
  notes?: string[];
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  regulatoryRequirement?: boolean;
  milestoneTask?: boolean;
  completedDate?: string;
  completedBy?: string;
  verifiedBy?: string;
  tags: string[];
  budget?: {
    estimated: number;
    actual: number;
    variance: number;
    notes: string[];
  };
  risks?: Array<{
    description: string;
    severity: 'high' | 'medium' | 'low';
    mitigation: string;
    owner: string;
  }>;
  comments: Array<{
    id: string;
    text: string;
    author: {
      name: string;
      avatar?: string;
    };
    timestamp: string;
    attachments?: string[];
  }>;
  history: Array<{
    action: string;
    timestamp: string;
    user: string;
    details?: string;
  }>;
  metrics?: {
    progress: number;
    efficiency: number;
    qualityScore: number;
    riskScore: number;
  };
  compliance: {
    requirements: string[];
    status: 'compliant' | 'pending' | 'non-compliant';
    lastChecked: string;
    nextReview: string;
    documents: string[];
  };
}

export interface ChecklistCategory {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  progress: number;
  dueDate?: string;
  owner?: string;
  dependencies?: string[];
  risks?: Array<{
    type: string;
    description: string;
    mitigation: string;
  }>;
  metrics: {
    completion: number;
    onTrack: number;
    delayed: number;
    blocked: number;
  };
}

interface StudyDetails {
  title: string;
  phase: string;
  type: string;
  targetEnrollment: number;
  monitoringFrequency: string;
  siteReadiness: string;
  regulatoryTimeline: string;
  budgetDetails: string;
  vendorRequirements: string;
  therapeuticArea?: string;
  indication?: string;
  duration?: string;
}

const systemPrompt = `You are an expert clinical research consultant with decades of experience in study startup. Generate a comprehensive startup checklist for:

Study Details:
{studyDetails}

Create a detailed checklist that:
1. Covers all critical startup phases
2. Identifies dependencies and critical path
3. Includes regulatory requirements
4. Addresses risk management
5. Considers resource allocation
6. Incorporates quality metrics
7. Ensures compliance standards
8. Optimizes timeline efficiency

Structure the response as a detailed JSON object matching the ChecklistCategory interface.
Include expert insights and industry best practices.`;

export async function generateStartupChecklist(
  studyDetails: StudyDetails
): Promise<Record<string, ChecklistCategory>> {
  const prompt = systemPrompt.replace('{studyDetails}', JSON.stringify(studyDetails, null, 2));

  try {
    const response = await generateWithGPT4([
      { role: 'system', content: prompt },
      { role: 'user', content: 'Generate a comprehensive study startup checklist with expert-level detail and guidance.' }
    ]);

    if (!response) {
      throw new Error('Failed to generate checklist');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to generate startup checklist:', error);
    return generateFallbackChecklist(studyDetails);
  }
}

function generateFallbackChecklist(studyDetails: StudyDetails): Record<string, ChecklistCategory> {
  // Implementation of fallback checklist generation
  // This would include a comprehensive set of default items based on study type and phase
  return {
    regulatory: {
      id: 'regulatory',
      title: 'Regulatory Readiness',
      description: 'Essential regulatory requirements and submissions',
      items: [
        {
          id: '1',
          title: 'Protocol Finalization',
          description: 'Complete and approve final protocol version',
          category: 'regulatory',
          status: 'pending',
          priority: 'critical',
          tags: ['protocol', 'regulatory'],
          // ... other properties
        },
        // ... more items
      ],
      progress: 0,
      metrics: {
        completion: 0,
        onTrack: 100,
        delayed: 0,
        blocked: 0
      }
    },
    // ... other categories
  };
}

export function calculateCriticalPath(checklist: Record<string, ChecklistCategory>): string[] {
  const criticalTasks = [];
  
  for (const category of Object.values(checklist)) {
    const criticalItems = category.items.filter(item => 
      item.priority === 'critical' && 
      (item.dependencies?.length || 0) > 0
    );
    
    criticalTasks.push(...criticalItems.map(item => item.title));
  }
  
  return criticalTasks;
}

export function generateTimeline(checklist: Record<string, ChecklistCategory>): Array<{
  phase: string;
  startDate: string;
  endDate: string;
  tasks: string[];
  milestones: string[];
}> {
  // Implementation of timeline generation based on checklist items
  // This would calculate optimal scheduling and identify dependencies
  return [];
}

export function calculateRiskScore(checklist: Record<string, ChecklistCategory>): {
  overall: number;
  categories: Record<string, number>;
} {
  // Implementation of risk scoring based on checklist items
  // This would evaluate various risk factors and provide a comprehensive score
  return {
    overall: 0,
    categories: {}
  };
}

export function generateActionItems(checklist: Record<string, ChecklistCategory>): Array<{
  task: string;
  priority: string;
  dueDate: string;
  owner: string;
}> {
  // Implementation of action item generation based on checklist status
  // This would create a prioritized list of immediate actions needed
  return [];
}

export function generateMetrics(checklist: Record<string, ChecklistCategory>): {
  completion: number;
  efficiency: number;
  risks: number;
  quality: number;
} {
  // Implementation of metrics calculation
  // This would provide comprehensive performance metrics
  return {
    completion: 0,
    efficiency: 0,
    risks: 0,
    quality: 0
  };
}