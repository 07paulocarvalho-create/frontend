import { useState, type SubmitEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tratarErroApi } from "../api/erros";
import { salvar } from "../api/recursos";
import { AcoesFormulario } from "../componentes/AcoesFormulario";
import { Alerta } from "../componentes/Alerta";
import { CabecalhoPagina } from "../componentes/CabecalhoPagina";
import { Campo } from "../componentes/Campo";
import { CampoSelecao } from "../componentes/CampoSelecao";
import { useTodos } from "../hooks/useTodos";
import type { Livro, Pedido } from "../types/livraria";
import { formatarPreco } from "../utils/formato";

type Linha = {
    livroId: string;
    quantidade: string;
}

type LinhaItemProps = {
    indice: number;
    linha: Linha;
    livros: Livro[];
    erro?: string;
    podeRemover: boolean;
    onAlterar: (linha: Linha) => void;
    onRemover: () => void;
}

function LinhaItem({ indice, linha, livros, erro, podeRemover, onAlterar, onRemover }: LinhaItemProps) {
    const disponiveis = livros.filter((livro) => livro.estoque > 0 || livro.id === linha.livroId);

    return (
        <div className="linha-item">
            <div className="linha-campos">
                <CampoSelecao
                    id={`livro-${indice}`}
                    label="Livro"
                    vazio="Selecione"
                    opcoes={disponiveis.map((l) => ({ valor: l.id, texto: `${l.titulo} - ${formatarPreco(l.preco)} (${l.estoque} em estoque)` }))}
                    value={linha.livroId}
                    onChange={(event) => onAlterar({ ...linha, livroId: event.target.value })}
                />
                <Campo
                    id={`quantidade-${indice}`}
                    label="Quantidade"
                    type="number"
                    min={1}
                    value={linha.quantidade}
                    onChange={(event) => onAlterar({ ...linha, quantidade: event.target.value })}
                />
            </div>
            {erro && <span className="mensagem-erro">{erro}</span>}
            {podeRemover && <button type="button" className="link-acao link-perigo" onClick={onRemover}>Remover livro</button>}
        </div>
    )
}

// Validação dos campos obrigatórios e do estoque antes de enviar
function validarLinhas(linhas: Linha[], livros: Livro[]): string[] {
    return linhas.map((linha, indice) => {
        const livro = livros.find((l) => l.id === linha.livroId);
        const quantidade = Number(linha.quantidade);

        if (!livro) {
            return "Selecione o livro";
        }
        if (!Number.isInteger(quantidade) || quantidade < 1) {
            return "Informe uma quantidade inteira maior que zero";
        }
        if (quantidade > livro.estoque) {
            return `Só há ${livro.estoque} em estoque`;
        }
        if (linhas.findIndex((l) => l.livroId === linha.livroId) !== indice) {
            return "Este livro já está no pedido";
        }
        return "";
    });
}

export function PedidoFormPage() {
    const navigate = useNavigate();
    const [parametros] = useSearchParams();
    const livros = useTodos<Livro>("/livros");

    const [linhas, setLinhas] = useState<Linha[]>([{ livroId: parametros.get("livro") ?? "", quantidade: "1" }]);
    const [erros, setErros] = useState<string[]>([]);
    const [mensagemErro, setMensagemErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    const total = linhas.reduce((soma, linha) => {
        const livro = livros.find((l) => l.id === linha.livroId);
        const quantidade = Number(linha.quantidade) || 0;
        return soma + (livro ? livro.preco * quantidade : 0);
    }, 0);

    function alterarLinha(indice: number, nova: Linha) {
        setLinhas((atual) => atual.map((linha, i) => (i === indice ? nova : linha)));
        setErros([]);
    }

    function removerLinha(indice: number) {
        setLinhas((atual) => atual.filter((_, i) => i !== indice));
        setErros([]);
    }

    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        setMensagemErro("");

        const novosErros = validarLinhas(linhas, livros);
        setErros(novosErros);

        if (novosErros.some(Boolean)) {
            return;
        }

        setEnviando(true);

        try {
            const itens = linhas.map((linha) => ({ livroId: linha.livroId, quantidade: Number(linha.quantidade) }));
            const pedido = await salvar<Pedido>("/pedidos", { itens });
            navigate(`/pedidos/${pedido.id}`, { state: { mensagem: "Pedido realizado com sucesso!" } });
        } catch (erro) {
            setMensagemErro(tratarErroApi(erro).mensagem);
            setEnviando(false);
        }
    }

    return (
        <section className="pagina-formulario">
            <CabecalhoPagina titulo="Novo pedido" descricao="Escolha os livros e as quantidades." />

            <form onSubmit={onSubmit} noValidate className="formulario">
                <Alerta tipo="erro" mensagem={mensagemErro} />

                {linhas.map((linha, indice) => (
                    <LinhaItem
                        key={indice}
                        indice={indice}
                        linha={linha}
                        livros={livros}
                        erro={erros[indice]}
                        podeRemover={linhas.length > 1}
                        onAlterar={(nova) => alterarLinha(indice, nova)}
                        onRemover={() => removerLinha(indice)}
                    />
                ))}

                <button
                    type="button"
                    className="btn btn-secundario"
                    onClick={() => setLinhas((atual) => [...atual, { livroId: "", quantidade: "1" }])}
                >
                    Adicionar outro livro
                </button>

                <p className="resumo-total">Total: <strong>{formatarPreco(total)}</strong></p>

                <AcoesFormulario enviando={enviando} voltarPara="/pedidos" textoSalvar="Finalizar pedido" />
            </form>
        </section>
    )
}
