import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    id: string;
    label: string;
    erro?: string;
}

export function CampoArea({ id, label, erro, ...props }: Props) {
    return (
        <div className="campo">
            <label htmlFor={id}>{label}</label>
            <textarea
                id={id}
                name={id}
                rows={4}
                aria-invalid={Boolean(erro)}
                className={erro ? "input-erro" : undefined}
                {...props}
            />
            {erro && <span className="mensagem-erro">{erro}</span>}
        </div>
    )
}
