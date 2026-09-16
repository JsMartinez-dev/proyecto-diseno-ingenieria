# Tareas - Entregable 03

---

# 1. Abraham — Modificación de diagramas de casos de uso

### Objetivo

Revisar y corregir los diagramas de casos de uso para simplificarlos, eliminar funcionalidades redundantes y asegurar que la relación entre los casos de uso represente correctamente las funcionalidades del sistema.

### Diagrama de Caso de Uso 02

Realizar las siguientes modificaciones:

1. Cambiar el título **"Descubrimiento"** por **"Buscar"**.

2. Simplificar los nombres y descripciones de los casos de uso. Los casos de uso no deben ser excesivamente descriptivos.

3. Revisar el uso de las relaciones `<<include>>` y `<<extend>>`:

   * Utilizar `<<include>>` únicamente cuando una funcionalidad sea obligatoriamente utilizada como parte de otra.
   * Utilizar `<<extend>>` únicamente cuando una funcionalidad represente una extensión opcional de otra.
   * Evitar utilizar estas relaciones únicamente para organizar visualmente funcionalidades.

4. Aplicar la siguiente instrucción general a todo el diagrama:

   **Eliminar los casos de uso que representen acciones o funcionalidades que ya están comprendidas dentro de otro caso de uso principal.**

   Por ejemplo:

   > **Descubrir prestadores por categoría y zona [US-026]**

   Ya comprende acciones como:

   * Explorar categorías.
   * Filtrar prestadores.

   Por lo tanto, estos casos de uso secundarios deben eliminarse del diagrama y mantenerse únicamente el caso de uso principal.

5. Aplicar el mismo criterio de simplificación a los demás diagramas de casos de uso.

---

### Diagrama de Caso de Uso 03

Realizar las siguientes modificaciones:

1. Cambiar:

   **"Seleccionar categorías de servicio"**

   por:

   **"Escoger categorías de servicio"**

2. Diferenciar correctamente los conceptos **categoría de servicio** y **servicio**:

   * **Categoría de servicio:** corresponde a la especialidad o tipo de trabajo que identifica al prestador.
     Ejemplos: pintor, tatuador, electricista, plomero.

   * **Servicio:** corresponde a una actividad específica que el trabajador ofrece dentro de una categoría.
     Ejemplos:

     * Tatuajes a color.
     * Pintura únicamente de exteriores.
     * Instalación de tomacorrientes.

3. Crear el caso de uso:

   **"Agregar categoría de servicio al perfil"**

   Este caso de uso debe representar la acción mediante la cual el prestador incorpora una nueva categoría a su perfil.

4. Eliminar el caso de uso:

   **"Validar elegibilidad para cotizar"**

5. Aplicar también en este diagrama la instrucción general de eliminar casos de uso secundarios que ya estén contenidos dentro de un caso de uso principal.

---

### Diagrama de Caso de Uso 04

Realizar las siguientes modificaciones:

1. Eliminar:

   **"User Story 6 - Comparar propuestas y perfiles"**

   debido a que esta funcionalidad se aleja del alcance definido para el MVP.

2. Cambiar:

   **"Habilitar datos de coordinación"**

   por:

   **"Habilitar datos de comunicación"**

3. Revisar nuevamente el diagrama para asegurar que no existan casos de uso redundantes o funcionalidades que estén fuera del alcance del MVP.

---

### Entregable de Abraham

Al finalizar, Abraham debe entregar:

* Todos los diagramas de casos de uso actualizados.
* Todos los casos de uso en formato **PlantUML**.
* Los nombres definitivos de cada caso de uso.
* Las relaciones `include` y `extend` correctamente justificadas y utilizadas.
* Los diagramas organizados y listos para que Sebastián pueda actualizar los SPEC.

**Dependencia:** esta tarea debe completarse antes de comenzar la modificación de los SPEC por parte de Sebastián.

---

# 2. Sebastián — Actualización y organización de SPEC

### Objetivo

Actualizar los SPEC del sistema tomando como referencia los diagramas de casos de uso modificados por Abraham y garantizar que la documentación tenga correspondencia directa con ellos.

### Tareas

1. Esperar a que Abraham finalice los diagramas de casos de uso y entregue todos los archivos en **PlantUML**.

2. Revisar los nuevos diagramas y utilizar sus casos de uso como referencia para modificar los SPEC existentes.

3. Organizar los casos de uso dentro de los SPEC según la relación funcional que tengan entre ellos.

4. Agrupar dentro de un mismo SPEC aquellas funcionalidades que pertenezcan a un mismo conjunto funcional y que tengan relación directa.

5. Agregar explícitamente dentro de cada SPEC los casos de uso correspondientes.

6. Verificar que exista una correspondencia clara entre:

   **Diagrama de Caso de Uso → SPEC → Casos de Uso incluidos**

