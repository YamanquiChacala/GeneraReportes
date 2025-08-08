/**
 * Añade la lista de asignaturas a la pestaña "Concentrado".
 * 
 * Crea columnas para cada asignatura y coloca los nombres respetando el formato de la hoja.
 * Da formato e inserta la fórmula a la fila de promedio de cada asignatura.
 * Da formato e inserta la fórmula al promedio total.
 */
function addAsignaturasToConcentrado() {
  const spreadsheet = SpreadsheetApp.getActive();
  const addSheet = spreadsheet.getSheetByName(sheetNames.add);
  const asignaturas = getAsignaturas(true, false);

  const progress = 100/4;
  updateDetails("<h4>Concentrado de asignaturas:</h4>", true);
  updateProgress(0);
  updateDetails("<p>Preparando la hoja</p>", true);
  
  // Insertamos columnas para cada materia.
  addSheet.insertColumns(4, asignaturas.length);

  // Esperamos a obtener los rangos aquí, pues cambian al insertar columnas.
  const periodo1Range = spreadsheet.getRangeByName(rangeNames.add.periodo1);
  const periodo2Range = spreadsheet.getRangeByName(rangeNames.add.periodo2);
  const periodo3Range = spreadsheet.getRangeByName(rangeNames.add.periodo3);
  
  updateProgress(progress, true);
  updateDetails("<p>Añadiendo materias</p>", true)

  for( const range of [periodo1Range, periodo2Range, periodo3Range]) {
    //Colocamos los nombres de las materias.
    range.offset(0, 3, 1, asignaturas.length).setValues([asignaturas])
    // Fórmula y formato para el promedio de cada materia. Si no hay datos, se escribe "SC"
    range.offset(range.getHeight()-1, 3, 1, asignaturas.length)
      .setFormulaR1C1('=IFERROR(AVERAGE(R[-2]C[0]:R[-1]C[0]),"SC")')
      .setFontWeight('bold').setNumberFormat('0.0');
    // Fórmula y formato para el promedio total. Si no hay datos se escribe "SC"
    range.offset(range.getHeight()-1, range.getWidth()-1, 1, 1)
      .setFormulaR1C1('=IFERROR(AVERAGE(R[0]C4:R[0]C[-1]),"SC")')
      .setFontWeight('bold').setNumberFormat('0.0');
    
    updateProgress(progress, true);
  }
}

/**
 * Añade la lista de asignaturas al template para estudiantes.
 */
