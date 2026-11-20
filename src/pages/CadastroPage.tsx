import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { tratarErroApi } from "../api/erros";
import { Alerta } from "../componentes/Alerta";
import { Campo } from "../componentes/Campo";
import { ForcaSenha } from "../componentes/ForcaSenha";
import { useAuth } from "../hooks/useAuth";
import { cadastroSchema, type CadastroForm } from "../schemas/cadastroSchema";
import type { CadastroUsuario } from "../types/usuario";
import { errosPorCampo, type ErrosFormulario } from "../utils/formulario";
import { formatarCpf } from "../utils/validacoes";

const formularioVazio: CadastroForm = {
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmarSenha: ""
};

export function CadastroPage() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState<CadastroForm>(formularioVazio);
    const [erros, setErros] = useState<ErrosFormulario<CadastroForm>>({});
    const [mensagemApi, setMensagemApi] = useState("");
    const [enviando, setEnviando] = useState(false);

    if (usuario) {
        return <Navigate to="/" replace />;
    }

    function onChange(event: ChangeEvent<HTMLInputElement>) {
        const campo = event.target.name as keyof CadastroForm;
        const valor = campo === "cpf" ? formatarCpf(event.target.value) : event.target.value;

        setForm((atual) => ({ ...atual, [campo]: valor }));
        setErros((atual) => ({ ...atual, [campo]: undefined }));
    }

    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        setMensagemApi("");

        const resultado = cadastroSchema.safeParse(form);

        if (!resultado.success) {
            setErros(errosPorCampo(resultado.error));
            return;
        }

        const { nome, email, senha, cpf } = resultado.data;
        const dados: CadastroUsuario = { nome, email, senha, cpf };

        setEnviando(true);

        try {
            await api.post("/usuarios", dados);

            // Redirecionar para o login após o cadastro
            navigate("/login", {
                replace: true,
                state: { email, mensagem: "Cadastro realizado com sucesso! Faça seu login." }
            });
        } catch (erro) {
            // Lidar com as mensagens de erro da API
            const { mensagem, erros: errosApi } = tratarErroApi(erro);
            setMensagemApi(mensagem);
            setErros(errosApi);
            setEnviando(false);
        }
    }

    return (
        <div className="pagina-centralizada">
            <div className="auth-card">
                <p className="marca">Livraria Entre Páginas</p>
                <h1>Criar conta</h1>
                <p className="auth-descricao">Preencha seus dados para se cadastrar</p>

                <Alerta tipo="erro" mensagem={mensagemApi} />

                <form onSubmit={onSubmit} noValidate className="auth-form">
                    <Campo id="nome" label="Nome" value={form.nome} onChange={onChange} erro={erros.nome} autoComplete="name" />
                    <Campo id="email" label="Email" type="email" value={form.email} onChange={onChange} erro={erros.email} autoComplete="email" />
                    <Campo
                        id="cpf"
                        label="CPF"
                        inputMode="numeric"
                        placeholder="000.000.000-00"
                        value={form.cpf}
                        onChange={onChange}
                        erro={erros.cpf}
                    />
                    <Campo
                        id="senha"
                        label="Senha"
                        type="password"
                        value={form.senha}
                        onChange={onChange}
                        erro={erros.senha}
                        autoComplete="new-password"
                    />
                    <ForcaSenha senha={form.senha} />
                    <Campo
                        id="confirmarSenha"
                        label="Confirmar senha"
                        type="password"
                        value={form.confirmarSenha}
                        onChange={onChange}
                        erro={erros.confirmarSenha}
                        autoComplete="new-password"
                    />

                    <button type="submit" className="btn btn-primary" disabled={enviando}>
                        {enviando ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>

                <p className="auth-rodape">
                    Já tem conta? <Link to="/login">Entrar</Link>
                </p>
            </div>
        </div>
    )
}
