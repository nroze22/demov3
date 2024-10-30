import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';

const studySetupSchema = z.object({
  monitoringFrequency: z.string().min(1, 'Monitoring frequency is required'),
  siteReadiness: z.string().min(1, 'Site readiness plan is required'),
  regulatoryTimeline: z.string().min(1, 'Regulatory timeline is required'),
  budgetDetails: z.string().min(1, 'Budget details are required'),
  vendorRequirements: z.string().min(1, 'Vendor requirements are required'),
});

type StudySetupValues = z.infer<typeof studySetupSchema>;

interface StudySetupFormProps {
  onSubmit: (data: StudySetupValues) => void;
  isSubmitting: boolean;
}

export function StudySetupForm({ onSubmit, isSubmitting }: StudySetupFormProps) {
  const [existingStudyData, setExistingStudyData] = useState<any>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('studyData');
    if (savedData) {
      setExistingStudyData(JSON.parse(savedData));
    }
  }, []);

  const form = useForm<StudySetupValues>({
    resolver: zodResolver(studySetupSchema),
    defaultValues: {
      monitoringFrequency: '',
      siteReadiness: '',
      regulatoryTimeline: '',
      budgetDetails: '',
      vendorRequirements: '',
    },
  });

  if (!existingStudyData) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Please complete the study setup first.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/study-setup'}>
            Go to Study Setup
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Display existing study information */}
      <div className="mb-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-4">Study Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Study Title:</span>
            <p className="font-medium">{existingStudyData.title}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Phase:</span>
            <p className="font-medium">{existingStudyData.phase}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Type:</span>
            <p className="font-medium">{existingStudyData.type}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Target Enrollment:</span>
            <p className="font-medium">{existingStudyData.targetEnrollment}</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="monitoringFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monitoring Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select monitoring frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How often will monitoring visits be conducted?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="siteReadiness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Readiness Requirements</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter site readiness requirements and timeline"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Specify requirements for site activation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="regulatoryTimeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regulatory Timeline</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter regulatory submission timeline"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Expected timeline for regulatory submissions and approvals
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budgetDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter budget and payment details"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Budget requirements and payment schedule
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vendorRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor Requirements</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter vendor requirements and timeline"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Specify vendor selection and setup requirements
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Checklist...
              </>
            ) : (
              <>
                Generate Startup Checklist
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}