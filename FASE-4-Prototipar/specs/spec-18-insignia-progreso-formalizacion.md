# Feature Specification: SPEC-18 — Insignia y progreso de formalización

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC088

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: <<Could>> La insignia es informativa y no equivale a certificación o estatus legal.
### User Story 1 - Insignia de progreso de formalización <<Could>> [UC088] (Priority: P2)
Como cliente o prestador, quiero una capacidad candidata de insignia de progreso de formalización [UC088], para evaluar si CONectaSM debería ofrecerla; disponibilidad, criterios, elegibilidad, fuente de datos y tratamiento de la insignia quedan [NEEDS CLARIFICATION: definir].

**Why this priority**: UC088 es una capacidad informativa <<Could>> para Cliente o Prestador; no implica habilitación, certificación, estatus legal, persistencia ni estado de progreso.

**Independent Test**: Con una cuenta de cliente o prestador, verificar que, si UC088 no está habilitado, no se presenta como disponible; si se habilitara, confirmar criterios y reglas documentadas [NEEDS CLARIFICATION: definir].

**Acceptance Scenarios**:

1. **Scenario**: UC088 no habilitado
   - **Given** la capacidad candidata de insignia de progreso de formalización [UC088] no está habilitada
   - **When** un cliente o prestador consulta las capacidades disponibles
   - **Then** el sistema no la presenta como disponible ni simula insignias, progreso o estados.

2. **Scenario**: UC088 habilitado sin reglas definidas
   - **Given** una activación de UC088 requiere decidir disponibilidad, criterios, elegibilidad, fuente y tratamiento de datos
   - **When** se intenta habilitarlo
   - **Then** el sistema exige documentar esas decisiones [NEEDS CLARIFICATION: definir] y no afirma que calcule, guarde o muestre progreso antes de ello.

---

### Edge Cases

- Recalcular progreso no debe convertir una insignia en certificación legal.
- <<Could>> La insignia es informativa y no equivale a certificación o estatus legal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-088**: El sistema DEBE tratar «Insignia de progreso de formalización <<Could>>» [UC088] como capacidad candidata e informativa para Cliente o Prestador; si no está habilitada, no debe presentarla como disponible. Criterios, elegibilidad, fuente y tratamiento de datos quedan [NEEDS CLARIFICATION: definir], y no equivale a certificación o estatus legal.
### Key Entities *(include if feature involves data)*

- **Registro específico de Insignia y progreso de formalización**: entidad candidata asociada al CU (UC088); si se consulta, crea o actualiza información queda [NEEDS CLARIFICATION: definir].
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: no definidos por el diagrama; cualquier insignia, progreso, mensaje, evidencia, retención o formato queda [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las superficies de CONectaSM no presenta UC088 como disponible mientras no exista una decisión de habilitación documentada.
- **SC-002**: Si se evalúa su habilitación, ninguna insignia, progreso o estado se calcula, muestra o guarda sin reglas documentadas [NEEDS CLARIFICATION: definir].
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
