# Feature Specification: SPEC-03 — Descubrimiento de prestadores

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC014,UC015

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: UC015 extiende UC014 para consultar el detalle desde resultados.
### User Story 1 - Buscar prestadores por categoría y zona [UC014] (Priority: P1)
Como cliente, quiero buscar prestadores por categoría y zona, para gestionar específicamente buscar prestadores por categoría y zona dentro de CONectaSM.

**Why this priority**: UC014 permite a Cliente buscar prestadores por categoría y zona; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Buscar prestadores por categoría y zona», verificar que UC014 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Buscar prestadores por categoría y zona para UC014
   - **Given** un cliente autorizado dispone de los datos de «Buscar prestadores por categoría y zona»
   - **When** ejecuta la acción «Buscar prestadores por categoría y zona»
   - **Then** el sistema muestra la información específica de «Buscar prestadores por categoría y zona».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC014
   - **Given** la solicitud de «Buscar prestadores por categoría y zona» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

### User Story 2 - Consultar perfil público del prestador [UC015] (Priority: P1)
Como cliente, quiero consultar perfil público del prestador, para gestionar específicamente consultar perfil público del prestador dentro de CONectaSM.

**Why this priority**: UC015 permite a Cliente consultar perfil público del prestador; el resultado se limita a la operación descrita en el diagrama.

**Independent Test**: Con una cuenta de cliente y un registro de prueba de «Consultar perfil público del prestador», verificar que UC015 muestra o guarda el resultado indicado sin ejecutar otro CU.

**Acceptance Scenarios**:

1. **Scenario**: Consultar perfil público del prestador para UC015
   - **Given** un cliente autorizado dispone de los datos de «Consultar perfil público del prestador»
   - **When** ejecuta la acción «Consultar perfil público del prestador»
   - **Then** el sistema muestra la información específica de «Consultar perfil público del prestador».

2. **Scenario**: Datos insuficientes o actor no autorizado en UC015
   - **Given** la solicitud de «Consultar perfil público del prestador» no identifica un registro válido o el actor no tiene el rol Cliente
   - **When** intenta confirmar la operación
   - **Then** el sistema rechaza la operación, no modifica el registro y comunica la causa

---

### Edge Cases

- Un resultado sin perfil público disponible debe indicar que el detalle no está disponible sin revelar datos privados.
- El descubrimiento debe conservar la privacidad de la ubicación y distinguir resultados de perfiles públicos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-014**: El sistema DEBE permitir que cliente ejecute «Buscar prestadores por categoría y zona» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC014]
- **FR-015**: El sistema DEBE permitir que cliente ejecute «Consultar perfil público del prestador» y debe mostrar o guardar el resultado específico de esa operación, sin concederla a otros roles. [UC015]
### Key Entities *(include if feature involves data)*

- **Registro específico de Descubrimiento de prestadores**: información que los CUs (UC014,UC015) consultan, crean, actualizan o muestran.
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: valor confirmado, mensaje mostrado y evidencia asociada; retención y formatos quedan [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los CUs UC014,UC015 solo permite la acción al actor asignado en su diagrama y devuelve el resultado de su operación específica.
- **SC-002**: Ante datos faltantes, registro inexistente o rol incorrecto, ninguna operación cambia datos y la interfaz informa la causa.
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
