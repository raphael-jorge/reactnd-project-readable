/**
 * Cria uma string de identificação (id) com 8 caracteres.
 * @return {string} O id criado.
 */
export function createId() {
  return Math.random().toString(36).substr(-8);
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


/**
 * Formata uma string. A string formatada corresponde à porção inicial da string
 * original com um tamanho máximo definido pelo parâmetro length.
 * @param  {string} str A string a ser formatada.
 * @param  {number} length O tamanho máximo da string.
 * @return {string} A string formatada.
 */
export function trimStringToLength(str, length) {
  const strLength = str.length;

  const formattedStr = strLength > length ?
    `${str.slice(0, length - 3)}...` :
    str;

  return formattedStr;
}
