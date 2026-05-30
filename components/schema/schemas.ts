import { Schema } from '@/types/query';

export const SCHEMAS: Schema[] = [
  {
    id: 'users',
    name: 'Users',
    icon: '◈',
    fields: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'name', label: 'Full Name', type: 'string' },
      { key: 'email', label: 'Email', type: 'string' },
      { key: 'age', label: 'Age', type: 'number' },
      { key: 'country', label: 'Country', type: 'enum', enumValues: ['Nigeria', 'Ghana', 'Kenya', 'USA', 'UK', 'Germany', 'France', 'Canada'] },
      { key: 'status', label: 'Status', type: 'enum', enumValues: ['active', 'inactive', 'pending', 'banned'] },
      { key: 'role', label: 'Role', type: 'enum', enumValues: ['admin', 'user', 'moderator', 'viewer'] },
      { key: 'purchases', label: 'Purchases', type: 'number' },
      { key: 'verified', label: 'Verified', type: 'boolean' },
      { key: 'createdAt', label: 'Created At', type: 'date' },
      { key: 'tags', label: 'Tags', type: 'array' },
    ],
    mockData: generateUserData(),
  },
  {
    id: 'products',
    name: 'Products',
    icon: '◆',
    fields: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'name', label: 'Product Name', type: 'string' },
      { key: 'category', label: 'Category', type: 'enum', enumValues: ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Beauty'] },
      { key: 'price', label: 'Price', type: 'number' },
      { key: 'stock', label: 'Stock', type: 'number' },
      { key: 'rating', label: 'Rating', type: 'number' },
      { key: 'inStock', label: 'In Stock', type: 'boolean' },
      { key: 'createdAt', label: 'Listed At', type: 'date' },
      { key: 'description', label: 'Description', type: 'string' },
    ],
    mockData: generateProductData(),
  },
  {
    id: 'orders',
    name: 'Orders',
    icon: '◉',
    fields: [
      { key: 'id', label: 'Order ID', type: 'number' },
      { key: 'userId', label: 'User ID', type: 'number' },
      { key: 'status', label: 'Status', type: 'enum', enumValues: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
      { key: 'total', label: 'Total Amount', type: 'number' },
      { key: 'itemCount', label: 'Item Count', type: 'number' },
      { key: 'paymentMethod', label: 'Payment', type: 'enum', enumValues: ['card', 'transfer', 'crypto', 'cash'] },
      { key: 'priority', label: 'Priority', type: 'boolean' },
      { key: 'createdAt', label: 'Order Date', type: 'date' },
      { key: 'region', label: 'Region', type: 'enum', enumValues: ['West Africa', 'East Africa', 'Europe', 'Americas', 'Asia'] },
    ],
    mockData: generateOrderData(),
  },
];

function generateUserData(): Record<string, unknown>[] {
  const countries = ['Nigeria', 'Ghana', 'Kenya', 'USA', 'UK', 'Germany', 'France', 'Canada'];
  const statuses = ['active', 'inactive', 'pending', 'banned'];
  const roles = ['admin', 'user', 'moderator', 'viewer'];
  const names = ['Adaeze Okonkwo', 'Emeka Chukwu', 'Fatima Al-Rashid', 'James Whitfield', 'Yuki Tanaka', 'Sofia Reyes', 'Kwame Asante', 'Lena Müller', 'Raj Patel', 'Amara Diallo', 'Chen Wei', 'Isabella Rossi', 'Dimitri Volkov', 'Aiko Nakamura', 'Khalid Hassan', 'Priya Sharma', 'Tobias Eriksen', 'Nkechi Eze', 'Marco Ferrari', 'Zara Ahmed'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    email: `user${i + 1}@example.com`,
    age: 18 + Math.floor(Math.random() * 47),
    country: countries[Math.floor(Math.random() * countries.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    purchases: Math.floor(Math.random() * 100),
    verified: Math.random() > 0.3,
    createdAt: new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['vip', 'newsletter', 'beta'].filter(() => Math.random() > 0.5),
  }));
}

function generateProductData(): Record<string, unknown>[] {
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Beauty'];
  const productNames = ['Quantum Lens', 'Solar Jacket', 'Artisan Blend', 'Data Atlas', 'Carbon Runner', 'Glow Serum', 'Nano Watch', 'Linen Wrap', 'Spice Kit', 'Mind Map', 'Flex Band', 'Pure Mist'];
  
  return Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: `${productNames[i % productNames.length]} ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: parseFloat((10 + Math.random() * 990).toFixed(2)),
    stock: Math.floor(Math.random() * 500),
    rating: parseFloat((1 + Math.random() * 4).toFixed(1)),
    inStock: Math.random() > 0.2,
    createdAt: new Date(Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    description: `Premium quality ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()} product.`,
  }));
}

function generateOrderData(): Record<string, unknown>[] {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const payments = ['card', 'transfer', 'crypto', 'cash'];
  const regions = ['West Africa', 'East Africa', 'Europe', 'Americas', 'Asia'];
  
  return Array.from({ length: 60 }, (_, i) => ({
    id: i + 1001,
    userId: Math.floor(Math.random() * 50) + 1,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    total: parseFloat((20 + Math.random() * 2000).toFixed(2)),
    itemCount: Math.floor(Math.random() * 15) + 1,
    paymentMethod: payments[Math.floor(Math.random() * payments.length)],
    priority: Math.random() > 0.7,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    region: regions[Math.floor(Math.random() * regions.length)],
  }));
}