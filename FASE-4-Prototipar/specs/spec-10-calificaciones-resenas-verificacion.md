# Feature Specification: SPEC-10 — Calificaciones, reseñas y verificación

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC059,UC060,UC061,UC062,UC063,UC064

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC059 incluye reputación UC061; UC060 extiende la calificación; UC063 y UC064 son flujos distintos de verificación y reporte.
### User Story 1 - Calificar servicio finalizado [UC059] (Priority: P1)
Como cliente, quiero calificar servicio finalizado, para gestionar específicamente calificar servicio finalizado dentro de CONectaSM.

**Why this priority**: UC059 permite a Cliente calificar servicio finalizado; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Calificar servicio finalizado», verificar que UC059 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Calificar servicio finalizado para UC059
   - **Given** un cliente autorizado dispone de los datos de «Calificar servicio finalizado»
   - **When** ejecuta la acción «Calificar servicio finalizado»
   - **Then** el sistema guarda «Calificar servicio finalizado» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC059
   - **Given** la solicitud de «Calificar servicio finalizado» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Agregar reseña textual [UC060] (Priority: P1)
Como usuario, quiero agregar reseña textual, para gestionar específicamente agregar reseña textual dentro de CONectaSM.

**Why this priority**: UC060 permite a Usuario agregar reseña textual; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Agregar reseña textual», verificar que UC060 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Agregar reseña textual para UC060
   - **Given** un usuario autorizado dispone de los datos de «Agregar reseña textual»
   - **When** ejecuta la acción «Agregar reseña textual»
   - **Then** el sistema guarda «Agregar reseña textual» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC060
   - **Given** la solicitud de «Agregar reseña textual» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 3 - Calcular reputación agregada [UC061] (Priority: P1)
Como usuario, quiero calcular reputación agregada, para gestionar específicamente calcular reputación agregada dentro de CONectaSM.

**Why this priority**: UC061 permite a Usuario calcular reputación agregada; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Calcular reputación agregada», verificar que UC061 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Calcular reputación agregada para UC061
   - **Given** un usuario autorizado dispone de los datos de «Calcular reputación agregada»
   - **When** ejecuta la acción «Calcular reputación agregada»
   - **Then** el sistema calcula y presenta «Calcular reputación agregada» usando los datos registrados.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC061
   - **Given** la solicitud de «Calcular reputación agregada» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 4 - Mostrar nivel de verificación [UC062] (Priority: P1)
Como usuario, quiero mostrar nivel de verificación, para gestionar específicamente mostrar nivel de verificación dentro de CONectaSM.

**Why this priority**: UC062 permite a Usuario mostrar nivel de verificación; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Mostrar nivel de verificación», verificar que UC062 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Mostrar nivel de verificación para UC062
   - **Given** un usuario autorizado dispone de los datos de «Mostrar nivel de verificación»
   - **When** ejecuta la acción «Mostrar nivel de verificación»
   - **Then** el sistema muestra la información específica de «Mostrar nivel de verificación».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC062
   - **Given** la solicitud de «Mostrar nivel de verificación» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 5 - Solicitar verificación documental ampliada [UC063] (Priority: P1)
Como prestador, quiero solicitar verificación documental ampliada, para gestionar específicamente solicitar verificación documental ampliada dentro de CONectaSM.

**Why this priority**: UC063 permite a Prestador solicitar verificación documental ampliada; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Solicitar verificación documental ampliada», verificar que UC063 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Solicitar verificación documental ampliada para UC063
   - **Given** un prestador autorizado dispone de los datos de «Solicitar verificación documental ampliada»
   - **When** ejecuta la acción «Solicitar verificación documental ampliada»
   - **Then** el sistema registra la solicitud «Solicitar verificación documental ampliada» asociada al usuario o servicio seleccionado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC063
   - **Given** la solicitud de «Solicitar verificación documental ampliada» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 6 - Reportar reseña problemática [UC064] (Priority: P1)
Como usuario, quiero reportar reseña problemática, para gestionar específicamente reportar reseña problemática dentro de CONectaSM.

**Why this priority**: UC064 permite a Usuario reportar reseña problemática; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Reportar reseña problemática», verificar que UC064 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Reportar reseña problemática para UC064
   - **Given** un usuario autorizado dispone de los datos de «Reportar reseña problemática»
   - **When** ejecuta la acción «Reportar reseña problemática»
   - **Then** el sistema registra la solicitud «Reportar reseña problemática» asociada al usuario o servicio seleccionado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC064
   - **Given** la solicitud de «Reportar reseña problemática» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Una calificación de un servicio no finalizado o duplicada debe rechazarse sin alterar la reputación.
- La reputación y la verificación deben distinguirse: ninguna reseña o nivel mostrado implica una certificación legal no definida.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-059**: El sistema DEBE permitir que cliente ejecute «Calificar servicio finalizado» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC059]
- **FR-060**: El sistema DEBE permitir que un Usuario ejecute «Agregar reseña textual» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC060]
- **FR-061**: El sistema DEBE permitir que un Usuario ejecute «Calcular reputación agregada» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC061]
- **FR-062**: El sistema DEBE permitir que un Usuario ejecute «Mostrar nivel de verificación» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC062]
- **FR-063**: El sistema DEBE permitir que un Prestador ejecute «Solicitar verificación documental ampliada» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC063]
- **FR-064**: El sistema DEBE permitir que un Usuario ejecute «Reportar reseña problemática» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC064]
### Key Entities *(include if feature involves data)*

- **Registro específico de Calificaciones, reseñas y verificación**: información que los CUs (UC059,UC060,UC061,UC062,UC063,UC064) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC059,UC060,UC061,UC062,UC063,UC064 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
