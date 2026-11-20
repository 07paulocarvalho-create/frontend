type Props = {
    tipo: "erro" | "sucesso";
    mensagem?: string;
}

export function Alerta({ tipo, mensagem }: Props) {
    if (!mensagem) {
        return null;
    }

    return (
        <div className={`alerta alerta-${tipo}`} role={tipo === "erro" ? "alert" : "status"}>
            {mensagem}
        </div>
    )
}
