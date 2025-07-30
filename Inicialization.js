/**
 * Añade la lista de asignaturas a la pestaña "Concentrado".
 * 
 * Crea columnas para cada asignatura y coloca los nombres respetando el formato de la hoja.
 * Da formato e inserta la fórmula a la fila de promedio de cada asignatura.
 * Da formato e inserta la fórmula al promedio total.
 */
function addAsignaturasToConcentrado() {
  const spreadsheet = SpreadsheetApp.getActive();
  const addSheet = spreadsheet.getSheetByName(addSheetName);
  const asignaturas = getAsignaturas(true);

  // Insertamos columnas para cada materia.
  addSheet.insertColumns(4, asignaturas.length);

  // Escondemos columnas sin título.
  for(let i=0; i< asignaturas.length; i++) {
    if(!asignaturas[i]){
      addSheet.setColumnWidth(i+4, 1);
      addSheet.hideColumns(i+4);
    }
  }

  // Esperamos a obtener los rangos aquí, pues cambian al insertar columnas.
  const periodo1Range = spreadsheet.getRangeByName(addPeriodo1RangeName);
  const periodo2Range = spreadsheet.getRangeByName(addPeriodo2RangeName);
  const periodo3Range = spreadsheet.getRangeByName(addPeriodo3RangeName);

  // Calculamos el espacio entre secciones, para no repetir los títulos.
  const distanceToPeriodo2 = periodo1Range.getRow() - periodo2Range.getRow();
  const distanceToPeriodo3 = periodo1Range.getRow() - periodo3Range.getRow();

  // Insertamos los nombres de las asignaturas, y los copiamos a cada periodo.
  periodo1Range.offset(0, 3, 1, asignaturas.length).setValues([asignaturas]);
  periodo2Range.offset(0, 3, 1, asignaturas.length).setFormulaR1C1(`=R[${distanceToPeriodo2}]C[0]`)
  periodo3Range.offset(0, 3, 1, asignaturas.length).setFormulaR1C1(`=R[${distanceToPeriodo3}]C[0]`)

  // Fórmula y formato para el promedio de cada materia. Si no hay datos, se escribe "SC"
  periodo1Range.offset(periodo1Range.getHeight()-1, 3, 1, asignaturas.length)
    .setFormulaR1C1('=IFERROR(AVERAGE(R[-2]C[0]:R[-1]C[0]),"SC")')
    .setFontWeight('bold').setNumberFormat('0.0');
  periodo2Range.offset(periodo2Range.getHeight()-1, 3, 1, asignaturas.length)
    .setFormulaR1C1('=IFERROR(AVERAGE(R[-2]C[0]:R[-1]C[0]),"SC")')
    .setFontWeight('bold').setNumberFormat('0.0');
  periodo3Range.offset(periodo3Range.getHeight()-1, 3, 1, asignaturas.length)
    .setFormulaR1C1('=IFERROR(AVERAGE(R[-2]C[0]:R[-1]C[0]),"SC")')
    .setFontWeight('bold').setNumberFormat('0.0');

  // Fórmula y formato para el promedio total. Si no hay datos se escribe "SC"
  periodo1Range.offset(periodo1Range.getHeight()-1, periodo1Range.getWidth()-1, 1, 1)
    .setFormulaR1C1('=IFERROR(AVERAGE(R[0]C4:R[0]C[-1]),"SC")')
    .setFontWeight('bold').setNumberFormat('0.0');
  periodo2Range.offset(periodo2Range.getHeight()-1, periodo2Range.getWidth()-1, 1, 1)
    .setFormulaR1C1('=IFERROR(AVERAGE(R[0]C4:R[0]C[-1]),"SC")')
    .setFontWeight('bold').setNumberFormat('0.0');
  periodo3Range.offset(periodo3Range.getHeight()-1, periodo3Range.getWidth()-1, 1, 1)
    .setFormulaR1C1('=IFERROR(AVERAGE(R[0]C4:R[0]C[-1]),"SC")')
    .setFontWeight('bold').setNumberFormat('0.0');
}

