import { useState, type SubmitEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { tratarErroApi } from "../api/erros";
import { salvar } from "../api/recursos";
import { Alerta } from "../componentes/Alerta";
import { CabecalhoPagina } from "../componentes/CabecalhoPagina";
import { CampoSelecao } from "../componentes/CampoSelecao";
import { Carregando } from "../componentes/Carregando";
import { Tabela, type Coluna } from "../componentes/Tabela";
import { useAuth } from "../hooks/useAuth";
import { useMensagemNavegacao } from "../hooks/useMensagemNavegacao";
import { useRegistro } from "../hooks/useRegistro";
import { STATUS_PEDIDO, type ItemPedido, type Pedido, type StatusPedido } from "../types/livraria";
import { formatarData, formatarPreco, ROTULOS_STATUS } from "../utils/formato";

const colunasItens: Coluna<ItemPedido>[] = [
    { titulo: "Livro", conteudo: (item) => item.titulo },
    { titulo: "Quantidade", conteudo: (item) => item.quantidade },
    { titulo: "Preço unitário", conteudo: (item) => formatarPreco(item.precoUnitario) },
    { titulo: "Subtotal", conteudo: (item) => formatarPreco(item.subtotal) }
];

type AlterarStatusProps = {
    pedido: Pedido;
    onAlterado: (pedido: Pedido) => void;
}

// Edição do pedido (somente admin): alteração do status
function AlterarStatus({ pedido, onAlterado }: AlterarStatusProps) {
    const [status, setStatus] = useState<StatusPedido>(pedido.status);
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);
    const finalizado = pedido.status === "cancelado" || pedido.status === "entregue";

    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        setErro("");

        if (status === "cancelado" && !window.confirm("Cancelar o pedido? Os livros voltam para o estoque.")) {
            return;
        }

        setEnviando(true);
        try {
            onAlterado(await salvar<Pedido>("/pedidos", { status }, pedido.id));
        } catch (e) {
            setErro(tratarErroApi(e).mensagem);
        } finally {
            setEnviando(false);
        }
    }

    if (finalizado) {
        return <p className="dica">Pedidos {ROTULOS_STATUS[pedido.status].toLowerCase()}s não podem mais ser alterados.</p>;
    }

    return (
        <form onSubmit={onSubmit} className="formulario-status">
            <Alerta tipo="erro" mensagem={erro} />
            <CampoSelecao
                id="status"
                label="Alterar status"
                opcoes={STATUS_PEDIDO.map((s) => ({ valor: s, texto: ROTULOS_STATUS[s] }))}
                value={status}
                onChange={(event) => setStatus(event.target.value as StatusPedido)}
            />
            <button type="submit" className="btn btn-primary" disabled={enviando || status === pedido.status}>
                {enviando ? "Salvando..." : "Salvar status"}
            </button>
        </form>
    )
}

export function PedidoDetalhePage() {
    const { id } = useParams();
    const { usuario } = useAuth();
    const mensagemNavegacao = useMensagemNavegacao();
    const { registro, carregando, erro } = useRegistro<Pedido>("/pedidos", id);
    const [atualizado, setAtualizado] = useState<Pedido | null>(null);

    const pedido = atualizado ?? registro;

    return (
        <section>
            <CabecalhoPagina titulo="Detalhes do pedido" />

            <Alerta tipo="sucesso" mensagem={atualizado ? "Status atualizado." : mensagemNavegacao} />
            <Alerta tipo="erro" mensagem={erro} />
            {carregando && <Carregando />}

            {pedido && (
                <>
                    <dl className="dados-conta">
                        <div><dt>Data</dt><dd>{formatarData(pedido.criadoEm)}</dd></div>
                        <div><dt>Cliente</dt><dd>{pedido.cliente.nome}</dd></div>
                        <div><dt>Status</dt><dd><span className={`status status-${pedido.status}`}>{ROTULOS_STATUS[pedido.status]}</span></dd></div>
                        <div><dt>Total</dt><dd><strong>{formatarPreco(pedido.total)}</strong></dd></div>
                    </dl>

                    <Tabela colunas={colunasItens} itens={pedido.itens} chave={(item) => item.livroId} mensagemVazia="Pedido sem itens." />

                    {usuario?.perfil === "admin" && <AlterarStatus pedido={pedido} onAlterado={setAtualizado} />}
                </>
            )}

            <p className="auth-rodape"><Link to="/pedidos">Voltar para os pedidos</Link></p>
        </section>
    )
}
