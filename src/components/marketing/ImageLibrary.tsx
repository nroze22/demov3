import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Upload,
  Image as ImageIcon,
  Tag,
  Info,
  Plus,
  X,
  Check,
} from 'lucide-react';
import { ImageManager } from '@/lib/marketing/image-manager';

interface ImageLibraryProps {
  onSelect: (image: any) => void;
  maxHeight?: string;
}

export function ImageLibrary({ onSelect, maxHeight = '600px' }: ImageLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [stockImages, setStockImages] = useState<any[]>([]);
  const imageManager = ImageManager.getInstance();

  useEffect(() => {
    setUploadedImages(imageManager.getUploadedImages());
    setStockImages(imageManager.getStockImages());
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    for (const file of files) {
      const asset = await imageManager.uploadImage(file);
      setUploadedImages(prev => [...prev, asset]);
    }
  };

  const filteredImages = (images: any[]) => {
    if (!searchQuery) return images;
    return imageManager.searchImages(searchQuery);
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
          <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
          />
        </div>

        <Tabs defaultValue="stock" className="w-full">
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
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="uploaded">
            <ScrollArea className="h-[500px]" style={{ maxHeight }}>
              <div className="grid grid-cols-2 gap-4 p-4">
                {filteredImages(uploadedImages).map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}

function ImageCard({ image, onSelect }: { image: any; onSelect: (image: any) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="relative overflow-hidden cursor-pointer group"
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
          {image.tags.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}