/**
 * Añade la lista de asignaturas al template para estudiantes.
 */
function addAsignaturasToTemplate() {
  const spreadsheet = SpreadsheetApp.getActive();
  const templateSheet = spreadsheet.getSheetByName(templateSheetName);
  const asignaturas = getAsignaturas(false);

  // Encontramos las separaciones entre asignaturas.
  const flatAsignaturas = getAsignaturas(true)
  const blankLines = [];
  for (let i=0; i<flatAsignaturas.length; i++) {
    if(!flatAsignaturas[i]) blankLines.push(i);
  }

  // Insertamos filas para las asignaturas en las diferentes secciones.
  templateSheet.insertRowsAfter(spreadsheet.getRangeByName(temHabilidadesRangeName).getRow(), asignaturas.length);
  templateSheet.insertRowsAfter(spreadsheet.getRangeByName(temObservacionesRangeName).getRow(), asignaturas.length);
  templateSheet.insertRowsAfter(spreadsheet.getRangeByName(temPeriodo1RangeName).getRow(), asignaturas.length);
  templateSheet.insertRowsAfter(spreadsheet.getRangeByName(temPeriodo2RangeName).getRow(), asignaturas.length);
  templateSheet.insertRowsAfter(spreadsheet.getRangeByName(temPeriodo3RangeName).getRow(), asignaturas.length);

  // Actualizamos los rangos con nombre con las nuevas filas insertadas.
  templateSheet.getNamedRanges().forEach( namedRange => {
    if( namedRange.getName() == temHabilidadesRangeName || namedRange.getName() == temObservacionesRangeName) {
      namedRange.setRange(namedRange.getRange().offset(0,0,asignaturas.length+1,namedRange.getRange().getWidth()));
    }
  });

  // Definimos los rangos después de insertar filas para evitar problemas.
  const habilidadesRange = spreadsheet.getRangeByName(temHabilidadesRangeName);
  const observacionesRange = spreadsheet.getRangeByName(temObservacionesRangeName);
  const ponderadoRange = spreadsheet.getRangeByName(temPonderadoRangeName);
  const periodo1Range = spreadsheet.getRangeByName(temPeriodo1RangeName);
  const periodo2Range = spreadsheet.getRangeByName(temPeriodo2RangeName);
  const periodo3Range = spreadsheet.getRangeByName(temPeriodo3RangeName);
  const promedioTotalRange = spreadsheet.getRangeByName(temPromedioRangeName);

  // ===== Nombres de las Asignaturas =====

  // Calculamos el espacio entre secciones, para no repetir los títulos.
  const distanceToObservacioens = habilidadesRange.getRow() - observacionesRange.getRow();
  const distanceToPeriodo1 = habilidadesRange.getRow() - periodo1Range.getRow();
  const distanceToPeriodo2 = habilidadesRange.getRow() - periodo2Range.getRow();
  const distanceToPeriodo3 = habilidadesRange.getRow() - periodo3Range.getRow();

  // Escribimos los nombres de las materias en cada sección, con su formato.
  habilidadesRange.offset(1,0,asignaturas.length,1).setValues(asignaturas)
    .setFontColor('black').setFontSize(9);
  observacionesRange.offset(1,0,asignaturas.length,1).setFormulaR1C1(`=R[${distanceToObservacioens}]C[0]`)
    .setFontColor('black').setFontSize(9);
  periodo1Range.offset(1,0,asignaturas.length,1).setFormulaR1C1(`=R[${distanceToPeriodo1}]C[0]`)
    .setFontColor('black').setFontSize(9);
  periodo2Range.offset(1,0,asignaturas.length,1).setFormulaR1C1(`=R[${distanceToPeriodo2}]C[0]`)
    .setFontColor('black').setFontSize(9);
  periodo3Range.offset(1,0,asignaturas.length,1).setFormulaR1C1(`=R[${distanceToPeriodo3}]C[0]`)
    .setFontColor('black').setFontSize(9);
  
  // ===== Formato de Habilidades y Observaciones =====

  // Definimos los valores posibles y formato para las Habilidades.
  const habilidadesDataValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['E','B','S','R'],true).build();
  habilidadesRange.offset(1,1,asignaturas.length,habilidadesRange.getWidth()-1)
    .setFontColor('black').setFontSize(9).setFontWeight('normal').setDataValidation(habilidadesDataValidation);

  // Damos espacio y formato para los comentarios.
  observacionesRange.offset(1,1,asignaturas.length,observacionesRange.getWidth()-1)
    .mergeAcross().setFontColor('black').setFontSize(9).setFontWeight('normal').setHorizontalAlignment('left')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
    .setValue("Escribe aquí tus comentarios, comienza con un comentario positivo, seguido de tus observaciones. Concluye con un comentario alentador, felicitaciones y/o recomendaciones. ¡No te olvides de revisar la ortografía y redacción!\nFORTALEZAS:\nÁREAS DE OPORTUNIDAD:\nSUGERENCIAS:");

  // Quitamos formato y contenido a lineas en blanco.
  for( const blankLine of blankLines ) {
    habilidadesRange.offset(1+blankLine,1,1,habilidadesRange.getWidth()-1).clearDataValidations();
    observacionesRange.offset(1+blankLine,1,1,observacionesRange.getWidth()-1).setValue("").breakApart();
  }

  // ===== Formato de Calificaciones =====

  // Damo formato al espacio para escribir las calificaciones.
  periodo1Range.offset(1,1,asignaturas.length,periodo1Range.getWidth()-2)
    .setFontColor('black').setFontSize(9).setFontWeight('normal');
  periodo2Range.offset(1,1,asignaturas.length,periodo2Range.getWidth()-2)
    .setFontColor('black').setFontSize(9).setFontWeight('normal');
  periodo3Range.offset(1,1,asignaturas.length,periodo3Range.getWidth()-2)
    .setFontColor('black').setFontSize(9).setFontWeight('normal');

  // Fórmula para la calificación de cada materia, en la hoja están los ponderados.
  const promedioFormula = `IFERROR(ROUND(AVERAGE.WEIGHTED(R[0]C[-3]:R[0]C[-1],R${ponderadoRange.getRow()}C${ponderadoRange.getColumn()}:R${ponderadoRange.getLastRow()}C${ponderadoRange.getLastColumn()})))`;

  // Copiamos la fórmula y damos formato a la calificación.
  periodo1Range.offset(1,periodo1Range.getWidth()-1, asignaturas.length, 1)
    .setFontColor('black').setFontSize(9).setFontWeight('bold').setFormulaR1C1(promedioFormula);
  periodo2Range.offset(1,periodo2Range.getWidth()-1, asignaturas.length, 1)
    .setFontColor('black').setFontSize(9).setFontWeight('bold').setFormulaR1C1(promedioFormula);
  periodo3Range.offset(1,periodo3Range.getWidth()-1, asignaturas.length, 1)
    .setFontColor('black').setFontSize(9).setFontWeight('bold').setFormulaR1C1(promedioFormula);
  
  // Extendemos la fórmula del promedio total
  const promedioTotalFormula = promedioTotalRange.offset(promedioTotalRange.getHeight()-1,0,1,1).getFormulaR1C1();
  promedioTotalRange.offset(1,0,promedioTotalRange.getHeight()-3,1)
    .setFontColor('black').setFontSize(9).setFontWeight('bold').setNumberFormat('0.0')
    .setFormulaR1C1(promedioTotalFormula);
}

/**
 * Crea una hoja para cada estudiante listado en la inicialización.
 */
function addEstudiantesFromInit() {
  const spreadsheet = SpreadsheetApp.getActive();

  // Obtenemos los nombres de los Datos a anexar a cada estudiante.
  const header = spreadsheet.getRangeByName(initEstudiantesRangeName).getValues()[0].slice(2);

  // Limpiamos la lista de estudiantes, respetando espacios intermedios.
  const students = getNonEmptyValues(initEstudiantesRangeName);

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