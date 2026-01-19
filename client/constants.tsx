
import { Product, UserRole } from './types';

export const CATEGORIES = ['Gấu bông', 'Móc khóa', 'Postcard', 'Sticker', 'Phụ kiện'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Gấu bông Teddy Khổng Lồ',
    description: 'Chú gấu bông mềm mại, kích thước lớn thích hợp làm quà tặng.',
    basePrice: 450000,
    originalPrice: 600000,
    category: 'Gấu bông',
    images: ['https://picsum.photos/seed/teddy/800/800'],
    stock: 50,
    isSale: true,
    rating: 4.8,
    reviewCount: 124,
    createdAt: '2023-10-01',
    variants: [
      { id: 'v1', name: 'Size 1m', stock: 20, priceDelta: 0 },
      { id: 'v2', name: 'Size 1m5', stock: 30, priceDelta: 200000 }
    ]
  },
  {
    id: 'p2',
    name: 'Móc khóa Shiba Inu',
    description: 'Móc khóa silicon hình chú chó Shiba cực đáng yêu.',
    basePrice: 35000,
    category: 'Móc khóa',
    images: ['https://picsum.photos/seed/shiba/800/800'],
    stock: 100,
    isNew: true,
    rating: 4.5,
    reviewCount: 45,
    createdAt: '2023-12-15',
    variants: []
  },
  {
    id: 'p3',
    name: 'Set Postcard Hội An',
    description: 'Bộ sưu tập 10 tấm bưu thiếp vẽ tay phong cảnh Hội An.',
    basePrice: 85000,
    originalPrice: 100000,
    category: 'Postcard',
    images: ['https://picsum.photos/seed/hoian/800/800'],
    stock: 20,
    isSale: true,
    rating: 4.9,
    reviewCount: 88,
    createdAt: '2023-11-20',
    variants: [
      { id: 'v3', name: 'Màu Nước', stock: 10, priceDelta: 0 },
      { id: 'v4', name: 'Phác Thảo', stock: 10, priceDelta: 0 }
    ]
  }
];
