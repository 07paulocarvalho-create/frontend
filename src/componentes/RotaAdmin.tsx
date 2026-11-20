import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RotaAdmin() {
    const { usuario } = useAuth();

    if (usuario?.perfil !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
