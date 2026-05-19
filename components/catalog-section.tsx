'use client'

import { useState, useMemo, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { Product, ProductCategory } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plus,
  Package,
  Clock,
  Zap,
  Box,
  DollarSign,
  Trash2,
  Edit,
  Image as ImageIcon,
  Search,
} from 'lucide-react'

interface ProductFormData {
  name: string
  category: ProductCategory
  imageUrl: string
  printTimeHours: number
  printTimeMinutes: number
  materialGrams: number
  finalPrice: number
}

const initialFormData: ProductFormData = {
  name: '',
  category: 'impresion-3d',
  imageUrl: '',
  printTimeHours: 0,
  printTimeMinutes: 0,
  materialGrams: 0,
  finalPrice: 0,
}

function ProductForm({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}: {
  onSubmit: (data: ProductFormData, costs: { electricityCost: number; materialCost: number; totalCost: number; suggestedPrice: number }) => void
  onCancel: () => void
  initialData?: ProductFormData
  isEdit?: boolean
}) {
  const { config } = useStore()
  const [formData, setFormData] = useState<ProductFormData>(initialData || initialFormData)

  const costs = useMemo(() => {
    const totalHours = formData.printTimeHours + formData.printTimeMinutes / 60
    const electricityCost = totalHours * (config.printerWatts / 1000) * config.electricityCostPerKwh
    const materialCostPerGram = formData.category === 'impresion-3d' 
      ? config.filamentCostPerKg / 1000 
      : config.resinCostPerKg / 1000
    const materialCost = formData.materialGrams * materialCostPerGram
    const totalCost = electricityCost + materialCost
    const suggestedPrice = totalCost * (1 + config.profitMargin / 100)

    return {
      electricityCost: Math.round(electricityCost * 100) / 100,
      materialCost: Math.round(materialCost * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    }
  }, [formData, config])

  useEffect(() => {
    if (!isEdit && costs.suggestedPrice > 0) {
      setFormData((prev) => ({ ...prev, finalPrice: costs.suggestedPrice }))
    }
  }, [costs.suggestedPrice, isEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData, costs)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del producto</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Baby Yoda"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={formData.category}
            onValueChange={(value: ProductCategory) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="impresion-3d">Impresión 3D</SelectItem>
              <SelectItem value="resina">Resina</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de la imagen</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Tiempo de impresión</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="number"
                min="0"
                value={formData.printTimeHours}
                onChange={(e) => setFormData({ ...formData, printTimeHours: parseInt(e.target.value) || 0 })}
                placeholder="Horas"
              />
              <span className="mt-1 block text-xs text-muted-foreground">Horas</span>
            </div>
            <div className="flex-1">
              <Input
                type="number"
                min="0"
                max="59"
                value={formData.printTimeMinutes}
                onChange={(e) => setFormData({ ...formData, printTimeMinutes: parseInt(e.target.value) || 0 })}
                placeholder="Minutos"
              />
              <span className="mt-1 block text-xs text-muted-foreground">Minutos</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="materialGrams">Cantidad de material (gramos)</Label>
          <Input
            id="materialGrams"
            type="number"
            min="0"
            value={formData.materialGrams}
            onChange={(e) => setFormData({ ...formData, materialGrams: parseInt(e.target.value) || 0 })}
            placeholder="120"
          />
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="grid gap-3 text-sm sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-warning" />
              <div>
                <p className="text-muted-foreground">Costo Eléctrico</p>
                <p className="font-semibold">${costs.electricityCost.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Box className="size-4 text-primary" />
              <div>
                <p className="text-muted-foreground">Costo Material</p>
                <p className="font-semibold">${costs.materialCost.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-destructive" />
              <div>
                <p className="text-muted-foreground">Costo Total</p>
                <p className="font-semibold">${costs.totalCost.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-success" />
              <div>
                <p className="text-muted-foreground">Precio Sugerido</p>
                <p className="font-semibold">${costs.suggestedPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="finalPrice">Precio Final de Venta ($)</Label>
        <Input
          id="finalPrice"
          type="number"
          min="0"
          step="0.01"
          value={formData.finalPrice}
          onChange={(e) => setFormData({ ...formData, finalPrice: parseFloat(e.target.value) || 0 })}
          className="text-lg font-semibold"
        />
        <p className="text-xs text-muted-foreground">
          Puedes ajustar el precio sugerido según tu criterio
        </p>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {isEdit ? 'Guardar Cambios' : 'Agregar Producto'}
        </Button>
      </DialogFooter>
    </form>
  )
}

function ProductCard({ product, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="size-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageIcon className="size-12 text-muted-foreground" />
          </div>
        )}
        <Badge
          className="absolute top-2 right-2"
          variant={product.category === 'impresion-3d' ? 'default' : 'secondary'}
        >
          {product.category === 'impresion-3d' ? '3D' : 'Resina'}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-balance font-semibold">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-3" />
          <span>{product.printTimeHours}h {product.printTimeMinutes}m</span>
          <span>•</span>
          <span>{product.materialGrams}g</span>
        </div>
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Costo:</span>
            <span>${product.totalCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-primary">
            <span>Precio:</span>
            <span>${product.finalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Edit className="mr-1 size-3" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="size-3 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function CatalogSection() {
  const { products, config, addProduct, updateProduct, deleteProduct } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [filterCategory, setFilterCategory] = useState<'all' | ProductCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    let filtered = products
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === filterCategory)
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query))
    }
    
    return filtered
  }, [products, filterCategory, searchQuery])

  const handleAddProduct = (
    formData: ProductFormData,
    costs: { electricityCost: number; materialCost: number; totalCost: number; suggestedPrice: number }
  ) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...formData,
      ...costs,
      createdAt: new Date().toISOString(),
    }
    addProduct(newProduct)
    setIsDialogOpen(false)
  }

  const handleEditProduct = (
    formData: ProductFormData,
    costs: { electricityCost: number; materialCost: number; totalCost: number; suggestedPrice: number }
  ) => {
    if (!editingProduct) return
    const updatedProduct: Product = {
      ...editingProduct,
      ...formData,
      ...costs,
    }
    updateProduct(updatedProduct)
    setEditingProduct(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Catálogo de Productos</h2>
          <p className="text-muted-foreground">
            {products.length} productos en tu catálogo
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-9 sm:w-64"
            />
          </div>
          <Select
            value={filterCategory}
            onValueChange={(value) => setFilterCategory(value as 'all' | ProductCategory)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="impresion-3d">Impresion 3D</SelectItem>
              <SelectItem value="resina">Resina</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Agregar Producto</DialogTitle>
                <DialogDescription>
                  Complete los datos del producto. Los costos se calculan automáticamente.
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                onSubmit={handleAddProduct}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <Package className="mb-4 size-12 text-muted-foreground" />
          <h3 className="font-semibold">No hay productos</h3>
          <p className="text-sm text-muted-foreground">
            Agrega tu primer producto al catálogo
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => deleteProduct(product.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica los datos del producto.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              onSubmit={handleEditProduct}
              onCancel={() => setEditingProduct(null)}
              initialData={{
                name: editingProduct.name,
                category: editingProduct.category,
                imageUrl: editingProduct.imageUrl,
                printTimeHours: editingProduct.printTimeHours,
                printTimeMinutes: editingProduct.printTimeMinutes,
                materialGrams: editingProduct.materialGrams,
                finalPrice: editingProduct.finalPrice,
              }}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
