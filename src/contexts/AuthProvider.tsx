import { useEffect, useState, type ReactNode } from "react";
import { api } from "../api/axios";
import { lerToken, removerToken, salvarToken } from "../api/token";
import type { LoginResposta, Usuario } from "../types/usuario";
import { AuthContext } from "./AuthContext";

type Props = {
    children: ReactNode;
}

// Contexto para exibir as informações do usuário em toda a aplicação
export function AuthProvider({ children }: Props) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(() => Boolean(lerToken()));

    useEffect(() => {
        if (!lerToken()) {
            return;
        }

        api.get<Usuario>("/usuarios/me")
            .then((resposta) => setUsuario(resposta.data))
            .catch(() => removerToken())
            .finally(() => setCarregando(false));
    }, []);

    async function entrar(email: string, senha: string) {
        const resposta = await api.post<LoginResposta>("/login", { email, senha });
        salvarToken(resposta.data.token);
        setUsuario(resposta.data.usuario);
    }

    function sair() {
        removerToken();
        setUsuario(null);
    }

    return (
        <AuthContext.Provider value={{ usuario, carregando, entrar, sair, atualizarUsuario: setUsuario }}>
            {children}
        </AuthContext.Provider>
    )
}
