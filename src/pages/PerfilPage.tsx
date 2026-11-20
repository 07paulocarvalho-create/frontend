import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { api } from "../api/axios";
import { tratarErroApi } from "../api/erros";
import { Alerta } from "../componentes/Alerta";
import { Campo } from "../componentes/Campo";
import { ForcaSenha } from "../componentes/ForcaSenha";
import { useAuth } from "../hooks/useAuth";
import { perfilSchema, type PerfilForm } from "../schemas/perfilSchema";
import type { EdicaoUsuario, Usuario } from "../types/usuario";
import { errosPorCampo, type ErrosFormulario } from "../utils/formulario";
import { formatarCpf } from "../utils/validacoes";

type DadosContaProps = {
    usuario: Usuario;
}

// Não permitir que o usuário altere o email: ele aparece apenas para leitura
function DadosConta({ usuario }: DadosContaProps) {
    return (
        <dl className="dados-conta">
            <div>
                <dt>Email</dt>
                <dd>{usuario.email}</dd>
            </div>
            <div>
                <dt>Perfil</dt>
                <dd>{usuario.perfil === "admin" ? "Administrador" : "Cliente"}</dd>
            </div>
        </dl>
    )
}

export function PerfilPage() {
    const { usuario, atualizarUsuario } = useAuth();
    const [form, setForm] = useState<PerfilForm>({
        nome: usuario?.nome ?? "",
        cpf: usuario?.cpf ?? "",
        senha: "",
        confirmarSenha: ""
    });
    const [erros, setErros] = useState<ErrosFormulario<PerfilForm>>({});
    const [mensagemErro, setMensagemErro] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [enviando, setEnviando] = useState(false);

    if (!usuario) {
        return null;
    }

    function onChange(event: ChangeEvent<HTMLInputElement>) {
        const campo = event.target.name as keyof PerfilForm;
        const valor = campo === "cpf" ? formatarCpf(event.target.value) : event.target.value;

        setForm((atual) => ({ ...atual, [campo]: valor }));
        setErros((atual) => ({ ...atual, [campo]: undefined }));
    }

    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        setMensagemErro("");
        setMensagemSucesso("");

        const resultado = perfilSchema.safeParse(form);

        if (!resultado.success) {
            setErros(errosPorCampo(resultado.error));
            return;
        }

        const { nome, cpf, senha } = resultado.data;
        const dados: EdicaoUsuario = { nome, cpf, senha };

        setEnviando(true);

        try {
            const resposta = await api.put<{ usuario: Usuario }>(`/usuarios/${usuario!.id}`, dados);
            atualizarUsuario(resposta.data.usuario);
            setForm((atual) => ({ ...atual, senha: "", confirmarSenha: "" }));
            setMensagemSucesso("Dados atualizados com sucesso!");
        } catch (erro) {
            const { mensagem, erros: errosApi } = tratarErroApi(erro);
            setMensagemErro(mensagem);
            setErros(errosApi);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section className="pagina-formulario">
            <h1>Meu perfil</h1>
            <p className="pagina-descricao">Para salvar qualquer alteração, informe uma nova senha.</p>

            <DadosConta usuario={usuario} />

            <Alerta tipo="sucesso" mensagem={mensagemSucesso} />
            <Alerta tipo="erro" mensagem={mensagemErro} />

            <form onSubmit={onSubmit} noValidate className="auth-form">
                <Campo id="nome" label="Nome" value={form.nome} onChange={onChange} erro={erros.nome} autoComplete="name" />
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
                    label="Nova senha"
                    type="password"
                    value={form.senha}
                    onChange={onChange}
                    erro={erros.senha}
                    autoComplete="new-password"
                />
                <ForcaSenha senha={form.senha} />
                <Campo
                    id="confirmarSenha"
                    label="Confirmar nova senha"
                    type="password"
                    value={form.confirmarSenha}
                    onChange={onChange}
                    erro={erros.confirmarSenha}
                    autoComplete="new-password"
                />

                <button type="submit" className="btn btn-primary" disabled={enviando}>
                    {enviando ? "Salvando..." : "Salvar alterações"}
                </button>
            </form>
        </section>
    )
}
