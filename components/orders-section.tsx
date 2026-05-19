'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/lib/store'
import { Order, OrderStatus, Product } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Package,
  Clock,
  User,
  Phone,
  Calendar,
  DollarSign,
  Trash2,
  ShoppingCart,
  PenTool,
  CheckCircle2,
  Printer,
  PackageCheck,
  AlertCircle,
  Search,
  Edit,
  TrendingUp,
  Wallet,
  PiggyBank,
  FileText,
} from 'lucide-react'

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente: {
    label: 'Pendiente',
    color: 'bg-warning/10 text-warning border-warning/30',
    icon: <AlertCircle className="size-4" />,
  },
  imprimiendo: {
    label: 'Imprimiendo',
    color: 'bg-primary/10 text-primary border-primary/30',
    icon: <Printer className="size-4" />,
  },
  listo: {
    label: 'Listo para entregar',
    color: 'bg-success/10 text-success border-success/30',
    icon: <PackageCheck className="size-4" />,
  },
  entregado: {
    label: 'Entregado',
    color: 'bg-muted text-muted-foreground border-muted',
    icon: <CheckCircle2 className="size-4" />,
  },
}

interface CatalogOrderFormData {
  productId: string
  clientName: string
  contact: string
  deliveryDate: string
  finalPrice: number
  notes: string
}

interface CustomOrderFormData {
  productName: string
  description: string
  clientName: string
  contact: string
  deliveryDate: string
  finalPrice: number
  saveAsCatalog: boolean
  notes: string
}

interface EditOrderFormData {
  clientName: string
  contact: string
  deliveryDate: string
  finalPrice: number
  status: OrderStatus
  notes: string
}

