import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const useSplashScreen = ({
    delay = 500,
    to = "/login",
}: {
    delay?: number;
    to?: string;
}) => {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate({ to, replace: true });
        }, delay);
        return () => clearTimeout(timer);
    }, []);
};
