# Feature Specification: UC-05 — Confianza, verificación, reportes y administración

**Creado**: 2026-09-11  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calificar servicio finalizado [US-065] (Priority: P1)

Como cliente, quiero calificar un servicio finalizado para aportar una señal de reputación sobre el prestador.

**Why this priority**: La reputación depende de servicios realmente completados y afecta confianza en el marketplace.

**Independent Test**: Se prueba con un servicio finalizado propio y otro no finalizado; solo el primero debe admitir la calificación.

**Acceptance Scenarios**:

1. **Scenario**: Calificación válida
   - **Given** el cliente participó en un servicio finalizado aún no calificado
   - **When** envía una calificación válida
   - **Then** la calificación queda asociada al servicio y al prestador

2. **Scenario**: Servicio no finalizado
   - **Given** el servicio no está finalizado
   - **When** el cliente intenta calificar
   - **Then** el sistema rechaza la operación

---

### User Story 2 - Impedir calificación duplicada [US-066] (Priority: P1)

Como sistema, quiero impedir que un mismo servicio genere calificaciones duplicadas para mantener integridad de la reputación.

**Why this priority**: Es una regla automática obligatoria incluida en calificar.

**Independent Test**: Se prueba enviando una segunda calificación para el mismo servicio/actor y verificando que no altera la reputación.

**Acceptance Scenarios**:

1. **Scenario**: Duplicado bloqueado
   - **Given** ya existe la calificación permitida para el servicio
   - **When** se intenta registrar otra equivalente
   - **Then** el sistema rechaza la duplicidad

---

### User Story 3 - Calcular reputación agregada [US-068] (Priority: P1)

Como usuario, quiero que la reputación agregada del prestador refleje sus calificaciones válidas para apoyar decisiones de confianza.

**Why this priority**: Convierte evaluaciones de servicios finalizados en una señal útil para clientes.

**Independent Test**: Se prueba con un conjunto controlado de calificaciones y verificando el resultado según la fórmula definida.

**Acceptance Scenarios**:

1. **Scenario**: Reputación recalculada
   - **Given** existen calificaciones válidas del prestador
   - **When** se registra o cambia el conjunto relevante
   - **Then** el sistema presenta el agregado resultante de la regla definida

---

### User Story 4 - Mostrar nivel de verificación con significado explícito [US-069] (Priority: P1)

Como usuario, quiero saber exactamente qué significa que un perfil esté verificado para no interpretar una garantía mayor que la evidencia validada.

**Why this priority**: Es una regla de confianza explícita del diseño y evita claims ambiguos.

**Independent Test**: Se prueba visualizando distintos niveles/estados y comprobando que cada uno explica qué evidencia fue validada.

**Acceptance Scenarios**:

1. **Scenario**: Verificación explicada
   - **Given** un perfil presenta un estado o nivel de verificación
   - **When** un usuario consulta su significado
   - **Then** el sistema indica de forma explícita qué fue validado y no afirma verificaciones no realizadas

---

### User Story 5 - Reportar usuario [US-072] (Priority: P1)

Como usuario, quiero reportar una cuenta problemática para que administración pueda revisarla.

**Why this priority**: Es un mecanismo básico de seguridad y moderación.

**Independent Test**: Se prueba creando un reporte válido contra un usuario y verificando su aparición en la cola administrativa.

**Acceptance Scenarios**:

1. **Scenario**: Reporte de usuario
   - **Given** un usuario autenticado identifica una cuenta reportable
   - **When** envía motivo y datos requeridos
   - **Then** el sistema registra el reporte para revisión administrativa

---

### User Story 6 - Reportar solicitud, propuesta o servicio [US-073] (Priority: P1)

Como usuario, quiero reportar contenido o una transacción problemática para que pueda revisarse.

**Why this priority**: Amplía moderación más allá de cuentas y cubre objetos centrales del marketplace.

**Independent Test**: Se prueba reportando cada tipo soportado y verificando relación correcta con el objeto.

**Acceptance Scenarios**:

1. **Scenario**: Reporte de objeto
   - **Given** el usuario tiene acceso al objeto reportable
   - **When** envía un reporte válido
   - **Then** el sistema registra el reporte vinculado al objeto correcto

---

### User Story 7 - Consultar cola de reportes [US-075] (Priority: P1)

Como administrador, quiero revisar una cola de reportes para priorizar casos pendientes.

**Why this priority**: Es la entrada operativa al proceso de moderación.

**Independent Test**: Se prueba con reportes en distintos estados y verificando que el administrador puede listarlos según reglas.

**Acceptance Scenarios**:

1. **Scenario**: Cola administrativa
   - **Given** existen reportes registrados
   - **When** el administrador abre la cola
   - **Then** el sistema muestra los reportes autorizados con su estado

