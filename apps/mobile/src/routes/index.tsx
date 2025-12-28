import { createFileRoute } from "@tanstack/react-router";
import { SplashScreen } from "@/features/splash-screen/ui/SplashScreen";
import { useSplashScreen } from "@/features/splash-screen/hooks/useSplashScreen";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    useSplashScreen({ delay: 2000 });
    return <SplashScreen />;
}
