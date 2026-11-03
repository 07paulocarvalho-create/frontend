import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { tratarErroApi } from "../api/erros";
import { Campo } from "../componentes/Campo";
import { cadastroSchema, type CadastroForm } from "../schemas/cadastroSchema";
import type { CadastroUsuario } from "../types/usuario";
import { formatarCpf } from "../utils/validacoes";

type Erros = Partial<Record<keyof CadastroForm, string>>;

const formularioVazio: CadastroForm = {
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmarSenha: ""
};

export function CadastroPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<CadastroForm>(formularioVazio);
    const [erros, setErros] = useState<Erros>({});
    const [mensagemApi, setMensagemApi] = useState("");
    const [enviando, setEnviando] = useState(false);

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
            const novosErros: Erros = {};
            for (const issue of resultado.error.issues) {
                const campo = issue.path[0] as keyof CadastroForm;
                novosErros[campo] ??= issue.message;
            }
            setErros(novosErros);
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
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="auth-card">
            <h1>Criar conta</h1>
            <p className="auth-descricao">Preencha seus dados para se cadastrar</p>

            {mensagemApi && <div className="alerta alerta-erro" role="alert">{mensagemApi}</div>}

            <form onSubmit={onSubmit} noValidate className="auth-form">
                <Campo
                    id="nome"
                    label="Nome"
                    value={form.nome}
                    onChange={onChange}
                    erro={erros.nome}
                    autoComplete="name"
                />
                <Campo
                    id="email"
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    erro={erros.email}
                    autoComplete="email"
                />
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
                <p className="dica">Mínimo de 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.</p>
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
    )
}