---

### User Story 8 - Revisar detalle de reporte [US-076] (Priority: P1)

Como administrador, quiero revisar el detalle de un reporte y su evidencia para tomar una decisión informada.

**Why this priority**: Es necesario antes de resolver o aplicar medidas.

**Independent Test**: Se prueba abriendo un reporte y comprobando contexto, objeto afectado y evidencia asociada.

**Acceptance Scenarios**:

1. **Scenario**: Detalle de reporte
   - **Given** un reporte existe
   - **When** el administrador abre su detalle
   - **Then** el sistema muestra la información y evidencia disponible para revisión

---

### User Story 9 - Cambiar estado y resolver reporte [US-077] (Priority: P1)

Como administrador, quiero actualizar y resolver reportes para cerrar el proceso de moderación con trazabilidad.

**Why this priority**: Es la acción central de gestión de incidentes y debe ser auditada.

**Independent Test**: Se prueba resolviendo un reporte y comprobando estado final y registro de auditoría.

**Acceptance Scenarios**:

1. **Scenario**: Resolución auditada
   - **Given** un administrador revisa un reporte abierto
   - **When** cambia su estado o lo resuelve
   - **Then** el sistema persiste el cambio y registra la acción administrativa

---

### User Story 10 - Bloquear preventivamente una cuenta [US-078] (Priority: P1)

Como administrador, quiero bloquear preventivamente una cuenta cuando exista riesgo que justifique la medida.

**Why this priority**: Control de seguridad sensible que debe poder limitar actividad y quedar auditado.

**Independent Test**: Se prueba bloqueando una cuenta y verificando restricciones y auditoría.

**Acceptance Scenarios**:

1. **Scenario**: Bloqueo preventivo
   - **Given** un administrador autorizado decide aplicar bloqueo
   - **When** confirma la medida
   - **Then** la cuenta queda en el estado de bloqueo definido y la acción queda auditada

---

### User Story 11 - Moderar perfil o contenido [US-079] (Priority: P1)

Como administrador, quiero moderar perfiles o contenido problemático para proteger la calidad y seguridad de la plataforma.

**Why this priority**: Permite actuar sobre contenido sin depender únicamente del bloqueo de cuenta.

**Independent Test**: Se prueba aplicando una acción de moderación y verificando su efecto y auditoría.

**Acceptance Scenarios**:

1. **Scenario**: Moderación auditada
   - **Given** existe contenido moderable
   - **When** el administrador aplica una acción permitida
   - **Then** el contenido refleja la medida y la acción queda auditada

---

### User Story 12 - Auditar acciones administrativas [US-081] (Priority: P1)

Como sistema, quiero registrar las acciones administrativas sensibles para disponer de trazabilidad y control.

**Why this priority**: El diseño exige auditoría para resolución, bloqueo, moderación y administración sensible.

**Independent Test**: Se prueba ejecutando cada acción incluida y verificando un registro de auditoría con actor, acción, objetivo y momento.

**Acceptance Scenarios**:

1. **Scenario**: Registro de auditoría
   - **Given** un administrador ejecuta una acción sensible incluida
   - **When** la operación se completa o intenta según la política
   - **Then** el sistema conserva la trazabilidad requerida de la acción

---

### User Story 13 - Gestionar categorías/servicios regulados o de alto riesgo [US-082] (Priority: P1)

Como administrador, quiero gestionar categorías o servicios regulados/de alto riesgo para aplicar controles de producto específicos.

**Why this priority**: Reduce riesgo operativo y de cumplimiento en categorías sensibles.

**Independent Test**: Se prueba marcando/configurando una categoría bajo el régimen definido y verificando que la regla asociada se aplica.

**Acceptance Scenarios**:

1. **Scenario**: Categoría de alto riesgo
   - **Given** una categoría es identificada como regulada o de alto riesgo
   - **When** el administrador aplica la configuración prevista
   - **Then** el sistema persiste la clasificación/control y audita la acción

---

### User Story 14 - Agregar reseña textual [US-067] (Priority: P2)

Como cliente, quiero añadir una reseña textual a mi calificación para explicar mi experiencia.

**Why this priority**: Enriquece reputación, pero el flujo de calificación sigue siendo viable sin texto.

**Independent Test**: Se prueba agregando una reseña permitida y verificando asociación con la calificación.

**Acceptance Scenarios**:

1. **Scenario**: Reseña opcional
   - **Given** el cliente califica un servicio finalizado
   - **When** agrega texto válido
   - **Then** la reseña queda asociada a la calificación según reglas de visibilidad/moderación

---

### User Story 15 - Solicitar verificación documental ampliada [US-070] (Priority: P2)

Como prestador, quiero solicitar una verificación documental ampliada para aportar evidencia adicional de confianza.

