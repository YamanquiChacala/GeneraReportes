/** Quien puede ver el menú */
const allowedEditors = [
  "info@chacala.school",
  "yamanqui@chacala.school",
  "erika@chacala.school"
];

/** Reportes */
const reportTemplateName = "__Template__";

/** Nombre de la hojas */
const sheetNames = {
  init      : "Initialization",
  template  : "Template",
  add       : "Concentrado",
  status    : "Estado"
};

/** Datos a proteger */
const protectedSection = {
  datos: 1,
  habilidades: 2,
  observaciones: 3,
  periodo1: 4,
  periodo2: 5,
  periodo3: 6
};

/** Named ranges */
// Initialization Sheet
const initAsignaturasRangeName = "initAsignaturas";
const initEstudiantesRangeName = "initEstudiantes";
const initProtectionsRangeName = "initProtections";

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