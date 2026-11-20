import { useState } from "react";
import { Link } from "react-router-dom";
import { AcoesLinha } from "../componentes/AcoesLinha";
import { Alerta } from "../componentes/Alerta";
import { CabecalhoPagina } from "../componentes/CabecalhoPagina";
import { CampoSelecao } from "../componentes/CampoSelecao";
import { Carregando } from "../componentes/Carregando";
import { Paginacao } from "../componentes/Paginacao";
import { useAuth } from "../hooks/useAuth";
import { useExclusao } from "../hooks/useExclusao";
import { useListagem } from "../hooks/useListagem";
import { useMensagemNavegacao } from "../hooks/useMensagemNavegacao";
import { useTodos } from "../hooks/useTodos";
import type { Categoria, Livro } from "../types/livraria";
import { formatarPreco } from "../utils/formato";

type LivroCardProps = {
    livro: Livro;
    admin: boolean;
    onExcluir: () => void;
}

function LivroCard({ livro, admin, onExcluir }: LivroCardProps) {
    const esgotado = livro.estoque === 0;

    return (
        <article className="livro-card">
            {livro.capaUrl
                ? <img src={livro.capaUrl} alt={`Capa de ${livro.titulo}`} className="livro-capa" />
                : <div className="livro-capa livro-capa-vazia">{livro.titulo}</div>}

            <div className="livro-info">
                <span className="livro-categoria">{livro.categoria.nome}</span>
                <h3>{livro.titulo}</h3>
                <p className="livro-autor">{livro.autor.nome}</p>
                <p className="livro-preco">{formatarPreco(livro.preco)}</p>
                <p className={esgotado ? "livro-estoque esgotado" : "livro-estoque"}>
                    {esgotado ? "Esgotado" : `${livro.estoque} em estoque`}
                </p>
            </div>

            {admin
                ? <AcoesLinha editarPara={`/livros/${livro.id}/editar`} onExcluir={onExcluir} />
                : !esgotado && <Link to={`/pedidos/novo?livro=${livro.id}`} className="btn btn-primary">Comprar</Link>}
        </article>
    )
}

export function LivrosPage() {
    const { usuario } = useAuth();
    const admin = usuario?.perfil === "admin";
    const mensagem = useMensagemNavegacao();

    const [categoriaId, setCategoriaId] = useState("");
    const categorias = useTodos<Categoria>("/categorias");
    const listagem = useListagem<Livro>("/livros", categoriaId ? { categoriaId } : {});
    const exclusao = useExclusao("/livros", listagem.recarregar);

    function onMudarCategoria(valor: string) {
        setCategoriaId(valor);
        listagem.irParaPagina(1);
    }

    return (
        <section>
            <CabecalhoPagina
                titulo="Livros"
                descricao="Catálogo da Livraria Entre Páginas"
                acao={admin ? { texto: "Novo livro", para: "/livros/novo" } : undefined}
            />

            <div className="filtros">
                <CampoSelecao
                    id="categoria"
                    label="Categoria"
                    vazio="Todas"
                    opcoes={categorias.map((c) => ({ valor: c.id, texto: c.nome }))}
                    value={categoriaId}
                    onChange={(event) => onMudarCategoria(event.target.value)}
                />
            </div>

            <Alerta tipo="sucesso" mensagem={mensagem} />
            <Alerta tipo="erro" mensagem={exclusao.erro || listagem.erro} />

            {listagem.carregando && <Carregando />}

            {!listagem.carregando && listagem.itens.length === 0 && <p className="vazio">Nenhum livro encontrado.</p>}

            {!listagem.carregando && (
                <div className="grade-livros">
                    {listagem.itens.map((livro) => (
                        <LivroCard
                            key={livro.id}
                            livro={livro}
                            admin={admin}
                            onExcluir={() => exclusao.excluirRegistro(livro.id, `o livro "${livro.titulo}"`)}
                        />
                    ))}
                </div>
            )}

            <Paginacao pagina={listagem.pagina} totalPaginas={listagem.totalPaginas} onMudar={listagem.irParaPagina} />
        </section>
    )
}
