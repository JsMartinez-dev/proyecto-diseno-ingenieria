# Feature Specification: SPEC-17 — Mapa visual de prestadores

**Creado**: 2026-09-16  
**Casos de uso cubiertos**: UC087

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exploración geográfica (Priority: P2)

Como cliente, quiero explorar prestadores en un mapa visual para descubrir opciones cercanas sin ver direcciones exactas.

**Why this priority**: Esta funcionalidad aporta valor directo al flujo de la plataforma y su prioridad refleja su dependencia y relevancia para el alcance definido.

**Independent Test**: Abrir el mapa, aplicar una zona y comprobar que los marcadores representan zonas aproximadas.

**Acceptance Scenarios**:

1. **Scenario**: Flujo exitoso de exploración geográfica
   - **Given** el actor tiene permisos y los datos requeridos son válidos
   - **When** ejecuta la acción principal del caso de uso
   - **Then** el sistema completa la operación y deja el resultado trazable

2. **Scenario**: Datos inválidos o condición no permitida en exploración geográfica
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

- **FR-001**: El sistema DEBE mostrar prestadores visibles en una representación geográfica aproximada.
- **FR-002**: El sistema DEBE permitir filtrar los resultados del mapa por categoría y zona.
- **FR-003**: El sistema DEBE evitar mostrar coordenadas o direcciones exactas protegidas.
- **FR-004**: El sistema DEBE permitir abrir el perfil público desde un marcador.

### Key Entities *(include if feature involves data)*

- **Marcador**: prestador, zona general, categorías y estado de visibilidad.
- **Consulta geográfica**: centro, nivel de detalle, filtros y fecha.
- **Regla de privacidad**: precisión máxima permitida y datos excluidos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El mapa no muestra marcadores sin ubicación aproximada válida.
- **SC-002**: El nivel de precisión nunca permite inferir una dirección exacta.
- **SC-003**: Una consulta sin resultados presenta un estado vacío comprensible.

## Trazabilidad

- **Diagrama de origen**: Casos de uso UC087.
- **Alcance**: La especificación describe el comportamiento observable y no prescribe tecnologías ni rutas de implementación.
