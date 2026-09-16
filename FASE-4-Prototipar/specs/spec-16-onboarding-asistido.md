# Feature Specification: SPEC-16 — Onboarding asistido

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC091

## User Scenarios & Testing *(mandatory)*

> Relaciones del diagrama: <<Could>> El acompañamiento puede involucrar Prestador o Gestor comunitario; el canal, disponibilidad y tratamiento de datos quedan [NEEDS CLARIFICATION: definir].
### User Story 1 - Onboarding asistido por WhatsApp o gestor <<Could>> [UC091] (Priority: P2)
Como prestador/gestor comunitario, quiero una capacidad candidata de onboarding asistido por WhatsApp o Gestor comunitario [UC091], para evaluar si CONectaSM debería ofrecerla; canal, disponibilidad, elegibilidad, actor, proveedor y tratamiento de datos quedan [NEEDS CLARIFICATION: definir].

**Why this priority**: UC091 es una capacidad informativa <<Could>> para Prestador o Gestor comunitario; no implica habilitación, creación de registros ni un estado de onboarding.

**Independent Test**: Con una cuenta de prestador/gestor comunitario, verificar que, si UC091 no está habilitado, no se presenta como disponible; si se habilitara, confirmar la activación y reglas documentadas [NEEDS CLARIFICATION: definir].

**Acceptance Scenarios**:

1. **Scenario**: UC091 no habilitado
   - **Given** la capacidad candidata de onboarding asistido [UC091] no está habilitada
   - **When** un prestador o Gestor comunitario consulta las capacidades disponibles
   - **Then** el sistema no la presenta como disponible ni simula acompañamiento, registro o estado.

2. **Scenario**: UC091 habilitado sin reglas definidas
   - **Given** una activación de UC091 requiere decidir canal, disponibilidad, elegibilidad, actor, proveedor y datos tratados
   - **When** se intenta habilitarlo
   - **Then** el sistema exige documentar esas decisiones [NEEDS CLARIFICATION: definir] y no afirma que cree registros o muestre estados antes de ello.

---

### Edge Cases

- Si el Gestor no está disponible, no debe presentarse una sesión de onboarding como realizada.
- <<Could>> El acompañamiento puede involucrar Prestador o Gestor comunitario; el canal, disponibilidad y tratamiento de datos quedan [NEEDS CLARIFICATION: definir].

## Requirements *(mandatory)*

### Functional Requirements

- **FR-091**: El sistema DEBE tratar «Onboarding asistido por WhatsApp o gestor <<Could>>» [UC091] como capacidad candidata e informativa para Prestador o Gestor comunitario; si no está habilitada, no debe presentarla como disponible. Canal, disponibilidad, elegibilidad, proveedor y tratamiento de datos quedan [NEEDS CLARIFICATION: definir].
### Key Entities *(include if feature involves data)*

- **Registro específico de Onboarding asistido**: entidad candidata asociada al CU (UC091); si se consulta, crea o actualiza información queda [NEEDS CLARIFICATION: definir].
- **Actor asignado y autorización**: identidad del actor indicado en el diagrama y permiso requerido para cada operación.
- **Estado y resultado de cada operación**: no definidos por el diagrama; cualquier valor, mensaje, evidencia, retención o formato queda [NEEDS CLARIFICATION: definir].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las superficies de CONectaSM no presenta UC091 como disponible mientras no exista una decisión de habilitación documentada.
- **SC-002**: Si se evalúa su habilitación, ninguna operación inicia acompañamiento, cambia datos o muestra estados sin reglas documentadas [NEEDS CLARIFICATION: definir].
- **SC-003**: Los estados, filtros, evidencias o políticas no definidos en los diagramas se presentan como [NEEDS CLARIFICATION: definir política antes de implementar].
