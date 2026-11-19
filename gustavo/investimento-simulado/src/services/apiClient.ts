const API_URL = "http://localhost:8081";

let authorization: string | null = null;

export function definirCredenciaisBasicas(usuario: string, senha: string) {
  // O header HTTP Basic é recriado a cada login e mantido somente em memória.
  // Evitar localStorage reduz a exposição da senha no navegador.
  authorization = `Basic ${btoa(`${usuario}:${senha}`)}`;
}

export function limparCredenciais() {
  authorization = null;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (authorization) {
    headers.set("Authorization", authorization);
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    const message = response.status === 401
      ? "Faça login antes de executar esta operação."
      : response.status === 403
        ? "Seu usuário não possui permissão para esta operação."
        : `Erro do servidor (${response.status}).`;
    throw new Error(message);
  }

  return response;
}
