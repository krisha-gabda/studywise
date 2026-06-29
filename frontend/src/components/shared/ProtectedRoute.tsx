import type { ReactNode } from "react";
import { useAuthStore } from "../../store/authStore";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = useAuthStore((state) => state.user)
    const isLoading = useAuthStore((state) => state.isLoading)

    if (isLoading) {
        return(
            <div>
                <p>Loading</p>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/auth" replace />
    }

    return <>{children}</>
    
}