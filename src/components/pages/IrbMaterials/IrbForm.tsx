import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRight } from 'lucide-react';

const irbFormSchema = z.object({
  irbName: z.string().min(1, 'IRB name is required'),
  irbType: z.enum(['central', 'local', 'commercial']),
  reviewType: z.enum(['full-board', 'expedited', 'exempt']),
  submissionType: z.enum(['initial', 'amendment', 'continuing-review']),
  meetingDate: z.string().optional(),
  expeditedCategory: z.string().optional(),
  exemptCategory: z.string().optional(),
});

type IrbFormValues = z.infer<typeof irbFormSchema>;

interface IrbFormProps {
  onSubmit: (data: IrbFormValues) => void;
  isSubmitting: boolean;
}

export function IrbForm({ onSubmit, isSubmitting }: IrbFormProps) {
  const form = useForm<IrbFormValues>({
    resolver: zodResolver(irbFormSchema),
    defaultValues: {
      irbName: '',
      irbType: 'central',
      reviewType: 'full-board',
      submissionType: 'initial',
    },
  });

  const reviewType = form.watch('reviewType');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="irb-name">IRB Name</Label>
        <Input
          id="irb-name"
          {...form.register('irbName')}
          placeholder="e.g., Western IRB"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label>IRB Type</Label>
        <Select
          value={form.watch('irbType')}
          onValueChange={(value: any) => form.setValue('irbType', value)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select IRB type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="central">Central IRB</SelectItem>
            <SelectItem value="local">Local IRB</SelectItem>
            <SelectItem value="commercial">Commercial IRB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Review Type</Label>
        <Select
          value={form.watch('reviewType')}
          onValueChange={(value: any) => form.setValue('reviewType', value)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select review type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-board">Full Board Review</SelectItem>
            <SelectItem value="expedited">Expedited Review</SelectItem>
            <SelectItem value="exempt">Exempt Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {reviewType === 'full-board' && (
        <div className="space-y-2">
          <Label>Next Meeting Date</Label>
          <Input
            type="date"
            {...form.register('meetingDate')}
            className="h-11"
          />
        </div>
      )}

      {reviewType === 'expedited' && (
        <div className="space-y-2">
          <Label>Expedited Review Category</Label>
          <Select
            value={form.watch('expeditedCategory')}
            onValueChange={(value) => form.setValue('expeditedCategory', value)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Category 1 - Clinical studies of drugs and medical devices</SelectItem>
              <SelectItem value="2">Category 2 - Collection of blood samples</SelectItem>
              <SelectItem value="3">Category 3 - Prospective collection of biological specimens</SelectItem>
              <SelectItem value="4">Category 4 - Collection of data through noninvasive procedures</SelectItem>
              <SelectItem value="5">Category 5 - Research involving materials collected for non-research purposes</SelectItem>
              <SelectItem value="6">Category 6 - Collection of data from voice, video, digital, or image recordings</SelectItem>
              <SelectItem value="7">Category 7 - Research on individual or group characteristics or behavior</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full h-11"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating Documents...
          </>
        ) : (
          <>
            Generate IRB Materials
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}