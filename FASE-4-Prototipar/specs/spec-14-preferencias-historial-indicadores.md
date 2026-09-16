# Feature Specification: SPEC-14 — Preferencias, historial e indicadores

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC081,UC082,UC083,UC084,UC085

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC083 extiende la consulta de historial UC082.
### User Story 1 - Configurar preferencias de notificación [UC081] (Priority: P1)
Como usuario, quiero configurar preferencias de notificación, para gestionar específicamente configurar preferencias de notificación dentro de CONectaSM.

**Why this priority**: UC081 permite a Usuario configurar preferencias de notificación; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Configurar preferencias de notificación», verificar que UC081 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Configurar preferencias de notificación para UC081
   - **Given** un usuario autorizado dispone de los datos de «Configurar preferencias de notificación»
   - **When** ejecuta la acción «Configurar preferencias de notificación»
   - **Then** el sistema guarda «Configurar preferencias de notificación» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC081
   - **Given** la solicitud de «Configurar preferencias de notificación» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Consultar historial de trabajos [UC082] (Priority: P1)
Como usuario, quiero consultar historial de trabajos, para gestionar específicamente consultar historial de trabajos dentro de CONectaSM.

**Why this priority**: UC082 permite a Usuario consultar historial de trabajos; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Consultar historial de trabajos», verificar que UC082 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar historial de trabajos para UC082
   - **Given** un usuario autorizado dispone de los datos de «Consultar historial de trabajos»
   - **When** ejecuta la acción «Consultar historial de trabajos»
   - **Then** el sistema muestra la información específica de «Consultar historial de trabajos».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC082
   - **Given** la solicitud de «Consultar historial de trabajos» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 3 - Descargar historial [UC083] (Priority: P1)
Como usuario, quiero descargar historial, para gestionar específicamente descargar historial dentro de CONectaSM.

**Why this priority**: UC083 permite a Usuario descargar historial; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Descargar historial», verificar que UC083 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Descargar historial para UC083
   - **Given** un usuario autorizado dispone de los datos de «Descargar historial»
   - **When** ejecuta la acción «Descargar historial»
   - **Then** el sistema guarda «Descargar historial» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC083
   - **Given** la solicitud de «Descargar historial» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 4 - Consultar indicadores básicos del prestador [UC084] (Priority: P1)
Como prestador, quiero consultar indicadores básicos del prestador, para gestionar específicamente consultar indicadores básicos del prestador dentro de CONectaSM.

**Why this priority**: UC084 permite a Prestador consultar indicadores básicos del prestador; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de prestador y un registro de prueba de «Consultar indicadores básicos del prestador», verificar que UC084 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar indicadores básicos del prestador para UC084
   - **Given** un prestador autorizado dispone de los datos de «Consultar indicadores básicos del prestador»
   - **When** ejecuta la acción «Consultar indicadores básicos del prestador»
   - **Then** el sistema muestra la información específica de «Consultar indicadores básicos del prestador».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC084
   - **Given** la solicitud de «Consultar indicadores básicos del prestador» no identifica un registro válido o el actor no tiene el rol Prestador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 5 - Consultar actividad reciente [UC085] (Priority: P1)
Como usuario, quiero consultar actividad reciente, para gestionar específicamente consultar actividad reciente dentro de CONectaSM.

**Why this priority**: UC085 permite a Usuario consultar actividad reciente; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de usuario y un registro de prueba de «Consultar actividad reciente», verificar que UC085 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar actividad reciente para UC085
   - **Given** un usuario autorizado dispone de los datos de «Consultar actividad reciente»
   - **When** ejecuta la acción «Consultar actividad reciente»
   - **Then** el sistema muestra la información específica de «Consultar actividad reciente».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC085
   - **Given** la solicitud de «Consultar actividad reciente» no identifica un registro válido o el actor no tiene el rol Usuario
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Una descarga interrumpida no debe cambiar el historial ni exponer registros de otro usuario.
- Cada usuario solo consulta su información autorizada; el alcance y cálculo exacto de indicadores queda [NEEDS CLARIFICATION: definir métricas y periodo].

## Requirements *(mandatory)*

### Functional Requirements

- **FR-081**: El sistema DEBE permitir que un Usuario ejecute «Configurar preferencias de notificación» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC081]
- **FR-082**: El sistema DEBE permitir que un Usuario ejecute «Consultar historial de trabajos» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC082]
- **FR-083**: El sistema DEBE permitir que un Usuario ejecute «Descargar historial» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC083]
- **FR-084**: El sistema DEBE permitir que un Prestador ejecute «Consultar indicadores básicos del prestador» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC084]
- **FR-085**: El sistema DEBE permitir que un Usuario ejecute «Consultar actividad reciente» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC085]
### Key Entities *(include if feature involves data)*

- **Registro específico de Preferencias, historial e indicadores**: información que los CUs (UC081,UC082,UC083,UC084,UC085) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC081,UC082,UC083,UC084,UC085 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
