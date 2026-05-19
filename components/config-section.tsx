'use client'

import { useStore } from '@/lib/store'
import { CostConfig } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Settings, Zap, Box, Droplets, Percent, Save } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ConfigSection() {
  const { config, updateConfig } = useStore()
  const [formData, setFormData] = useState<CostConfig>(config)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setFormData(config)
  }, [config])

  const handleChange = (field: keyof CostConfig, value: string) => {
    const numValue = parseFloat(value) || 0
    setFormData((prev) => ({ ...prev, [field]: numValue }))
  }

  const handleSave = () => {
    updateConfig(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Ajusta las variables de costos para calcular precios automáticamente
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-5 text-warning" />
              Electricidad
            </CardTitle>
            <CardDescription>
              Configura el costo de electricidad y consumo de tu impresora
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="electricityCost">Costo por kWh ($)</Label>
              <Input
                id="electricityCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.electricityCostPerKwh}
                onChange={(e) => handleChange('electricityCostPerKwh', e.target.value)}
                placeholder="150"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="printerWatts">Consumo de la impresora (Watts)</Label>
              <Input
                id="printerWatts"
                type="number"
                min="0"
                step="1"
                value={formData.printerWatts}
                onChange={(e) => handleChange('printerWatts', e.target.value)}
                placeholder="200"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="size-5 text-primary" />
              Materiales
            </CardTitle>
            <CardDescription>
              Configura el costo de filamento y resina por kilogramo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filamentCost">Costo filamento por Kg ($)</Label>
              <Input
                id="filamentCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.filamentCostPerKg}
                onChange={(e) => handleChange('filamentCostPerKg', e.target.value)}
                placeholder="8000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resinCost">Costo resina por Kg ($)</Label>
              <Input
                id="resinCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.resinCostPerKg}
                onChange={(e) => handleChange('resinCostPerKg', e.target.value)}
                placeholder="15000"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="size-5 text-success" />
              Margen de Ganancia
            </CardTitle>
            <CardDescription>
              Define el porcentaje de ganancia deseado sobre el costo total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="profitMargin">Margen de ganancia (%)</Label>
                <Input
                  id="profitMargin"
                  type="number"
                  min="0"
                  max="500"
                  step="1"
                  value={formData.profitMargin}
                  onChange={(e) => handleChange('profitMargin', e.target.value)}
                  placeholder="50"
                />
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="size-4" />
                {saved ? 'Guardado!' : 'Guardar Configuración'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Settings className="size-5" />
            Resumen de Configuración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm sm:grid-cols-2 md:grid-cols-5">
            <div className="rounded-lg bg-card p-3">
              <p className="text-muted-foreground">Electricidad</p>
              <p className="text-lg font-semibold">${formData.electricityCostPerKwh}/kWh</p>
            </div>
            <div className="rounded-lg bg-card p-3">
              <p className="text-muted-foreground">Consumo</p>
              <p className="text-lg font-semibold">{formData.printerWatts}W</p>
            </div>
            <div className="rounded-lg bg-card p-3">
              <p className="text-muted-foreground">Filamento</p>
              <p className="text-lg font-semibold">${formData.filamentCostPerKg}/Kg</p>
            </div>
            <div className="rounded-lg bg-card p-3">
              <p className="text-muted-foreground">Resina</p>
              <p className="text-lg font-semibold">${formData.resinCostPerKg}/Kg</p>
            </div>
            <div className="rounded-lg bg-card p-3">
              <p className="text-muted-foreground">Margen</p>
              <p className="text-lg font-semibold">{formData.profitMargin}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
