/**
 * Añade un nuevo estudiante a la lista, crea su hoja de calificaciones y conecta dicha hoja con el total.
 * 
 * nombre - Arreglo de 2 elementos: Nombre(s), Apellido(s)
 * datos - Diccionario de donde se obtendrán datos para el template.
 */
function addEstudiante(nombre, datos={}) {
  const spreadsheet = SpreadsheetApp.getActive();
  const templateSheet = spreadsheet.getSheetByName(sheetNames.template);
  const addSheet = spreadsheet.getSheetByName(sheetNames.add);

  // El nombre que se utilizará para la hoja
  const nombreCompleto = nombre.join(" ").trim();

  // Cancelamos si el nombre no es válido.
  if( !nombre[0] || !nombre[1] || spreadsheet.getSheetByName(nombreCompleto) ) {
    const ui = SpreadsheetApp.getUi();
    ui.alert('¡Error!', 'Nombre de estudiante faltante o duplicado.', ui.ButtonSet.OK);
    return;
  }

  // ===== Creación de la hoja del estudiante =====

  // Creamos la hoja del estudiante y le damos el nombre.
  const newStudentSheet = templateSheet.copyTo(spreadsheet);
  newStudentSheet.getNamedRanges().forEach( namedRange => namedRange.remove());
  newStudentSheet.setName(nombreCompleto);

  const nombreRange = spreadsheet.getRangeByName(temNombreRangeName);
  const datosRange = spreadsheet.getRangeByName(temDatosRangeName);
  const habilidadesRange = spreadsheet.getRangeByName(temHabilidadesRangeName);
  const observacionesRange = spreadsheet.getRangeByName(temObservacionesRangeName);
  let periodo1CalRange = spreadsheet.getRangeByName(temPeriodo1RangeName);
  let periodo2CalRange = spreadsheet.getRangeByName(temPeriodo2RangeName);
  let periodo3CalRange = spreadsheet.getRangeByName(temPeriodo3RangeName);

  // Insertamos el nombre del estudiante en la hoja.
  newStudentSheet.getRange(nombreRange.getRow(), nombreRange.getColumn(), nombreRange.getHeight(), nombreRange.getWidth())
    .getMergedRanges().forEach( (range, i) => range.setValue(nombre[i]));
  
  // Vaciamos el diccionario de datos en la hoja.
  const studentDatosRange = newStudentSheet.getRange(datosRange.getRow(), datosRange.getColumn(), datosRange.getHeight(), datosRange.getWidth());
  const studentDatos = studentDatosRange.getValues();
  for( const dato of studentDatos ) {
    dato[1] = datos[dato[0]]
  }
  studentDatosRange.setValues(studentDatos);

  // Protejemos la hoja, excepto las secciones editables
  const numMaterias = periodo1CalRange.getHeight() - 3;
  const editableRanges = [
    newStudentSheet.getRange(datosRange.getRow(), datosRange.getColumn()+1, datosRange.getHeight(), datosRange.getWidth()-1),
    newStudentSheet.getRange(habilidadesRange.getRow()+1, habilidadesRange.getColumn()+1, numMaterias, habilidadesRange.getWidth()-1),
    newStudentSheet.getRange(observacionesRange.getRow()+1, observacionesRange.getColumn()+1, numMaterias, observacionesRange.getWidth()-1),
    newStudentSheet.getRange(periodo1CalRange.getRow()+1, periodo1CalRange.getColumn()+1, numMaterias, periodo1CalRange.getWidth()-2),
    newStudentSheet.getRange(periodo2CalRange.getRow()+1, periodo2CalRange.getColumn()+1, numMaterias, periodo2CalRange.getWidth()-2),
    newStudentSheet.getRange(periodo3CalRange.getRow()+1, periodo3CalRange.getColumn()+1, numMaterias, periodo3CalRange.getWidth()-2),
  ];

  const protection = newStudentSheet.protect().setDescription('Calificaciones');
  protection.setUnprotectedRanges(editableRanges);

  const me = Session.getEffectiveUser();
  protection.addEditor(me);
  protection.removeEditors(protection.getEditors());
  if (protection.canDomainEdit()) {
    protection.setDomainEdit(false);
  }
  
  // ===== Creación del estudiatne en el concentrado =====

  // Hacemos espacio para el nuevo estudiante.
  addSheet.insertRowBefore(spreadsheet.getRangeByName(addPeriodo1RangeName).getLastRow() - 1)
  addSheet.insertRowBefore(spreadsheet.getRangeByName(addPeriodo2RangeName).getLastRow() - 1)
  addSheet.insertRowBefore(spreadsheet.getRangeByName(addPeriodo3RangeName).getLastRow() - 1)

  // Seleccionamos los rangos después de hacer espacio para evitar errores.
  const periodo1Range = spreadsheet.getRangeByName(addPeriodo1RangeName);
  const periodo2Range = spreadsheet.getRangeByName(addPeriodo2RangeName);
  const periodo3Range = spreadsheet.getRangeByName(addPeriodo3RangeName);

  const distanceToPeriodo2 = periodo1Range.getRow() - periodo2Range.getRow();
  const distanceToPeriodo3 = periodo1Range.getRow() - periodo3Range.getRow();

  // Insertams el nombre del estudiante en cada periodo.
  periodo1Range.offset(periodo1Range.getHeight()-3, 1, 1, 2).setValues([nombre]);
  periodo2Range.offset(periodo2Range.getHeight()-3, 1, 1, 2).setFormulaR1C1(`=R[${distanceToPeriodo2}]C[0]`);
  periodo3Range.offset(periodo3Range.getHeight()-3, 1, 1, 2).setFormulaR1C1(`=R[${distanceToPeriodo3}]C[0]`);

  // Obtenemos el número de estudiante
  let studentNumber = periodo1Range.offset(periodo1Range.getHeight()-4, 0, 1, 1).getValue();
  if ( !isNaN(parseFloat(studentNumber)) && isFinite(studentNumber) ) {
    studentNumber++;
  } else {
    studentNumber = 1;
  }

  // Escribimos el número de estudiante.
  periodo1Range.offset(periodo1Range.getHeight()-3, 0, 1, 1).setValue(studentNumber);
  periodo2Range.offset(periodo2Range.getHeight()-3, 0, 1, 1).setFormulaR1C1(`=R[${distanceToPeriodo2}]C[0]`);
  periodo3Range.offset(periodo3Range.getHeight()-3, 0, 1, 1).setFormulaR1C1(`=R[${distanceToPeriodo3}]C[0]`);

  // Obtenemos los rangos en la hoja del estudiante donde estarán las calificaciones
  periodo1CalRange = periodo1CalRange.offset(1, periodo1CalRange.getWidth()-1, periodo1CalRange.getHeight()-3);
  periodo2CalRange = periodo2CalRange.offset(1, periodo2CalRange.getWidth()-1, periodo2CalRange.getHeight()-3);
  periodo3CalRange = periodo3CalRange.offset(1, periodo3CalRange.getWidth()-1, periodo3CalRange.getHeight()-3);

  // Creamos la fórmula para copiar las calificaciones a la hoja de concentrados.
  const periodo1CalFormulas = [];
  const periodo2CalFormulas = [];
  const periodo3CalFormulas = [];
  for(let i=0; i<periodo1CalRange.getHeight(); i++) {
    periodo1CalFormulas.push(`'${nombreCompleto}'!R${periodo1CalRange.getRow()+i}C${periodo1CalRange.getColumn()}`);
    periodo2CalFormulas.push(`'${nombreCompleto}'!R${periodo2CalRange.getRow()+i}C${periodo2CalRange.getColumn()}`);
    periodo3CalFormulas.push(`'${nombreCompleto}'!R${periodo3CalRange.getRow()+i}C${periodo3CalRange.getColumn()}`);
  }

  // Insertamos y damos formato a las calificaciones copiadas.
  periodo1Range.offset(periodo1Range.getHeight()-3, 3, 1, periodo1Range.getWidth()-4)
    .setFontWeight('normal').setNumberFormat('0')
    .setFormulasR1C1([periodo1CalFormulas]);
  periodo2Range.offset(periodo2Range.getHeight()-3, 3, 1, periodo2Range.getWidth()-4)
    .setFontWeight('normal').setNumberFormat('0')
    .setFormulasR1C1([periodo2CalFormulas]);
  periodo3Range.offset(periodo3Range.getHeight()-3, 3, 1, periodo3Range.getWidth()-4)
    .setFontWeight('normal').setNumberFormat('0')
    .setFormulasR1C1([periodo3CalFormulas]);
  
  // Insertamos la fórmula para obtener promedios y le damos formato.
  const promedioFormula = '=IFERROR(AVERAGE(R[0]C4:R[0]C[-1]),"SC")';
  periodo1Range.offset(periodo1Range.getHeight()-3, periodo1Range.getWidth()-1, 1, 1)
    .setFormulaR1C1(promedioFormula)
    .setFontWeight('bold').setNumberFormat('0.0');
  periodo2Range.offset(periodo2Range.getHeight()-3, periodo2Range.getWidth()-1, 1, 1)
    .setFormulaR1C1(promedioFormula)
    .setFontWeight('bold').setNumberFormat('0.0');
  periodo3Range.offset(periodo3Range.getHeight()-3, periodo3Range.getWidth()-1, 1, 1)
    .setFormulaR1C1(promedioFormula)
    .setFontWeight('bold').setNumberFormat('0.0');
}

/**
 * Inserta un espacio en blanco después del último estudiante.
 */
function addSpace() {
  const spreadsheet = SpreadsheetApp.getActive();
  const addSheet = spreadsheet.getSheetByName(sheetNames.add);

  // Hacemos espacio.
  addSheet.insertRowBefore(spreadsheet.getRangeByName(addPeriodo1RangeName).getLastRow() - 1)
  addSheet.insertRowBefore(spreadsheet.getRangeByName(addPeriodo2RangeName).getLastRow() - 1)
  addSheet.insertRowBefore(spreadsheet.getRangeByName(addPeriodo3RangeName).getLastRow() - 1)
}