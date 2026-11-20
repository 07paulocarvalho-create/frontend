import type { SelectHTMLAttributes } from "react";

export type Opcao = {
    valor: string;
    texto: string;
}

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
    id: string;
    label: string;
    opcoes: Opcao[];
    vazio?: string;
    erro?: string;
}

export function CampoSelecao({ id, label, opcoes, vazio, erro, ...props }: Props) {
    return (
        <div className="campo">
            <label htmlFor={id}>{label}</label>
            <select
                id={id}
                name={id}
                aria-invalid={Boolean(erro)}
                className={erro ? "input-erro" : undefined}
                {...props}
            >
                {vazio !== undefined && <option value="">{vazio}</option>}
                {opcoes.map((opcao) => <option key={opcao.valor} value={opcao.valor}>{opcao.texto}</option>)}
            </select>
            {erro && <span className="mensagem-erro">{erro}</span>}
        </div>
    )
}
