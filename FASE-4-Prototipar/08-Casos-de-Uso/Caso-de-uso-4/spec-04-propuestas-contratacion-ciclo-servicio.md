# Feature Specification: UC-04 — Propuestas, contratación y ciclo de vida del servicio

**Creado**: 2026-09-11  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear propuesta [US-045] (Priority: P1)

Como prestador elegible, quiero crear una propuesta para ofrecer condiciones concretas a una solicitud abierta.

**Why this priority**: Es el mecanismo que conecta oportunidad con contratación.

**Independent Test**: Se prueba desde una oportunidad elegible creando una propuesta con precio/rango, disponibilidad y mensaje; debe quedar asociada a la solicitud.

**Acceptance Scenarios**:

1. **Scenario**: Propuesta válida
   - **Given** una solicitud está abierta y el prestador es elegible
   - **When** envía una propuesta con los datos requeridos
   - **Then** la propuesta queda activa y asociada a la solicitud y al prestador

2. **Scenario**: Solicitud no disponible
   - **Given** la solicitud fue cancelada/cerrada o el prestador no es elegible
   - **When** intenta crear propuesta
   - **Then** el sistema rechaza la creación sin generar una propuesta activa

---

### User Story 2 - Definir precio o rango [US-046] (Priority: P1)

Como prestador, quiero indicar un precio o rango en mi propuesta para comunicar la condición económica del servicio.

**Why this priority**: Es información central para comparar y aceptar propuestas.

**Independent Test**: Se prueba creando una propuesta con el formato de precio permitido y verificando persistencia.

**Acceptance Scenarios**:

1. **Scenario**: Precio válido
   - **Given** el prestador prepara una propuesta
   - **When** define un valor o rango permitido
   - **Then** el sistema lo asocia a la propuesta

---

### User Story 3 - Indicar disponibilidad [US-047] (Priority: P1)

Como prestador, quiero indicar disponibilidad en la propuesta para comunicar cuándo podría realizar el servicio.

**Why this priority**: Permite al cliente comparar viabilidad temporal.

**Independent Test**: Se prueba registrando una disponibilidad válida en la propuesta y consultándola como cliente.

**Acceptance Scenarios**:

1. **Scenario**: Disponibilidad en propuesta
   - **Given** el prestador crea o edita una propuesta activa
   - **When** indica disponibilidad válida
   - **Then** la información queda disponible para el cliente

---

### User Story 4 - Agregar mensaje [US-048] (Priority: P1)

Como prestador, quiero agregar un mensaje a mi propuesta para contextualizar alcance, condiciones o preguntas.

**Why this priority**: Aporta contexto para la decisión del cliente y forma parte incluida de crear propuesta.

**Independent Test**: Se prueba enviando un mensaje permitido y verificando que acompaña a la propuesta.

**Acceptance Scenarios**:

1. **Scenario**: Mensaje asociado
   - **Given** el prestador prepara una propuesta
   - **When** incluye un mensaje válido
   - **Then** el mensaje queda asociado y visible para el cliente según reglas

---

### User Story 5 - Consultar propuestas recibidas [US-052] (Priority: P1)

Como cliente, quiero ver las propuestas recibidas para evaluar opciones para mi solicitud.

**Why this priority**: Es el punto de entrada del cliente al proceso de selección.

**Independent Test**: Se prueba con una solicitud que tenga propuestas activas y verificando que el propietario puede consultarlas.

**Acceptance Scenarios**:

1. **Scenario**: Listado de propuestas
   - **Given** una solicitud del cliente tiene propuestas
   - **When** el cliente consulta propuestas recibidas
   - **Then** el sistema muestra las propuestas autorizadas asociadas a esa solicitud

---

### User Story 6 - Comparar propuestas y perfiles [US-053] (Priority: P1)

Como cliente, quiero comparar propuestas y perfiles de los prestadores para seleccionar la alternativa más adecuada.

**Why this priority**: Soporta la decisión previa a aceptar una propuesta.

**Independent Test**: Se prueba seleccionando varias propuestas y verificando que la comparación presenta información equivalente de propuesta y perfil.

**Acceptance Scenarios**:

1. **Scenario**: Comparación
   - **Given** existen al menos dos propuestas para la solicitud
   - **When** el cliente usa la comparación
   - **Then** el sistema presenta criterios comparables sin mezclar datos entre propuestas

