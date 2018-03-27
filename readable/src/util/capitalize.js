/**
 * Transforma em maiúscula a primeira letra de uma string.
 * @param  {string} str A string a ser transformada.
 * @return {[type]}     A string transformada.
 */
export default function capitalize(str) {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}
