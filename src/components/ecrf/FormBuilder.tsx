import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { ECRFForm, ECRFSection, ECRFField } from '@/lib/ecrf/types';
import {
  GripVertical,
  Plus,
  Trash2,
  Settings,
  Copy,
  Eye,
  ArrowDown,
  ArrowUp,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FormBuilderProps {
  form: ECRFForm;
  onChange: (form: ECRFForm) => void;
}

export function FormBuilder({ form, onChange }: FormBuilderProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sections = Array.from(form.sections);
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    onChange({
      ...form,
      sections,
    });
  };

  const addSection = () => {
    const newSection: ECRFSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      fields: [],
    };

    onChange({
      ...form,
      sections: [...form.sections, newSection],
    });
  };

  const addField = (sectionId: string) => {
    const newField: ECRFField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: 'New Field',
      name: `field_${Date.now()}`,
      required: false,
    };

    onChange({
      ...form,
      sections: form.sections.map(section =>
        section.id === sectionId
          ? { ...section, fields: [...section.fields, newField] }
          : section
      ),
    });
  };

  const deleteSection = (sectionId: string) => {
    onChange({
      ...form,
      sections: form.sections.filter(section => section.id !== sectionId),
    });
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    onChange({
      ...form,
      sections: form.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.filter(field => field.id !== fieldId),
            }
          : section
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={addSection}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {form.sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          {...provided.dragHandleProps}
                          className="mt-2 cursor-move"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {section.title}
                              </h3>
                              {section.description && (
                                <p className="text-sm text-muted-foreground">
                                  {section.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addField(section.id)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Field
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Section Settings
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate Section
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => deleteSection(section.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Section
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {section.fields.map((field) => (
                              <Card
                                key={field.id}
                                className={`p-3 ${
                                  selectedField === field.id
                                    ? 'ring-2 ring-primary'
                                    : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {field.label}
                                      </span>
                                      {field.required && (
                                        <Badge variant="secondary">
                                          Required
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Type: {field.type}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        deleteField(section.id, field.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}