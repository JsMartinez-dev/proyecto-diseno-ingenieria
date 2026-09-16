# Feature Specification: SPEC-12 — Administración, moderación y gestión de riesgos

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC068,UC069,UC070,UC071,UC072,UC073,UC074,UC075,UC076

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC071 extiende la cola UC070 y UC072 extiende la revisión UC071.
### User Story 1 - Administrar categorías de servicios [UC068] (Priority: P1)
Como administrador, quiero administrar categorías de servicios, para gestionar específicamente administrar categorías de servicios dentro de CONectaSM.

**Why this priority**: UC068 permite a Administrador administrar categorías de servicios; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de administrador y un registro de prueba de «Administrar categorías de servicios», verificar que UC068 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Administrar categorías de servicios para UC068
   - **Given** un administrador autorizado dispone de los datos de «Administrar categorías de servicios»
   - **When** ejecuta la acción «Administrar categorías de servicios»
   - **Then** el sistema guarda «Administrar categorías de servicios» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC068
   - **Given** la solicitud de «Administrar categorías de servicios» no identifica un registro válido o el actor no tiene el rol Administrador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Administrar zonas [UC069] (Priority: P1)
Como administrador, quiero administrar zonas, para gestionar específicamente administrar zonas dentro de CONectaSM.

**Why this priority**: UC069 permite a Administrador administrar zonas; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de administrador y un registro de prueba de «Administrar zonas», verificar que UC069 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Administrar zonas para UC069
   - **Given** un administrador autorizado dispone de los datos de «Administrar zonas»
   - **When** ejecuta la acción «Administrar zonas»
   - **Then** el sistema guarda «Administrar zonas» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC069
   - **Given** la solicitud de «Administrar zonas» no identifica un registro válido o el actor no tiene el rol Administrador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 3 - Consultar cola de reportes [UC070] (Priority: P1)
Como administrador, quiero consultar cola de reportes, para gestionar específicamente consultar cola de reportes dentro de CONectaSM.

**Why this priority**: UC070 permite a Administrador consultar cola de reportes; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de administrador y un registro de prueba de «Consultar cola de reportes», verificar que UC070 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar cola de reportes para UC070
   - **Given** un administrador autorizado dispone de los datos de «Consultar cola de reportes»
   - **When** ejecuta la acción «Consultar cola de reportes»
   - **Then** el sistema muestra la información específica de «Consultar cola de reportes».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC070
   - **Given** la solicitud de «Consultar cola de reportes» no identifica un registro válido o el actor no tiene el rol Administrador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 4 - Revisar detalle de reporte [UC071] (Priority: P1)
Como administrador, quiero revisar detalle de reporte, para gestionar específicamente revisar detalle de reporte dentro de CONectaSM.

**Why this priority**: UC071 permite a Administrador revisar detalle de reporte; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de administrador y un registro de prueba de «Revisar detalle de reporte», verificar que UC071 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Revisar detalle de reporte para UC071
   - **Given** un administrador autorizado dispone de los datos de «Revisar detalle de reporte»
   - **When** ejecuta la acción «Revisar detalle de reporte»
   - **Then** el sistema guarda «Revisar detalle de reporte» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC071
   - **Given** la solicitud de «Revisar detalle de reporte» no identifica un registro válido o el actor no tiene el rol Administrador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 5 - Cambiar estado y resolver reporte [UC072] (Priority: P1)
Como administrador, quiero cambiar estado y resolver reporte, para gestionar específicamente cambiar estado y resolver reporte dentro de CONectaSM.

**Why this priority**: UC072 permite a Administrador cambiar estado y resolver reporte; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de administrador y un registro de prueba de «Cambiar estado y resolver reporte», verificar que UC072 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Cambiar estado y resolver reporte para UC072
   - **Given** un administrador autorizado dispone de los datos de «Cambiar estado y resolver reporte»
   - **When** ejecuta la acción «Cambiar estado y resolver reporte»
   - **Then** el sistema guarda «Cambiar estado y resolver reporte» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC072
   - **Given** la solicitud de «Cambiar estado y resolver reporte» no identifica un registro válido o el actor no tiene el rol Administrador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 6 - Bloquear preventivamente una cuenta [UC073] (Priority: P1)
Como administrador, quiero bloquear preventivamente una cuenta, para gestionar específicamente bloquear preventivamente una cuenta dentro de CONectaSM.

