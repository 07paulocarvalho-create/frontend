import { AcoesLinha } from "../componentes/AcoesLinha";
import { Alerta } from "../componentes/Alerta";
import { CabecalhoPagina } from "../componentes/CabecalhoPagina";
import { Carregando } from "../componentes/Carregando";
import { Paginacao } from "../componentes/Paginacao";
import { Tabela, type Coluna } from "../componentes/Tabela";
import { useAuth } from "../hooks/useAuth";
import { useExclusao } from "../hooks/useExclusao";
import { useListagem } from "../hooks/useListagem";
import { useMensagemNavegacao } from "../hooks/useMensagemNavegacao";
import type { Pedido } from "../types/livraria";
import { formatarData, formatarPreco, ROTULOS_STATUS } from "../utils/formato";

export function PedidosPage() {
    const { usuario } = useAuth();
    const admin = usuario?.perfil === "admin";
    const mensagem = useMensagemNavegacao();
    const listagem = useListagem<Pedido>("/pedidos");
    const exclusao = useExclusao("/pedidos", listagem.recarregar);

    const colunas: Coluna<Pedido>[] = [
        { titulo: "Data", conteudo: (pedido) => formatarData(pedido.criadoEm) },
        ...(admin ? [{ titulo: "Cliente", conteudo: (pedido: Pedido) => pedido.cliente.nome }] : []),
        { titulo: "Livros", conteudo: (pedido) => pedido.itens.reduce((total, item) => total + item.quantidade, 0) },
        { titulo: "Total", conteudo: (pedido) => formatarPreco(pedido.total) },
        { titulo: "Status", conteudo: (pedido) => <span className={`status status-${pedido.status}`}>{ROTULOS_STATUS[pedido.status]}</span> },
        {
            titulo: "Ações",
            conteudo: (pedido) => (
                <AcoesLinha
                    editarPara={`/pedidos/${pedido.id}`}
                    textoEditar={admin ? "Ver / editar" : "Ver"}
                    onExcluir={admin ? () => exclusao.excluirRegistro(pedido.id, "este pedido") : undefined}
                />
            )
        }
    ];

    return (
        <section>
            <CabecalhoPagina
                titulo={admin ? "Pedidos" : "Meus pedidos"}
                acao={{ texto: "Novo pedido", para: "/pedidos/novo" }}
            />

            <Alerta tipo="sucesso" mensagem={mensagem} />
            <Alerta tipo="erro" mensagem={exclusao.erro || listagem.erro} />

            {listagem.carregando
                ? <Carregando />
                : <Tabela colunas={colunas} itens={listagem.itens} chave={(p) => p.id} mensagemVazia="Nenhum pedido encontrado." />}

            <Paginacao pagina={listagem.pagina} totalPaginas={listagem.totalPaginas} onMudar={listagem.irParaPagina} />
        </section>
    )
}
