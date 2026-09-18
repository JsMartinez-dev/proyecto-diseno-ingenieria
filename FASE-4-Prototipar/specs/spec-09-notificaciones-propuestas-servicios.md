# Feature Specification: SPEC-09 — Notificaciones de propuestas y servicios

**Creado**: 2026-09-16
**Casos de uso cubiertos**: Ninguno; UC057 y UC058 son eventos automáticos asociados a otros casos de uso

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Notificar la aceptación de una propuesta [Evento UC057] (Priority: P1)

Como prestador, quiero ser notificado automáticamente cuando un cliente acepta mi propuesta, para saber sin demora que debo iniciar el servicio contratado.

**Why this priority**: Sin esta notificación, el Prestador dependería de consultar manualmente el estado de cada propuesta enviada para saber si fue aceptada.

**Independent Test**: Con una propuesta activa de un Prestador, hacer que un Cliente la acepte (UC046) y verificar que el Prestador recibe la notificación correspondiente; simular una falla en el canal de entrega y verificar que el evento de aceptación sigue siendo consultable sin duplicar el aviso al recuperarse.

**Acceptance Scenarios**:

1. **Scenario**: Notificación disparada por la aceptación [Evento UC057]
    
    - **Given** un Cliente acepta la propuesta de un Prestador
    - **When** la aceptación se confirma
    - **Then** el sistema notifica automáticamente al Prestador seleccionado, sin que ningún actor deba solicitar esa notificación por separado
2. **Scenario**: Falla en el canal de notificación
    
    - **Given** el canal de entrega de notificaciones falla en el momento de la aceptación
    - **When** el canal se recupera
    - **Then** el evento de aceptación permanece consultable por el Prestador (por ejemplo, en el detalle del servicio) y el sistema no duplica el aviso al reintentar la entrega
3. **Scenario**: Intento de generar la notificación sin una aceptación real
    
    - **Given** no ha ocurrido ninguna aceptación de propuesta
    - **When** se intenta generar o forzar una notificación de aceptación
    - **Then** el sistema no permite crear una notificación de aceptación sin una aceptación real asociada

### User Story 2 - Notificar cambios de estado del servicio [Evento UC058] (Priority: P1)

Como cliente o prestador, quiero ser notificado automáticamente cuando la otra parte cambie el estado del servicio contratado, para conocer su avance sin tener que consultarlo manualmente cada vez.

**Why this priority**: El ciclo de vida del servicio (SPEC-08) involucra a ambas partes; sin notificaciones, cada cambio de estado quedaría oculto para quien no lo ejecutó hasta que decida consultarlo.

**Independent Test**: Con un servicio contratado entre un Cliente y un Prestador, hacer que el Prestador lo marque en ejecución y verificar que el Cliente es notificado; repetir para terminado, confirmación de finalización y cancelación, verificando en cada caso que se notifica a la contraparte de quien ejecutó la acción.

**Acceptance Scenarios**:

1. **Scenario**: Notificación por una transición ejecutada por el Prestador [Evento UC058]
    
    - **Given** un Prestador marca su servicio contratado como en ejecución o como terminado
    - **When** la transición se confirma
    - **Then** el sistema notifica automáticamente al Cliente de ese servicio sobre el nuevo estado
2. **Scenario**: Notificación por una transición ejecutada por el Cliente [Evento UC058]
    
    - **Given** un Cliente confirma la finalización de su servicio
    - **When** la confirmación se registra
    - **Then** el sistema notifica automáticamente al Prestador sobre el cierre del servicio
3. **Scenario**: Notificación por cancelación [Evento UC058]
    
    - **Given** un Cliente o un Prestador cancela un servicio contratado
    - **When** la cancelación se confirma
    - **Then** el sistema notifica automáticamente a la otra parte sobre la cancelación
4. **Scenario**: Falla en el canal de notificación
    
    - **Given** el canal de entrega falla al momento de un cambio de estado
    - **When** el canal se recupera
    - **Then** el evento de cambio de estado permanece consultable (por ejemplo, en el historial de estados) y el sistema no duplica el aviso

---

### Edge Cases

- El canal de notificación falla en el momento de una aceptación o de un cambio de estado: el sistema debe mantener el evento consultable en su origen y no debe duplicar el aviso al reintentar la entrega.
- Se intenta generar una notificación de aceptación o de cambio de estado sin que haya ocurrido el evento que la origina: el sistema debe impedirlo, dado que estas notificaciones son siempre una extensión de un evento real, nunca una acción independiente.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-057**: El sistema DEBE notificar automáticamente al Prestador cuya propuesta fue aceptada, disparado exclusivamente por la aceptación de esa propuesta, sin que ningún actor lo ejecute como acción independiente. _(Evento automático de UC046)_
- **FR-058**: El sistema DEBE notificar automáticamente a la contraparte del servicio (Cliente o Prestador) cuando este cambie de estado por marcar en ejecución, marcar como terminado, confirmar finalización o cancelar, disparado exclusivamente por esas transiciones. _(Evento automático de UC051, UC052, UC053 y UC054)_

### Key Entities _(include if feature involves data)_

- **Notificación de aceptación**: aviso generado hacia el Prestador cuando su propuesta es aceptada; incluye referencia al servicio contratado resultante.
- **Notificación de cambio de estado**: aviso generado hacia la contraparte de quien ejecuta una transición del servicio; incluye el nuevo estado y referencia al servicio.
- **Canal de entrega**: mecanismo por el cual el actor "Proveedor de notificaciones" hace llegar estos avisos.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las aceptaciones de propuesta genera una notificación hacia el Prestador correspondiente.
- **SC-002**: El 100% de las transiciones de estado del servicio (en ejecución, terminado, finalización confirmada, cancelado) genera una notificación hacia la contraparte de quien la ejecutó.
- **SC-003**: Ante una falla del canal de entrega, el 100% de los eventos de aceptación o cambio de estado permanece consultable en su origen sin generar avisos duplicados al recuperarse.
- **SC-004**: El 100% de los intentos de generar una notificación sin un evento real asociado es rechazado.
