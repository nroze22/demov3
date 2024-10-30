import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  dob: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface PatientListProps {
  patients: Patient[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
}

export function PatientList({ patients, selectedId, onSelect, searchQuery }: PatientListProps) {
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.dob.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-2">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-muted ${
              selectedId === patient.id ? 'bg-muted' : ''
            }`}
            onClick={() => onSelect(patient.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">DOB: {patient.dob}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(patient.status)}
                <Badge variant="outline" className="ml-2">
                  {patient.status}
                </Badge>
              </div>
            </div>
          </Card>
        ))}

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No patients found
          </div>
        )}
      </div>
    </ScrollArea>
  );
}