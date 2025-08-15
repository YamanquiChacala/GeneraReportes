<div align="center" width="100%">

![image](images/Logo.png)
</div>

# 📃 Generador de Reportes  

Un script desarrollado en **Google Apps Script** para **automatizar** y **simplificar** la creación de reportes de calificaciones de alumnos en **Google Sheets**.

Permite **gestionar listas de estudiantes** 📋, **organizar la información por periodos** 📅, **proteger secciones para evitar errores** 🔒 y **generar reportes individuales o masivos** 📄 de forma rápida y precisa.

## ✨ Características  

- ⚡ **Inicialización sencilla** a partir de una lista de alumnos.  
- 📄 **Generación automática** de una página individual para cada estudiante.  
- 📊 **Concentrado general** con calificaciones y promedios.  
- 📈 **Seguimiento del progreso** al registrar calificaciones.  
- 🔒 **Control de acceso por secciones** en las hojas de cada estudiante.  
- 📝 **Creación automática de reportes** a partir de una plantilla en Google Docs.  

---

## 👥 Roles de uso  

Este sistema está diseñado para dos tipos de usuarios:  

- **👩‍🏫 Docentes**  
    - Acceden únicamente a las hojas individuales de sus estudiantes.  
    - Registran calificaciones, observaciones y otros datos solicitados.  
    - No necesitan interactuar con el menú personalizado del script.  

- **🛠 Administradores**  
    - Configuran el archivo inicial y realizan cambios en la estructura.  
    - Usan el menú **`📃 Generador de Reportes`** para inicializar, agregar estudiantes, borrar datos, proteger secciones y generar reportes.  
    - Son responsables de mantener el correcto funcionamiento del sistema.  

---

![Separator](images/HorizontalLine.png)

## 👩‍🏫 Guía para Docentes  

En este sistema, las partes que **no deben modificarse** están protegidas automáticamente.  
Incluso dentro de las hojas de cada alumno, **solo las áreas donde los docentes deben introducir información** estarán desbloqueadas para edición.  

Aun así, los docentes pueden consultar otras hojas:  
- **`Concentrado`** 📊 – Para verificar calificaciones globales.  
- **`Estado`** ✅ – Para confirmar qué datos ya se han completado y cuáles faltan.  

---

### 📄 Estructura de la hoja de cada alumno  

Cada hoja de alumno está dividida en **secciones**.  
Un administrador puede dar o quitar permisos de edición para cada sección:  

1. **📌 Datos** *(información general)*  
    - Incluye: **Nombre(s)**, **Apellidos**, **Nivel**, **Grado**, **Faltas**, **Periodo**, **Fecha**, y cualquier otra información que se quiera agregar.  
    - Normalmente los docentes **no cambian nada** aquí, salvo **Faltas** cuando sea necesario.  

2. **🧠 Habilidades de aprendizaje**  
    - Evaluación en: **Actitud**, **Hábitos de estudio/trabajo**, **Pensamiento crítico** y **Desarrollo socioemocional**.  
    - Valores: **E** (Excelente), **B** (Bueno), **S** (Suficiente), **R** (Requiere apoyo).  

|![Datos](images/StudentDatos.png)|![Habilidades](images/StudentHabilidades.png)|
|:---:|:---:|

3. **💬 Comentarios**  
    - Espacio para observaciones sobre el alumno.  
    - 💡 **Consejo importante**:  
        - Escriba y revise el texto en otro programa. (*Es importante revisar la ortografía*) 
        - Pegue el texto **en la barra de fórmulas** (arriba) para que se respeten los párrafos y el formato.  
        - Si se pega directamente en la celda, cada párrafo podría ir a una celda distinta y desordenar el formato.

4. **📅 Evaluaciones del año** *(tres secciones, una por cada periodo)*  
    - En cada evaluación, calificar (0 a 10) en:  
        - Desempeño y aprendizaje  
        - Proyectos y evaluaciones  
        - Asistencia y puntualidad  

![Comentarios](images/StudentComentarios.png)|![Calificaciones](images/StudentGrades.png)
|:---:|:---:|

### 📌 Notas finales  
- El cálculo de **promedios** y la verificación de que todo esté listo para el reporte se realiza **automáticamente**.  
- Los docentes **solo necesitan ingresar calificaciones y comentarios** en las áreas desbloqueadas.  
- No es necesario modificar fórmulas ni celdas protegidas.

---

![Separator](images/HorizontalLine.png)

## 🚀 Guía de inicio
### *(Solo para administradores)*

El **Generador de Reportes** utiliza **dos archivos**:
- 📄 **Hoja de cálculo** – donde se registran y consultan las calificaciones. Puede tener cualquier nombre.
- 📝 **Plantilla de reportes** – documento base para generar los reportes, con el nombre exacto **`__Template__`**.

---

### 🛠 Creación de los archivos

1. 📁 **Crea la carpeta de trabajo**
    - En **Google Drive**, crea una carpeta vacía para almacenar todos los archivos del proyecto.
    - Esto ayudará a mantener todo organizado y evitar errores.

    |![Carpeta vacía](images/CarpetaVacia.png)|
    |:---:|

