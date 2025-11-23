-- 电商网站数据库设计
-- Supabase PostgreSQL Schema

-- 1. 商品分类表 (categories)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 商品表 (products)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[], -- 商品图片数组
  specifications JSONB, -- 商品规格（颜色、尺寸等）
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 用户表 (users) - Supabase auth.users 的扩展表
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(100),
  avatar_url VARCHAR(500),
  phone VARCHAR(20),
  address JSONB, -- 收货地址
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 订单表 (orders)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
  shipping_address JSONB NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, refunded
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 订单详情表 (order_items) - 订单与商品的关联表
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  product_snapshot JSONB -- 商品快照（防止商品信息变更影响历史订单）
);

-- 6. 购物车表 (cart_items)
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id) -- 确保每个用户每个商品只有一个购物车记录
);

-- 索引优化
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- 插入示例数据
INSERT INTO categories (name, description, image_url) VALUES
('电子产品', '各类电子设备和数码产品', '/images/electronics.jpg'),
('服装配饰', '时尚服装和配饰', '/images/fashion.jpg'),
('家居用品', '居家生活用品', '/images/home.jpg'),
('运动户外', '运动器材和户外装备', '/images/sports.jpg');

INSERT INTO products (name, description, price, original_price, sku, stock_quantity, category_id, images, specifications) VALUES
('iPhone 15 Pro', '苹果最新款智能手机，钛金属设计', 8999.00, 9999.00, 'IP15P001', 50, 1, 
 ARRAY['/images/iphone15pro-1.jpg', '/images/iphone15pro-2.jpg'],
 '{"color": ["深空黑", "银色", "金色", "深蓝色"], "storage": ["128GB", "256GB", "512GB", "1TB"], "screen_size": "6.1英寸"}'),

('运动T恤', '透气速干运动T恤', 199.00, 299.00, 'SPORT001', 100, 2,
 ARRAY['/images/tshirt-1.jpg', '/images/tshirt-2.jpg'],
 '{"color": ["黑色", "白色", "蓝色", "红色"], "size": ["S", "M", "L", "XL", "XXL"], "material": "聚酯纤维"}'),

('智能手表', '多功能运动健康智能手表', 1299.00, 1599.00, 'WATCH001', 30, 1,
 ARRAY['/images/smartwatch-1.jpg', '/images/smartwatch-2.jpg'],
 '{"color": ["黑色", "银色", "金色"], "screen": "1.4英寸AMOLED", "battery_life": "7天"}'),

('瑜伽垫', '防滑加厚瑜伽垫', 99.00, 149.00, 'YOGA001', 200, 4,
 ARRAY['/images/yogamat-1.jpg', '/images/yogamat-2.jpg'],
 '{"color": ["紫色", "蓝色", "粉色", "灰色"], "thickness": ["6mm", "8mm", "10mm"], "material": "TPE"}');

-- 创建 Row Level Security (RLS) 策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的资料
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 用户只能访问自己的订单
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户只能访问自己的购物车
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);