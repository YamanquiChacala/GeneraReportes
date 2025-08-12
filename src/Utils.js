/**
 * Zips two arrays into a dictionary.
 * @param {any[]} headers
 * @param {any[]} values
 */
function createDict(headers, values) {
    const result = {};
    headers.forEach((/** @type {string | number} */ key, /** @type {string | number} */ i) => result[key] = values[i]);
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
    const values = range.offset(1, 0, 100, range.getWidth()).getValues();
    const nonEmptyValues = [];
    let erraseIfEmpty = true;
    for (const row of values) {
        if (row[0] || !erraseIfEmpty) {
            nonEmptyValues.push(row);
            erraseIfEmpty = !(respectEmpty && row[0]);
        }
    }
    if (!nonEmptyValues[nonEmptyValues.length - 1][0]) {
        nonEmptyValues.pop();
    }

    return nonEmptyValues;
}

/**
 * Genera un diálogo de avance para tareas tardadas.
 * @param {string} title
 * @param {string} sheetToFinish
 */
function showDialog(title, sheetToFinish) {
    var html = HtmlService.createHtmlOutputFromFile("src/dialog")
        .setWidth(400)
        .setHeight(400);
    SpreadsheetApp.getUi().showModalDialog(html, title);

    const cache = CacheService.getDocumentCache();
    cache.put(cacheKeys.progress, "0");
    cache.put(cacheKeys.details, "");
    cache.put(cacheKeys.sheetToFinish, sheetToFinish);

    // PropertiesService.getScriptProperties().setProperty(properties.progress, '0');
    // PropertiesService.getScriptProperties().setProperty(properties.details, '');
}

/**
 * Cuando el dialogo pide información, esta función le dice el avance.
 */
function updateDialog() {
    const cache = CacheService.getDocumentCache();

    const progress = parseInt(cache.get(cacheKeys.progress));
    const details = cache.get(cacheKeys.details);

    // const progress = parseInt(PropertiesService.getScriptProperties().getProperty(properties.progress));
    // const details = PropertiesService.getScriptProperties().getProperty(properties.details);

    return { progress: progress, details: details };
}

/**
 * Una vez que el diálogo se cierra, esta función se ejecuta.
*/
function finishDialog() {
    const cache = CacheService.getDocumentCache();

    let sheetToGo = cache.get(cacheKeys.sheetToFinish);
    if (!sheetToGo) sheetToGo = sheetNames.add;

    const spreadsheet = SpreadsheetApp.getActive();
    const sheet = spreadsheet.getSheetByName(sheetToGo);

    sheet?.activate();
    requestAuth();
}

/**
 * Actualiza la hoja a la cual movernos cuando el diálogo desaparezca.
 * @param {string} sheetName
 */
function updateSheetToFinish(sheetName) {
    const cache = CacheService.getDocumentCache();
    cache.put(cacheKeys.sheetToFinish, sheetName);
}

/**
 * Actualiza el cache de progreso.
 * @param {number} newProgress
 * @param {boolean} add
 */
function updateProgress(newProgress, add) {
    const cache = CacheService.getDocumentCache();

    // const scriptProperties = PropertiesService.getScriptProperties();
    let progress = 0;
    if (add) {
        progress = parseInt(cache.get(cacheKeys.progress));
        // progress = parseInt(scriptProperties.getProperty(properties.progress));
    }
    progress += newProgress;
    cache.put(cacheKeys.progress, progress.toString());
    // scriptProperties.setProperty(properties.progress, progress.toString());
}

/**
 * Actualiza el cache de detalles.
 * @param {string} newDetails
 * @param {boolean} append
 */
function updateDetails(newDetails, append) {
    const cache = CacheService.getDocumentCache();
    // const scriptProperties = PropertiesService.getScriptProperties();
    let details = "";
    if (append) {
        details = cache.get(cacheKeys.details);
        // details = scriptProperties.getProperty(properties.details);
    }
    details += newDetails;
    cache.put(cacheKeys.details, details);
    // scriptProperties.setProperty(properties.details, details);
}