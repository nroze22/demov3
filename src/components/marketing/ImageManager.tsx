import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/hooks/use-toast';
import {
  Upload,
  Image as ImageIcon,
  Search,
  Filter,
  Grid,
  Plus,
  X,
  Check,
  ExternalLink,
  Download,
} from 'lucide-react';

interface ImageAsset {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  tags: string[];
  dimensions: { width: number; height: number };
  fileSize: number;
  uploadedAt: Date;
}

interface ImageManagerProps {
  onSelect: (image: ImageAsset) => void;
  maxHeight?: string;
  allowMultiple?: boolean;
  selectedImages?: string[];
}

export function ImageManager({
  onSelect,
  maxHeight = '500px',
  allowMultiple = false,
  selectedImages = []
}: ImageManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('stock');
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const stockImages = [
    {
      id: 'medical-1',
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200',
      title: 'Medical Research',
      tags: ['research', 'laboratory', 'medical'],
      dimensions: { width: 2400, height: 1600 },
      fileSize: 1024000,
      uploadedAt: new Date()
    },
    {
      id: 'medical-2',
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
      thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200',
      title: 'Healthcare Team',
      tags: ['healthcare', 'team', 'professional'],
      dimensions: { width: 2400, height: 1600 },
      fileSize: 1024000,
      uploadedAt: new Date()
    }
    // Add more stock images...
  ];

  const handleFileUpload = useCallback(async (files: FileList) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload JPG, PNG, or WebP images only',
          variant: 'destructive'
        });
        continue;
      }

      if (file.size > maxSize) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 5MB',
          variant: 'destructive'
        });
        continue;
      }

      // Create upload progress tracker
      const uploadId = Math.random().toString(36).substring(7);
      setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({ ...prev, [uploadId]: progress }));
        }

        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const newImage: ImageAsset = {
              id: uploadId,
              url: e.target?.result as string,
              thumbnail: e.target?.result as string,
              title: file.name,
              tags: [],
              dimensions: { width: img.width, height: img.height },
              fileSize: file.size,
              uploadedAt: new Date()
            };
            onSelect(newImage);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);

        toast({
          title: 'Upload complete',
          description: `${file.name} has been uploaded successfully`
        });
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: 'Failed to upload image. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setUploadProgress(prev => {
          const { [uploadId]: removed, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [onSelect, toast]);

  const filteredImages = (images: ImageAsset[]) => {
    if (!searchQuery) return images;
    const query = searchQuery.toLowerCase();
    return images.filter(image =>
      image.title.toLowerCase().includes(query) ||
      image.tags.some(tag => tag.toLowerCase().includes(query))
    );
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple={allowMultiple}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="stock">Stock Images</TabsTrigger>
            <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
          </TabsList>

          <TabsContent value="stock">
            <ScrollArea className="h-[500px]" style={{ maxHeight }}>
              <div className="grid grid-cols-2 gap-4 p-4">
                {filteredImages(stockImages).map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onSelect={onSelect}
                    isSelected={selectedImages.includes(image.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="uploaded">
            <div className="p-8 text-center text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-4" />
              <p>Upload images to see them here</p>
            </div>
          </TabsContent>
        </Tabs>

        {Object.entries(uploadProgress).map(([id, progress]) => (
          <div key={id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ImageCard({
  image,
  onSelect,
  isSelected
}: {
  image: ImageAsset;
  onSelect: (image: ImageAsset) => void;
  isSelected: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(image)}
    >
      <img
        src={image.thumbnail}
        alt={image.title}
        className="w-full h-32 object-cover transition-transform group-hover:scale-105"
      />
      
      {isHovered && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Button variant="secondary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Select Image
          </Button>
        </div>
      )}

      <div className="p-2">
        <h3 className="text-sm font-medium truncate">{image.title}</h3>
        <div className="flex flex-wrap gap-1 mt-1">
          {image.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{`${image.dimensions.width}×${image.dimensions.height}`}</span>
          <span>{formatFileSize(image.fileSize)}</span>
        </div>
      </div>
    </Card>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}