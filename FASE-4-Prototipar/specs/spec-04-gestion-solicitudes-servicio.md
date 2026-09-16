# Feature Specification: SPEC-04 — Gestión de solicitudes de servicio

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC016, UC017, UC018, UC019, UC020, UC021, UC022, UC023 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Publicar una solicitud de servicio [UC016, UC017, UC018, UC019] (Priority: P1)

Como cliente, quiero crear una solicitud de servicio definiendo obligatoriamente su zona aproximada y su urgencia, pudiendo adjuntar fotos y decidiendo si la publico de inmediato o la conservo como borrador, para conseguir prestadores sin necesidad de revelar mi dirección exacta.

**Why this priority**: Es la acción central del Cliente en CONectaSM: sin la posibilidad de publicar una solicitud completa no existe demanda visible que los prestadores puedan atender, y de ella dependen todas las historias posteriores de esta especificación.

**Independent Test**: Con una cuenta de Cliente, completar zona y urgencia y publicar sin adjuntar fotos, repetir adjuntando una foto, repetir eligiendo conservar como borrador en lugar de publicar. Verificar que cada camino produce el estado correcto, ya sea publicada o borrador, sin duplicar el registro y sin permitir una publicación incompleta.

**Acceptance Scenarios**:

1. **Scenario**: Publicación completa con datos obligatorios [UC017]
    
    - **Given** un Cliente indica categoría, descripción, zona aproximada y nivel de urgencia de su solicitud
    - **When** confirma la publicación
    - **Then** el sistema crea la solicitud en estado «publicada», visible para prestadores de esa categoría y zona, mostrando la zona aproximada pero no la dirección exacta del Cliente
2. **Scenario**: Intento de publicar sin zona o sin urgencia [UC017]
    
    - **Given** un Cliente intenta publicar una solicitud sin haber definido la zona aproximada o el nivel de urgencia
    - **When** confirma la publicación
    - **Then** el sistema rechaza la operación, señala el campo faltante y no crea ningún registro
3. **Scenario**: Adjuntar fotos de forma opcional [UC016]
    
    - **Given** un Cliente está redactando su solicitud antes de confirmarla
    - **When** adjunta una o más fotos del problema o del lugar
    - **Then** el sistema las asocia a la solicitud y las incluye al publicarla; si el Cliente no adjunta ninguna foto, la publicación se completa igualmente sin ellas
4. **Scenario**: Conservar como borrador en lugar de publicar [UC019]
    
    - **Given** un Cliente completó parcial o totalmente los datos de su solicitud
    - **When** elige conservar como borrador en lugar de confirmar la publicación
    - **Then** el sistema guarda la solicitud en estado «borrador», no visible para prestadores, y permite retomarla más adelante para completarla o publicarla
5. **Scenario**: Pérdida de conexión durante la publicación
    
    - **Given** un Cliente confirma la publicación de su solicitud y la conexión se interrumpe antes de recibir respuesta
    - **When** la conexión se restablece
    - **Then** el sistema conserva el último estado confirmado (borrador o publicada), sin duplicar la solicitud
6. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Cliente intenta publicar o guardar como borrador una solicitud
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso a la funcionalidad

### User Story 2 - Gestionar una solicitud abierta [UC020, UC021] (Priority: P1)

Como cliente, quiero editar o cancelar una solicitud que sigue abierta, para corregir su información o desistir del servicio antes de que se concrete con un prestador.

**Why this priority**: Las solicitudes reales cambian: el Cliente necesita poder corregir datos o retirar su solicitud sin depender de contactar manualmente a cada prestador interesado.

**Independent Test**: Con una solicitud propia en estado abierto, editar uno de sus campos y verificar el cambio; sobre otra solicitud propia, cancelarla y verificar que deja de estar disponible para prestadores; repetir ambas operaciones sobre una solicitud ya cerrada o contratada y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Editar una solicitud abierta [UC020]
    
    - **Given** un Cliente tiene una solicitud propia en estado «publicada» o «borrador»
    - **When** modifica uno de sus datos (categoría, descripción, zona, urgencia o fotos) y confirma
    - **Then** el sistema guarda el cambio y muestra el estado actualizado de la solicitud
2. **Scenario**: Intento de editar una solicitud que ya no está abierta [UC020]
    
    - **Given** una solicitud propia ya fue cancelada o pasó a un estado en el que ya no admite cambios (por ejemplo, contratada)
    - **When** el Cliente intenta editarla
    - **Then** el sistema rechaza la edición y comunica que la solicitud ya no admite cambios
3. **Scenario**: Cancelar una solicitud abierta [UC021]
    
    - **Given** un Cliente tiene una solicitud propia abierta
    - **When** confirma su cancelación
    - **Then** el sistema marca la solicitud como «cancelada», deja de mostrarla a los prestadores y conserva su historial
4. **Scenario**: Intento de cancelar una solicitud que ya no está abierta [UC021]
    
    - **Given** una solicitud propia ya fue cancelada previamente o ya no está en estado abierto
    - **When** el Cliente intenta cancelarla de nuevo
    - **Then** el sistema rechaza la operación sin cambiar el estado actual
5. **Scenario**: Actor no autorizado o solicitud ajena [UC20], [UC021]
    
    - **Given** un actor sin rol Cliente, o un Cliente que intenta editar o cancelar una solicitud que no le pertenece
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación sin modificar ningún registro

### User Story 3 - Consultar mis solicitudes [UC022, UC023] (Priority: P1)

