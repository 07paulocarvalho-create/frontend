import { useLocation } from "react-router-dom";

export function useMensagemNavegacao(): string | undefined {
    const location = useLocation();
    return (location.state as { mensagem?: string } | null)?.mensagem;
}
