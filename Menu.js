// @ts-check
/// <reference types="google-apps-script" />

/** 
 * Crea el menú "Generador de Reportes" cuando se abre la hoja de cálculo.
 */
function onOpen() {
  addInitialMenu();
}

/** 
 * El menú inicial sólo tiene el botón para dar authorización al resto.
 */
function addInitialMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu(menuTitle)
    .addItem("Pedir autorización", "requestAuth")
    .addToUi();
}

/**
 * Crea el menú principal.
 * Hay dos versiones. Si la hoja "Initialize" es visible, solo aparece un botón para inicializar.
 * Si la hoja "Initialize" no existe o está oculta, aparece el menú normal.
 */
function addAuthorizedMenu() {
  const ui = SpreadsheetApp.getUi();
  const spreadsheet = SpreadsheetApp.getActive();
  const initSheet = spreadsheet.getSheetByName(initSheetName);
  if( initSheet && !initSheet.isSheetHidden()){
     ui.createMenu(menuTitle)
      .addItem("Inicializar materias y alumnos", "initialize")
      .addToUi();
  } else {
    ui.createMenu(menuTitle)
      .addSubMenu(ui.createMenu("Alumnos")
        .addItem("Añadir nuevo alumno", "addStudent")
        .addItem("Añadir espacio en blanco", "addSpace"))
      .addSubMenu(ui.createMenu("Datos de Alumnos")
        .addItem("Crear nuevo dato", "newData")
        .addItem("Dar valor a un dato para todos los alumnos", "setData"))
      .addSeparator()
      .addSubMenu(ui.createMenu("Reportes")
        .addItem("Reporte de alumno actual", "currentReport")
        .addSeparator()
        .addItem("Todos los reportes", "allReports"))
      .addToUi();
  }
}

/** 
 * Sólo muestra el menú a usuarios authrizados.
 * La lista de usuarios está en el archivo "Constantes".
 * Esta NO es una medidad de seguridad, todos los usuarios pueden ejecutar y modificar el código.
 * Todo lo que esto hace es ocultar el menú a usuarios no autorizados.
 */
function requestAuth() {
  const me = Session.getEffectiveUser().getEmail();
  if ( allowedEditors.includes(me) ){
    addAuthorizedMenu();
  }
}

/**
 * Toma los datos de la hoja "Initialize" y prepara la hoja de cálculo.
 * - Añade las Asignaturas al Concentrado
 * - Añade las Asignaturas al template para alumnos.
 * - Crea una hoja para cada Estudiante
 * - Conecta todas las fórmulas.
 * Esta función tarda un tiempo en terminar.
 * Una vez ejecutada, esta función no debe correrse de nuevo.
 */
function initialize() {
  const spreadsheet = SpreadsheetApp.getActive();
  const initSheet = spreadsheet.getSheetByName(initSheetName);
  const templateSheet = spreadsheet.getSheetByName(templateSheetName);
  const addSheet = spreadsheet.getSheetByName(addSheetName);

  if (!initSheet || !addSheet || !templateSheet || initSheet.isSheetHidden()) return;

  addSheet.activate();
  addAsignaturasToConcentrado();
  addAsignaturasToTemplate();
  addEstudiantesFromInit();

  initSheet.hideSheet();
  templateSheet.hideSheet();
  onOpen();
}

/**
 * Añade un Estudiante.
 * - Pide el nombre del estudiante
 * - Crea una hoja para el Estudiante
 * - Crea espacio para el estudiante en el Concentrado
 * - Conecta las funciones.
 */
function addStudent() {
  const ui = SpreadsheetApp.getUi();
  const nombre = ui.prompt("Nombre(s)", "Sin apellidos", ui.ButtonSet.OK).getResponseText().trim();
  const apellido = ui.prompt("Apellido(s)").getResponseText().trim();
  addEstudiante([nombre, apellido]);
}

/**
 * Añade un espacio a la sección de "Datos" de todos los estudiantes.
 * Sólo añade el espacio, no le da valor.
 */
function newData() {
  const ui = SpreadsheetApp.getUi();
  const respuesta = ui.prompt("Nuevo Dato", "Nombre del dato a añadir", ui.ButtonSet.OK_CANCEL);
  if (respuesta.getSelectedButton() == ui.Button.OK && respuesta.getResponseText().trim() ) {
    addDataRow(respuesta.getResponseText().trim());
  }
}

/**
 * Le da un valor a un "Dato" de todos los estudiantes.
 * Si no existe un renglón de Datos con el nombre dado, no hace nada.
 */
function setData() {
  const ui = SpreadsheetApp.getUi();
  const nombre = ui.prompt("Dato a asignar", "Nombre del dato", ui.ButtonSet.OK_CANCEL);
  if( nombre.getSelectedButton() == ui.Button.CANCEL || !nombre.getResponseText().trim() ) return;

  const valor = ui.prompt("Valor", "Valor a asignar a todos los alumnos", ui.ButtonSet.OK_CANCEL);
  if( valor.getSelectedButton() == ui.Button.CANCEL) return;
  
  setDataValue(nombre.getResponseText().trim(), valor.getResponseText().trim());
}

/**
 * Genera el reporte de la hoja actual.
 */
function currentReport() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const forbiddenSheetNames = [initSheetName, addSheetName, templateSheetName];

  if( forbiddenSheetNames.includes(sheet.getName()) ) {
    const ui = SpreadsheetApp.getUi();
    ui.alert('¡Error!', 'Este no es el reporte de un estudiante', ui.ButtonSet.OK);
    return;
  }

  generateReport(sheet);
}

/**
 * Genera todos los reportes
 */
function allReports() {
  const spreadsheet = SpreadsheetApp.getActive();
  const avoidSheets = [initSheetName, addSheetName, templateSheetName];
  const sheets = spreadsheet.getSheets();

  for (const sheet of sheets) {
    if (avoidSheets.includes(sheet.getName())) continue;
    generateReport(sheet);
  }
}
