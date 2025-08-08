/**
 * Añade un nuevo estudiante a la lista, crea su hoja de calificaciones y conecta dicha hoja con el total y el control.
 * 
 * nombre - Arreglo de 2 elementos: Nombre(s), Apellido(s)
 * datos - Diccionario de donde se obtendrán datos para el template.
 * @param {string[]} nombre
 * @param {object} [datos]
 */
function addEstudiante(nombre, datos={}) {
  const spreadsheet = SpreadsheetApp.getActive();
  const templateSheet = spreadsheet.getSheetByName(sheetNames.template);
  const addSheet = spreadsheet.getSheetByName(sheetNames.add);
  const statusSheet = spreadsheet.getSheetByName(sheetNames.status);

  // El nombre que se utilizará para la hoja
  const nombreCompleto = nombre.join(" ").trim();

  // Cancelamos si el nombre no es válido.
  if( !nombre[0] || !nombre[1] || spreadsheet.getSheetByName(nombreCompleto) ) {
    const ui = SpreadsheetApp.getUi();
    ui.alert('¡Error!', 'Nombre de estudiante faltante o duplicado.', ui.ButtonSet.OK);
    return;
  }

  // ===== Creación de la hoja del estudiante =====

  updateDetails(`<h5>${nombreCompleto}</h5>`, true);
  const progres = Math.floor(100/33);
  updateProgress(0);

  // Creamos la hoja del estudiante y le damos el nombre.
  const newStudentSheet = templateSheet.copyTo(spreadsheet);
  newStudentSheet.getNamedRanges().forEach( namedRange => namedRange.remove());
  newStudentSheet.setName(nombreCompleto);

  const tempNombreRange = spreadsheet.getRangeByName(rangeNames.template.name);
  const tempDatosRange = spreadsheet.getRangeByName(rangeNames.template.data);
  const tempHabilidadesRange = spreadsheet.getRangeByName(rangeNames.template.habilities);
  const tempObservacionesRange = spreadsheet.getRangeByName(rangeNames.template.comments);

  updateProgress(progres, true);
  // ===== Datos ===== 

  updateDetails("<p>Datos</p>", true)
  newStudentSheet.activate();

  // Insertamos el nombre del estudiante en la hoja.
  newStudentSheet.getRange(tempNombreRange.getRow(), tempNombreRange.getColumn(), tempNombreRange.getHeight(), tempNombreRange.getWidth())
    .getMergedRanges().forEach( (range, i) => range.setValue(nombre[i]));
  
  // Vaciamos el diccionario de datos en la hoja.
  const studentDatosRange = newStudentSheet.getRange(tempDatosRange.getRow(), tempDatosRange.getColumn(), tempDatosRange.getHeight(), tempDatosRange.getWidth());
  const studentDatos = studentDatosRange.getValues();
  for( const dato of studentDatos ) {
    dato[1] = datos[dato[0]]
  }
  studentDatosRange.setValues(studentDatos);

  updateProgress(progres, true);

  /** Proteccion 
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
  */
  
  // ===== Creación del estudiatne en el concentrado =====

  updateDetails("<p>Concentrado</p>", true);
  addSheet.activate();

  // Hacemos espacio para el nuevo estudiante.
  for( const rangeName of [rangeNames.add.periodo1, rangeNames.add.periodo2, rangeNames.add.periodo3] ) {
    addSheet.insertRowBefore(spreadsheet.getRangeByName(rangeName).getLastRow() - 1);
    updateProgress(progres, true); // x3
  }

  // Seleccionamos los rangos después de hacer espacio para evitar errores.
  const addPeriodo1Range = spreadsheet.getRangeByName(rangeNames.add.periodo1);
  const addPeriodo2Range = spreadsheet.getRangeByName(rangeNames.add.periodo2);
  const addPeriodo3Range = spreadsheet.getRangeByName(rangeNames.add.periodo3);

  // Obtenemos el número de estudiante
  let studentNumber = addPeriodo1Range.offset(addPeriodo1Range.getHeight()-4, 0, 1, 1).getValue();
  if ( !isNaN(parseFloat(studentNumber)) && isFinite(studentNumber) ) {
    studentNumber++;
  } else {
    studentNumber = 1;
  }

  // Insertams el nombre y número de estudiante en cada periodo.
  for( const range of [addPeriodo1Range, addPeriodo2Range, addPeriodo3Range] ) {
    range.offset(range.getHeight()-3, 1, 1, 2).setValues([nombre]);
    range.offset(range.getHeight()-3, 0, 1, 1).setValue(studentNumber);
    updateProgress(progres, true); // x3
  }

  // Encontramos filas con las materias, para ignorar las vacías.
  const asignaturas = spreadsheet.getRangeByName(rangeNames.template.habilities)
    .offset(1, 0, spreadsheet.getRangeByName(rangeNames.template.habilities).getHeight() - 1, 1)
    .getValues().flat();
  const asignaturasIndex = [];
  for( let i=0; i<asignaturas.length; i++ ) {
    if( asignaturas[i] ) asignaturasIndex.push(i);
  }
  updateProgress(progres, true);

  // Obtenemos los rangos en la hoja del estudiante donde estarán las calificaciones
  const studentPeriodo1CalRangeRaw = spreadsheet.getRangeByName(rangeNames.template.periodo1);
  const studentPeriodo2CalRangeRaw = spreadsheet.getRangeByName(rangeNames.template.periodo2);
  const studentPeriodo3CalRangeRaw = spreadsheet.getRangeByName(rangeNames.template.periodo3);

  const studentPeriodCalRanges = [
    studentPeriodo1CalRangeRaw.offset(1, studentPeriodo1CalRangeRaw.getWidth()-1, studentPeriodo1CalRangeRaw.getHeight()-3, 1),
    studentPeriodo2CalRangeRaw.offset(1, studentPeriodo2CalRangeRaw.getWidth()-1, studentPeriodo2CalRangeRaw.getHeight()-3, 1),
    studentPeriodo3CalRangeRaw.offset(1, studentPeriodo3CalRangeRaw.getWidth()-1, studentPeriodo3CalRangeRaw.getHeight()-3, 1)
  ];

  // Creamos la fórmula para copiar las calificaciones a la hoja de concentrados.
  const calFormulas = [[],[],[]];

  for( const [i, range] of studentPeriodCalRanges.entries() ) {
    for( const index of asignaturasIndex ) {
      calFormulas[i].push(`'${nombreCompleto}'!R${range.getRow()+index}C${range.getColumn()}`);
    }
  }
  updateProgress(progres, true);

  // Creamos la fórmula para obtener promedios.
  const promedioFormula = '=IFERROR(AVERAGE(R[0]C4:R[0]C[-1]),"SC")';
  
  // Insertamos y damos formato a las calificaciones copiadas.
  for( const [i, range] of [addPeriodo1Range, addPeriodo2Range, addPeriodo3Range].entries() ) {
    range.offset(range.getHeight()-3, 3, 1, range.getWidth()-4)
      .setFontWeight('normal').setNumberFormat('0')
      .setFormulasR1C1([calFormulas[i]]);
    range.offset(range.getHeight()-3, range.getWidth()-1, 1, 1)
      .setFontWeight('bold').setNumberFormat('0.0')
      .setFormulaR1C1(promedioFormula);
    updateProgress(progres, true); //x3
  }

  // ===== Creación del estudiatne en el estado =====

  updateDetails("<p>Estado</p>", true);
  statusSheet.activate();
  
  const statusRangeNames = [
    rangeNames.status.datos, 
    rangeNames.status.habilidades, 
    rangeNames.status.observaciones, 
    rangeNames.status.periodo1, 
    rangeNames.status.periodo2, 
    rangeNames.status.periodo3
  ];
  
  // Hacemos espacio para el nuevo estudiante.
  for( let rangeName of statusRangeNames) {
    statusSheet.insertRowAfter(spreadsheet.getRangeByName(rangeName).getLastRow());
    updateProgress(progres, true); // x6
  }

  // Extendemos los rangos con nombre y corfregimos formato de la fila.
  statusSheet.getNamedRanges().forEach(namedRange => {
    if( statusRangeNames.includes(namedRange.getName()) ){
      namedRange.setRange(namedRange.getRange().offset(0, 0, namedRange.getRange().getHeight() + 1));
      namedRange.getRange().offset(1, 0, 1).setFontWeight("bold").setFontSize(9).setFontColor("black").setTextRotation(0)
        .offset(0, 1, 1 ,1).setFontWeight("normal").setHorizontalAlignment("right")
        .offset(0, 1, 1, 1).setHorizontalAlignment("left");
      updateProgress(progres, true); // x6
    }
  });

  // Obtenemos los rangos tras actualizar sus tamaños.
  const statusRanges = [];
  for( const rangeName of statusRangeNames ) {
    statusRanges.push(spreadsheet.getRangeByName(rangeName));
  }

  // Formula para señalar si hace flata algo en el renglón completo.
  const fullCheckmarkFormula = 'IF(COUNTIF(R[0]C[2]:R[0]C[100], "✔️") + COUNTIF(R[0]C2:R[0]C100, "❌") = 0, "", IF(COUNTIF(R[0]C2:R[0]C100, "❌") > 0, "❌", "✔️"))';

  // Insertams la formula y el nombre del estudiante en cada seccion.
  for( const range of statusRanges ) {
    range.offset(range.getHeight()-1, 0, 1, 1).setFormulaR1C1(fullCheckmarkFormula);
    range.offset(range.getHeight()-1, 1, 1, 2).setValues([nombre]);
  }
  updateProgress(progres, true);

  // Creamos las fórmulas para el estado.
  const datosFormulas = [[],[],[],[],[],[]];

  // La fórmula para los datos.
  const datosStartingCell = tempDatosRange.offset(0, 1, 1, 1);
  for( let i=0; i<tempDatosRange.getHeight(); i++) {
    datosFormulas[indexPos.status.datos].push(`IF(REGEXMATCH(TO_TEXT('${nombreCompleto}'!R${datosStartingCell.getRow()+i}C${datosStartingCell.getColumn()}), "^\\s*$"), "❌", "✔️")`);
  }
  
  // La fórmula para las habilidades.
  const habilidadesStartingCell = tempHabilidadesRange.offset(1,1,1,1);
  for( const asignaturaIndex of asignaturasIndex) {
    for( let i=0; i<4; i++){
      datosFormulas[indexPos.status.habilidades].push(`IF(ISNUMBER(MATCH(TRUE,ARRAYFORMULA(EXACT('${nombreCompleto}'!R${habilidadesStartingCell.getRow()+asignaturaIndex}C${habilidadesStartingCell.getColumn()+i}, {"E","B","S","R"})), 0)), "✔️", "❌")`);
    }
  }

  // Fórmula para las observaciones.
  const observacionesStartingCell = tempObservacionesRange.offset(1,1,1,1);
  for( const asignaturaIndex of asignaturasIndex) {
    datosFormulas[indexPos.status.observaciones].push(`IF(REGEXMATCH(TO_TEXT('${nombreCompleto}'!R${observacionesStartingCell.getRow()+asignaturaIndex}C${observacionesStartingCell.getColumn()}),"^[\\W\\d]*$|Escribe aqu"), "❌", "✔️")`);
  }

  // Fórmulas para las calificaciones.
  const calsStartingCells = [
    spreadsheet.getRangeByName(rangeNames.template.periodo1).offset(1,1,1,1),
    spreadsheet.getRangeByName(rangeNames.template.periodo2).offset(1,1,1,1),
    spreadsheet.getRangeByName(rangeNames.template.periodo3).offset(1,1,1,1)
  ];
  for( const [periodoIndex, startingCell] of calsStartingCells.entries() ) {
    for( const asignaturaIndex of asignaturasIndex) {
      for( let i=0; i<3; i++) {
        datosFormulas[indexPos.status.periodo1 + periodoIndex].push(`IF(AND(ISNUMBER('${nombreCompleto}'!R${startingCell.getRow()+asignaturaIndex}C${startingCell.getColumn()+i}), ISBETWEEN('${nombreCompleto}'!R${startingCell.getRow()+asignaturaIndex}C${startingCell.getColumn()+i},0,10)), "✔️", "❌")`);
      }
    }
  }
  updateProgress(progres, true);

  // Colocamos las fórmulas (excepto observaciones) en la página de estado.
  for( const [index, range] of statusRanges.entries() ) {
    if (index != indexPos.status.observaciones) {
      range.offset(range.getHeight()-1, 3, 1, range.getWidth()-3).setFormulasR1C1([datosFormulas[index]]);
      updateProgress(progres, true); // x5
    }
  }
  

  // Fundimos las celdas para las observaciones y colocalmos las fórmulas.
  const statusObservacionesRange = statusRanges[indexPos.status.observaciones].offset(statusRanges[indexPos.status.observaciones].getHeight()-1, 3, 1, statusRanges[indexPos.status.observaciones].getWidth()-3);
  for( let i=0; i<statusObservacionesRange.getWidth()/3; i++) {
    statusObservacionesRange.offset(0, 3*i, 1, 3).merge()
      .setFormulaR1C1(datosFormulas[indexPos.status.observaciones][i]);
  }
  updateProgress(progres, true);
}