function addAsignaturasToTemplate() {
  const spreadsheet = SpreadsheetApp.getActive();
  const templateSheet = spreadsheet.getSheetByName(sheetNames.template);
  const asignaturas = getAsignaturas(false, true);

  const progress = Math.floor(100/14);
  updateDetails("<h4>Machote de estudiantes:</h4>", true);
  updateProgress(0);

  updateDetails("<p>Preparando la hoja<p/>", true);
  // Insertamos filas para las asignaturas en las diferentes secciones.
  templateSheet.insertRowsAfter(spreadsheet.getRangeByName(rangeNames.template.habilities).getRow(), asignaturas.length);
  templateSheet.insertRowsAfter(spreadsheet.getRangeByName(rangeNames.template.comments).getRow(), asignaturas.length);
  templateSheet.insertRowsAfter(spreadsheet.getRangeByName(rangeNames.template.periodo1).getRow(), asignaturas.length);
  templateSheet.insertRowsAfter(spreadsheet.getRangeByName(rangeNames.template.periodo2).getRow(), asignaturas.length);
  templateSheet.insertRowsAfter(spreadsheet.getRangeByName(rangeNames.template.periodo3).getRow(), asignaturas.length);

  // Actualizamos los rangos con nombre con las nuevas filas insertadas.
  templateSheet.getNamedRanges().forEach( namedRange => {
    if( namedRange.getName() == rangeNames.template.habilities || namedRange.getName() == rangeNames.template.comments) {
      namedRange.setRange(namedRange.getRange().offset(0,0,asignaturas.length+1,namedRange.getRange().getWidth()));
      updateProgress(progress, true); // x2
    }
  });

  // Pedimos los rangos después de insertar filas para tenerlos actulizados.
  const habilidadesRange = spreadsheet.getRangeByName(rangeNames.template.habilities);
  const observacionesRange = spreadsheet.getRangeByName(rangeNames.template.comments);
  const ponderadoRange = spreadsheet.getRangeByName(rangeNames.template.weights);
  const periodo1Range = spreadsheet.getRangeByName(rangeNames.template.periodo1);
  const periodo2Range = spreadsheet.getRangeByName(rangeNames.template.periodo2);
  const periodo3Range = spreadsheet.getRangeByName(rangeNames.template.periodo3);
  const promedioTotalRange = spreadsheet.getRangeByName(rangeNames.template.promedio);

  // Ponemos los nombres de las materias.
  updateDetails("<p>Añadiendo materias</p>", true);
  for( const range of [habilidadesRange, observacionesRange, periodo1Range, periodo2Range, periodo3Range]){
    range.offset(1, 0, asignaturas.length, 1).setValues(asignaturas)
      .setFontColor('black').setFontSize(9);
    updateProgress(progress, true); // x5
  }
  
  // ===== Formato de Habilidades y Observaciones =====
  updateDetails("<p>Dando formato</p>", true);

  // Definimos los valores posibles y formato para las Habilidades.
  const habilidadesDataValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['E','B','S','R'],true).build();
  habilidadesRange.offset(1, 1, asignaturas.length, habilidadesRange.getWidth()-1)
    .setFontColor('black').setFontSize(9).setFontWeight('normal').setDataValidation(habilidadesDataValidation);
  updateProgress(progress, true);

  // Damos espacio y formato para los comentarios.
  observacionesRange.offset(1, 1, asignaturas.length, observacionesRange.getWidth()-1)
    .mergeAcross().setFontColor('black').setFontSize(9).setFontWeight('normal').setHorizontalAlignment('left')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
    .setValue("Escribe aquí tus comentarios, comienza con un comentario positivo, seguido de tus observaciones. Concluye con un comentario alentador, felicitaciones y/o recomendaciones. ¡No te olvides de revisar la ortografía y redacción!\nFORTALEZAS:\nÁREAS DE OPORTUNIDAD:\nSUGERENCIAS:");
  updateProgress(progress, true);
  
  // Quitamos formato y contenido a lineas en blanco.
  const blankLines = [];
  for ( let i=0; i<asignaturas.length; i++) {
    if(!asignaturas[i][0]) blankLines.push(i);
  }

  for( const blankLine of blankLines ) {
    habilidadesRange.offset(1+blankLine,1,1,habilidadesRange.getWidth()-1).clearDataValidations();
    observacionesRange.offset(1+blankLine,1,1,observacionesRange.getWidth()-1).setValue("").breakApart();
  }
  updateProgress(progress, true);

  // ===== Formato de Calificaciones =====

  updateDetails("<p>Asignando fórmulas</p>", true);

  // Fórmula para la calificación de cada materia, en la hoja están los ponderados, escritos en blanco para que no sean visibles.
  const promedioFormula = `IFERROR(ROUND(AVERAGE.WEIGHTED(R[0]C[-3]:R[0]C[-1],R${ponderadoRange.getRow()}C${ponderadoRange.getColumn()}:R${ponderadoRange.getLastRow()}C${ponderadoRange.getLastColumn()})))`;

  for( const range of [periodo1Range, periodo2Range, periodo3Range] ) {
    // Damo formato al espacio para escribir las calificaciones.
    range.offset(1, 1, asignaturas.length, range.getWidth()-2)
      .setFontColor('black').setFontSize(9).setFontWeight('normal');
    // Copiamos la fórmula y damos formato a la calificación.
    range.offset(1, range.getWidth()-1, asignaturas.length, 1)
      .setFontColor('black').setFontSize(9).setFontWeight('bold').setFormulaR1C1(promedioFormula);
    updateProgress(progress, true); // x3
  }
  
  // Extendemos la fórmula del promedio total
  const promedioTotalFormula = promedioTotalRange.offset(promedioTotalRange.getHeight()-1,0,1,1).getFormulaR1C1();
  promedioTotalRange.offset(1,0,promedioTotalRange.getHeight()-3,1)
    .setFontColor('black').setFontSize(9).setFontWeight('bold').setNumberFormat('0.0')
    .setFormulaR1C1(promedioTotalFormula);
  updateProgress(progress, true);
}


