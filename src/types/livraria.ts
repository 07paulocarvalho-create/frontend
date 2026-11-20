export type Referencia = {
    id: string;
    nome: string;
}

export type Categoria = {
    id: string;
    nome: string;
    descricao: string | null;
    criadoEm: string;
}

export type Autor = {
    id: string;
    nome: string;
    biografia: string | null;
    criadoEm: string;
}

export type Livro = {
    id: string;
    titulo: string;
    descricao: string | null;
    preco: number;
    isbn: string;
    estoque: number;
    capaUrl: string | null;
    autor: Referencia;
    categoria: Referencia;
    criadoEm: string;
}

export const STATUS_PEDIDO = ["pendente", "pago", "enviado", "entregue", "cancelado"] as const;

export type StatusPedido = (typeof STATUS_PEDIDO)[number];

export type ItemPedido = {
    livroId: string;
    titulo: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export type Pedido = {
    id: string;
    cliente: Referencia;
    itens: ItemPedido[];
    status: StatusPedido;
    total: number;
    criadoEm: string;
}

// Paginação das listagens
export type Pagina<T> = {
    itens: T[];
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
}
