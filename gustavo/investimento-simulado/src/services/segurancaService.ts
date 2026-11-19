import { apiFetch, definirCredenciaisBasicas, limparCredenciais } from "./apiClient";

export interface UsuarioAutenticado {
  usuario: string;
  permissoes: string[];
}

export async function autenticar(usuario: string, senha: string): Promise<UsuarioAutenticado> {
  definirCredenciaisBasicas(usuario, senha);

  try {
    const response = await apiFetch("/api/seguranca/usuario-atual");
    return response.json();
  } catch (error) {
    limparCredenciais();
    throw error;
  }
}

export function sair() {
  limparCredenciais();
}
