import { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/lib/hooks/use-toast';
import { 
  getAllTerms, 
  operators, 
  units,
  oncologyConditions,
  oncologyBiomarkers,
  oncologyLabValues,
  oncologyTreatments,
  performanceStatus,
  commonComorbidities
} from '@/lib/patient-screening/medical-terms';
import {
  X,
  Plus,
  Target,
  ArrowRight,
  Brain,
  Info,
  Search,
  Check,
} from 'lucide-react';

interface CriteriaSetupProps {
  onSubmit: (criteria: any) => void;
}

interface Criterion {
  id: string;
  description: string;
  value?: string;
  operator?: string;
  unit?: string;
}

export function CriteriaSetup({ onSubmit }: CriteriaSetupProps) {
  const [inclusionCriteria, setInclusionCriteria] = useState<Criterion[]>([]);
  const [exclusionCriteria, setExclusionCriteria] = useState<Criterion[]>([]);
  const { toast } = useToast();

  const addCriterion = (type: 'inclusion' | 'exclusion') => {
    const newCriterion: Criterion = {
      id: `criterion-${Date.now()}`,
      description: '',
    };

    if (type === 'inclusion') {
      setInclusionCriteria([...inclusionCriteria, newCriterion]);
    } else {
      setExclusionCriteria([...exclusionCriteria, newCriterion]);
    }
  };

  const removeCriterion = (type: 'inclusion' | 'exclusion', id: string) => {
    if (type === 'inclusion') {
      setInclusionCriteria(inclusionCriteria.filter(c => c.id !== id));
    } else {
      setExclusionCriteria(exclusionCriteria.filter(c => c.id !== id));
    }
  };

  const updateCriterion = (
    type: 'inclusion' | 'exclusion',
    id: string,
    updates: Partial<Criterion>
  ) => {
    if (type === 'inclusion') {
      setInclusionCriteria(inclusionCriteria.map(c => 
        c.id === id ? { ...c, ...updates } : c
      ));
    } else {
      setExclusionCriteria(exclusionCriteria.map(c => 
        c.id === id ? { ...c, ...updates } : c
      ));
    }
  };

  const handleSubmit = () => {
    if (inclusionCriteria.length === 0) {
      toast({
        title: 'Missing Criteria',
        description: 'Please add at least one inclusion criterion',
        variant: 'destructive',
      });
      return;
    }

    onSubmit({
      inclusion: inclusionCriteria,
      exclusion: exclusionCriteria,
    });
  };

  const CriterionCard = ({ 
    criterion, 
    type,
    onUpdate,
    onRemove 
  }: { 
    criterion: Criterion;
    type: 'inclusion' | 'exclusion';
    onUpdate: (updates: Partial<Criterion>) => void;
    onRemove: () => void;
  }) => {
    const [inputValue, setInputValue] = useState(criterion.description);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInput = useCallback((value: string) => {
      setInputValue(value);
      
      if (value.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const searchTerm = value.toLowerCase();
      const allTerms = getAllTerms();
      const matchingTerms = allTerms.filter(term => 
        term.toLowerCase().includes(searchTerm)
      ).slice(0, 10); // Limit to top 10 matches

      setSuggestions(matchingTerms);
      setShowSuggestions(true);
      setFocusedIndex(-1);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!showSuggestions) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0) {
            handleSuggestionSelect(suggestions[focusedIndex]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          break;
      }
    };

    const handleSuggestionSelect = (term: string) => {
      setInputValue(term);
      onUpdate({ description: term });
      setShowSuggestions(false);
      inputRef.current?.focus();
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="relative"
      >
        <Card className="p-6 bg-background border-2">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-4">
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => handleInput(e.target.value)}
                    onFocus={() => {
                      if (inputValue.length >= 2) {
                        setShowSuggestions(true);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter criterion description"
                    className="pl-9 text-foreground bg-background border-input"
                  />
                </div>
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 w-full mt-1"
                    >
                      <Card className="p-2 shadow-lg border-2 max-h-[300px] overflow-y-auto">
                        <div className="space-y-1">
                          {suggestions.map((term, index) => (
                            <motion.button
                              key={index}
                              className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent text-foreground flex items-center justify-between group ${
                                focusedIndex === index ? 'bg-accent' : ''
                              }`}
                              onClick={() => handleSuggestionSelect(term)}
                              onMouseEnter={() => setFocusedIndex(index)}
                              whileHover={{ scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <span>{term}</span>
                              <Check className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                                focusedIndex === index ? 'opacity-100' : ''
                              }`} />
                            </motion.button>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    value={criterion.value}
                    onChange={(e) => onUpdate({ value: e.target.value })}
                    placeholder={criterion.operator === 'between' ? 'e.g., 18-65' : 'e.g., 18'}
                    className="text-foreground bg-background border-input"
                  />
                </div>

                <div>
                  <select
                    value={criterion.operator}
                    onChange={(e) => onUpdate({ operator: e.target.value })}
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground"
                  >
                    <option value="">Select operator</option>
                    {operators.map(op => (
                      <option key={op.value} value={op.value}>
                        {op.label} - {op.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={criterion.unit}
                    onChange={(e) => onUpdate({ unit: e.target.value })}
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground"
                  >
                    <option value="">Select unit</option>
                    {units.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Study Criteria</h2>
            <p className="text-muted-foreground">
              Define inclusion and exclusion criteria for patient screening
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Inclusion Criteria</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addCriterion('inclusion')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Criterion
              </Button>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <AnimatePresence>
                {inclusionCriteria.map((criterion) => (
                  <div key={criterion.id} className="mb-4">
                    <CriterionCard
                      criterion={criterion}
                      type="inclusion"
                      onUpdate={(updates) => updateCriterion('inclusion', criterion.id, updates)}
                      onRemove={() => removeCriterion('inclusion', criterion.id)}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Exclusion Criteria</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addCriterion('exclusion')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Criterion
              </Button>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <AnimatePresence>
                {exclusionCriteria.map((criterion) => (
                  <div key={criterion.id} className="mb-4">
                    <CriterionCard
                      criterion={criterion}
                      type="exclusion"
                      onUpdate={(updates) => updateCriterion('exclusion', criterion.id, updates)}
                      onRemove={() => removeCriterion('exclusion', criterion.id)}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>AI-powered patient matching</span>
          </div>

          <Button onClick={handleSubmit} size="lg">
            <Brain className="h-4 w-4 mr-2" />
            Continue to Document Upload
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}