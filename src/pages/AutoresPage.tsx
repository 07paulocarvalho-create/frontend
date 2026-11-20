import { AcoesLinha } from "../componentes/AcoesLinha";
import { Alerta } from "../componentes/Alerta";
import { CabecalhoPagina } from "../componentes/CabecalhoPagina";
import { Carregando } from "../componentes/Carregando";
import { Paginacao } from "../componentes/Paginacao";
import { Tabela, type Coluna } from "../componentes/Tabela";
import { useExclusao } from "../hooks/useExclusao";
import { useListagem } from "../hooks/useListagem";
import { useMensagemNavegacao } from "../hooks/useMensagemNavegacao";
import type { Autor } from "../types/livraria";

function resumir(texto: string | null, tamanho = 80): string {
    if (!texto) {
        return "-";
    }
    return texto.length > tamanho ? `${texto.slice(0, tamanho)}...` : texto;
}

export function AutoresPage() {
    const mensagem = useMensagemNavegacao();
    const listagem = useListagem<Autor>("/autores");
    const exclusao = useExclusao("/autores", listagem.recarregar);

    const colunas: Coluna<Autor>[] = [
        { titulo: "Nome", conteudo: (autor) => autor.nome },
        { titulo: "Biografia", conteudo: (autor) => resumir(autor.biografia) },
        {
            titulo: "Ações",
            conteudo: (autor) => (
                <AcoesLinha
                    editarPara={`/autores/${autor.id}/editar`}
                    onExcluir={() => exclusao.excluirRegistro(autor.id, `o autor "${autor.nome}"`)}
                />
            )
        }
    ];

    return (
        <section>
            <CabecalhoPagina titulo="Autores" acao={{ texto: "Novo autor", para: "/autores/novo" }} />

            <Alerta tipo="sucesso" mensagem={mensagem} />
            <Alerta tipo="erro" mensagem={exclusao.erro || listagem.erro} />

            {listagem.carregando
                ? <Carregando />
                : <Tabela colunas={colunas} itens={listagem.itens} chave={(a) => a.id} mensagemVazia="Nenhum autor cadastrado." />}

            <Paginacao pagina={listagem.pagina} totalPaginas={listagem.totalPaginas} onMudar={listagem.irParaPagina} />
        </section>
    )
}
