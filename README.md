<p align="center" width="100%">
    <img src=images/Logo.png>
</p>

# 📃 Generador de reportes

Un script desarrollado en **Google Apps Script** para **automatizar** y **simplificar** la creación de reportes de calificaciones de alumnos en **Google Sheets**.

Permite **gestionar listas de estudiantes** 📋, **organizar la información por periodos** 📅, **proteger secciones para evitar errores** 🔒 y **generar reportes individuales o masivos** 📄 de forma rápida y precisa.

## ✨ Características

- ⚡ **Inicialización sencilla** a partir de una lista de alumnos.
- 📄 **Generación automática** de una página individual para cada estudiante.
- 📊 **Concentrado general** con calificaciones y promedios.
- 📈 **Seguimiento del progreso** al registrar calificaciones.
- 🔒 **Control de acceso por secciones** en las hojas de cada estudiante.
- 📝 **Creación automática de reportes** a partir de un machote en Google Docs.

## Guía de inicio

El **Generador de Reportes** utiliza **dos archivos**:
- 📄 **Hoja de cálculo** – donde se registran y consultan las calificaciones. Puede tener cualquier nombre.
- 📝 **Machote de reporte** – documento base para generar los reportes, con el nombre exacto `__Template__`.

### 🛠 Creación de los archivos

1. 📁 **Crea la carpeta de trabajo**
    - En **Google Drive**, crea una carpeta vacía para almacenar todos los archivos del proyecto.
    - Esto ayudará a mantener todo organizado y evitar errores.

    |![Carpeta vacía](images/CarpetaVacia.png)|
    |:---:|

2. 📑 **Haz copias de los archivos base**
    - Abre cada enlace y selecciona **"Hacer una copia"** en Google Drive:
        - [📄 Hoja de cálculo](https://docs.google.com/spreadsheets/d/1WbxAkBY3VWJAXX0XvkNK8EL00SJkToOg0IrvBvZsUM8/copy)
        - [📝 Machote de documento](https://docs.google.com/document/d/1NwaMDAemmDlTmx3bFkm11032FXVUIrooJdXxkrgC2G4/copy)
3. 📂 **Mueve ambos archivos a la carpeta creada**
    - Esto asegura que el script pueda encontrar el machote y los datos fácilmente.
4. ⚠️ **Verifica el nombre del machote**
    - La **hoja de cálculo** puede renombrarse como quieras.
    - El **machote de documento** debe llamarse **exactamente**: `__Template__` (con doble guion bajo al inicio y al final).

|![CreateCopy](images/CopyFile.png)|![MoveFile](images/MoveFile.png)|![Confirm](images/MoveFileConfirm.png)|
|:---:|:---:|:---:|

### 👩‍🏫 Preparación de alumnos

5. 📄 **Identifica la hoja correcta**
    - La hoja de cálculo contiene **tres pestañas** (hojas).
    - Abre la primera, llamada `Initialization`.
6. ✏️ **Introduce la lista de alumnos**
    - En la tabla principal, rellena las columnas para:
        - **Nombre**
        - **Apellido(s)**
        - **Otros datos** (si se requieren)
    - Cada fila corresponde a un alumno.

### 📚 Preparación de materias

7. 📍 **Localiza la tabla de materias**
    - En la misma hoja `Initialization`, desplázate hacia la **derecha** hasta encontrar la tabla llamada `Materias`.
8. ✏️ **Lista las materias**
    - Introduce en la tabla el nombre de cada materia.
    - Cada fila corresponde a una materia distinta.

### 💡 Notas importantes
- 📌 **El orden importa**: El script utilizará exactamente el orden en el que se ingresen los alumnos y materias.
- ➖ **Espacios en blanco**: Si dejas filas vacías, el script las respetará. Esto es útil si quieres **agrupar** alumnos o materias visualmente.

|![Pestañas](images/Pestañas.png)|![Estudiantes](images/TablaEstudiantes.png)|![Materias](images/TablaMaterias.png)|
|:---:|:---:|:---:|


### 🔑 Pedir autorización

9. 📂 **Ubica el menú del script**
    - En la barra superior de la hoja de cálculo, busca el menú `📃 Generador de Reportes`.
10. 🖱 **Selecciona la opción inicial**
    - Al abrir el menú por primera vez, solo verás una opción:
        `🪪 Pedir autorización.`
    - Haz clic en esta opción.
11. 🔐 **Autoriza el script**
    - Google mostrará una ventana con la lista de acciones que el script puede realizar.
    - Esto es **normal**: el script necesita acceso a Google Drive para **crear y eliminar reportes**.
12. ✅ **Acepta todos los permisos**
    - Haz clic en "**Permitir**" para autorizar el script.
    - Si no aceptas, el **Generador de Reportes no funcionará**.
13. 🚀 **Accede a las opciones completas**
    - Una vez autorizada la ejecución, el menú cambiará y mostrará la opción:
        `🏁 Inicializar materias y alumnos.`

|[MenuAuth]()|[GoogleAuth]()|[MenuInitialize]()|
|:---:|:---:|:---:|