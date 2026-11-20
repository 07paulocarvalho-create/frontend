import type { Pagina } from "../types/livraria";
import { api } from "./axios";

export type Parametros = Record<string, string | number>;

// Funções genéricas usadas pelos quatro CRUDs
export async function listar<T>(caminho: string, parametros: Parametros = {}): Promise<Pagina<T>> {
    const resposta = await api.get<Pagina<T>>(caminho, { params: parametros });
    return resposta.data;
}

export async function buscar<T>(caminho: string, id: string): Promise<T> {
    const resposta = await api.get<T>(`${caminho}/${id}`);
    return resposta.data;
}

export async function salvar<T>(caminho: string, dados: object, id?: string): Promise<T> {
    const resposta = id
        ? await api.put<T>(`${caminho}/${id}`, dados)
        : await api.post<T>(caminho, dados);
    return resposta.data;
}

export async function excluir(caminho: string, id: string): Promise<void> {
    await api.delete(`${caminho}/${id}`);
}
