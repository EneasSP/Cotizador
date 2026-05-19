'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  AppState,
  CostConfig,
  Product,
  Order,
  defaultConfig,
  sampleProducts,
  sampleOrders,
} from '@/lib/types'

const STORAGE_KEY = 'printcraft-dashboard-data'

interface StoreContextType {
  config: CostConfig
  products: Product[]
  orders: Order[]
  updateConfig: (config: CostConfig) => void
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  addOrder: (order: Order) => void
  updateOrder: (order: Order) => void
  deleteOrder: (id: string) => void
  isLoaded: boolean
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    config: defaultConfig,
    products: [],
    orders: [],
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AppState
        setState(parsed)
      } catch {
        setState({
          config: defaultConfig,
          products: sampleProducts,
          orders: sampleOrders,
        })
      }
    } else {
      setState({
        config: defaultConfig,
        products: sampleProducts,
        orders: sampleOrders,
      })
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isLoaded])

  const updateConfig = (config: CostConfig) => {
    setState((prev) => ({ ...prev, config }))
  }

  const addProduct = (product: Product) => {
    setState((prev) => ({ ...prev, products: [...prev.products, product] }))
  }

  const updateProduct = (product: Product) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === product.id ? product : p)),
    }))
  }

  const deleteProduct = (id: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }))
  }

  const addOrder = (order: Order) => {
    setState((prev) => ({ ...prev, orders: [...prev.orders, order] }))
  }

  const updateOrder = (order: Order) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === order.id ? order : o)),
    }))
  }

  const deleteOrder = (id: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.filter((o) => o.id !== id),
    }))
  }

  return (
    <StoreContext.Provider
      value={{
        config: state.config,
        products: state.products,
        orders: state.orders,
        updateConfig,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrder,
        deleteOrder,
        isLoaded,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
