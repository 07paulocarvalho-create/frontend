import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Telas de cadastro e edição do catálogo são só para administradores
export function RotaAdmin() {
    const { usuario } = useAuth();

    if (usuario?.perfil !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
