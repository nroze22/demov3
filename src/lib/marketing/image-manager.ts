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

interface ImageCategory {
  id: string;
  name: string;
  assets: ImageAsset[];
}

export const stockImageCategories: ImageCategory[] = [
  {
    id: 'medical',
    name: 'Medical & Healthcare',
    assets: [
      {
        id: 'med-1',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200',
        title: 'Medical Research',
        tags: ['research', 'laboratory', 'medical'],
        dimensions: { width: 2400, height: 1600 },
        fileSize: 1024000,
        uploadedAt: new Date()
      }
      // Add more assets...
    ]
  },
  {
    id: 'people',
    name: 'People & Lifestyle',
    assets: [
      {
        id: 'people-1',
        url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
        thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200',
        title: 'Diverse Group',
        tags: ['people', 'diversity', 'healthcare'],
        dimensions: { width: 2400, height: 1600 },
        fileSize: 1024000,
        uploadedAt: new Date()
      }
      // Add more assets...
    ]
  }
];

export class ImageManager {
  private static instance: ImageManager;
  private uploadedImages: Map<string, ImageAsset> = new Map();

  private constructor() {}

  static getInstance(): ImageManager {
    if (!ImageManager.instance) {
      ImageManager.instance = new ImageManager();
    }
    return ImageManager.instance;
  }

  async uploadImage(file: File): Promise<ImageAsset> {
    // In a real implementation, this would upload to a server
    // For now, we'll create a local URL
    const url = URL.createObjectURL(file);
    const asset: ImageAsset = {
      id: `upload-${Date.now()}`,
      url,
      thumbnail: url,
      title: file.name,
      tags: [],
      dimensions: { width: 0, height: 0 }, // Would get from actual image
      fileSize: file.size,
      uploadedAt: new Date()
    };

    // Get actual dimensions
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    asset.dimensions = {
      width: img.naturalWidth,
      height: img.naturalHeight
    };

    this.uploadedImages.set(asset.id, asset);
    return asset;
  }

  getUploadedImages(): ImageAsset[] {
    return Array.from(this.uploadedImages.values());
  }

  getStockImages(category?: string): ImageAsset[] {
    if (category) {
      return stockImageCategories
        .find(cat => cat.id === category)
        ?.assets || [];
    }
    return stockImageCategories.flatMap(cat => cat.assets);
  }

  searchImages(query: string): ImageAsset[] {
    const searchTerms = query.toLowerCase().split(' ');
    const allImages = [
      ...this.getUploadedImages(),
      ...this.getStockImages()
    ];

    return allImages.filter(image => 
      searchTerms.some(term =>
        image.title.toLowerCase().includes(term) ||
        image.tags.some(tag => tag.toLowerCase().includes(term))
      )
    );
  }
}