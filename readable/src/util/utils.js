/**
 * Cria uma string de identificação (id) com 8 caracteres.
 * @return {string} O id criado.
 */
export function createId() {
  return Math.random().toString(36).substr(-8);
}

/**
 * Transforma em maiúscula a primeira letra de uma string.
 * @param  {string} str A string a ser transformada.
 * @return {[type]}     A string transformada.
 */
export function capitalize(str) {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}


/**
 * Formata um valor de data obtido com o objeto Date.
 * @param  {number} dateValue O valor da data.
 * @return {string} A data formatada: <Data Local> HH:MM.
 */
export function formatDate(dateValue) {
  const date = new Date(dateValue);
  const dateStr = date.toLocaleDateString();

  // Hora e minutos com leading 0
  const hours = `0${ date.getHours().toString() }`.slice(-2);
  const minutes = `0${ date.getMinutes().toString() }`.slice(-2);
  const timeStr = `${ hours }:${ minutes }`;

  return `${ dateStr } ${ timeStr }`;
}
