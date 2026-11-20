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
import { categoriaSchema, type CategoriaForm } from "../schemas/livrariaSchemas";
import type { Categoria } from "../types/livraria";

type FormularioProps = {
    id?: string;
    inicial: CategoriaForm;
}

function FormularioCategoria({ id, inicial }: FormularioProps) {
    const navigate = useNavigate();
    const { form, erros, mensagemErro, enviando, onChange, enviar } = useFormulario(inicial);

    function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        enviar(categoriaSchema, async (dados) => {
            await salvar("/categorias", dados, id);
            navigate("/categorias", { state: { mensagem: id ? "Categoria atualizada." : "Categoria cadastrada." } });
        });
    }

    return (
        <form onSubmit={onSubmit} noValidate className="formulario">
            <Alerta tipo="erro" mensagem={mensagemErro} />
            <Campo id="nome" label="Nome *" value={form.nome} onChange={onChange} erro={erros.nome} />
            <CampoArea id="descricao" label="Descrição" value={form.descricao} onChange={onChange} erro={erros.descricao} />
            <AcoesFormulario enviando={enviando} voltarPara="/categorias" />
        </form>
    )
}

// Cadastro e edição em tela separada da listagem
export function CategoriaFormPage() {
    const { id } = useParams();
    const { registro, carregando, erro } = useRegistro<Categoria>("/categorias", id);

    return (
        <section className="pagina-formulario">
            <CabecalhoPagina titulo={id ? "Editar categoria" : "Nova categoria"} />

            {carregando && <Carregando />}
            <Alerta tipo="erro" mensagem={erro} />

            {!carregando && !erro && (
                <FormularioCategoria
                    id={id}
                    inicial={{ nome: registro?.nome ?? "", descricao: registro?.descricao ?? "" }}
                />
            )}
        </section>
    )
}
