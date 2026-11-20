import type { SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { salvar } from "../api/recursos";
import { AcoesFormulario } from "../componentes/AcoesFormulario";
import { Alerta } from "../componentes/Alerta";
import { CabecalhoPagina } from "../componentes/CabecalhoPagina";
import { Campo } from "../componentes/Campo";
import { CampoArea } from "../componentes/CampoArea";
import { CampoSelecao } from "../componentes/CampoSelecao";
import { Carregando } from "../componentes/Carregando";
import { useFormulario } from "../hooks/useFormulario";
import { useRegistro } from "../hooks/useRegistro";
import { useTodos } from "../hooks/useTodos";
import { livroSchema, type LivroForm } from "../schemas/livrariaSchemas";
import type { Autor, Categoria, Livro } from "../types/livraria";

type FormularioProps = {
    id?: string;
    inicial: LivroForm;
}

function paraFormulario(livro?: Livro): LivroForm {
    return {
        titulo: livro?.titulo ?? "",
        descricao: livro?.descricao ?? "",
        preco: livro ? livro.preco.toFixed(2).replace(".", ",") : "",
        estoque: livro ? String(livro.estoque) : "",
        isbn: livro?.isbn ?? "",
        capaUrl: livro?.capaUrl ?? "",
        autorId: livro?.autor.id ?? "",
        categoriaId: livro?.categoria.id ?? ""
    };
}

function FormularioLivro({ id, inicial }: FormularioProps) {
    const navigate = useNavigate();
    const autores = useTodos<Autor>("/autores");
    const categorias = useTodos<Categoria>("/categorias");
    const { form, erros, mensagemErro, enviando, onChange, enviar } = useFormulario(inicial);

    function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        enviar(livroSchema, async (dados) => {
            await salvar("/livros", dados, id);
            navigate("/livros", { state: { mensagem: id ? "Livro atualizado." : "Livro cadastrado." } });
        });
    }

    return (
        <form onSubmit={onSubmit} noValidate className="formulario">
            <Alerta tipo="erro" mensagem={mensagemErro} />

            <Campo id="titulo" label="Título *" value={form.titulo} onChange={onChange} erro={erros.titulo} />

            <div className="linha-campos">
                <CampoSelecao
                    id="autorId"
                    label="Autor *"
                    vazio="Selecione"
                    opcoes={autores.map((a) => ({ valor: a.id, texto: a.nome }))}
                    value={form.autorId}
                    onChange={onChange}
                    erro={erros.autorId}
                />
                <CampoSelecao
                    id="categoriaId"
                    label="Categoria *"
                    vazio="Selecione"
                    opcoes={categorias.map((c) => ({ valor: c.id, texto: c.nome }))}
                    value={form.categoriaId}
                    onChange={onChange}
                    erro={erros.categoriaId}
                />
            </div>

            <div className="linha-campos">
                <Campo id="preco" label="Preço (R$) *" inputMode="decimal" placeholder="0,00" value={form.preco} onChange={onChange} erro={erros.preco} />
                <Campo id="estoque" label="Estoque *" inputMode="numeric" value={form.estoque} onChange={onChange} erro={erros.estoque} />
            </div>

            <Campo id="isbn" label="ISBN *" placeholder="978-85-..." value={form.isbn} onChange={onChange} erro={erros.isbn} />
            <Campo id="capaUrl" label="URL da capa" placeholder="https://" value={form.capaUrl} onChange={onChange} erro={erros.capaUrl} />
            <CampoArea id="descricao" label="Descrição" value={form.descricao} onChange={onChange} erro={erros.descricao} />

            <AcoesFormulario enviando={enviando} voltarPara="/livros" />
        </form>
    )
}

// Cadastro e edição em tela separada da listagem
export function LivroFormPage() {
    const { id } = useParams();
    const { registro, carregando, erro } = useRegistro<Livro>("/livros", id);

    return (
        <section className="pagina-formulario">
            <CabecalhoPagina titulo={id ? "Editar livro" : "Novo livro"} descricao="Campos com * são obrigatórios." />

            {carregando && <Carregando />}
            <Alerta tipo="erro" mensagem={erro} />

            {!carregando && !erro && <FormularioLivro id={id} inicial={paraFormulario(registro)} />}
        </section>
    )
}
