import { useState } from 'react';
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
import { Loader2, Save } from 'lucide-react';

const studyFormSchema = z.object({
  studyTitle: z.string().min(1, 'Study title is required'),
  protocolNumber: z.string().min(1, 'Protocol number is required'),
  sponsorName: z.string().min(1, 'Sponsor name is required'),
  phase: z.enum(['I', 'II', 'III', 'IV', 'N/A']),
  studyType: z.string().min(1, 'Study type is required'),
  irbName: z.string().min(1, 'IRB name is required'),
  primaryObjective: z.string().min(1, 'Primary objective is required'),
  secondaryObjectives: z.string(),
  inclusionCriteria: z.string().min(1, 'Inclusion criteria is required'),
  exclusionCriteria: z.string().min(1, 'Exclusion criteria is required'),
});

type StudyFormValues = z.infer<typeof studyFormSchema>;

interface StudyDetailsFormProps {
  onSubmit: (data: StudyFormValues) => void;
  isSubmitting: boolean;
}

export function StudyDetailsForm({ onSubmit, isSubmitting }: StudyDetailsFormProps) {
  const form = useForm<StudyFormValues>({
    resolver: zodResolver(studyFormSchema),
    defaultValues: {
      studyTitle: '',
      protocolNumber: '',
      sponsorName: '',
      phase: 'N/A',
      studyType: '',
      irbName: '',
      primaryObjective: '',
      secondaryObjectives: '',
      inclusionCriteria: '',
      exclusionCriteria: '',
    },
  });

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="studyTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter study title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="protocolNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protocol Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter protocol number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sponsorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sponsor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sponsor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Phase</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select study phase" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="I">Phase I</SelectItem>
                      <SelectItem value="II">Phase II</SelectItem>
                      <SelectItem value="III">Phase III</SelectItem>
                      <SelectItem value="IV">Phase IV</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Interventional, Observational" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="irbName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IRB Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IRB name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="primaryObjective"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Objective</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter the primary objective of the study"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryObjectives"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Objectives</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter secondary objectives (optional)"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inclusionCriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inclusion Criteria</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter inclusion criteria"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exclusionCriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exclusion Criteria</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter exclusion criteria"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving Study Details...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Study Details
              </>
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}