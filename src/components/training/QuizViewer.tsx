import { useEffect, useState } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brain,
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Timer,
  Award,
  BookOpen,
} from 'lucide-react';
import 'survey-core/defaultV2.min.css';

interface QuizViewerProps {
  definition: any;
  onComplete: (data: any) => void;
}

export function QuizViewer({ definition, onComplete }: QuizViewerProps) {
  const [survey] = useState(() => new Model(definition));
  const [timeLeft, setTimeLeft] = useState(definition.timeLimit || 0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            survey.completeLastPage();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, showResults, survey]);

  useEffect(() => {
    // Custom theme
    survey.applyTheme({
      cssVariables: {
        '--sjs-general-backcolor': 'var(--background)',
        '--sjs-general-forecolor': 'var(--foreground)',
        '--sjs-base-unit': '8px',
        '--sjs-corner-radius': 'var(--radius)',
        '--sjs-font-family': 'inherit',
      },
    });

    // Add custom navigation
    survey.showNavigationButtons = false;
    survey.showProgressBar = 'bottom';
    survey.showTimerPanel = 'none';
    survey.showQuestionNumbers = 'off';

    survey.onComplete.add((sender) => {
      const results = {
        data: sender.data,
        correctAnswers: sender.correctAnswersCount,
        totalQuestions: sender.getAllQuestions().length,
        score: (sender.correctAnswersCount / sender.getAllQuestions().length) * 100,
        timeSpent: definition.timeLimit ? definition.timeLimit - timeLeft : 0,
        questionAnalysis: sender.getAllQuestions().map((q: any) => ({
          title: q.title,
          isCorrect: q.isAnswerCorrect(),
          correctAnswer: q.correctAnswer,
          givenAnswer: q.value,
          explanation: q.correctAnswerExplanation,
        })),
      };
      setResults(results);
      setShowResults(true);
      onComplete(results);
    });
  }, [survey, timeLeft, onComplete, definition.timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
              <p className="text-muted-foreground">
                You've completed the assessment. Here's how you did:
              </p>
            </div>
            <Award className="h-12 w-12 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Score</span>
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{Math.round(results.score)}%</div>
              <Progress value={results.score} className="mt-2" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Time Spent</span>
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{formatTime(results.timeSpent)}</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Correct Answers</span>
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">
                {results.correctAnswers}/{results.totalQuestions}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Question Analysis</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {results.questionAnalysis.map((q: any, i: number) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {q.isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <h4 className="font-medium">{q.title}</h4>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Your answer: {q.givenAnswer}
                          {!q.isCorrect && (
                            <div className="mt-1 text-green-600">
                              Correct answer: {q.correctAnswer}
                            </div>
                          )}
                        </div>
                        {showExplanation && q.explanation && (
                          <div className="mt-2 text-sm bg-muted p-2 rounded">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              {showExplanation ? (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Hide Explanations
                </>
              ) : (
                <>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Show Explanations
                </>
              )}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
              <Button>
                Continue to Next Module
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{definition.title}</h2>
          <p className="text-muted-foreground">{definition.description}</p>
        </div>
        {timeLeft > 0 && (
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-primary" />
            <Badge variant="outline" className="text-lg">
              {formatTime(timeLeft)}
            </Badge>
          </div>
        )}
      </div>

      <Survey model={survey} />

      <div className="flex justify-end mt-6">
        <Button
          onClick={() => survey.completeLastPage()}
          disabled={!survey.isLastPage}
        >
          Submit Quiz
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}