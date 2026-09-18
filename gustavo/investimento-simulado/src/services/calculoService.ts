import { apiFetch } from "./apiClient";

export interface Calculo {
    valorInicial: number;
    prazo: number;
    juro: number;
    valorFinal?: number;
    data?: string;
}

export async function calcular(calculo: Calculo) {
    const response = await apiFetch("/main/calculando", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(calculo)
    });

    return response.json();
}

export async function salvar(calculo: Calculo) {
    const response = await apiFetch("/main", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(calculo)
    });
    return response.json();
}

export async function listarTodos(): Promise<Calculo[]> {
    const response = await apiFetch("/main");
    return response.json();
}

export async function  filtrarPorData(data: string) {
    const response = await apiFetch(`/main/data/${data}`);
    return response.json();
}


export async function  deletarTodos() {
    await apiFetch("/main", {
        method: "DELETE"
    });
}

