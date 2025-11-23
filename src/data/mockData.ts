import { Product, Category } from '@/types'

export const mockCategories: Category[] = [
  {
    id: 1,
    name: '电子产品',
    description: '各类电子设备和数码产品',
    image_url: '/images/electronics.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: '服装配饰',
    description: '时尚服装和配饰',
    image_url: '/images/fashion.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: '家居用品',
    description: '居家生活用品',
    image_url: '/images/home.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: '运动户外',
    description: '运动器材和户外装备',
    image_url: '/images/sports.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: '苹果最新款智能手机，钛金属设计，支持 5G 网络',
    price: 8999.00,
    original_price: 9999.00,
    sku: 'IP15P001',
    stock_quantity: 50,
    category_id: 1,
    images: [
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=2'
    ],
    specifications: {
      color: ['深空黑', '银色', '金色', '深蓝色'],
      storage: ['128GB', '256GB', '512GB', '1TB'],
      screen_size: '6.1英寸'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0]
  },
  {
    id: 2,
    name: '运动T恤',
    description: '透气速干运动T恤，适合各种运动场景',
    price: 199.00,
    original_price: 299.00,
    sku: 'SPORT001',
    stock_quantity: 100,
    category_id: 2,
    images: [
      'https://picsum.photos/400/400?random=3',
      'https://picsum.photos/400/400?random=4'
    ],
    specifications: {
      color: ['黑色', '白色', '蓝色', '红色'],
      size: ['S', 'M', 'L', 'XL', 'XXL'],
      material: '聚酯纤维'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[1]
  },
  {
    id: 3,
    name: '智能手表',
    description: '多功能运动健康智能手表，支持心率监测和GPS定位',
    price: 1299.00,
    original_price: 1599.00,
    sku: 'WATCH001',
    stock_quantity: 30,
    category_id: 1,
    images: [
      'https://picsum.photos/400/400?random=5',
      'https://picsum.photos/400/400?random=6'
    ],
    specifications: {
      color: ['黑色', '银色', '金色'],
      screen: '1.4英寸AMOLED',
      battery_life: '7天'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0]
  },
  {
    id: 4,
    name: '瑜伽垫',
    description: '防滑加厚瑜伽垫，环保材质，适合瑜伽和健身',
    price: 99.00,
    original_price: 149.00,
    sku: 'YOGA001',
    stock_quantity: 200,
    category_id: 4,
    images: [
      'https://picsum.photos/400/400?random=7',
      'https://picsum.photos/400/400?random=8'
    ],
    specifications: {
      color: ['紫色', '蓝色', '粉色', '灰色'],
      thickness: ['6mm', '8mm', '10mm'],
      material: 'TPE'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[3]
  },
  {
    id: 5,
    name: '无线耳机',
    description: '蓝牙5.0无线耳机，主动降噪，长续航',
    price: 599.00,
    original_price: 799.00,
    sku: 'EAR001',
    stock_quantity: 80,
    category_id: 1,
    images: [
      'https://picsum.photos/400/400?random=9',
      'https://picsum.photos/400/400?random=10'
    ],
    specifications: {
      color: ['黑色', '白色'],
      battery_life: '30小时',
      bluetooth_version: '5.0'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0]
  },
  {
    id: 6,
    name: '运动鞋',
    description: '轻便透气运动鞋，适合跑步和日常穿着',
    price: 399.00,
    original_price: 599.00,
    sku: 'SHOES001',
    stock_quantity: 150,
    category_id: 2,
    images: [
      'https://picsum.photos/400/400?random=11',
      'https://picsum.photos/400/400?random=12'
    ],
    specifications: {
      color: ['黑色', '白色', '灰色'],
      size: ['39', '40', '41', '42', '43', '44'],
      material: '网布+橡胶'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[1]
  },
  {
    id: 7,
    name: '保温杯',
    description: '316不锈钢保温杯，24小时保温保冷',
    price: 129.00,
    original_price: 189.00,
    sku: 'BOTTLE001',
    stock_quantity: 120,
    category_id: 3,
    images: [
      'https://picsum.photos/400/400?random=13',
      'https://picsum.photos/400/400?random=14'
    ],
    specifications: {
      color: ['银色', '金色', '蓝色'],
      capacity: ['500ml', '750ml', '1000ml'],
      material: '316不锈钢'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2]
  },
  {
    id: 8,
    name: '背包',
    description: '大容量商务背包，防水材质，笔记本电脑隔层',
    price: 299.00,
    original_price: 399.00,
    sku: 'BAG001',
    stock_quantity: 60,
    category_id: 3,
    images: [
      'https://picsum.photos/400/400?random=15',
      'https://picsum.photos/400/400?random=16'
    ],
    specifications: {
      color: ['黑色', '灰色', '蓝色'],
      capacity: '25L',
      material: '防水尼龙'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2]
  },
]