2. 📑 **Haz copias de los archivos base**
    - Abre cada enlace y selecciona **"Hacer una copia"** en Google Drive:
        - [📄 Hoja de cálculo](https://docs.google.com/spreadsheets/d/1WbxAkBY3VWJAXX0XvkNK8EL00SJkToOg0IrvBvZsUM8/copy)
        - [📝 Plantilla de reportes](https://docs.google.com/document/d/1NwaMDAemmDlTmx3bFkm11032FXVUIrooJdXxkrgC2G4/copy)
3. 📂 **Mueve ambos archivos a la carpeta creada**
    - Esto asegura que el script pueda encontrar la plantilla y los datos fácilmente.
4. ⚠️ **Verifica el nombre de la plantilla**
    - La **hoja de cálculo** puede renombrarse como quieras.
    - La **plantilla de reportes** debe llamarse **exactamente**: `__Template__` (con doble guion bajo al inicio y al final).

|![CreateCopy](images/CopyFile.png)|![MoveFile](images/MoveFile.png)|![Confirm](images/MoveFileConfirm.png)|
|:---:|:---:|:---:|

---

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

---

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

---

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

|![MenuAuth](images/MenuAuth.png)|![GoogleAuth1](images/GoogleAuth1.png)|
|:---:|:---:|

|![GoogleAuth2](images/GoogleAuth2.png)|![GoogleAuth3](images/GoogleAuth3.png)|
|:---:|:---:|

---

### 🏁 Inicialización

14. 🖱 **Ejecuta la inicialización**
    - En el menú `📃 Generador de Reportes`, selecciona la opción `🏁 Inicializar materias y alumnos`.
15. ⏳ **Espera a que termine el proceso**
    - El proceso puede tardar **varios minutos**.
    - No cierres la hoja de cálculo mientras esté en ejecución.
16. 📢 **Atiende la ventana de aviso**
    - Aparecerá una ventana recordándote que no debes cerrar la hoja hasta que finalice el proceso.
17. ✅ **Verifica los cambios**
    - Una vez que el script termine:
        - La hoja `Initialization` se ocultará.
        - Cada alumno tendrá su propia hoja individual.
        - En la hoja `Concentrado` podrás ver calificaciones y promedios generales.
        - En la hoja `Estado` podrás ver qué datos ya están completos o faltan en cada hoja de alumno.
18. 📚 **Archivo listo para uso**
    - A partir de este momento, los maestros pueden comenzar a **ingresar calificaciones y observaciones** en la hoja de cada alumno.

![InitMenu](images/MenuInitialize.png)|![Dialogo](images/DialogWait.png)
|:---:|:---:|

---

![Separator](images/HorizontalLine.png)

## 📝 Plantilla de reportes

La plantilla es un documento de **Google Docs** que sirve como base para generar los reportes.  
Puede tener **cualquier formato, diseño u orden**; el sistema solo busca y reemplaza **etiquetas** especiales escritas entre llaves **`{}`**.

---

### 📌 Reglas generales

- La plantilla debe llamarse **`__Template__`** (con exactamente ese nombre, rodeado entre pares de guiones bajos).
- Las etiquetas deben escribirse **exactamente** a como se describen aquí, respetando letras, números y símbolos.
- Cada etiqueta se reemplazará por la información correspondiente de la hoja del alumno.

![Plantilla](images/Folder.png)|![Asignaturas](images/TablaMaterias.png)
|:---:|:---:|

---

### ⚠️ Importante: orden de las asignaturas

El **orden de las asignaturas** en las etiquetas **debe coincidir exactamente** con el orden en que fueron configuradas en la hoja de cálculo al momento de la inicialización.

Por ejemplo, si en la hoja se registraron así:
1. **Matemáticas**  
2. **Ciencias**  
3. **Historia**  

Entonces:
- Matemáticas siempre será **`a1`**
- Ciencias siempre será **`a2`**
- Historia siempre será **`a3`**

Si en la plantilla usas un número distinto al configurado en la hoja, el dato **se mostrará en el lugar equivocado** en el reporte.

💡 **Consejo:** antes de editar la **📝 plantilla**, revisa en la **📄 hoja de cálculo** el orden exacto de las asignaturas.

---

### 1️⃣ Datos del alumno

En la sección **Datos** (Nivel, Grado, Faltas, Periodo, Fecha, etc.) la etiqueta es simplemente el **nombre del dato** entre llaves.  
Ejemplo: **`{Fecha}`**

![templateDatos](images/templateDatos.png)

---

### 2️⃣ Habilidades de aprendizaje
Formato
```
{a#h#}
```
- `a#` → número de la asignatura (ej. `a5` = quinta asignatura)
- `h#` → número de la habilidad (1 a 4)  
  1 -  Actitud  
  2 - Hábitos de estudio/trabajo  
  3 - Pensamiento crítico  
  4 - Desarrollo socioemocional  

Ejemplo: **`{a5h3}`** = Pensamiento crítico de la quinta asignatura.

![templateDatos](images/templateHabilidades.png)

---

### 3️⃣ Comentarios
Formato:
```
{a#c}
```
- `a#` → número de la asignatura  
- `c` → comentario

Ejemplo: **`{a3c}`** = Comentario de la tercera asignatura.

![templateDatos](images/templateComments.png)

---

### 4️⃣ Calificaciones numéricas
Formato:
```
{a#p#}
```
- `a#` → número de la asignatura  
- `p#` → periodo (1, 2 o 3)

Ejemplo: **`{a6p3}`** = Calificación de la sexta asignatura en el tercer periodo.

![templateDatos](images/templateGrades.png)

---

### 5️⃣ Promedios

- **Promedio por asignatura**:  
  `{a#f}` = promedio final de esa asignatura  
  Ejemplo: **`{a4f}`** = promedio final de la cuarta asignatura.

- **Promedio por periodo**:  
  `{fp#}` = promedio general del periodo #  
  Ejemplo: **`{fp2}`** = promedio general del segundo periodo.

- **Promedio final del año**:  
  **`{ff}`** = promedio de promedios.

![templateDatos](images/templatePromedios.png)

---

![Separator](images/HorizontalLine.png)