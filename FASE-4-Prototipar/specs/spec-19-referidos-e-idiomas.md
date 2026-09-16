# Feature Specification: SPEC-19 — Programa de referidos e idiomas adicionales

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC089,UC092

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: <<Could>> Las reglas de elegibilidad, beneficios y traducciones quedan [NEEDS CLARIFICATION: definir antes de habilitar].
### User Story 1 - Programa de referidos <<Could>> [UC089] (Priority: P2)
Como usuario, quiero una capacidad candidata de programa de referidos [UC089], para evaluar si CONectaSM debería ofrecerla; disponibilidad, elegibilidad, beneficios, reglas anti-auto-referido y tratamiento de datos quedan [NEEDS CLARIFICATION: definir].

**Why this priority**: UC089 es una capacidad informativa <<Could>> para Usuario; no implica habilitación, generación de beneficios, persistencia ni estado de referido.

**Independent Test**: Con una cuenta de usuario, verificar que, si UC089 no está habilitado, no se presenta como disponible; si se habilitara, confirmar elegibilidad, beneficios y reglas documentadas [NEEDS CLARIFICATION: definir].

**Acceptance Scenarios**:

1. **Scenario**: UC089 no habilitado
   - **Given** la capacidad candidata de programa de referidos [UC089] no está habilitada
   - **When** un usuario consulta las capacidades disponibles
   - **Then** el sistema no la presenta como disponible ni simula invitaciones, beneficios, registros o estados.

2. **Scenario**: UC089 habilitado sin reglas definidas
   - **Given** una activación de UC089 requiere decidir canal, disponibilidad, elegibilidad, beneficios, anti-auto-referido y datos tratados
   - **When** se intenta habilitarlo
   - **Then** el sistema exige documentar esas decisiones [NEEDS CLARIFICATION: definir] y no afirma que genere beneficios o muestre estados antes de ello.

### User Story 2 - Idiomas adicionales <<Could>> [UC092] (Priority: P2)
Como usuario, quiero una capacidad candidata de idiomas adicionales [UC092], para evaluar si CONectaSM debería ofrecerla; disponibilidad, idiomas, cobertura, traducción, proveedor y tratamiento de contenido quedan [NEEDS CLARIFICATION: definir].

**Why this priority**: UC092 es una capacidad informativa <<Could>> para Usuario; no implica habilitación, traducción disponible, persistencia ni estado de idioma.

**Independent Test**: Con una cuenta de usuario, verificar que, si UC092 no está habilitado, no se presenta como disponible; si se habilitara, confirmar idiomas, cobertura y reglas documentadas [NEEDS CLARIFICATION: definir].

**Acceptance Scenarios**:

1. **Scenario**: UC092 no habilitado
   - **Given** la capacidad candidata de idiomas adicionales [UC092] no está habilitada
   - **When** un usuario consulta las capacidades disponibles
   - **Then** el sistema no la presenta como disponible ni simula traducciones, contenido o estados.

2. **Scenario**: UC092 habilitado sin reglas definidas
   - **Given** una activación de UC092 requiere decidir idiomas, cobertura, proveedor, traducción y datos tratados
   - **When** se intenta habilitarlo
   - **Then** el sistema exige documentar esas decisiones [NEEDS CLARIFICATION: definir] y no afirma que traduzca, guarde o muestre estados antes de ello.

---

### Edge Cases

- Un referido propio o duplicado no debe generar un beneficio; la política exacta queda [NEEDS CLARIFICATION: definir].
- <<Could>> Las reglas de elegibilidad, beneficios y traducciones quedan [NEEDS CLARIFICATION: definir antes de habilitar].

## Requirements *(mandatory)*

### Functional Requirements

- **FR-089**: El sistema DEBE tratar «Programa de referidos <<Could>>» [UC089] como capacidad candidata e informativa para Usuario; si no está habilitada, no debe presentarla como disponible. Canal, disponibilidad, elegibilidad, beneficios, reglas anti-auto-referido y tratamiento de datos quedan [NEEDS CLARIFICATION: definir].
- **FR-092**: El sistema DEBE tratar «Idiomas adicionales <<Could>>» [UC092] como capacidad candidata e informativa para Usuario; si no está habilitada, no debe presentarla como disponible. Idiomas, cobertura, proveedor, traducción y tratamiento de contenido quedan [NEEDS CLARIFICATION: definir].
### Key Entities *(include if feature involves data)*

- **Registro específico de Programa de referidos e idiomas adicionales**: entidad candidata asociada a los CUs (UC089,UC092); si se consulta, crea o actualiza información queda [NEEDS CLARIFICATION: definir].
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: no definidos por el diagrama; cualquier beneficio, traducción, mensaje, evidencia, retención o formato queda [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las superficies de CONectaSM no presenta UC089 ni UC092 como disponibles mientras no exista una decisión de habilitación documentada.
- **SC-002**: Si se evalúa su habilitación, ninguna invitación, beneficio, traducción, cambio de datos o estado se genera sin reglas documentadas [NEEDS CLARIFICATION: definir].
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