Como cliente, quiero ver la lista de mis solicitudes y el detalle y estado de cada una, para dar seguimiento a mis oportunidades de servicio sin depender de recordar cada caso manualmente.

**Why this priority**: Sin visibilidad sobre sus propias solicitudes, el Cliente no puede saber qué está pendiente, publicado, cancelado o en borrador, reintroduciendo la fragmentación que el proyecto busca resolver.

**Independent Test**: Con al menos dos solicitudes propias en distintos estados, listar las solicitudes del Cliente y verificar que aparecen todas y solo las suyas; abrir el detalle de una de ellas y verificar que refleja su estado y datos actuales sin exponer información de otros clientes.

**Acceptance Scenarios**:

1. **Scenario**: Consultar la lista de solicitudes propias [UC022]
    
    - **Given** un Cliente tiene una o más solicitudes creadas (publicadas, en borrador o cerradas)
    - **When** consulta su lista de solicitudes
    - **Then** el sistema muestra únicamente las solicitudes de ese Cliente, indicando el estado de cada una
2. **Scenario**: Lista vacía
    
    - **Given** un Cliente aún no ha creado ninguna solicitud
    - **When** consulta su lista de solicitudes
    - **Then** el sistema muestra la lista vacía sin producir un error
3. **Scenario**: Consultar detalle y estado de una solicitud propia [UC023]
    
    - **Given** un Cliente selecciona una de sus solicitudes
    - **When** consulta su detalle
    - **Then** el sistema muestra los datos completos de la solicitud (categoría, descripción, zona aproximada, urgencia, fotos y estado actual)
4. **Scenario**: Intento de consultar una solicitud inexistente o ajena
    
    - **Given** un Cliente intenta consultar el detalle de una solicitud que no existe o que pertenece a otro Cliente
    - **When** realiza la consulta
    - **Then** el sistema rechaza la operación sin revelar si la solicitud existe bajo otro dueño
5. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Cliente intenta consultar la lista o el detalle de solicitudes
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

---

### Edge Cases

- Un cliente pierde la conexión durante la publicación o edición de una solicitud: el sistema debe conservar el último estado confirmado y no duplicar la solicitud.
- Un cliente intenta editar o cancelar un servicio que ya fue contratada por un prestador: el sistema debe bloquear la edición o cancelación inmediatamente y notificar que es imposible modificar un servicio ya acordado.
## Requirements _(mandatory)_

### Functional Requirements

- **FR-017**: El sistema DEBE exigir zona aproximada y nivel de urgencia como datos obligatorios en toda publicación de solicitud, incluidos siempre dentro del flujo de publicación. _(UC017, incluido en UC018)_
- **FR-018**: El sistema DEBE permitir que un Cliente publique una solicitud completa (categoría, descripción, zona aproximada, urgencia y fotos opcionales), dejándola visible para prestadores de esa categoría y zona sin revelar la dirección exacta, y DEBE rechazar la publicación si falta algún dato obligatorio. _(UC018)_
- **FR-016**: El sistema DEBE permitir, de forma opcional, adjuntar una o más fotos a la solicitud antes o durante su publicación, sin que su ausencia impida publicar. _(UC016, extiende a UC018)_
- **FR-019**: El sistema DEBE permitir, como alternativa a publicar, conservar la solicitud como borrador no visible para prestadores, retomable posteriormente. _(UC019, extiende a UC018)_
- **FR-020**: El sistema DEBE permitir que un Cliente edite los datos de una solicitud propia mientras esté en estado abierto (publicada o borrador), y DEBE rechazar la edición si la solicitud ya no admite cambios o no le pertenece. _(UC020)_
- **FR-021**: El sistema DEBE permitir que un Cliente cancele una solicitud propia mientras esté abierta, dejándola fuera de la visibilidad de los prestadores, y DEBE rechazar la cancelación si la solicitud ya no está abierta o no le pertenece. _(UC021)_
- **FR-022**: El sistema DEBE permitir que un Cliente consulte la lista completa de sus propias solicitudes, con su estado actual, sin mostrar solicitudes de otros clientes. _(UC022)_
- **FR-023**: El sistema DEBE permitir que un Cliente consulte el detalle y el estado de una solicitud propia, y DEBE rechazar la consulta si la solicitud no existe o pertenece a otro Cliente, sin revelar cuál de las dos causas aplica. _(UC023)_

### Key Entities _(include if feature involves data)_

- **Solicitud de servicio**: categoría, descripción, zona aproximada, nivel de urgencia, fotos adjuntas (0 o más), estado (borrador, publicada, cancelada y otros por definir) y Cliente propietario.
- **Actor asignado y autorización**: identidad del Cliente que crea o posee la solicitud; solo su propietario puede editarla, cancelarla o consultar su detalle.
- **Historial de estado**: transición y momento de cada cambio de estado del servicio.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las solicitudes publicadas incluye zona aproximada y urgencia; ninguna se publica sin estos datos.
- **SC-002**: El 100% de las solicitudes guardadas como borrador permanece no visible para prestadores hasta que el Cliente decide publicarlas.
- **SC-003**: El 100% de los intentos de editar o cancelar una solicitud ajena, inexistente o que ya no está abierta es rechazado sin modificar ningún registro.
- **SC-004**: El 100% de las consultas de lista o detalle de solicitudes devuelve únicamente información del Cliente autenticado que la solicita.
- **SC-005**: Ante una pérdida de conexión durante publicación o edición, el 100% de los casos de prueba conserva un único registro consistente, sin duplicados.