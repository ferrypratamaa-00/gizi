import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

export const useSplash = ({ delay = 500, to = "/login" }: {
    delay?: number,
    to?: string
}) => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)

            navigate({ to, replace: true })
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [delay, navigate, to])

    return {
        isLoading
    }
}