---

### User Story 7 - Aceptar propuesta [US-054] (Priority: P1)

Como cliente, quiero aceptar una propuesta para contratar al prestador seleccionado.

**Why this priority**: Es el evento transaccional principal que debe cerrar alternativas, crear el servicio y habilitar coordinación.

**Independent Test**: Se prueba aceptando una propuesta activa y verificando de forma atómica los efectos incluidos: propuesta seleccionada, cierre de no seleccionadas, servicio creado, coordinación habilitada y aviso correspondiente.

**Acceptance Scenarios**:

1. **Scenario**: Aceptación exitosa
   - **Given** la solicitud está abierta y la propuesta elegida está activa
   - **When** el cliente acepta la propuesta
   - **Then** la propuesta queda seleccionada, se crea el servicio contratado, se cierran las demás propuestas y se habilita coordinación

2. **Scenario**: Aceptación concurrente
   - **Given** otra operación ya cerró/aceptó la solicitud
   - **When** se intenta aceptar una segunda propuesta
   - **Then** el sistema impide una segunda contratación para la misma solicitud

---

### User Story 8 - Cerrar propuestas no seleccionadas [US-055] (Priority: P1)

Como sistema, quiero cerrar las propuestas no seleccionadas al aceptar una propuesta para preservar un único resultado de contratación.

**Why this priority**: Es una regla automática obligatoria incluida en la aceptación.

**Independent Test**: Se prueba aceptando una de varias propuestas y verificando que todas las restantes dejan de estar activas.

**Acceptance Scenarios**:

1. **Scenario**: Cierre automático
   - **Given** una solicitud tiene varias propuestas activas
   - **When** el cliente acepta una de ellas
   - **Then** todas las propuestas no seleccionadas cambian a un estado cerrado/no seleccionable

---

### User Story 9 - Crear registro de servicio contratado [US-056] (Priority: P1)

Como sistema, quiero crear un registro de servicio cuando se acepta una propuesta para gestionar el ciclo de vida posterior.

**Why this priority**: Es el agregado transaccional que soporta ejecución, finalización, cancelación e historial.

**Independent Test**: Se prueba aceptando una propuesta y verificando que existe un único servicio relacionado con solicitud, cliente, prestador y propuesta.

**Acceptance Scenarios**:

1. **Scenario**: Servicio creado
   - **Given** una propuesta activa es aceptada válidamente
   - **When** se completa la aceptación
   - **Then** el sistema crea un registro único de servicio contratado con las relaciones necesarias

---

### User Story 10 - Habilitar datos de coordinación [US-057] (Priority: P1)

Como participante de un servicio contratado, quiero disponer de los datos de coordinación autorizados después de la aceptación.

**Why this priority**: Materializa la regla de que datos sensibles como la dirección exacta no se exponen antes de contratar.

**Independent Test**: Se prueba comparando la visibilidad antes y después de aceptar una propuesta.

**Acceptance Scenarios**:

1. **Scenario**: Coordinación posterior a aceptación
   - **Given** existe un servicio contratado entre cliente y prestador
   - **When** los participantes consultan la información de coordinación
   - **Then** el sistema habilita únicamente los datos/canal autorizados para ese servicio

2. **Scenario**: Sin contratación
   - **Given** la solicitud sigue abierta sin propuesta aceptada
   - **When** un prestador intenta acceder a datos de coordinación protegidos
   - **Then** el sistema los mantiene ocultos

---

### User Story 11 - Consultar detalle del servicio [US-058] (Priority: P1)

Como participante del servicio, quiero consultar sus detalles para conocer condiciones y estado actual.

**Why this priority**: Es la vista base del ciclo de vida del servicio para ambas partes.

**Independent Test**: Se prueba desde Cliente y Prestador vinculados y desde un tercero no vinculado.

**Acceptance Scenarios**:

1. **Scenario**: Participante autorizado
   - **Given** el usuario es cliente o prestador del servicio
   - **When** consulta el detalle
   - **Then** el sistema muestra datos autorizados y estado actual

2. **Scenario**: Tercero no autorizado
   - **Given** un usuario no participa en el servicio
   - **When** intenta consultar el detalle
   - **Then** el sistema deniega el acceso

---

### User Story 12 - Marcar servicio en ejecución [US-059] (Priority: P1)

Como prestador, quiero marcar el servicio como en ejecución para reflejar que el trabajo comenzó.

