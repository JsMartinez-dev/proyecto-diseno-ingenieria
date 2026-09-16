# Feature Specification: SPEC-11 — Reportes y evidencias

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC065,UC066,UC067

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC067 extiende UC064, UC065 o UC066.
### User Story 1 - Reportar usuario [UC065] (Priority: P1)
Como usuario, quiero reportar usuario, para gestionar específicamente reportar usuario dentro de CONectaSM.

**Why this priority**: UC065 permite a Usuario reportar usuario; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Reportar usuario», verificar que UC065 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Reportar usuario para UC065
   - **Given** un usuario autorizado dispone de los datos de «Reportar usuario»
   - **When** ejecuta la acción «Reportar usuario»
   - **Then** el sistema registra la solicitud «Reportar usuario» asociada al usuario o servicio seleccionado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC065
   - **Given** la solicitud de «Reportar usuario» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Reportar servicio [UC066] (Priority: P1)
Como usuario, quiero reportar servicio, para gestionar específicamente reportar servicio dentro de CONectaSM.

**Why this priority**: UC066 permite a Usuario reportar servicio; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Reportar servicio», verificar que UC066 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Reportar servicio para UC066
   - **Given** un usuario autorizado dispone de los datos de «Reportar servicio»
   - **When** ejecuta la acción «Reportar servicio»
   - **Then** el sistema registra la solicitud «Reportar servicio» asociada al usuario o servicio seleccionado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC066
   - **Given** la solicitud de «Reportar servicio» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 3 - Adjuntar evidencia a reporte [UC067] (Priority: P1)
Como usuario, quiero adjuntar evidencia a reporte, para gestionar específicamente adjuntar evidencia a reporte dentro de CONectaSM.

**Why this priority**: UC067 permite a Usuario adjuntar evidencia a reporte; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Adjuntar evidencia a reporte», verificar que UC067 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Adjuntar evidencia a reporte para UC067
   - **Given** un usuario autorizado dispone de los datos de «Adjuntar evidencia a reporte»
   - **When** ejecuta la acción «Adjuntar evidencia a reporte»
   - **Then** el sistema guarda «Adjuntar evidencia a reporte» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC067
   - **Given** la solicitud de «Adjuntar evidencia a reporte» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Un archivo incompatible o demasiado grande debe rechazarse sin perder el reporte ya guardado; límites concretos quedan [NEEDS CLARIFICATION: definir].
- La evidencia es una extensión opcional del reporte y debe conservar asociación con el objetivo reportado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-065**: El sistema DEBE permitir que un Usuario ejecute «Reportar usuario» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC065]
- **FR-066**: El sistema DEBE permitir que un Usuario ejecute «Reportar servicio» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC066]
- **FR-067**: El sistema DEBE permitir que un Usuario ejecute «Adjuntar evidencia a reporte» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC067]
### Key Entities *(include if feature involves data)*

- **Registro específico de Reportes y evidencias**: información que los CUs (UC065,UC066,UC067) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC065,UC066,UC067 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
