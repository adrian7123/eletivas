/**
 * Formata a data atual em um formato amigável para exibição
 * @returns string com data formatada
 */
export function formatDate(): string {
  const now = new Date();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

/**
 * Gera um timestamp único
 * @returns número representando o timestamp atual
 */
export function generateUniqueId(): number {
  return Date.now();
}

/**
 * Valida se uma string não está vazia
 * @param value string a ser validada
 * @returns boolean indicando se a string é válida
 */
export function isValidString(value: string | undefined | null): boolean {
  return !!value && value.trim().length > 0;
}