**Why this priority**: Inicia la etapa operativa y genera notificación de cambio de estado.

**Independent Test**: Se prueba desde un servicio en estado permitido y verificando transición e historial/notificación.

**Acceptance Scenarios**:

1. **Scenario**: Inicio de ejecución
   - **Given** el servicio contratado está en un estado que permite iniciar
   - **When** el prestador lo marca en ejecución
   - **Then** el estado cambia de forma válida y se registra/notifica el cambio

---

### User Story 13 - Marcar trabajo como terminado [US-060] (Priority: P1)

Como prestador, quiero marcar el trabajo como terminado para solicitar la confirmación del cliente.

**Why this priority**: Prepara la finalización y posterior reputación/calificación.

**Independent Test**: Se prueba desde un servicio en ejecución y verificando la transición a terminado pendiente de confirmación.

**Acceptance Scenarios**:

1. **Scenario**: Trabajo terminado
   - **Given** el servicio está en ejecución
   - **When** el prestador marca el trabajo como terminado
   - **Then** el sistema registra el nuevo estado y avisa el cambio

---

### User Story 14 - Confirmar finalización [US-061] (Priority: P1)

Como cliente, quiero confirmar la finalización para cerrar formalmente el ciclo del servicio.

**Why this priority**: Establece el servicio finalizado, base para historial y reputación.

**Independent Test**: Se prueba confirmando un trabajo marcado terminado y verificando el estado final correspondiente.

**Acceptance Scenarios**:

1. **Scenario**: Confirmación válida
   - **Given** el prestador marcó el trabajo como terminado
   - **When** el cliente confirma la finalización
   - **Then** el servicio pasa al estado finalizado y el cambio queda registrado/notificado

---

### User Story 15 - Consultar historial de estados [US-063] (Priority: P1)

Como participante, quiero consultar el historial de estados del servicio para tener trazabilidad de su evolución.

**Why this priority**: Aporta auditabilidad funcional y resolución de discrepancias.

**Independent Test**: Se prueba ejecutando varias transiciones y verificando que el historial conserva el orden y los estados registrados.

**Acceptance Scenarios**:

1. **Scenario**: Historial de transiciones
   - **Given** un servicio ha cambiado de estado varias veces
   - **When** un participante autorizado consulta el historial
   - **Then** el sistema presenta las transiciones registradas en orden coherente

---

### User Story 16 - Editar propuesta activa [US-049] (Priority: P2)

Como prestador, quiero editar una propuesta mientras esté activa para ajustar sus condiciones antes de la selección.

**Why this priority**: Permite corregir condiciones sin crear propuestas duplicadas.

**Independent Test**: Se prueba editando una propuesta activa propia y verificando que una cerrada/aceptada no se edita.

**Acceptance Scenarios**:

1. **Scenario**: Edición activa
   - **Given** la propuesta pertenece al prestador y está activa
   - **When** modifica campos permitidos
   - **Then** el sistema guarda los cambios

2. **Scenario**: Propuesta cerrada
   - **Given** la propuesta ya no está activa
   - **When** se intenta editar
   - **Then** el sistema rechaza la modificación

---

### User Story 17 - Retirar propuesta [US-050] (Priority: P2)

Como prestador, quiero retirar una propuesta activa cuando ya no deseo participar.

**Why this priority**: Evita que el cliente acepte una oferta que el prestador ya no puede sostener.

**Independent Test**: Se prueba retirando una propuesta activa y verificando que deja de ser seleccionable.

**Acceptance Scenarios**:

1. **Scenario**: Retiro de propuesta
   - **Given** la propuesta propia está activa
   - **When** el prestador confirma retiro
   - **Then** la propuesta queda retirada y no puede ser aceptada

---

### User Story 18 - Notificar propuesta recibida [US-051] (Priority: P2)

Como cliente, quiero recibir una notificación cuando llega una propuesta para reaccionar oportunamente.

**Why this priority**: Reduce tiempo hasta selección y es parte incluida de la creación de propuesta.

**Independent Test**: Se prueba creando una propuesta válida y verificando la generación del aviso para el propietario de la solicitud.

**Acceptance Scenarios**:

1. **Scenario**: Nueva propuesta
   - **Given** una propuesta válida se crea para una solicitud abierta
   - **When** se completa la creación
   - **Then** se genera una notificación para el cliente conforme a sus preferencias

