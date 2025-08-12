[![Logo](images/Logo.png)](https://chacala.school/)
# 📃 Generador de reportes

Un script de GoogleApps para automatizar la generación de reportes de calificación de alumnos.

[toc]

## Características

- Inicialización simple desde una lista de alumnos.
- Página individual para cada estudiante.
- Concentrado de calificaciones y promedios.
- Seguimiento de progreso al llenar calificaciones.
- Control de acceso por secciones a las hojas de estudiantes.
- Creación automática de reportes utilizando un machote de Google Documents.

## Guía de inicio

### Espacio de trabajo

El Generador de Reportes consta de dos archivos:
- La hoja de cálculo donde se anotan y revisan calificaciones, puede tener cualquier nombre
- Un machote para los reportes con nombre `__Template__`

#### Creando los archivos

1. En Google Drive crea una carpeta vacía.
    |![Carpeta vacía](images/CarpetaVacia.png)|
    |:---:|

2. Crea copias de ambos archivos, y muévelos a esa carpeta. Para crear las copias puedes utilizar estas ligas:
    - [Hoja de cálculo](https://docs.google.com/spreadsheets/d/1WbxAkBY3VWJAXX0XvkNK8EL00SJkToOg0IrvBvZsUM8/copy)
    - [Machote de documento](https://docs.google.com/document/d/1NwaMDAemmDlTmx3bFkm11032FXVUIrooJdXxkrgC2G4/copy)

    |![CreateCopy](images/CopyFile.png)|![MoveFile](images/MoveFile.png)|![Confirm](images/MoveFileConfirm.png)|
    |:---:|:---:|:---:|

3. La hoja de cálculo puede tener cualquier nombre, pero es muy importante que el machote se llame `__Template__` (con doble guion bajo a ambos lados `__`).

    |![Folder](images/Folder.png)|
    |:---:|