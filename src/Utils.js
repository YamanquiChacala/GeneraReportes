/**
 * Zips two arrays into a dictionary.
 */
function createDict(headers, values) {
  const result = {};
  headers.forEach( (key, i) => result[key] = values[i]);
  return result;
}

/**
 * Regresa una lista de las Asignaturas.
 * Retira espacios antes y después, pero respeta espacios intermedios.
 * @param flat - Determina si la lista es anidada (false) o llana (true)
 */
function getAsignaturas(flat) {
  if (flat) {
    return getNonEmptyValues(initAsignaturasRangeName).flat();
  } else {
    return getNonEmptyValues(initAsignaturasRangeName);
  }
}

/**
 * Regresa los valores del rango dado, eliminando espacios de más.
 * Esta función la usa el proceso de inicialización para conseguir la lista de Asignaturas y Estudiantes.
 */
function getNonEmptyValues(rangeName) {
  const spreadsheet = SpreadsheetApp.getActive();
  const range = spreadsheet.getRangeByName(rangeName);
  const values = range.offset(1,0,100,range.getWidth()).getValues();
  const nonEmptyValues = [];
  let erraseIfEmpty = true;
  for( const row of values ) {
    if( row[0] || !erraseIfEmpty) {
      nonEmptyValues.push(row);
      if( row[0] ) {
        erraseIfEmpty = false;
      } else {
        erraseIfEmpty = true;
      }
    }
  }
  if( !nonEmptyValues[nonEmptyValues.length-1][0] ) {
    nonEmptyValues.pop();
  }

  return nonEmptyValues;
}