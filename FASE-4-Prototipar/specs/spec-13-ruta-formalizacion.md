# Feature Specification: SPEC-13 — Ruta de formalización

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC077,UC078,UC079,UC080

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC078 extiende la consulta UC077; UC080 representa una vinculación futura.
### User Story 1 - Consultar ruta de formalización [UC077] (Priority: P1)
Como prestador, quiero consultar ruta de formalización, para gestionar específicamente consultar ruta de formalización dentro de CONectaSM.

**Why this priority**: UC077 permite a Prestador consultar ruta de formalización; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Consultar ruta de formalización», verificar que UC077 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar ruta de formalización para UC077
   - **Given** un prestador autorizado dispone de los datos de «Consultar ruta de formalización»
   - **When** ejecuta la acción «Consultar ruta de formalización»
   - **Then** el sistema muestra la información específica de «Consultar ruta de formalización».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC077
   - **Given** la solicitud de «Consultar ruta de formalización» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Abrir enlaces oficiales de formalización [UC078] (Priority: P1)
Como prestador, quiero abrir enlaces oficiales de formalización, para gestionar específicamente abrir enlaces oficiales de formalización dentro de CONectaSM.

**Why this priority**: UC078 permite a Prestador abrir enlaces oficiales de formalización; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Abrir enlaces oficiales de formalización», verificar que UC078 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Abrir enlaces oficiales de formalización para UC078
   - **Given** un prestador autorizado dispone de los datos de «Abrir enlaces oficiales de formalización»
   - **When** ejecuta la acción «Abrir enlaces oficiales de formalización»
   - **Then** el sistema muestra la información específica de «Abrir enlaces oficiales de formalización».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC078
   - **Given** la solicitud de «Abrir enlaces oficiales de formalización» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 3 - Mostrar progreso sin declarar estatus legal [UC079] (Priority: P1)
Como prestador, quiero mostrar progreso sin declarar estatus legal, para gestionar específicamente mostrar progreso sin declarar estatus legal dentro de CONectaSM.

**Why this priority**: UC079 permite a Prestador mostrar progreso sin declarar estatus legal; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Mostrar progreso sin declarar estatus legal», verificar que UC079 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Mostrar progreso sin declarar estatus legal para UC079
   - **Given** un prestador autorizado dispone de los datos de «Mostrar progreso sin declarar estatus legal»
   - **When** ejecuta la acción «Mostrar progreso sin declarar estatus legal»
   - **Then** el sistema muestra la información específica de «Mostrar progreso sin declarar estatus legal».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC079
   - **Given** la solicitud de «Mostrar progreso sin declarar estatus legal» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 4 - Vincular ruta institucional futura <<Future>> [UC080] (Priority: P3)
Como prestador, quiero vincular ruta institucional futura <<future>>, para gestionar específicamente vincular ruta institucional futura <<future>> dentro de CONectaSM.

**Why this priority**: UC080 permite a Prestador vincular ruta institucional futura <<future>>; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Vincular ruta institucional futura <<Future>>», verificar que UC080 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Vincular ruta institucional futura <<Future>> para UC080
   - **Given** un prestador autorizado dispone de los datos de «Vincular ruta institucional futura <<Future>>»
   - **When** ejecuta la acción «Vincular ruta institucional futura <<Future>>»
   - **Then** el sistema guarda «Vincular ruta institucional futura <<Future>>» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC080
   - **Given** la solicitud de «Vincular ruta institucional futura <<Future>>» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Un enlace oficial roto debe mostrarse como no disponible sin afirmar que el trámite fue completado.
- La ruta es informativa y no declara estatus legal; los enlaces y la integración institucional futura requieren fuentes y políticas por definir.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-077**: El sistema DEBE permitir que un Prestador ejecute «Consultar ruta de formalización» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC077]
- **FR-078**: El sistema DEBE permitir que un Prestador ejecute «Abrir enlaces oficiales de formalización» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC078]
- **FR-079**: El sistema DEBE permitir que un Prestador ejecute «Mostrar progreso sin declarar estatus legal» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC079]
- **FR-080**: El sistema DEBE permitir que un Prestador ejecute «Vincular ruta institucional futura <<Future>>» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC080]
### Key Entities *(include if feature involves data)*

- **Registro específico de Ruta de formalización**: información que los CUs (UC077,UC078,UC079,UC080) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC077,UC078,UC079,UC080 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
