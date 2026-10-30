# Feature Specification: SPEC-18 — Insignia y progreso de formalización

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC088 
## User Scenarios & Testing _(mandatory)_

### User Story 1 - Insignia de progreso de formalización `<<Could>>` [UC088] (Priority: P3)

Como Cliente o Prestador, quiero ver una insignia que resuma el progreso de formalización de un Prestador, para tener una referencia visual rápida sin leer el detalle completo de su ruta.

**Why this priority**: Es una capa visual de conveniencia sobre datos que ya existirían en `spec-13`; no aporta información nueva, solo la resume.

**Independent Test**: Con un Prestador con distintos niveles de progreso de formalización, mostrar su insignia y verificar que nunca se presenta como una certificación.

**Acceptance Scenarios**:

1. **Scenario**: Capacidad deshabilitada (comportamiento por defecto)
    
    - **Given** la insignia no está habilitada
    - **When** un Cliente o Prestador consulta un perfil
    - **Then** el sistema no la presenta como disponible; el progreso detallado sigue siendo consultable en `spec-13`
2. **Scenario**: Insignia no engañosa
    
    - **Given** la insignia está habilitada y un Prestador tiene progreso declarado en `spec-13`
    - **When** se muestra su insignia
    - **Then** el sistema la presenta junto con una indicación explícita de que representa progreso orientativo y no una certificación o estatus legal
3. **Scenario**: Progreso al máximo nivel
    
    - **Given** un Prestador alcanza el nivel más alto de progreso definido
    - **When** se muestra su insignia
    - **Then** el sistema mantiene la misma indicación de que no equivale a certificación, igual que en cualquier otro nivel

---

### Edge Cases

- Recalcular el progreso base no debe convertir retroactivamente ninguna insignia histórica en una certificación.
- Si el progreso base se elimina o resetea, la insignia debe reflejar el nuevo valor de inmediato, no un valor cacheado.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-088**: El sistema PUEDE mostrar una insignia de progreso de formalización derivada del progreso definido en `spec-13` (UC079), pero NO DEBE representarla como estado legal o certificación en ningún nivel, y DEBE permanecer deshabilitada sin afectar `spec-13` mientras no exista aprobación explícita. [UC088]

### Key Entities _(include if feature involves data)_

- **Insignia de formalización**: representación visual resumida del progreso definido en `spec-13`; no es una entidad de datos independiente, sino una vista derivada.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las insignias mostradas incluye la indicación de que no equivalen a certificación o estatus legal, en cualquier nivel de progreso.
- **SC-002**: La desactivación de la insignia no impide consultar el progreso detallado definido en `spec-13`.

