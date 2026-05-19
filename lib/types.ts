export interface CostConfig {
  electricityCostPerKwh: number
  printerWatts: number
  filamentCostPerKg: number
  resinCostPerKg: number
  profitMargin: number
}

export type ProductCategory = 'impresion-3d' | 'resina'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  imageUrl: string
  printTimeHours: number
  printTimeMinutes: number
  materialGrams: number
  electricityCost: number
  materialCost: number
  totalCost: number
  suggestedPrice: number
  finalPrice: number
  createdAt: string
}

export type OrderStatus = 'pendiente' | 'imprimiendo' | 'listo' | 'entregado'

export interface Order {
  id: string
  type: 'catalog' | 'custom'
  productId?: string
  productName: string
  clientName: string
  contact: string
  deliveryDate: string
  finalPrice: number
  status: OrderStatus
  description?: string
  notes?: string
  productionCost?: number
  createdAt: string
}

export interface AppState {
  config: CostConfig
  products: Product[]
  orders: Order[]
}

export const defaultConfig: CostConfig = {
  electricityCostPerKwh: 150,
  printerWatts: 200,
  filamentCostPerKg: 8000,
  resinCostPerKg: 15000,
  profitMargin: 50,
}

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Baby Yoda (Grogu)',
    category: 'impresion-3d',
    imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop',
    printTimeHours: 8,
    printTimeMinutes: 30,
    materialGrams: 120,
    electricityCost: 255,
    materialCost: 960,
    totalCost: 1215,
    suggestedPrice: 1823,
    finalPrice: 2000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Llavero Personalizado',
    category: 'impresion-3d',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    printTimeHours: 1,
    printTimeMinutes: 15,
    materialGrams: 15,
    electricityCost: 37.5,
    materialCost: 120,
    totalCost: 157.5,
    suggestedPrice: 236,
    finalPrice: 300,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Porta Velas Floral',
    category: 'resina',
    imageUrl: 'https://images.unsplash.com/photo-1602607434680-99c2f8e57e8b?w=400&h=400&fit=crop',
    printTimeHours: 0,
    printTimeMinutes: 45,
    materialGrams: 80,
    electricityCost: 22.5,
    materialCost: 1200,
    totalCost: 1222.5,
    suggestedPrice: 1834,
    finalPrice: 2000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Posavasos Set x4',
    category: 'resina',
    imageUrl: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&h=400&fit=crop',
    printTimeHours: 1,
    printTimeMinutes: 0,
    materialGrams: 200,
    electricityCost: 30,
    materialCost: 3000,
    totalCost: 3030,
    suggestedPrice: 4545,
    finalPrice: 4500,
    createdAt: new Date().toISOString(),
  },
]

export const sampleOrders: Order[] = [
  {
    id: '1',
    type: 'catalog',
    productId: '1',
    productName: 'Baby Yoda (Grogu)',
    clientName: 'María García',
    contact: '@maria_crafts',
    deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    finalPrice: 2000,
    status: 'imprimiendo',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'custom',
    productName: 'Letras AMOR en Resina',
    clientName: 'Carlos López',
    contact: '+54 9 11 1234-5678',
    deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    finalPrice: 3500,
    status: 'pendiente',
    description: 'Letras de 15cm de alto, colores rosa y dorado, con flores secas incrustadas. Para regalo de aniversario.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'catalog',
    productId: '4',
    productName: 'Posavasos Set x4',
    clientName: 'Ana Martínez',
    contact: '@ana.deco',
    deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    finalPrice: 4500,
    status: 'listo',
    createdAt: new Date().toISOString(),
  },
]
