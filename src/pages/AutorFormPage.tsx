import type { SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { salvar } from "../api/recursos";
import { AcoesFormulario } from "../componentes/AcoesFormulario";
import { Alerta } from "../componentes/Alerta";
import { CabecalhoPagina } from "../componentes/CabecalhoPagina";
import { Campo } from "../componentes/Campo";
import { CampoArea } from "../componentes/CampoArea";
import { Carregando } from "../componentes/Carregando";
import { useFormulario } from "../hooks/useFormulario";
import { useRegistro } from "../hooks/useRegistro";
import { autorSchema, type AutorForm } from "../schemas/livrariaSchemas";
import type { Autor } from "../types/livraria";

type FormularioProps = {
    id?: string;
    inicial: AutorForm;
}

function FormularioAutor({ id, inicial }: FormularioProps) {
    const navigate = useNavigate();
    const { form, erros, mensagemErro, enviando, onChange, enviar } = useFormulario(inicial);

    function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        enviar(autorSchema, async (dados) => {
            await salvar("/autores", dados, id);
            navigate("/autores", { state: { mensagem: id ? "Autor atualizado." : "Autor cadastrado." } });
        });
    }

    return (
        <form onSubmit={onSubmit} noValidate className="formulario">
            <Alerta tipo="erro" mensagem={mensagemErro} />
            <Campo id="nome" label="Nome *" value={form.nome} onChange={onChange} erro={erros.nome} />
            <CampoArea id="biografia" label="Biografia" value={form.biografia} onChange={onChange} erro={erros.biografia} />
            <AcoesFormulario enviando={enviando} voltarPara="/autores" />
        </form>
    )
}

// Cadastro e edição em tela separada da listagem
export function AutorFormPage() {
    const { id } = useParams();
    const { registro, carregando, erro } = useRegistro<Autor>("/autores", id);

    return (
        <section className="pagina-formulario">
            <CabecalhoPagina titulo={id ? "Editar autor" : "Novo autor"} />

            {carregando && <Carregando />}
            <Alerta tipo="erro" mensagem={erro} />

            {!carregando && !erro && (
                <FormularioAutor
                    id={id}
                    inicial={{ nome: registro?.nome ?? "", biografia: registro?.biografia ?? "" }}
                />
            )}
        </section>
    )
}
