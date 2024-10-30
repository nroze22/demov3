import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Brain,
  Target,
  Users,
  Clock,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { ScreeningCriteria, ExtractedPatient, ScreeningStats } from '@/lib/patient-screening/types';

interface PatientRankingProps {
  patients: ExtractedPatient[];
  criteria: ScreeningCriteria;
  stats: ScreeningStats;
}

export function PatientRanking({ patients, criteria, stats }: PatientRankingProps) {
  const [selectedPatient, setSelectedPatient] = useState<ExtractedPatient | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const getMatchColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMatchIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 0.6) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Stats Overview */}
      <div className="col-span-12">
        <Card className="p-6">
          <div className="grid grid-cols-5 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Total Patients</h3>
              </div>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Eligible Patients</h3>
              </div>
              <div className="text-2xl font-bold">{stats.eligiblePatients}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Match Score</h3>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(stats.averageMatchScore * 100)}%
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium">Documents</h3>
              </div>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <h3 className="font-medium">Processing Time</h3>
              </div>
              <div className="text-2xl font-bold">{stats.processingTime.toFixed(1)}s</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Patient List */}
      <div className="col-span-3">
        <Card className="h-[800px] flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Ranked Patients</h2>
            <p className="text-sm text-muted-foreground">
              Ordered by eligibility match score
            </p>
          </div>

          <ScrollArea className="flex-1">
            <AnimatePresence>
              {patients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                      selectedPatient?.id === patient.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">
                          {patient.demographics.firstName} {patient.demographics.lastName}
                        </div>
                        <Badge variant="outline">
                          {Math.round(patient.matchScore * 100)}% Match
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div>Age: {patient.demographics.age}</div>
                      <div>{patient.sourceDocuments.length} documents</div>
                    </div>

                    <Progress 
                      value={patient.matchScore * 100}
                      className="h-1 mt-2"
                    />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </Card>
      </div>

      {/* Patient Details */}
      <div className="col-span-9">
        <Card className="h-[800px] flex flex-col">
          {selectedPatient ? (
            <>
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedPatient.demographics.firstName} {selectedPatient.demographics.lastName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <span>DOB: {selectedPatient.demographics.dateOfBirth}</span>
                      <span>•</span>
                      <span>Age: {selectedPatient.demographics.age}</span>
                      <span>•</span>
                      <span>Gender: {selectedPatient.demographics.gender}</span>
                    </div>
                  </div>

                  <Button size="lg" className="bg-green-500 hover:bg-green-600">
                    Proceed to Enrollment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Inclusion Criteria</h3>
                  <div className="space-y-4">
                    {criteria.inclusion.map((criterion) => {
                      const match = selectedPatient.criteriaMatches.find(
                        m => m.criteriaId === criterion.id
                      );

                      return (
                        <Card
                          key={criterion.id}
                          className={`p-4 cursor-pointer transition-all ${
                            selectedField === criterion.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedField(criterion.id)}
                        >
                          <div className="flex items-start gap-3">
                            {match ? getMatchIcon(match.confidence) : null}
                            <div className="flex-1">
                              <div className="font-medium">{criterion.description}</div>
                              {match?.sourceEvidence.map((evidence, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-muted-foreground mt-1"
                                >
                                  Found in: {evidence.text}
                                </div>
                              ))}
                            </div>
                            <Badge variant="outline">
                              {match ? `${Math.round(match.confidence * 100)}%` : 'N/A'}
                            </Badge>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Source Documents</h3>
                  <ScrollArea className="h-[600px]">
                    {selectedPatient.sourceDocuments.map((doc) => (
                      <Card key={doc.id} className="p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
                          {selectedField && doc.extractedFields.some(
                            f => f.field === selectedField
                          ) ? (
                            <motion.div
                              initial={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                              animate={{ backgroundColor: 'transparent' }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              {doc.content}
                            </motion.div>
                          ) : (
                            doc.content
                          )}
                        </div>
                      </Card>
                    ))}
                  </ScrollArea>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p>Select a patient to view details</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}