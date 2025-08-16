/**
 * Inserta una fila de datos en todas las hojas de estudiantes.
 * @param {string} name El título que se le dará a la fila.
 * 
 * TODO: Check that the new data is not repeated.
 */
function addDataRow(name) {
    const spreadsheet = SpreadsheetApp.getActive();
    const avoidSheets = Object.values(sheetNames).filter((a) => a != sheetNames.template);
    const sheets = spreadsheet.getSheets();
    const prevDatosRange = spreadsheet.getRangeByName(rangeNames.template.data);

    const newDatosRowRange = prevDatosRange.offset(prevDatosRange.getHeight(), 0, 1, prevDatosRange.getWidth());
    for (const sheet of sheets) {
        if (avoidSheets.includes(sheet.getName())) continue;
        addDataRowToSheet(name, sheet, newDatosRowRange);
    }

    const newDatosRange = prevDatosRange.offset(0, 0, prevDatosRange.getHeight() + 1, prevDatosRange.getWidth());
    spreadsheet.setNamedRange(rangeNames.template.data, newDatosRange);

    updateSheetProtections();
}

/**
 * Inserta una file de datos en una hoja específica
 * @param {string} name El título que se le dará a la fila
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet La hoja donde se insertará
 * @param {GoogleAppsScript.Spreadsheet.Range} range La fila que se creará
 */
function addDataRowToSheet(name, sheet, range) {
    sheet.insertRowBefore(range.getRow());

    sheet.getRange(range.getRow(), range.getColumn()).setValue(name);
    sheet.getRange(range.getRow(), range.getColumn() + 1, 1, range.getWidth() - 1).merge();

}

/**
 * Aplica un valor a una fila de datos, para todas las hojas de estudiantes.
 * @param {string} name El título del dato a darle valor
 * @param {string} value El valor que se pondrá
 * 
 * TODO: En vez de buscar en cada hoja, buscar el dato en el template, y modificar cada
 * hoja directamente.
 */
function setDataValue(name, value) {
    const spreadsheet = SpreadsheetApp.getActive();
    const avoidSheets = Object.values(sheetNames)
    const sheets = spreadsheet.getSheets();

    const datosRange = spreadsheet.getRangeByName(rangeNames.template.data);
    for (const sheet of sheets) {
        if (avoidSheets.includes(sheet.getName())) continue;
        setDataValueForSheet(sheet, datosRange, name, value);
    }
}

/**
 * Aplica un valor a una fila de datos, para la hoja seleccionada.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet La hoja donde se pondrá el valor
 * @param {GoogleAppsScript.Spreadsheet.Range} range El rango donde están todos los datos
 * @param {string} name El título del dato a darle valor
 * @param {string} value El valor que se pondrá
 */
function setDataValueForSheet(sheet, range, name, value) {
    const datosRange = sheet.getRange(range.getRow(), range.getColumn(), range.getHeight(), range.getWidth());
    const values = datosRange.getValues();
    for (const row of values) {
        if (row[0] == name) {
            row[1] = value;
            break;
        }
    }
    datosRange.setValues(values);
}