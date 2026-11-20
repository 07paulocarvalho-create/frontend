import { useState, type SubmitEvent } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { tratarErroApi } from "../api/erros";
import { Alerta } from "../componentes/Alerta";
import { Campo } from "../componentes/Campo";
import { useAuth } from "../hooks/useAuth";
import { emailValido } from "../utils/validacoes";

type EstadoNavegacao = {
    email?: string;
    mensagem?: string;
    destino?: string;
} | null;

type ErrosLogin = {
    email?: string;
    senha?: string;
}

export function LoginPage() {
    const { usuario, entrar } = useAuth();
    const location = useLocation();
    const [parametros] = useSearchParams();
    const estado = location.state as EstadoNavegacao;

    const [email, setEmail] = useState(estado?.email ?? "");
    const [senha, setSenha] = useState("");
    const [erros, setErros] = useState<ErrosLogin>({});
    const [erroApi, setErroApi] = useState("");
    const [enviando, setEnviando] = useState(false);

    // Redirecionar para a área logada assim que o login der certo
    if (usuario) {
        return <Navigate to={estado?.destino ?? "/"} replace />;
    }

    const aviso = estado?.mensagem
        ?? (parametros.get("sessao") === "expirada" ? "Sua sessão expirou. Entre novamente." : "");

    function validar(): ErrosLogin {
        const novosErros: ErrosLogin = {};

        if (!email.trim()) {
            novosErros.email = "O email é obrigatório";
        } else if (!emailValido(email)) {
            // Validação de email (regex)
            novosErros.email = "Email inválido";
        }

        if (!senha) {
            novosErros.senha = "A senha é obrigatória";
        }

        return novosErros;
    }

    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        setErroApi("");

        const novosErros = validar();
        setErros(novosErros);

        if (Object.keys(novosErros).length > 0) {
            return;
        }

        setEnviando(true);

        try {
            await entrar(email.trim(), senha);
        } catch (erro) {
            // Lidar com os erros da API de forma amigável
            const { mensagem, erros: errosApi } = tratarErroApi(erro);
            setErroApi(mensagem);
            setErros(errosApi);
            setEnviando(false);
        }
    }

    return (
        <div className="pagina-centralizada">
            <div className="auth-card">
                <p className="marca">Livraria Entre Páginas</p>
                <h1>Entrar</h1>

                {!erroApi && <Alerta tipo="sucesso" mensagem={aviso} />}
                <Alerta tipo="erro" mensagem={erroApi} />

                <form onSubmit={onSubmit} noValidate className="auth-form">
                    <Campo
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        erro={erros.email}
                        autoComplete="email"
                    />
                    <Campo
                        id="senha"
                        label="Senha"
                        type="password"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                        erro={erros.senha}
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
        </div>
    )
}
