import { createFileRoute } from '@tanstack/react-router'
import { SplashScreen } from '@/features/splash-screen/ui/SplashScreen'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SplashScreen />
}
