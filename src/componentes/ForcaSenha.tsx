import { avaliarSenha } from "../utils/validacoes";

type Props = {
    senha: string;
}

const ROTULOS = {
    fraca: "Senha fraca",
    media: "Senha média",
    forte: "Senha forte"
};

export function ForcaSenha({ senha }: Props) {
    if (!senha) {
        return <p className="dica">Use 8 caracteres ou mais, com letra maiúscula, minúscula, número e caractere especial.</p>;
    }

    const { nivel, pendencias } = avaliarSenha(senha);

    return (
        <div className="forca-senha">
            <div className={`forca-barra forca-${nivel}`} />
            <span className="dica">
                {ROTULOS[nivel]}
                {pendencias.length > 0 && ` - falta: ${pendencias.join(", ")}`}
            </span>
        </div>
    )
}
