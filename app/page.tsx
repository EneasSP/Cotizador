import { StoreProvider } from '@/lib/store'
import { Dashboard } from '@/components/dashboard'

export default function Home() {
  return (
    <StoreProvider>
      <Dashboard />
    </StoreProvider>
  )
}