function CatalogOrderForm({
  products,
  onSubmit,
  onCancel,
}: {
  products: Product[]
  onSubmit: (data: CatalogOrderFormData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<CatalogOrderFormData>({
    productId: '',
    clientName: '',
    contact: '',
    deliveryDate: '',
    finalPrice: 0,
    notes: '',
  })

  const selectedProduct = products.find((p) => p.id === formData.productId)

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    setFormData({
      ...formData,
      productId,
      finalPrice: product?.finalPrice || 0,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product">Producto del catalogo</Label>
        <Select value={formData.productId} onValueChange={handleProductChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un producto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} - ${product.finalPrice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProduct && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 pt-4">
            {selectedProduct.imageUrl && (
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="size-16 rounded-md object-cover"
                crossOrigin="anonymous"
              />
            )}
            <div>
              <p className="font-semibold">{selectedProduct.name}</p>
              <p className="text-sm text-muted-foreground">
                Precio sugerido: ${selectedProduct.finalPrice}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nombre del cliente</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            placeholder="Maria Garcia"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Contacto (Instagram/WhatsApp/Tel)</Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            placeholder="@usuario o +54 9 11..."
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="deliveryDate">Fecha de entrega</Label>
          <Input
            id="deliveryDate"
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="finalPrice">Precio final cobrado ($)</Label>
          <Input
            id="finalPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.finalPrice}
            onChange={(e) => setFormData({ ...formData, finalPrice: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Detalles de acabado / Notas (opcional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Ej: Color azul metalico, con base incluida, pintado mate..."
          rows={2}
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!formData.productId}>
          Crear Pedido
        </Button>
      </DialogFooter>
    </form>
  )
}

function CustomOrderForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: CustomOrderFormData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<CustomOrderFormData>({
    productName: '',
    description: '',
    clientName: '',
    contact: '',
    deliveryDate: '',
    finalPrice: 0,
    saveAsCatalog: false,
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productName">Titulo del trabajo</Label>
        <Input
          id="productName"
          value={formData.productName}
          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
          placeholder="Ej: Letras AMOR en resina"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripcion detallada</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe los detalles del trabajo para no olvidar nada..."
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientNameCustom">Nombre del cliente</Label>
          <Input
            id="clientNameCustom"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            placeholder="Carlos Lopez"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactCustom">Contacto</Label>
          <Input
            id="contactCustom"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            placeholder="@usuario o +54 9 11..."
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="deliveryDateCustom">Fecha de entrega</Label>
          <Input
            id="deliveryDateCustom"
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="finalPriceCustom">Precio cobrado ($)</Label>
          <Input
            id="finalPriceCustom"
            type="number"
            min="0"
            step="0.01"
            value={formData.finalPrice}
            onChange={(e) => setFormData({ ...formData, finalPrice: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notesCustom">Detalles de acabado / Notas (opcional)</Label>
        <Textarea
          id="notesCustom"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Ej: Colores rosa y dorado, con flores secas..."
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="saveAsCatalog"
          checked={formData.saveAsCatalog}
          onCheckedChange={(checked) => setFormData({ ...formData, saveAsCatalog: checked as boolean })}
        />
        <Label htmlFor="saveAsCatalog" className="cursor-pointer text-sm">
          Guardar tambien como producto en el Catalogo
        </Label>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Crear Pedido
        </Button>
      </DialogFooter>
    </form>
  )
}

function EditOrderForm({
  order,
  onSubmit,
  onCancel,
}: {
  order: Order
  onSubmit: (data: EditOrderFormData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<EditOrderFormData>({
    clientName: order.clientName,
    contact: order.contact,
    deliveryDate: order.deliveryDate,
    finalPrice: order.finalPrice,
    status: order.status,
    notes: order.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <p className="font-semibold">{order.productName}</p>
          <p className="text-sm text-muted-foreground">
            {order.type === 'catalog' ? 'Producto del catalogo' : 'Pedido personalizado'}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="editClientName">Nombre del cliente</Label>
          <Input
            id="editClientName"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editContact">Contacto</Label>
          <Input
            id="editContact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="editDeliveryDate">Fecha de entrega</Label>
          <Input
            id="editDeliveryDate"
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editFinalPrice">Precio final ($)</Label>
          <Input
            id="editFinalPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.finalPrice}
            onChange={(e) => setFormData({ ...formData, finalPrice: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editStatus">Estado</Label>
        <Select value={formData.status} onValueChange={(value: OrderStatus) => setFormData({ ...formData, status: value })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="imprimiendo">Imprimiendo</SelectItem>
            <SelectItem value="listo">Listo para entregar</SelectItem>
            <SelectItem value="entregado">Entregado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editNotes">Detalles de acabado / Notas</Label>
        <Textarea
          id="editNotes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Ej: Color azul metalico, pintado mate..."
          rows={2}
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar Cambios
        </Button>
      </DialogFooter>
    </form>
  )
}

function OrderCard({
  order,
  product,
  onStatusChange,
  onDelete,
  onEdit,
}: {
  order: Order
  product?: Product
  onStatusChange: (status: OrderStatus) => void
  onDelete: () => void
  onEdit: () => void
}) {
  const daysUntilDelivery = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const delivery = new Date(order.deliveryDate)
    delivery.setHours(0, 0, 0, 0)
    return Math.ceil((delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }, [order.deliveryDate])

  const status = statusConfig[order.status]

  return (
    <Card className={`transition-shadow hover:shadow-lg ${order.status === 'entregado' ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-balance text-base">{order.productName}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <User className="size-3" />
              {order.clientName}
            </CardDescription>
          </div>
          <Badge variant="outline" className={status.color}>
            {status.icon}
            <span className="ml-1">{status.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {order.description && (
          <p className="text-sm text-muted-foreground">{order.description}</p>
        )}

        {order.notes && (
          <div className="flex items-start gap-2 rounded-md bg-accent/50 p-2">
            <FileText className="mt-0.5 size-3 shrink-0 text-primary" />
            <p className="text-xs text-foreground">{order.notes}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Phone className="size-3" />
            {order.contact}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="size-3" />
            ${order.finalPrice}
          </div>
        </div>

        <div className={`flex items-center gap-1 text-sm font-medium ${
          daysUntilDelivery < 0 ? 'text-destructive' :
          daysUntilDelivery === 0 ? 'text-warning' :
          daysUntilDelivery <= 2 ? 'text-primary' :
          'text-muted-foreground'
        }`}>
          <Calendar className="size-3" />
          {daysUntilDelivery < 0 ? (
            `Vencido hace ${Math.abs(daysUntilDelivery)} dia(s)`
          ) : daysUntilDelivery === 0 ? (
            'Entregar HOY'
          ) : daysUntilDelivery === 1 ? (
            'Entregar MANANA'
          ) : (
            `En ${daysUntilDelivery} dias (${new Date(order.deliveryDate).toLocaleDateString('es-AR')})`
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Select value={order.status} onValueChange={(value: OrderStatus) => onStatusChange(value)}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="imprimiendo">Imprimiendo</SelectItem>
              <SelectItem value="listo">Listo para entregar</SelectItem>
              <SelectItem value="entregado">Entregado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function OrdersSection() {
  const { orders, products, addOrder, updateOrder, deleteOrder, addProduct, config } = useStore()
  const [dialogType, setDialogType] = useState<'catalog' | 'custom' | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | OrderStatus>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  const filteredOrders = useMemo(() => {
    let filtered = [...orders]
    
    if (filterStatus === 'active') {
      filtered = filtered.filter((o) => o.status !== 'entregado')
    } else if (filterStatus !== 'all') {
      filtered = filtered.filter((o) => o.status === filterStatus)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((o) => 
        o.clientName.toLowerCase().includes(query) ||
        o.productName.toLowerCase().includes(query)
      )
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.deliveryDate).getTime()
      const dateB = new Date(b.deliveryDate).getTime()
      return dateA - dateB
    })
  }, [orders, filterStatus, searchQuery])

  // Calculate profit metrics
  const metrics = useMemo(() => {
    // Consider all non-cancelled orders (active + completed)
    const relevantOrders = orders.filter((o) => o.status !== 'pendiente' || true) // All orders count
    
    const totalRevenue = relevantOrders.reduce((sum, o) => sum + o.finalPrice, 0)
    
    // Calculate production costs
    let totalProductionCost = 0
    relevantOrders.forEach((order) => {
      if (order.productionCost) {
        totalProductionCost += order.productionCost
      } else if (order.productId) {
        const product = products.find((p) => p.id === order.productId)
        if (product) {
          totalProductionCost += product.totalCost
        }
      }
    })
    
    const netProfit = totalRevenue - totalProductionCost
    
    return {
      totalRevenue,
      totalProductionCost,
      netProfit,
    }
  }, [orders, products])

  const handleAddCatalogOrder = (data: CatalogOrderFormData) => {
    const product = products.find((p) => p.id === data.productId)
    if (!product) return

    const newOrder: Order = {
      id: Date.now().toString(),
      type: 'catalog',
      productId: data.productId,
      productName: product.name,
      clientName: data.clientName,
      contact: data.contact,
      deliveryDate: data.deliveryDate,
      finalPrice: data.finalPrice,
      status: 'pendiente',
      notes: data.notes || undefined,
      productionCost: product.totalCost,
      createdAt: new Date().toISOString(),
    }
    addOrder(newOrder)
    setDialogType(null)
  }

  const handleAddCustomOrder = (data: CustomOrderFormData) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      type: 'custom',
      productName: data.productName,
      clientName: data.clientName,
      contact: data.contact,
      deliveryDate: data.deliveryDate,
      finalPrice: data.finalPrice,
      status: 'pendiente',
      description: data.description,
      notes: data.notes || undefined,
      createdAt: new Date().toISOString(),
    }
    addOrder(newOrder)

    if (data.saveAsCatalog) {
      const newProduct: Product = {
        id: `catalog-${Date.now()}`,
        name: data.productName,
        category: 'resina',
        imageUrl: '',
        printTimeHours: 0,
        printTimeMinutes: 0,
        materialGrams: 0,
        electricityCost: 0,
        materialCost: 0,
        totalCost: 0,
        suggestedPrice: data.finalPrice,
        finalPrice: data.finalPrice,
        createdAt: new Date().toISOString(),
      }
      addProduct(newProduct)
    }

    setDialogType(null)
  }

  const handleEditOrder = (data: EditOrderFormData) => {
    if (!editingOrder) return
    updateOrder({
      ...editingOrder,
      clientName: data.clientName,
      contact: data.contact,
      deliveryDate: data.deliveryDate,
      finalPrice: data.finalPrice,
      status: data.status,
      notes: data.notes || undefined,
    })
    setEditingOrder(null)
  }

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return
    updateOrder({ ...order, status })
  }

  const activeOrdersCount = orders.filter((o) => o.status !== 'entregado').length

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Wallet className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Facturado</p>
              <p className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-destructive/10 p-3">
              <TrendingUp className="size-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Costo Produccion</p>
              <p className="text-2xl font-bold">${metrics.totalProductionCost.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-success/10 p-3">
              <PiggyBank className="size-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ganancia Neta</p>
              <p className={`text-2xl font-bold ${metrics.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                ${metrics.netProfit.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion de Pedidos</h2>
          <p className="text-muted-foreground">
            {activeOrdersCount} pedidos activos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente o producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 pl-9"
            />
          </div>
          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="imprimiendo">Imprimiendo</SelectItem>
              <SelectItem value="listo">Listos</SelectItem>
              <SelectItem value="entregado">Entregados</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={dialogType !== null} onOpenChange={(open) => !open && setDialogType(null)}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setDialogType('catalog')}>
                <Plus className="size-4" />
                Nuevo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nuevo Pedido</DialogTitle>
                <DialogDescription>
                  Selecciona el tipo de pedido que deseas crear.
                </DialogDescription>
              </DialogHeader>
              <Tabs
                value={dialogType || 'catalog'}
                onValueChange={(v) => setDialogType(v as 'catalog' | 'custom')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="catalog" className="gap-2">
                    <ShoppingCart className="size-4" />
                    Del Catalogo
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="gap-2">
                    <PenTool className="size-4" />
                    Personalizado
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="catalog" className="mt-4">
                  <CatalogOrderForm
                    products={products}
                    onSubmit={handleAddCatalogOrder}
                    onCancel={() => setDialogType(null)}
                  />
                </TabsContent>
                <TabsContent value="custom" className="mt-4">
                  <CustomOrderForm
                    onSubmit={handleAddCustomOrder}
                    onCancel={() => setDialogType(null)}
                  />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <Package className="mb-4 size-12 text-muted-foreground" />
          <h3 className="font-semibold">No hay pedidos</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? 'No se encontraron resultados' : 'Crea un nuevo pedido para comenzar'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              product={products.find((p) => p.id === order.productId)}
              onStatusChange={(status) => handleStatusChange(order.id, status)}
              onDelete={() => deleteOrder(order.id)}
              onEdit={() => setEditingOrder(order)}
            />
          ))}
        </div>
      )}

      {/* Edit Order Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={(open) => !open && setEditingOrder(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Pedido</DialogTitle>
            <DialogDescription>
              Modifica los datos del pedido.
            </DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <EditOrderForm
              order={editingOrder}
              onSubmit={handleEditOrder}
              onCancel={() => setEditingOrder(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
