# Feature Specification: SPEC-17 — Mapa visual de prestadores

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC087

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: <<Could>> El mapa debe mostrar solo zonas aproximadas; la precisión y proveedor cartográfico quedan [NEEDS CLARIFICATION: definir].
### User Story 1 - Mapa visual de prestadores <<Could>> [UC087] (Priority: P2)
Como cliente, quiero una capacidad candidata de mapa visual de prestadores [UC087], para evaluar si CONectaSM debería ofrecerla; disponibilidad, elegibilidad, precisión, proveedor cartográfico y tratamiento de ubicación quedan [NEEDS CLARIFICATION: definir].

**Why this priority**: UC087 es una capacidad informativa <<Could>> para Cliente; no implica habilitación, publicación de marcadores, persistencia ni estados.

**Independent Test**: Con una cuenta de cliente, verificar que, si UC087 no está habilitado, no se presenta como disponible; si se habilitara, confirmar precisión, proveedor y reglas documentadas [NEEDS CLARIFICATION: definir].

**Acceptance Scenarios**:

1. **Scenario**: UC087 no habilitado
   - **Given** la capacidad candidata de mapa visual de prestadores [UC087] no está habilitada
   - **When** un cliente consulta las capacidades disponibles
   - **Then** el sistema no la presenta como disponible ni simula marcadores, zonas o estados.

2. **Scenario**: UC087 habilitado sin reglas definidas
   - **Given** una activación de UC087 requiere decidir disponibilidad, elegibilidad, precisión, proveedor cartográfico y datos de ubicación
   - **When** se intenta habilitarlo
   - **Then** el sistema exige documentar esas decisiones [NEEDS CLARIFICATION: definir] y no afirma que muestre o guarde ubicaciones antes de ello.

---

### Edge Cases

- Un marcador sin zona aproximada válida debe omitirse, nunca sustituirse por una dirección exacta.
- <<Could>> El mapa debe mostrar solo zonas aproximadas; la precisión y proveedor cartográfico quedan [NEEDS CLARIFICATION: definir].

## Requirements *(mandatory)*

### Functional Requirements

- **FR-087**: El sistema DEBE tratar «Mapa visual de prestadores <<Could>>» [UC087] como capacidad candidata e informativa para Cliente; si no está habilitada, no debe presentarla como disponible. Disponibilidad, elegibilidad, precisión, proveedor y tratamiento de ubicación quedan [NEEDS CLARIFICATION: definir].
### Key Entities *(include if feature involves data)*

- **Registro específico de Mapa visual de prestadores**: entidad candidata asociada al CU (UC087); si se consulta, crea o actualiza información queda [NEEDS CLARIFICATION: definir].
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: no definidos por el diagrama; cualquier zona, marcador, mensaje, evidencia, retención o formato queda [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las superficies de CONectaSM no presenta UC087 como disponible mientras no exista una decisión de habilitación documentada.
- **SC-002**: Si se evalúa su habilitación, ninguna ubicación exacta, marcador o estado se muestra o guarda sin reglas documentadas [NEEDS CLARIFICATION: definir].
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
