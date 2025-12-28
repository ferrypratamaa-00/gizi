import { useSplash } from '@/features/splash/hooks/useSplash'
import { SplashScreen } from '@/features/splash/ui/SplashScreen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    useSplash({ delay: 1000 })
    return (
        <SplashScreen />
    )
}