**Why this priority**: Puede elevar confianza, pero la fuente no define documentos, niveles ni proceso operativo.

**Independent Test**: Se prueba enviando una solicitud con la información requerida y verificando que entra al flujo de revisión definido.

**Acceptance Scenarios**:

1. **Scenario**: Solicitud de verificación
   - **Given** un prestador autenticado inicia verificación ampliada
   - **When** entrega los requisitos definidos
   - **Then** el sistema registra la solicitud con su estado correspondiente

---

### User Story 16 - Reportar reseña o reputación problemática [US-071] (Priority: P2)

Como usuario, quiero reportar una reseña o señal de reputación problemática para que sea revisada.

**Why this priority**: Permite corregir abuso o contenido inapropiado dentro del sistema de confianza.

**Independent Test**: Se prueba creando un reporte sobre una reseña/reputación visible y verificando su llegada a moderación.

**Acceptance Scenarios**:

1. **Scenario**: Reporte de reseña
   - **Given** existe una reseña o elemento de reputación reportable
   - **When** el usuario envía el reporte
   - **Then** el sistema lo registra y permite adjuntar evidencia de forma opcional

---

### User Story 17 - Adjuntar evidencia a reporte [US-074] (Priority: P2)

Como reportante, quiero adjuntar evidencia para ayudar a administración a evaluar el caso.

**Why this priority**: Mejora calidad de moderación, pero el reporte puede existir sin adjunto cuando el producto lo permita.

**Independent Test**: Se prueba agregando un adjunto válido e intentando uno no permitido.

**Acceptance Scenarios**:

1. **Scenario**: Evidencia válida
   - **Given** existe un reporte en creación o estado que admite evidencia
   - **When** el usuario adjunta un archivo permitido
   - **Then** la evidencia queda vinculada al reporte

2. **Scenario**: Evidencia inválida
   - **Given** el archivo incumple reglas
   - **When** se intenta adjuntar
   - **Then** el sistema rechaza el archivo sin perder el reporte

---

### User Story 18 - Administrar categorías [US-028] (Priority: P2)

Como administrador, quiero crear/actualizar el catálogo de categorías para mantener vigente la oferta de servicios.

**Why this priority**: Soporta descubrimiento, perfiles y solicitudes; los cambios deben auditarse.

**Independent Test**: Se prueba aplicando una modificación permitida y verificando catálogo y auditoría.

**Acceptance Scenarios**:

1. **Scenario**: Gestión de categoría
   - **Given** un administrador autorizado accede al catálogo
   - **When** crea o actualiza una categoría válida
   - **Then** el cambio queda disponible conforme a su estado y se audita

---

### User Story 19 - Administrar zonas [US-029] (Priority: P2)

Como administrador, quiero gestionar las zonas utilizadas por la plataforma para mantener consistente la referencia geográfica.

**Why this priority**: Las zonas participan en privacidad, descubrimiento y matching.

**Independent Test**: Se prueba creando/actualizando una zona y verificando su disponibilidad controlada y auditoría.

**Acceptance Scenarios**:

1. **Scenario**: Gestión de zona
   - **Given** un administrador autorizado modifica una zona
   - **When** guarda una configuración válida
   - **Then** el catálogo de zonas se actualiza y la acción queda auditada

---

### User Story 20 - Buscar usuarios y perfiles [US-080] (Priority: P2)

Como administrador, quiero buscar usuarios/perfiles para localizar rápidamente sujetos de revisión o soporte.

**Why this priority**: Acelera operación administrativa y moderación.

**Independent Test**: Se prueba buscando por criterios definidos y verificando resultados autorizados.

**Acceptance Scenarios**:

1. **Scenario**: Búsqueda administrativa
   - **Given** existen usuarios/perfiles que cumplen el criterio
   - **When** el administrador realiza la búsqueda
   - **Then** el sistema presenta coincidencias autorizadas

---

### Edge Cases

- Dos intentos de calificar el mismo servicio ocurren concurrentemente: solo una calificación válida debe persistir.
- Una reseña es reportada y moderada después de haber afectado reputación: la regla de recálculo debe estar definida y ser consistente.
- Un administrador intenta actuar sobre su propia cuenta/reporte o existe conflicto de interés: requiere política.
- Un adjunto de evidencia es malicioso, demasiado grande o de formato no permitido: se rechaza/aisla sin comprometer el reporte ni otros usuarios.
- Una cuenta bloqueada tiene servicios activos: deben definirse efectos sobre acceso, coordinación y transacciones en curso.
- Una categoría con solicitudes/servicios históricos se desactiva: los registros históricos deben seguir interpretables aunque no pueda usarse para nuevos flujos.
- Falla la escritura de auditoría de una acción sensible: la operación administrativa debe aplicar una política fail-safe definida; para acciones críticas se recomienda no confirmar sin trazabilidad.

