/**
 * Verifica se uma determinada entrada de texto, armazenda em um objeto,
 * está definida, ou seja, difere de uma string vazia.
 * @param {String} entry  O nome da entrada, à ser verificada, no objeto.
 * @param {Object} object O objeto que contém a entrada.
 * @return {Boolean} Indica se a entrada está definida.
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
 * @return {Boolean} Indica se todas as entradas especificadas estão
 * devidamente definidas.
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
  let differentData = false;
  for (const key in newData) {
    if (newData[key] !== oldData[key]) {
      differentData = true;
    }
  }

  return differentData;
}
