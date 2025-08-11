function updateSheetProtections() {
    updateDetails("<h4>Actualizando secciones protegidas</h4>", true);
    updateProgress(0);

    const spreadsheet = SpreadsheetApp.getActive();
    const sheets = spreadsheet.getSheets();
    const avoidSheets = Object.values(sheetNames);

    const progress = Math.floor(100 / (sheets.length - 3));

    const sectionNames = [
        rangeNames.template.data,
        rangeNames.template.habilities,
        rangeNames.template.comments,
        rangeNames.template.periodo1,
        rangeNames.template.periodo2,
        rangeNames.template.periodo3
    ];

    const sectionMask = spreadsheet.getRangeByName(rangeNames.init.protections).offset(1, 0, 6, 1).getValues().flat();

    const asignaturasMask = spreadsheet.getRangeByName(rangeNames.template.habilities)
        .offset(1, 0, spreadsheet.getRangeByName(rangeNames.template.habilities).getHeight() - 1, 1)
        .getValues().flat()
        .map(value => !!value);

    updateDetails("<p>Creando rangos a proteger</p>", true);

    /** @type {[number, number, number, number][]} */
    const unprotectedRangeBlocks = [];

    for (const [sectionIndex, sectionName] of sectionNames.entries()) {
        if (sectionMask[sectionIndex]) continue;

        const range = spreadsheet.getRangeByName(sectionName);

        if (sectionName === rangeNames.template.data) {
            unprotectedRangeBlocks.push([range.getRow(), 2, range.getHeight(), 1]);
            continue;
        }

        let startRow = range.getRow() + 1;
        let width = 3;

        if (sectionName === rangeNames.template.habilities) {
            width = 4;
        }
        if (sectionName === rangeNames.template.comments) {
            width = 1;
        }

        unprotectedRangeBlocks.push(...getContigousBlocks(asignaturasMask, startRow, 2, width));
    }
    updateProgress(progress, true);

    for (const sheet of sheets) {
        if (avoidSheets.includes(sheet.getName())) continue;
        updateDetails(`<p>Protegiendo ${sheet.getName()}</p>`, true);
        const unprotectedRanges = [];
        for (const rangeBlock of unprotectedRangeBlocks) {
            unprotectedRanges.push(sheet.getRange(...rangeBlock));
        }
        const protection = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)[0];
        protection.setUnprotectedRanges(unprotectedRanges);
        updateProgress(progress, true); // sheets.lenght - 4
    }
}

/**
 * @param {boolean[]} asignaturasMask
 * @param {number} startRow
 * @param {number} startColumn
 * @param {number} width
 * @returns {[number, number, number, number][]} 
 */
function getContigousBlocks(asignaturasMask, startRow, startColumn, width) {
    /** @type {[number, number, number, number][]} */
    const blocks = [];
    let blockStart = null;

    for (let i = 0; i < asignaturasMask.length; i++) {
        if (asignaturasMask[i] && blockStart === null) {
            blockStart = startRow + i; // Start of a block
        }
        if ((!asignaturasMask[i] || i === asignaturasMask.length - 1) && blockStart !== null) {
            const blockEnd = (asignaturasMask[i] ? startRow + i : startRow + i - 1);
            blocks.push([blockStart, startColumn, blockEnd - blockStart + 1, width]);
            blockStart = null;
        }
    }
    return blocks;
}


/**
 * Nos dice si la sección seleccionada debería estar protegida contra escritura.
 * @param {number} section
 */
function isProtected(section) {
    const spreadsheet = SpreadsheetApp.getActive();

    const checkmarkCell = spreadsheet.getRangeByName(rangeNames.init.protections).offset(section, 0);

    return checkmarkCell.isChecked();
}

/**
 * Marca o desmarca la sección seleccionada para protección.
 * @param {number} section
 * @param {boolean} status
 */
function setProtected(section, status) {
    const spreadsheet = SpreadsheetApp.getActive();

    const checkmarkCell = spreadsheet.getRangeByName(rangeNames.init.protections).offset(section, 0);

    if (status) {
        checkmarkCell.check();
    } else {
        checkmarkCell.uncheck();
    }
}

/**
 * Cambia el estado de la selección para protección.
 * @param {number} section
 */
function toggleProtected(section) {
    const spreadsheet = SpreadsheetApp.getActive();

    const checkmarkCell = spreadsheet.getRangeByName(rangeNames.init.protections).offset(section, 0);

    if (checkmarkCell.isChecked()) {
        checkmarkCell.uncheck();
    } else {
        checkmarkCell.check();
    }
}