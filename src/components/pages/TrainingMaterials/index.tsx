import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { TrainingWizard } from './TrainingWizard';
import { ArrowLeft } from 'lucide-react';

export function TrainingMaterials() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Training Materials Generator</h1>
              <p className="text-muted-foreground mt-1">
                Create comprehensive training content for your study team
              </p>
            </div>
          </div>
        </div>

        <TrainingWizard />
      </main>
    </div>
  );
}