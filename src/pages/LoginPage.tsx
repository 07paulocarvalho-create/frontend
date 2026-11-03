import { useState, type SubmitEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api/axios";
import { tratarErroApi } from "../api/erros";
import { Campo } from "../componentes/Campo";
import type { Usuario } from "../types/usuario";

type EstadoNavegacao = {
    email?: string;
    mensagem?: string;
} | null;

export function LoginPage() {
    const location = useLocation();
    const estado = location.state as EstadoNavegacao;

    const [email, setEmail] = useState(estado?.email ?? "");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [enviando, setEnviando] = useState(false);

    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        setErro("");

        if (!email.trim() || !senha) {
            setErro("Informe email e senha");
            return;
        }

        setEnviando(true);

        try {
            const response = await api.post<{ usuario: Usuario }>("/login", { email, senha });
            setUsuario(response.data.usuario);
        } catch (e) {
            setErro(tratarErroApi(e).mensagem);
        } finally {
            setEnviando(false);
        }
    }

    if (usuario) {
        return (
            <div className="auth-card">
                <h1>Olá, {usuario.nome}!</h1>
                <p className="auth-descricao">Login realizado com sucesso.</p>
                <button type="button" className="btn btn-secondary" onClick={() => setUsuario(null)}>
                    Sair
                </button>
            </div>
        )
    }

    return (
        <div className="auth-card">
            <h1>Entrar</h1>

            {estado?.mensagem && !erro && <div className="alerta alerta-sucesso" role="status">{estado.mensagem}</div>}
            {erro && <div className="alerta alerta-erro" role="alert">{erro}</div>}

            <form onSubmit={onSubmit} noValidate className="auth-form">
                <Campo
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                />
                <Campo
                    id="senha"
                    label="Senha"
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    autoComplete="current-password"
                />

                <button type="submit" className="btn btn-primary" disabled={enviando}>
                    {enviando ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p className="auth-rodape">
                Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
            </p>
        </div>
    )
}
