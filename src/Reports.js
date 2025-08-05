/**
 * Genera el reporte de la hoja dada.
 * 
 * Saca la información de la hoja y la coloca en una copia del documento "reportTemplateName".
 * Coloca en rojo calificaciones reprobatorias: <6 y R
 */
function generateReport(sheet) {
  const name = sheet.getName();
  const reportFile = createReportFile(name);

  if( !reportFile ) return;

  const sheetData = getValueDictionary(sheet);

  const reportDoc = DocumentApp.openById(reportFile.getId());
  const reportText = reportDoc.getBody();

  for (const key in sheetData) {
    if (key != 'Faltas' && (sheetData[key] == 'R' || sheetData[key] < 6)) {
      const found = reportText.findText(`{${key}}`);
      if(found) {
        const element = found.getElement().asText();
        if (found.isPartial()) {
          const start = found.getStartOffset();
          const end = found.getEndOffsetInclusive();
          element.setForegroundColor(start, end, '#FF0000');
        } else {
          element.setForegroundColor('#FF0000');
        }
      }
    }
    reportText.replaceText(`{${key}}`, sheetData[key]);
  }
  reportDoc.saveAndClose();
}

/**
 * Crea y regresa una copia del machote de reporte.
 * El machote debe tener el nombre definido en "reportTemplateName" y estar en la misma carpeta que esta hoja.
 * Si ya existe un archivo con el mismo nombre, este se elimina antes de crear el nuevo.
 */
function createReportFile(name) {
  const spreadsheet = SpreadsheetApp.getActive();
  const parent = DriveApp.getFileById(spreadsheet.getId()).getParents().next();

  let searchParam = `title = "${reportTemplateName}"`;
  let searchResults = parent.searchFiles(searchParam);

  if (!searchResults.hasNext()) return;

  const templateFile = searchResults.next();

  searchParam = `title = "${name}"`;
  searchResults = parent.searchFiles(searchParam);

  while (searchResults.hasNext()) {
    const oldFile = searchResults.next();
    oldFile.setTrashed(true);
  }

  return templateFile.makeCopy(name);  
}

/**
 * Regresa un diccioario con todos los datos y calificacioens de la hoja de un estudiante.
 * 
 * Contenido del diccionario:
 * - Nombres
 * - Apellidos
 * - Datos: Cada dato con la etiqueta que aparece en la hoja
 * - Habilidades: En formato a{i}h{j} donde 
 *    i es el índice de la asignatura, y 
 *    j el índice de la habilidad, ambos iniciando en 1.
 * - Comentarios: En formato a{i}c, donde
 *    i es el índice de la asignatura, iniciando en 1.
 * - Calificaciones: En formato a{i}p{j} donde
 *    i es el índice de la asignatura, y 
 *    j es el índice del período, ambos iniciando en 1.
 * - Promedio por materia: En formato a{i}f donde
 *    i es el índice de la asignatura, iniciando en 1.
 * - Promedio por periodo: En formato fp{i} donde
 *    i es el índice del periodo
 * - Promedio total: ff
 */
