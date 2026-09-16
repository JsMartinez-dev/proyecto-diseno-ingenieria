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