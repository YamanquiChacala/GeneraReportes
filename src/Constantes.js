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
    init: "Initialization",
    template: "Template",
    add: "Concentrado",
    status: "Estado",
    alert: "Alerta"
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
const rangeNames = {
    init: {
        asignaturas: "initAsignaturas",
        students: "initEstudiantes",
        protections: "initProtections",
    },
    add: {
        periodo1: "addPeriodo1",
        periodo2: "addPeriodo2",
        periodo3: "addPeriodo3",
    },
    status: {
        datos: "statDatos",
        habilidades: "statHabilidades",
        observaciones: "statObservaciones",
        periodo1: "statPeriodo1",
        periodo2: "statPeriodo2",
        periodo3: "statPeriodo3",
    },
    template: {
        weights: "temPonderado",
        name: "temNombre",
        data: "temDatos",
        habilities: "temHabilidades",
        comments: "temObservaciones",
        periodo1: "temPeriodo1",
        periodo2: "temPeriodo2",
        periodo3: "temPeriodo3",
        promedio: "temPromedio",
    },
}

const indexPos = {
    status: {
        datos: 0,
        habilidades: 1,
        observaciones: 2,
        periodo1: 3,
        periodo2: 4,
        periodo3: 5,
    }
}

/** Para las propiedades */
const propertyKeys = {
    students: "students",
    header: "header",
    studentIndex: "currentIndex",
    sheets: "sheets",
    sheetIndex: "sheetIndex",
};