import { AcoesLinha } from "../componentes/AcoesLinha";
import { Alerta } from "../componentes/Alerta";
import { CabecalhoPagina } from "../componentes/CabecalhoPagina";
import { Carregando } from "../componentes/Carregando";
import { Paginacao } from "../componentes/Paginacao";
import { Tabela, type Coluna } from "../componentes/Tabela";
import { useExclusao } from "../hooks/useExclusao";
import { useListagem } from "../hooks/useListagem";
import { useMensagemNavegacao } from "../hooks/useMensagemNavegacao";
import type { Categoria } from "../types/livraria";

export function CategoriasPage() {
    const mensagem = useMensagemNavegacao();
    const listagem = useListagem<Categoria>("/categorias");
    const exclusao = useExclusao("/categorias", listagem.recarregar);

    const colunas: Coluna<Categoria>[] = [
        { titulo: "Nome", conteudo: (categoria) => categoria.nome },
        { titulo: "Descrição", conteudo: (categoria) => categoria.descricao ?? "-" },
        {
            titulo: "Ações",
            conteudo: (categoria) => (
                <AcoesLinha
                    editarPara={`/categorias/${categoria.id}/editar`}
                    onExcluir={() => exclusao.excluirRegistro(categoria.id, `a categoria "${categoria.nome}"`)}
                />
            )
        }
    ];

    return (
        <section>
            <CabecalhoPagina titulo="Categorias" acao={{ texto: "Nova categoria", para: "/categorias/nova" }} />

            <Alerta tipo="sucesso" mensagem={mensagem} />
            <Alerta tipo="erro" mensagem={exclusao.erro || listagem.erro} />

            {listagem.carregando
                ? <Carregando />
                : <Tabela colunas={colunas} itens={listagem.itens} chave={(c) => c.id} mensagemVazia="Nenhuma categoria cadastrada." />}

            <Paginacao pagina={listagem.pagina} totalPaginas={listagem.totalPaginas} onMudar={listagem.irParaPagina} />
        </section>
    )
}
