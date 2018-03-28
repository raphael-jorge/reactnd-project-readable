/**
 * Formata um valor de data obtido com o objeto Date.
 * @param  {number} dateValue O valor da data.
 * @return {string} A data formatada: <Data Local> HH:MM.
 */
export default function formatDate(dateValue) {
  const date = new Date(dateValue);
  const dateStr = date.toLocaleDateString('en-US');

  // Hora e minutos com leading 0
  const hours = `0${ date.getHours().toString() }`.slice(-2);
  const minutes = `0${ date.getMinutes().toString() }`.slice(-2);
  const timeStr = `${ hours }:${ minutes }`;

  return `${ dateStr } ${ timeStr }`;
}
