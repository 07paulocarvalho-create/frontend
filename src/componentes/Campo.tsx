import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label: string;
    erro?: string;
}

export function Campo({ id, label, erro, ...props }: Props) {
    return (
        <div className="campo">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                name={id}
                aria-invalid={Boolean(erro)}
                aria-describedby={erro ? `${id}-erro` : undefined}
                className={erro ? "input-erro" : undefined}
                {...props}
            />
            {erro && <span id={`${id}-erro`} className="mensagem-erro">{erro}</span>}
        </div>
    )
}
