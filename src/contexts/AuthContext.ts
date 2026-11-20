import { createContext } from "react";
import type { Usuario } from "../types/usuario";

export type AuthContextValor = {
    usuario: Usuario | null;
    carregando: boolean;
    entrar: (email: string, senha: string) => Promise<void>;
    sair: () => void;
    atualizarUsuario: (usuario: Usuario) => void;
}

export const AuthContext = createContext<AuthContextValor | null>(null);