---

### User Story 19 - Cancelar servicio contratado [US-062] (Priority: P2)

Como participante, quiero cancelar un servicio contratado cuando corresponda para cerrar un compromiso que no continuará.

**Why this priority**: Gestiona excepciones operativas del ciclo de vida.

**Independent Test**: Se prueba solicitando cancelación desde estados permitidos y verificando estado, historial y notificación.

**Acceptance Scenarios**:

1. **Scenario**: Cancelación permitida
   - **Given** el servicio está en un estado cancelable y el actor está autorizado
   - **When** confirma la cancelación
   - **Then** el servicio pasa a cancelado y se registra/notifica la transición

2. **Scenario**: Cancelación no permitida
   - **Given** el estado no admite cancelación
   - **When** el actor intenta cancelar
   - **Then** el sistema rechaza la transición

---

### User Story 20 - Usar canal de coordinación autorizado [US-064] (Priority: P2)

Como participantes de un servicio contratado, queremos usar el canal de coordinación autorizado para organizar la prestación.

**Why this priority**: Es necesario para la ejecución, pero la fuente deja abierta la decisión entre chat interno, teléfono tras aceptación o WhatsApp.

**Independent Test**: Se prueba que solo participantes contratados acceden al mecanismo seleccionado y que antes de aceptación no queda habilitado.

**Acceptance Scenarios**:

1. **Scenario**: Coordinación autorizada
   - **Given** existe un servicio contratado
   - **When** cliente o prestador accede al canal/datos definidos
   - **Then** el sistema permite la coordinación según la decisión de producto

2. **Scenario**: Coordinación prematura
   - **Given** no existe servicio contratado
   - **When** se intenta acceder al mecanismo protegido
   - **Then** el sistema no lo habilita

---

### User Story 21 - Notificar aceptación de propuesta [US-089] (Priority: P2)

Como prestador, quiero ser notificado cuando mi propuesta es aceptada para iniciar coordinación y ejecución.

**Why this priority**: Conecta la decisión del cliente con la acción del prestador.

**Independent Test**: Se prueba aceptando una propuesta y verificando que el prestador seleccionado recibe/genera el aviso correspondiente.

**Acceptance Scenarios**:

1. **Scenario**: Propuesta aceptada
   - **Given** el cliente acepta una propuesta válida
   - **When** se completa la contratación
   - **Then** se genera una notificación para el prestador seleccionado

---

### User Story 22 - Notificar cambios de estado del servicio [US-090] (Priority: P2)

Como participante, quiero ser notificado cuando cambia el estado del servicio para mantenerme informado.

**Why this priority**: Reduce desalineación durante ejecución, finalización o cancelación.

**Independent Test**: Se prueba cada transición notificada definida en el diagrama y verificando que el participante contraparte recibe/genera el evento.

**Acceptance Scenarios**:

1. **Scenario**: Cambio de estado
   - **Given** el servicio cambia válidamente a ejecución, terminado, finalizado o cancelado
   - **When** se persiste la transición
   - **Then** el sistema genera el aviso correspondiente según preferencias

---

### Edge Cases

- Dos aceptaciones se procesan casi al mismo tiempo sobre propuestas diferentes de la misma solicitud: solo una puede confirmar contratación; la otra debe fallar de forma controlada.
- El prestador retira o edita una propuesta al mismo tiempo que el cliente intenta aceptarla: la operación debe validar el estado vigente y evitar aceptar una versión no válida.
- La solicitud se cancela mientras se envía una propuesta: la creación debe validar el estado actual y no dejar una propuesta activa huérfana.
- Falla la generación/entrega de una notificación después de persistir una transición: el estado de negocio no debe revertirse únicamente por el fallo del canal; debe existir estrategia de reintento/registro. 
- Un usuario no participante intenta ver datos de coordinación o detalle protegido: acceso denegado.
- Un servicio finalizado intenta volver a ejecución o ser finalizado dos veces: transición inválida bloqueada/idempotente según corresponda.
- Una cancelación compite con marcar terminado/finalizado: debe persistir una única transición válida basada en el estado actual.

## Requirements *(mandatory)*

### Requisitos Funcionales

