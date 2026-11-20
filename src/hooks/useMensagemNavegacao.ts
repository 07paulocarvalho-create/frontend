import { useLocation } from "react-router-dom";

// Lê a mensagem de sucesso enviada pela tela anterior (por exemplo, depois de salvar)
export function useMensagemNavegacao(): string | undefined {
    const location = useLocation();
    return (location.state as { mensagem?: string } | null)?.mensagem;
}
