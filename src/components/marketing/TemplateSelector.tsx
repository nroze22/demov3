import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Layout,
  Grid,
  ArrowRight,
  Star,
  Clock,
  Tag,
} from 'lucide-react';
import { PosterTemplate } from '@/lib/marketing/types';
import { posterTemplates } from '@/lib/marketing/templates/poster-templates';

interface TemplateSelectorProps {
  onSelect: (template: PosterTemplate) => void;
  selectedId?: string;
  type: 'poster' | 'brochure' | 'flyer';
}

export function TemplateSelector({
  onSelect,
  selectedId,
  type
}: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'medical', name: 'Medical & Healthcare' },
    { id: 'clinical', name: 'Clinical Research' },
    { id: 'professional', name: 'Professional' },
    { id: 'modern', name: 'Modern' },
  ];

  const filteredTemplates = posterTemplates.filter(template => {
    if (selectedCategory !== 'all' && template.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <ScrollArea className="h-[60px]">
          <div className="flex items-center gap-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={template.id === selectedId}
                onSelect={() => onSelect(template)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: PosterTemplate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <div className="relative aspect-[3/4]">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Button>
              Use Template
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium">{template.name}</h3>
            <p className="text-sm text-muted-foreground">
              {template.description}
            </p>
          </div>
          <Badge variant="outline" className="ml-2">
            {template.size}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400" />
            4.8
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            New
          </div>
          {template.tags && (
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {template.tags.length}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}