/**
 * Inserta un espacio en blanco después del último estudiante.
 */
function addSpace() {
  const spreadsheet = SpreadsheetApp.getActive();
  const addSheet = spreadsheet.getSheetByName(sheetNames.add);
  const statusSheet = spreadsheet.getSheetByName(sheetNames.status);

  updateDetails("<h5>Añadiendo espacio</h5>", true);
  const progress = Math.floor(100/15);
  updateProgress(0);
  // ====== Concentrado ======
  addSheet.activate();

  // Hacemos espacio en el concentrado.
  for( let rangeName of [rangeNames.add.periodo1, rangeNames.add.periodo2, rangeNames.add.periodo3] ) {
    addSheet.insertRowBefore(spreadsheet.getRangeByName(rangeName).getLastRow() - 1);
    updateProgress(progress, true); // x3
  }

  // ===== Estado ======
  statusSheet.activate();

  const statusRangeNames = [
    rangeNames.status.datos, 
    rangeNames.status.habilidades, 
    rangeNames.status.observaciones, 
    rangeNames.status.periodo1, 
    rangeNames.status.periodo2, 
    rangeNames.status.periodo3
  ];
  
  // Hacemos espacio en el estado.
  for( let rangeName of statusRangeNames) {
    statusSheet.insertRowAfter(spreadsheet.getRangeByName(rangeName).getLastRow());
    updateProgress(progress, true); // x6
  }

  // Extendemos los rangos con nombre.
  statusSheet.getNamedRanges().forEach(namedRange => {
    if( statusRangeNames.includes(namedRange.getName()) ){
      namedRange.setRange(namedRange.getRange().offset(0, 0, namedRange.getRange().getHeight() + 1));
      updateProgress(progress, true); // x6
    }
  });
}