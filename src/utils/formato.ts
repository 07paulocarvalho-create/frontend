import type { StatusPedido } from "../types/livraria";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatarPreco(valor: number): string {
    return moeda.format(valor);
}

export function formatarData(iso: string): string {
    return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export const ROTULOS_STATUS: Record<StatusPedido, string> = {
    pendente: "Pendente",
    pago: "Pago",
    enviado: "Enviado",
    entregue: "Entregue",
    cancelado: "Cancelado"
};