/**
 * Añade la lista de materias a la hoja de Estado.
 */
function addAsignaturasToStatus() {
  const spreadsheet = SpreadsheetApp.getActive();
  const statusSheet = spreadsheet.getSheetByName(sheetNames.status);
  const asignaturas = getAsignaturas(true, false);

  updateDetails("<h4>Estatus de llenado:</h4>", true);
  const progress = Math.floor(100/(11 + asignaturas.length));
  updateProgress(0);
  updateDetails("<p>Preparando la hoja</p>", true);
  
  // Si hace falta espacio para las materias, lo agregamos.
  const extraColumnsNeeded = 3 + 4*asignaturas.length - statusSheet.getMaxColumns();
  if(extraColumnsNeeded > 0) {
    statusSheet.insertColumnsAfter(statusSheet.getMaxColumns(), extraColumnsNeeded);
  }
  updateProgress(progress, true);

  // Escribimos los nombres de las materias.
  updateDetails("<p>Añadiendo las materias</p>", true)  
  for( let i=0; i< asignaturas.length; i++) {
    let range = spreadsheet.getRangeByName(rangeNames.status.habilidades);
    range.offset(0, 3+4*i, 2, 4).mergeAcross().setValue(asignaturas[i]);
    for( const rangeName of [rangeNames.status.observaciones, rangeNames.status.periodo1, rangeNames.status.periodo2, rangeNames.status.periodo3]) {
      range = spreadsheet.getRangeByName(rangeName);
      range.offset(0, 3+3*i, 2, 3).mergeAcross().setValue(asignaturas[i]);
    }
    updateProgress(progress, true); // x#asignaturas
  }
  
  // Ajustamos los rangos.
  updateDetails("<p>Ajustando formato</p>", true)
  statusSheet.getNamedRanges().forEach( namedRange => {
    if( namedRange.getName() == rangeNames.status.habilidades ) {
      namedRange.setRange(namedRange.getRange().offset(0, 0, 1, 3+4*asignaturas.length));
      updateProgress(progress, true); // x1
    }
    if( [rangeNames.status.observaciones, rangeNames.status.periodo1, rangeNames.status.periodo2, rangeNames.status.periodo3].includes(namedRange.getName()) ) {
      namedRange.setRange(namedRange.getRange().offset(0, 0, 1, 3+3*asignaturas.length));
      updateProgress(progress, true); // x3
    }
  });

  // Arreglamos el formato alternos.
  const rangesToFix = [rangeNames.status.datos, rangeNames.status.habilidades, rangeNames.status.observaciones, rangeNames.status.periodo1, rangeNames.status.periodo2, rangeNames.status.periodo3];
  for( const rangeName of rangesToFix ){
    const range = spreadsheet.getRangeByName(rangeName);
    const banding = range.getBandings()[0];
    banding.setRange(range);
    range.offset(0, 3, 2, range.getWidth()-3)
      .setBorder(false, false, false, false, true, false, "#efefef", SpreadsheetApp.BorderStyle.SOLID);
    range.offset(1, 3, 1, range.getWidth()-3)
      .clearContent().breakApart();

    
    updateProgress(progress, true); // x6
  }
  
}

/**
 * Crea una hoja para cada estudiante listado en la inicialización.
 */
function addEstudiantesFromInit() {
  const spreadsheet = SpreadsheetApp.getActive();

  updateDetails("<h4>Añadiendo estudiantes:</h4>", true);

  // Obtenemos los nombres de los Datos a anexar a cada estudiante.
  const header = spreadsheet.getRangeByName(rangeNames.init.students).getValues()[0].slice(2);

  // Limpiamos la lista de estudiantes, respetando espacios intermedios.
  const students = getNonEmptyValues(rangeNames.init.students, true);

  for( const student of students ) {
    const nombre = student.toSpliced(2);
    if ( !nombre[0] ) {
      addSpace();
    } else {
      const datos = createDict(header, student.slice(2));
      addEstudiante(nombre, datos);
    }  
  }
}