function getValueDictionary(sheet) {
  const spreadsheet = SpreadsheetApp.getActive();

  const nombreRange = spreadsheet.getRangeByName(rangeNames.template.name);
  const datosRange = spreadsheet.getRangeByName(rangeNames.template.data);
  const habilidadesRange = spreadsheet.getRangeByName(rangeNames.template.habilities);
  const observacionesRange = spreadsheet.getRangeByName(rangeNames.template.comments);
  const periodo1CalRange = spreadsheet.getRangeByName(rangeNames.template.periodo1);
  const periodo2CalRange = spreadsheet.getRangeByName(rangeNames.template.periodo2);
  const periodo3CalRange = spreadsheet.getRangeByName(rangeNames.template.periodo3);
  const promedioCalRange = spreadsheet.getRangeByName(rangeNames.template.promedio);

  // Inicializamos el diccionario a regresar.
  const valores = {};

  // Guardamos los nombres y apellidos (en mayúsculas)
  sheet.getRange(nombreRange.getRow(), nombreRange.getColumn(), nombreRange.getHeight(), nombreRange.getWidth())
    .getMergedRanges().forEach( (range, i) => {
      let label;
      if ( i == 0) {
        label = "Nombres";
      } else {
        label = "Apellidos";
      }
      valores[label] = range.getValue().toUpperCase();
    });
  
  // ===== Datos =====

  const datos = sheet.getRange(datosRange.getRow(), datosRange.getColumn(), datosRange.getHeight(), datosRange.getWidth()).getValues();

  for( const dato of datos ){
    valores[dato[0]] = dato[1];
  }

  // Índice para transversar las asignaturas.
  let asignaturaIndex;

  // ===== Habilidades =====

  const habilidadesValues = sheet.getRange(habilidadesRange.getRow()+1, habilidadesRange.getColumn(), habilidadesRange.getHeight()-1, habilidadesRange.getWidth()).getValues();

  asignaturaIndex = 0;
  for( const asignaturaHabilidadesValues of habilidadesValues ){
    if(!asignaturaHabilidadesValues[0]) continue; // Salta filas vacías.
    asignaturaIndex++;
    for ( let i=1; i<asignaturaHabilidadesValues.length; i++) { // 0 es el nombre de la materia.
      valores[`a${asignaturaIndex}h${i}`] = asignaturaHabilidadesValues[i];
    }
  }

  // ===== Observaciones =====

  const observacionesValues = sheet.getRange(observacionesRange.getRow()+1, observacionesRange.getColumn(), observacionesRange.getHeight()-1, observacionesRange.getWidth()).getValues();

  asignaturaIndex = 0;
  for( const asignaturaObservaciones of observacionesValues ){
    if( !asignaturaObservaciones[0] ) continue; // Salta filas vacías
    asignaturaIndex++;
    valores[`a${asignaturaIndex}c`] = asignaturaObservaciones[1];
  }

  // ===== Calificaciones =====

  const nombresAsignaturas = sheet.getRange(periodo1CalRange.getRow()+1, periodo1CalRange.getColumn(), periodo1CalRange.getHeight()-1, 1).getValues();

  const periodo1Cals = sheet.getRange(periodo1CalRange.getRow()+1, periodo1CalRange.getLastColumn(), periodo1CalRange.getHeight()-1, 1).getValues();
  const periodo2Cals = sheet.getRange(periodo2CalRange.getRow()+1, periodo2CalRange.getLastColumn(), periodo2CalRange.getHeight()-1, 1).getValues();
  const periodo3Cals = sheet.getRange(periodo3CalRange.getRow()+1, periodo3CalRange.getLastColumn(), periodo3CalRange.getHeight()-1, 1).getValues();
  const promedioCals = sheet.getRange(promedioCalRange.getRow()+1, promedioCalRange.getLastColumn(), promedioCalRange.getHeight()-1, 1).getValues();

  asignaturaIndex = 0;
  for (let i = 0; i<nombresAsignaturas.length-2; i++) {
    if( !nombresAsignaturas[i][0] ) continue; // Salta filas vacías
    asignaturaIndex++;
    valores[`a${asignaturaIndex}p1`] = periodo1Cals[i][0];
    valores[`a${asignaturaIndex}p2`] = periodo2Cals[i][0];
    valores[`a${asignaturaIndex}p3`] = periodo3Cals[i][0];
    valores[`a${asignaturaIndex}f`] = promedioCals[i][0];
  }

  valores['fp1'] = periodo1Cals[periodo1Cals.length-1][0];
  valores['fp2'] = periodo2Cals[periodo2Cals.length-1][0];
  valores['fp3'] = periodo3Cals[periodo3Cals.length-1][0];
  valores['ff'] = promedioCals[promedioCals.length-1][0];
  
  return valores;
}