**Why this priority**: UC073 permite a Administrador bloquear preventivamente una cuenta; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de administrador y un registro de prueba de «Bloquear preventivamente una cuenta», verificar que UC073 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Bloquear preventivamente una cuenta para UC073
   - **Given** un administrador autorizado dispone de los datos de «Bloquear preventivamente una cuenta»
   - **When** ejecuta la acción «Bloquear preventivamente una cuenta»
   - **Then** el sistema guarda «Bloquear preventivamente una cuenta» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC073
   - **Given** la solicitud de «Bloquear preventivamente una cuenta» no identifica un registro válido o el actor no tiene el rol Administrador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 7 - Moderar perfil o contenido [UC074] (Priority: P1)
Como administrador, quiero moderar perfil o contenido, para gestionar específicamente moderar perfil o contenido dentro de CONectaSM.

**Why this priority**: UC074 permite a Administrador moderar perfil o contenido; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de administrador y un registro de prueba de «Moderar perfil o contenido», verificar que UC074 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Moderar perfil o contenido para UC074
   - **Given** un administrador autorizado dispone de los datos de «Moderar perfil o contenido»
   - **When** ejecuta la acción «Moderar perfil o contenido»
   - **Then** el sistema guarda «Moderar perfil o contenido» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC074
   - **Given** la solicitud de «Moderar perfil o contenido» no identifica un registro válido o el actor no tiene el rol Administrador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 8 - Buscar usuarios y perfiles [UC075] (Priority: P1)
Como administrador, quiero buscar usuarios y perfiles, para gestionar específicamente buscar usuarios y perfiles dentro de CONectaSM.

**Why this priority**: UC075 permite a Administrador buscar usuarios y perfiles; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de administrador y un registro de prueba de «Buscar usuarios y perfiles», verificar que UC075 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Buscar usuarios y perfiles para UC075
   - **Given** un administrador autorizado dispone de los datos de «Buscar usuarios y perfiles»
   - **When** ejecuta la acción «Buscar usuarios y perfiles»
   - **Then** el sistema muestra la información específica de «Buscar usuarios y perfiles».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC075
   - **Given** la solicitud de «Buscar usuarios y perfiles» no identifica un registro válido o el actor no tiene el rol Administrador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 9 - Gestionar servicios de alto riesgo [UC076] (Priority: P1)
Como administrador, quiero gestionar servicios de alto riesgo, para gestionar específicamente gestionar servicios de alto riesgo dentro de CONectaSM.

**Why this priority**: UC076 permite a Administrador gestionar servicios de alto riesgo; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de administrador y un registro de prueba de «Gestionar servicios de alto riesgo», verificar que UC076 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Gestionar servicios de alto riesgo para UC076
   - **Given** un administrador autorizado dispone de los datos de «Gestionar servicios de alto riesgo»
   - **When** ejecuta la acción «Gestionar servicios de alto riesgo»
   - **Then** el sistema guarda «Gestionar servicios de alto riesgo» en el registro seleccionado y muestra su nuevo estado.

2. **Scenario**: Datos insuficientes o actor no autorizado en UC076
   - **Given** la solicitud de «Gestionar servicios de alto riesgo» no identifica un registro válido o el actor no tiene el rol Administrador
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Una cuenta bloqueada preventivamente debe conservar trazabilidad; duración, apelación y umbrales quedan [NEEDS CLARIFICATION: definir].
- Solo el Administrador ejecuta estas capacidades; las políticas concretas de bloqueo, moderación y alto riesgo quedan [NEEDS CLARIFICATION: definir criterios, duración y autoridad].

## Requirements *(mandatory)*

### Functional Requirements

- **FR-068**: El sistema DEBE permitir que un Administrador ejecute «Administrar categorías de servicios» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC068]
- **FR-069**: El sistema DEBE permitir que un Administrador ejecute «Administrar zonas» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC069]
- **FR-070**: El sistema DEBE permitir que un Administrador ejecute «Consultar cola de reportes» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC070]
- **FR-071**: El sistema DEBE permitir que un Administrador ejecute «Revisar detalle de reporte» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC071]
- **FR-072**: El sistema DEBE permitir que un Administrador ejecute «Cambiar estado y resolver reporte» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC072]
- **FR-073**: El sistema DEBE permitir que un Administrador ejecute «Bloquear preventivamente una cuenta» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC073]
- **FR-074**: El sistema DEBE permitir que un Administrador ejecute «Moderar perfil o contenido» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC074]
- **FR-075**: El sistema DEBE permitir que un Administrador ejecute «Buscar usuarios y perfiles» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC075]
- **FR-076**: El sistema DEBE permitir que un Administrador ejecute «Gestionar servicios de alto riesgo» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC076]
### Key Entities *(include if feature involves data)*

- **Registro específico de Administración, moderación y gestión de riesgos**: información que los CUs (UC068,UC069,UC070,UC071,UC072,UC073,UC074,UC075,UC076) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC068,UC069,UC070,UC071,UC072,UC073,UC074,UC075,UC076 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
