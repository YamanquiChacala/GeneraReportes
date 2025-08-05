/**
 * Zips two arrays into a dictionary.
 * @param {any[]} headers
 * @param {any[]} values
 */
function createDict(headers, values) {
  const result = {};
  headers.forEach( (/** @type {string | number} */ key, /** @type {string | number} */ i) => result[key] = values[i]);
  return result;
}

/**
 * Regresa una lista de las Asignaturas.
 * Retira espacios antes y después, pero respeta espacios intermedios.
 * @param {boolean} flat - Determina si la lista es anidada (false) o llana (true)
 * @param {boolean} respectEmpty
 */
function getAsignaturas(flat, respectEmpty) {
  if (flat) {
    return getNonEmptyValues(rangeNames.init.asignaturas, respectEmpty).flat();
  } else {
    return getNonEmptyValues(rangeNames.init.asignaturas, respectEmpty);
  }
}

/**
 * Regresa los valores del rango dado, eliminando espacios de más.
 * Esta función la usa el proceso de inicialización para conseguir la lista de Asignaturas y Estudiantes.
 * @param {string} rangeName
 * @param {boolean} respectEmpty
 */
function getNonEmptyValues(rangeName, respectEmpty) {
  const spreadsheet = SpreadsheetApp.getActive();
  const range = spreadsheet.getRangeByName(rangeName);
  const values = range.offset(1,0,100,range.getWidth()).getValues();
  const nonEmptyValues = [];
  let erraseIfEmpty = true;
  for( const row of values ) {
    if( row[0] || !erraseIfEmpty) {
      nonEmptyValues.push(row);
      erraseIfEmpty = !(respectEmpty && row[0]);
    }
  }
  if( !nonEmptyValues[nonEmptyValues.length-1][0] ) {
    nonEmptyValues.pop();
  }

  return nonEmptyValues;
}


/**
 * Nos dice si la sección seleccionada debería estar protegida contra escritura.
 * @param {number} section
 */
function isProtected(section){
  const spreadsheet = SpreadsheetApp.getActive();

  const checkmarkCell = spreadsheet.getRangeByName(rangeNames.init.protections).offset(section, 0);

  return checkmarkCell.isChecked();
}

/**
 * Marca o desmarca la sección seleccionada para protección.
 * @param {number} section
 * @param {boolean} status
 */
function setProtected(section, status) {
  const spreadsheet = SpreadsheetApp.getActive();

  const checkmarkCell = spreadsheet.getRangeByName(rangeNames.init.protections).offset(section, 0);

  if(status) {
    checkmarkCell.check();
  } else {
    checkmarkCell.uncheck();
  }
}

/**
 * Cambia el estado de la selección para protección.
 * @param {number} section
 */
function toggleProtected(section) {
  const spreadsheet = SpreadsheetApp.getActive();

  const checkmarkCell = spreadsheet.getRangeByName(rangeNames.init.protections).offset(section, 0);

  if(checkmarkCell.isChecked()) {
    checkmarkCell.uncheck();
  } else {
    checkmarkCell.check();
  }
}