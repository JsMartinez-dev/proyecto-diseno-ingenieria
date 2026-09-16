# Feature Specification: SPEC-06 — Compatibilidad y oportunidades de servicio

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC034–UC038

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Determinación de compatibilidad (Priority: P1)

Como prestador, quiero que el sistema determine qué solicitudes coinciden con mis categorías, zona y disponibilidad.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Crear una solicitud compatible y comprobar que es identificada como oportunidad.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de determinación de compatibilidad
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en determinación de compatibilidad
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### User Story 2 - Tablero de oportunidades (Priority: P1)

Como prestador, quiero consultar, filtrar y abrir oportunidades para decidir cuáles atender.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Consultar el tablero, aplicar filtros y abrir el detalle de una oportunidad compatible.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de tablero de oportunidades
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en tablero de oportunidades
   - **Given** falta un dato obligatorio o el estado no permite la operación
   - **When** el actor intenta completar la acción
   - **Then** el sistema rechaza la operación, explica el motivo y conserva la información válida

---

### Edge Cases

- Si faltan datos obligatorios, el sistema identifica cada campo pendiente y no crea un registro incompleto.
- Si el actor pierde la sesión o la red falla, el sistema no confirma una operación que no haya sido persistida.
- Si el estado del recurso cambió en otra operación, el sistema informa el conflicto y solicita consultar la información actualizada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE comparar categorías, zona y disponibilidad para determinar compatibilidad.
- **FR-002**: El sistema DEBE mostrar oportunidades compatibles en un tablero del prestador.
- **FR-003**: El sistema DEBE permitir filtrar oportunidades por criterios disponibles.
- **FR-004**: El sistema DEBE mostrar el detalle de la oportunidad sin exponer la dirección exacta.
- **FR-005**: El sistema DEBE notificar nuevas oportunidades compatibles según las preferencias vigentes.

### Key Entities *(include if feature involves data)*

- **Regla de compatibilidad**: categorías, distancia aproximada, disponibilidad y estado.
- **Oportunidad**: solicitud compatible, nivel de coincidencia y fecha de detección.
- **Notificación**: destinatario, oportunidad, canal, fecha y estado de entrega.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una solicitud fuera de zona o categoría no aparece como oportunidad compatible.
- **SC-002**: El tablero informa cuando no existen oportunidades en lugar de mostrar datos incompletos.
- **SC-003**: Una nueva coincidencia genera como máximo una notificación por canal y evento.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC034–UC038.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
