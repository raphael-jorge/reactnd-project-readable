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


/**
 * Verifica se uma determinada entrada de texto, armazenda em um objeto,
 * está definida, ou seja, difere de uma string vazia.
 * @param  {String}  entry  O nome da entrada, à ser verificada, no objeto.
 * @param  {Object}  object O objeto que contém a entrada.
 * @return {Boolean}        Indica se a entrada está definida.
 */
export function isEntryProvided(entry, object) {
  let valid = true;
  if (object[entry] === '') {
    valid = false;
  }
  return valid;
}


/**
 * Verifica se um conjunto de entradas de texto, armazendas em um objeto,
 * estao definidas, ou seja, se todas diferem de uma string vazia.
 * @param {Array} entries Os nomes das entradas a serem verificadas.
 * @param {Object} object O objeto que contém as entradas.
 * @return {Boolean} Indica se todas as entradas especificadas estão devidamente definidas.
 */
export function areAllEntriesProvided(entries, object) {
  let allValid = true;
  entries.forEach((entry) => {
    const entryValid = isEntryProvided(entry, object);
    allValid = entryValid && allValid;
  });
  return allValid;
}

/**
 * Verifica se os valores das keys em newData são iguas aos valores das
 * keys em oldData. Vale ressaltar que oldData pode ter keys adicionais.
 * @param {Object} oldData Valores base de comparação.
 * @param {Object} newData Novos valores a serem comparados.
 * @return {Boolean} Indica se os valores são iguais ou não.
 */
export function areKeysDifferent(oldData, newData) {
  let differentData = true;

  for (const key in newData) {
    if (newData[key] === oldData[key]) {
      differentData = false;
    }
  }

  return differentData;
}
