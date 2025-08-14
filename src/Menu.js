/** Título */
const menuTitle = "📃 Generador de Reportes";

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
        .addItem("🪪 Pedir autorización", "requestAuth")
        .addItem("Test", "test")
        .addToUi();
}

/**
 * Crea el menú principal.
 * Hay dos versiones. Si la hoja "Initialize" es visible, solo aparece un botón para inicializar.
 * Si la hoja "Initialize" está oculta, aparece el menú normal.
 */
function addAuthorizedMenu() {
    const ui = SpreadsheetApp.getUi();
    const spreadsheet = SpreadsheetApp.getActive();
    const initSheet = spreadsheet.getSheetByName(sheetNames.init);
    if (initSheet && !initSheet.isSheetHidden()) {
        ui.createMenu(menuTitle)
            .addItem("🏁 Inicializar materias y alumnos", "initialize")
            .addToUi();
    } else {
        const status = ["📕 ", "📖 "]

        const datosText = (isProtected(protectedSection.datos) ? status[0] : status[1]) + "Datos"
        const habilidadesText = (isProtected(protectedSection.habilidades) ? status[0] : status[1]) + "Habilidades"
        const observacionesText = (isProtected(protectedSection.observaciones) ? status[0] : status[1]) + "Observaciones"
        const periodo1Text = (isProtected(protectedSection.periodo1) ? status[0] : status[1]) + "Primer periodo"
        const periodo2Text = (isProtected(protectedSection.periodo2) ? status[0] : status[1]) + "Segundo periodo"
        const periodo3Text = (isProtected(protectedSection.periodo3) ? status[0] : status[1]) + "Tercer periodo"

        ui.createMenu(menuTitle)
            .addSubMenu(ui.createMenu("🎒 Alumnos")
                .addItem("➕ Añadir nuevo alumno", "addStudent")
                .addItem("➖ Añadir espacio en blanco", "addSpace"))
            .addSubMenu(ui.createMenu("🗃️ Datos de alumnos")
                .addItem("➕ Crear nuevo dato", "newData")
                .addItem("📝 Dar valor a un dato para todos los alumnos", "setData"))
            .addSubMenu(ui.createMenu("🏫 Control de periodos")
                .addItem("✏️ Borrar observaciones", "erraseComments")
                .addSeparator()
                .addSubMenu(ui.createMenu("🛡️ Secciones protegidas")
                    .addItem(datosText, "toggleDatos")
                    .addItem(habilidadesText, "toggleHabilidades")
                    .addItem(observacionesText, "toggleObservaciones")
                    .addItem(periodo1Text, "togglePeriodo1")
                    .addItem(periodo2Text, "togglePeriodo2")
                    .addItem(periodo3Text, "togglePeriodo3")))
            .addSeparator()
            .addSubMenu(ui.createMenu("📜 Reportes")
                .addItem("🙋 Reporte de alumno actual", "currentReport")
                .addSeparator()
                .addItem("💯 Todos los reportes", "allReports"))
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
    if (allowedEditors.includes(me)) {
        addAuthorizedMenu();
    } else {
        addInitialMenu();
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
    const initSheet = spreadsheet.getSheetByName(sheetNames.init);
    const templateSheet = spreadsheet.getSheetByName(sheetNames.template);
    const addSheet = spreadsheet.getSheetByName(sheetNames.add);
    const statusSheet = spreadsheet.getSheetByName(sheetNames.status);

    if (!initSheet || !addSheet || !statusSheet || !templateSheet || initSheet.isSheetHidden()) return;

    showWaitDialog("Inicializando");

    const scriptProperties = PropertiesService.getScriptProperties();

    addSheet.activate();
    addAsignaturasToConcentrado();

    statusSheet.activate();
    addAsignaturasToStatus();

    templateSheet.activate();
    addAsignaturasToTemplate();

    addEstudiantesFromInit();
}

/**
 * Una vez que los estudinates se añadan, se llama esta función para terminar la inicialización.
 */
function finishInitialization() {
    const spreadsheet = SpreadsheetApp.getActive();
    const initSheet = spreadsheet.getSheetByName(sheetNames.init);
    const templateSheet = spreadsheet.getSheetByName(sheetNames.template);
    const statusSheet = spreadsheet.getSheetByName(sheetNames.status);

    updateSheetProtections();

    initSheet.hideSheet();
    templateSheet.hideSheet();
    statusSheet.setRowHeight(1, 65);
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

    showWaitDialog("Creando Estudiante");

    addEstudiante([nombre, apellido]);
    updateSheetProtections();
}

/**
 * Añade un espacio a la sección de "Datos" de todos los estudiantes.
 * Sólo añade el espacio, no le da valor.
 */
function newData() {
    const ui = SpreadsheetApp.getUi();
    const respuesta = ui.prompt("Nuevo Dato", "Nombre del dato a añadir", ui.ButtonSet.OK_CANCEL);
    if (respuesta.getSelectedButton() == ui.Button.OK && respuesta.getResponseText().trim()) {
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
    if (nombre.getSelectedButton() == ui.Button.CANCEL || !nombre.getResponseText().trim()) return;

    const valor = ui.prompt("Valor", "Valor a asignar a todos los alumnos", ui.ButtonSet.OK_CANCEL);
    if (valor.getSelectedButton() == ui.Button.CANCEL) return;

    setDataValue(nombre.getResponseText().trim(), valor.getResponseText().trim());
}

/**
 * Borra los comentarios de todos los alumnos.
 */
function erraseComments() {
    const ui = SpreadsheetApp.getUi();
    const respuesta = ui.alert("¿Borrar TODOS los comentarios?", "¿Estás seguro que quieres borrar TODOS los comentarios?", ui.ButtonSet.YES_NO);
    if (respuesta == ui.Button.NO) return;

    showWaitDialog("Borrando comentarios");

    removeComments();
}

/**
 * Cambia la proteción de la sección de datos.
 */
function toggleDatos() {
    toggleProtected(protectedSection.datos);
    menuUpdateProtections();
}

/**
 * Cambia la proteción de la sección de habilidades.
 */
function toggleHabilidades() {
    toggleProtected(protectedSection.habilidades);
    menuUpdateProtections();
}

/**
 * Cambia la proteción de la sección de observaciones.
 */
function toggleObservaciones() {
    toggleProtected(protectedSection.observaciones);
    menuUpdateProtections();
}

/**
 * Cambia la proteción de la sección del periodo 1.
 */
function togglePeriodo1() {
    toggleProtected(protectedSection.periodo1);
    menuUpdateProtections();
}

/**
 * Cambia la proteción de la sección del periodo 2.
 */
function togglePeriodo2() {
    toggleProtected(protectedSection.periodo2);
    menuUpdateProtections();
}

/**
 * Cambia la proteción de la sección del periodo 3.
 */
function togglePeriodo3() {
    toggleProtected(protectedSection.periodo3);
    menuUpdateProtections();
}

/**
 * Actualiza las secciones protegidas.
 */
function menuUpdateProtections() {
    showWaitDialog("Actualizando protecciones");

    updateSheetProtections();
}

/**
 * Genera el reporte de la hoja actual.
 */
function currentReport() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const forbiddenSheetNames = Object.values(sheetNames)

    if (forbiddenSheetNames.includes(sheet.getName())) {
        const ui = SpreadsheetApp.getUi();
        ui.alert('¡Error!', 'Este no es el reporte de un estudiante', ui.ButtonSet.OK);
        return;
    }

    showWaitDialog("Generando Reporte");

    generateReport(sheet);
}

/**
 * Genera todos los reportes
 */
function allReports() {
    const spreadsheet = SpreadsheetApp.getActive();
    const properties = PropertiesService.getDocumentProperties();
    const avoidSheets = Object.values(sheetNames);
    const sheets = spreadsheet.getSheets();

    showWaitDialog("Generando Reportes");

    const studentSheetNames = [];

    for (const sheet of sheets) {
        if (avoidSheets.includes(sheet.getName())) continue;
        studentSheetNames.push(sheet.getName());
    }

    properties.setProperty(propertyKeys.sheets, JSON.stringify(studentSheetNames));
    properties.setProperty(propertyKeys.sheetIndex, "0");

    splitGenerateReports();
}

function test() {
    showWaitDialog("Inicializando");
}