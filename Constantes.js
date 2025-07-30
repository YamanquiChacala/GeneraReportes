// @ts-check
/// <reference types="google-apps-script" />

/** Quien puede ver el menú */
const allowedEditors = [
  "info@chacala.school",
  "yamanqui@chacala.school",
  "erika@chacala.school"
];

/** Menu */
const menuTitle = "Generador de Reportes";

/** Reportes */
const reportTemplateName = "__Template__";

/** Nombre de la hojas */
const initSheetName = "Initialization";
const addSheetName = "Concentrado";
const templateSheetName = "Template";

/** Named ranges */
// Initialization Sheet
const initAsignaturasRangeName = "initAsignaturas";
const initEstudiantesRangeName = "initEstudiantes";

// Concentrado
const addPeriodo1RangeName = "addPeriodo1";
const addPeriodo2RangeName = "addPeriodo2";
const addPeriodo3RangeName = "addPeriodo3";

// Template
const temNombreRangeName = 'temNombre';
const temDatosRangeName = 'temDatos';
const temHabilidadesRangeName = "temHabilidades";
const temObservacionesRangeName = "temObservaciones";
const temPonderadoRangeName = "temPonderado";
const temPeriodo1RangeName = "temPeriodo1";
const temPeriodo2RangeName = "temPeriodo2";
const temPeriodo3RangeName = "temPeriodo3";
const temPromedioRangeName = "temPromedio";