## Requirements *(mandatory)*

### Requisitos Funcionales

- **FR-001**: El sistema DEBE permitir que un Cliente califique únicamente un servicio que se encuentre en estado completado/finalizado y en el cual dicho Cliente haya participado.
- **FR-002**: El sistema DEBE impedir que se realice una calificación duplicada para el mismo servicio o ámbito de calificación.
- **FR-003**: El sistema DEBE permitir asociar opcionalmente una reseña textual a una calificación válida, sujeta a las reglas de moderación.
- **FR-004**: El sistema DEBE calcular y mostrar la reputación agregada del Prestador a partir de las calificaciones válidas y elegibles, utilizando una fórmula definida.
- **FR-005**: El sistema DEBE describir exactamente qué evidencia o estado representa una etiqueta de verificación y NO DEBE implicar una validación que no se haya realizado.
- **FR-006**: El sistema DEBE permitir que los Prestadores soliciten una verificación documental ampliada.
- **FR-007**: El sistema DEBE permitir que los Usuarios reporten contenido problemático relacionado con reseñas o reputación.
- **FR-008**: El sistema DEBE permitir que los Usuarios reporten otra cuenta de usuario.
- **FR-009**: El sistema DEBE permitir que los Usuarios reporten objetos de servicio compatibles, incluyendo solicitudes, propuestas o servicios, cuando estos sean accesibles y reportables.
- **FR-010**: El sistema DEBE permitir adjuntar evidencia opcional a los reportes, conforme a las reglas de seguridad y archivos definidas.
- **FR-011**: El sistema DEBE permitir que los Administradores autorizados gestionen las categorías de servicio.
- **FR-012**: El sistema DEBE permitir que los Administradores autorizados gestionen las zonas.
- **FR-013**: El sistema DEBE permitir que los Administradores autorizados consulten la cola de reportes y revisen los detalles de cada reporte.
- **FR-014**: El sistema DEBE permitir que los Administradores autorizados cambien el estado de los reportes y resuelvan los mismos.
- **FR-015**: El sistema DEBE permitir que los Administradores autorizados bloqueen preventivamente cuentas conforme a una política definida.
- **FR-016**: El sistema DEBE permitir que los Administradores autorizados moderen perfiles y contenido mediante las acciones definidas.
- **FR-017**: El sistema DEBE permitir que los Administradores autorizados busquen usuarios y perfiles.
- **FR-018**: El sistema DEBE crear registros de auditoría inmutables o que permitan detectar manipulaciones para las acciones administrativas sensibles representadas en el CU, incluyendo la resolución de reportes, bloqueo de cuentas, moderación, gestión de categorías, gestión de zonas y gestión de categorías de alto riesgo.
- **FR-019**: El sistema DEBE permitir que los Administradores clasifiquen y gestionen categorías o servicios regulados o de alto riesgo, y hacer cumplir las restricciones definidas por el producto.

### Key Entities *(include if feature involves data)*

- **Calificación**: Evaluación vinculada a un servicio finalizado, cliente y prestador.
- **Reseña**: Texto opcional asociado a una calificación y sujeto a moderación.
- **Reputación agregada**: Resultado calculado a partir de calificaciones válidas.
- **Verificación**: Estado/nivel respaldado por evidencia concreta y significado explícito.
- **Solicitud de verificación**: Proceso solicitado por Prestador para validación documental ampliada.
- **Reporte**: Incidente presentado por un usuario; posee tipo, objetivo, motivo, estado y trazabilidad.
- **Evidencia de reporte**: Adjunto opcional vinculado a un reporte.
- **Acción administrativa**: Operación sensible realizada por Administrador.
- **Registro de auditoría**: Trazabilidad de actor, acción, objetivo, momento y datos mínimos necesarios.
- **Categoría / Zona**: Catálogos administrables utilizados por otros casos de uso.
- **Clasificación de alto riesgo**: Metadato/regla que identifica categorías o servicios sujetos a controles especiales.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de calificaciones aceptadas están asociadas a servicios finalizados y no existen duplicados dentro del alcance definido.
- **SC-002**: 100% de etiquetas de verificación mostradas en pruebas incluyen una explicación del alcance realmente validado.
- **SC-003**: 100% de acciones administrativas sensibles enumeradas generan un registro de auditoría asociado al actor y objetivo.
- **SC-004**: 100% de reportes creados pueden ser localizados en la cola/detalle por un administrador autorizado.
- **SC-005**: 0 usuarios no administradores pueden ejecutar acciones administrativas protegidas.
- **SC-006**: El cálculo de reputación produce el resultado esperado para 100% de los conjuntos de prueba definidos por la fórmula aprobada.