- **FR-001**: El sistema DEBE permitir que un Prestador elegible cree como máximo la(s) propuesta(s) activa(s) permitida(s) por el producto para una solicitud abierta.
- **FR-002**: El sistema DEBE registrar un precio o rango de precios en una propuesta utilizando un modelo de moneda y validación definido.
- **FR-003**: El sistema DEBE registrar la disponibilidad del Prestador en una propuesta.
- **FR-004**: El sistema DEBE permitir que un Prestador incluya un mensaje en la propuesta, sujeto a las reglas de contenido.
- **FR-005**: El sistema DEBE permitir que los Prestadores editen únicamente sus propias propuestas activas.
- **FR-006**: El sistema DEBE permitir que los Prestadores retiren únicamente las propuestas que aún puedan ser retiradas y DEBE hacer que las propuestas retiradas no puedan ser seleccionadas.
- **FR-007**: El sistema DEBE notificar al Cliente cuando se reciba una propuesta válida, sujeto a las preferencias de notificación.
- **FR-008**: El sistema DEBE permitir que un Cliente consulte las propuestas asociadas a sus propias solicitudes.
- **FR-009**: El sistema DEBE permitir la comparación de los términos de las propuestas y de los datos relevantes del perfil público del Prestador.
- **FR-010**: El sistema DEBE permitir que el Cliente acepte únicamente una propuesta activa asociada a una solicitud abierta y seleccionable.
- **FR-011**: El sistema DEBE cerrar de forma atómica todas las propuestas activas no seleccionadas cuando se acepta una propuesta.
- **FR-012**: El sistema DEBE crear de forma atómica exactamente un registro de servicio contratado a partir de una aceptación exitosa de propuesta.
- **FR-013**: El sistema DEBE habilitar los datos de coordinación únicamente después de una contratación exitosa y DEBE mantener los datos protegidos de ubicación exacta inaccesibles antes de ese momento.
- **FR-014**: El sistema DEBE permitir que únicamente los participantes del servicio consulten los detalles protegidos del servicio.
- **FR-015**: El sistema DEBE hacer cumplir las transiciones de estado válidas del servicio para los estados en progreso, trabajo terminado, finalización confirmada por el Cliente y cancelación.
- **FR-016**: El sistema DEBE conservar un historial ordenado de las transiciones de estado del servicio.
- **FR-017**: El sistema DEBE proporcionar un mecanismo de coordinación definido por el producto para los participantes del servicio contratado.
- **FR-018**: El sistema DEBE notificar al Prestador seleccionado cuando una propuesta sea aceptada.
- **FR-019**: El sistema DEBE notificar a los participantes correspondientes sobre los cambios de estado del servicio representados por la US-090, sujeto a las preferencias de notificación.
- **FR-020**: El sistema DEBE gestionar la aceptación concurrente de propuestas de manera que una solicitud no pueda generar múltiples servicios contratados exitosamente, a menos que el producto modifique explícitamente dicha regla.
### Key Entities *(include if feature involves data)*

- **Propuesta**: Oferta de un Prestador para una Solicitud; contiene estado, precio/rango, disponibilidad, mensaje y relación con prestador/solicitud.
- **Solicitud de servicio**: Demanda del Cliente que puede recibir propuestas mientras su estado lo permita.
- **Servicio contratado**: Registro creado al aceptar una propuesta; vincula cliente, prestador, solicitud, propuesta y estado operativo.
- **Estado de servicio**: Estado actual dentro del ciclo contratado.
- **Historial de estados**: Secuencia trazable de transiciones del servicio.
- **Dato/canal de coordinación**: Información o mecanismo habilitado únicamente a los participantes autorizados después de contratación.
- **Notificación**: Aviso asociado a propuesta recibida, aceptación o cambio de estado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de aceptaciones exitosas de propuestas producen exactamente un servicio contratado y cierran todas las propuestas no seleccionadas de esa solicitud.
- **SC-002**: 0 casos de prueba concurrente producen dos servicios contratados para una única solicitud cuando el modelo exige selección única.
- **SC-003**: 100% de accesos a datos de coordinación antes de la contratación son rechazados.
- **SC-004**: 100% de transiciones de estado inválidas incluidas en la suite de aceptación son rechazadas sin alterar el estado vigente.
- **SC-005**: El historial reproduce todas las transiciones exitosas del servicio en orden y sin omitir el estado resultante.
- **SC-006**: Al menos 95% de clientes de prueba pueden revisar y aceptar una propuesta válida sin asistencia.
