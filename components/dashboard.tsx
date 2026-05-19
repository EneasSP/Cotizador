'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Header } from '@/components/header'
import { ConfigSection } from '@/components/config-section'
import { CatalogSection } from '@/components/catalog-section'
import { OrdersSection } from '@/components/orders-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Package, ShoppingCart, Loader2 } from 'lucide-react'

export function Dashboard() {
  const { isLoaded } = useStore()
  const [activeTab, setActiveTab] = useState('pedidos')

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="pedidos" className="gap-2">
                <ShoppingCart className="size-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
              <TabsTrigger value="catalogo" className="gap-2">
                <Package className="size-4" />
                <span className="hidden sm:inline">Catálogo</span>
              </TabsTrigger>
              <TabsTrigger value="config" className="gap-2">
                <Settings className="size-4" />
                <span className="hidden sm:inline">Config</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="config" className="mt-0">
            <ConfigSection />
          </TabsContent>

          <TabsContent value="catalogo" className="mt-0">
            <CatalogSection />
          </TabsContent>

          <TabsContent value="pedidos" className="mt-0">
            <OrdersSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