7. Reescribir el caso de uso:

   **"Crear registro de servicio contratado"**

   Actualmente este nombre puede interpretarse como una operación relacionada principalmente con el almacenamiento de información en una base de datos.

   Debe reformularse para representar una **funcionalidad relevante para el usuario y para el MVP**, evitando que el caso de uso se perciba simplemente como una operación de persistencia.

8. Ordenar los SPEC junto con los diagramas de casos de uso de manera correcta, de forma que sea evidente qué SPEC corresponde a cada diagrama.

### Entregable de Sebastián

* SPEC actualizados.
* Casos de uso correctamente asociados dentro de cada SPEC.
* Correspondencia clara entre diagramas y SPEC.
* Caso de uso de servicio contratado reformulado de acuerdo con el alcance funcional del MVP.
* Documentación organizada y lista para revisión final.

**Dependencia:** Sebastián inicia esta tarea después de recibir los diagramas finales y los PlantUML de Abraham.

---

# 3. Daniel y Jennifer — Diseño y presentación de los diagramas

### Objetivo

Mejorar la presentación visual de los casos de uso modificados por Abraham para que sean legibles, ordenados y adecuados para incorporarlos al repositorio del proyecto.

### Tareas

1. Tomar los diagramas de casos de uso una vez Abraham haya finalizado su modificación.

2. Mejorar la distribución visual de los elementos del diagrama.

3. Organizar actores, casos de uso y relaciones para facilitar su lectura.

4. Evitar cruces innecesarios entre líneas y relaciones.

5. Utilizar una presentación consistente entre todos los diagramas:

   * Tamaño y posición de los elementos.
   * Nombres.
   * Distribución.
   * Relaciones.
   * Espaciado.

6. Verificar que los cambios de diseño **no modifiquen el significado funcional** de los casos de uso definidos por Abraham.

7. Preparar los diagramas en un formato adecuado para ser incorporados al repositorio.

### Entregable

* Todos los diagramas de casos de uso con presentación visual mejorada.
* Diagramas legibles, consistentes y listos para publicación en el repositorio.

**Dependencia:** trabajar sobre las versiones de los diagramas ya modificadas por Abraham.

---

# 4. Seuma — Revisión final del documento y control del alcance del MVP

### Objetivo

Realizar una revisión integral de la documentación final para identificar inconsistencias y evitar que se incorporen funcionalidades que no correspondan al alcance del MVP.

### Tareas

1. Revisar el documento final completo.

2. Verificar la coherencia entre:

   * Diagramas de casos de uso.
   * SPEC.
   * Historias de usuario.
   * Funcionalidades.
   * Alcance del MVP.

3. Identificar funcionalidades, casos de uso o especificaciones que:

   * No correspondan al MVP.
   * Sean redundantes.
   * Presenten inconsistencias.
   * No coincidan con los diagramas actualizados.

4. Cuando encuentre algún elemento que deba corregirse, enviar las indicaciones correspondientes a **Sebastián**.

5. Realizar seguimiento de las correcciones necesarias hasta comprobar que la documentación esté alineada con el alcance del MVP.

### Entregable

* Revisión final del documento.
* Lista de inconsistencias encontradas.
* Indicaciones de corrección enviadas a Sebastián.
* Validación final de que la documentación corresponde al MVP.

---

# Orden de ejecución de las tareas

Para evitar conflictos entre los integrantes, las tareas deben ejecutarse en el siguiente orden:

### Fase 1 — Casos de uso

**Abraham**

Modifica y depura todos los diagramas de casos de uso y entrega los archivos PlantUML definitivos.

↓

### Fase 2 — Diseño de diagramas

**Daniel y Jennifer**

Toman las versiones corregidas por Abraham y mejoran su presentación visual.

↓

### Fase 3 — Especificaciones

**Sebastián**

Utiliza los diagramas definitivos para actualizar y organizar los SPEC, incorporando los casos de uso correspondientes.

↓

### Fase 4 — Revisión final

**Seuma**

Revisa el documento completo y detecta cualquier inconsistencia relacionada con el alcance del MVP.

↓

### Fase 5 — Correcciones finales

**Sebastián**

Realiza las correcciones señaladas por Seuma y prepara la documentación final.

---

# Resultado esperado

Al finalizar el proceso, el proyecto debe contar con:

* Diagramas de casos de uso simplificados y correctamente estructurados.
* Relaciones `include` y `extend` utilizadas únicamente cuando corresponda.
* Ausencia de casos de uso redundantes o innecesariamente detallados.
* Diferenciación correcta entre categorías de servicio y servicios.
* SPEC organizados y relacionados claramente con cada diagrama.
* Casos de uso orientados a funcionalidades reales del sistema y no a operaciones internas de base de datos.
* Eliminación de funcionalidades que se encuentren fuera del alcance del MVP.
* Diagramas visualmente consistentes y listos para el repositorio.
* Documento final revisado y coherente en todas sus partes.
