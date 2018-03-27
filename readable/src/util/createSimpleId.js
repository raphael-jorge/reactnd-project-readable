/**
 * Cria uma string de identificação (id) com 8 caracteres.
 * @return {string} O id criado.
 */
export default function createSimpleId() {
  return Math.random().toString(36).substr(-8);
}
