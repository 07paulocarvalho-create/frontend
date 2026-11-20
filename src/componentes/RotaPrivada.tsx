import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Carregando } from "./Carregando";

export function RotaPrivada() {
    const { usuario, carregando } = useAuth();
    const location = useLocation();

    if (carregando) {
        return <Carregando />;
    }

    if (!usuario) {
        return <Navigate to="/login" replace state={{ destino: location.pathname }} />;
    }

    return <Outlet />;
}
