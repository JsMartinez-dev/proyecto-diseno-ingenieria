# Feature Specification: SPEC-08 — Contratación y ciclo de vida del servicio

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC045, UC046, UC050, UC051, UC052, UC053, UC054, UC055, UC056

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Consultar y aceptar propuestas recibidas [UC045, UC046; postcondiciones UC047, UC048 y UC049] (Priority: P1)

Como cliente, quiero consultar las propuestas que recibí para mi solicitud y aceptar la que prefiera, para que se registre el servicio contratado, se cierren automáticamente las demás propuestas y quede habilitada la comunicación con el prestador elegido.

**Why this priority**: Es el punto donde una oportunidad  y una propuesta se convierten en un compromiso real entre Cliente y Prestador; sin esta aceptación no existe contratación.

**Independent Test**: Con una solicitud propia que tiene varias propuestas activas, aceptar una de ellas y verificar que el servicio queda registrado, las demás propuestas quedan cerradas y los datos de comunicación quedan habilitados; intentar aceptar dos propuestas para la misma solicitud y verificar que la segunda es rechazada.

**Acceptance Scenarios**:

1. **Scenario**: Consultar propuestas recibidas [UC045]
    
    - **Given** un Cliente tiene una solicitud publicada con una o más propuestas activas
    - **When** consulta las propuestas recibidas para esa solicitud
    - **Then** el sistema muestra todas las propuestas activas, con la disponibilidad y el mensaje de cada Prestador
2. **Scenario**: Aceptar una propuesta [UC046]
    
    - **Given** un Cliente tiene varias propuestas activas para su solicitud
    - **When** acepta una de ellas
    - **Then** el sistema registra el servicio contratado con el Prestador seleccionado y habilita los datos de comunicación entre ambos, en una sola operación consistente
3. **Scenario**: Cerrar automáticamente las propuestas no seleccionadas [Postcondición UC047]
    
    - **Given** un Cliente acepta una propuesta entre varias recibidas para la misma solicitud
    - **When** la aceptación se confirma
    - **Then** el sistema cierra automáticamente el resto de las propuestas de esa solicitud, sin que el Cliente deba rechazarlas una por una
4. **Scenario**: Intento de aceptar una segunda propuesta para la misma solicitud
    
    - **Given** un Cliente ya aceptó una propuesta para su solicitud
    - **When** intenta aceptar otra propuesta de la misma solicitud
    - **Then** el sistema rechaza la operación, indicando que la solicitud ya tiene un servicio contratado
5. **Scenario**: Actor no autorizado o propuesta ajena
    
    - **Given** un actor sin rol Cliente, o un Cliente que intenta consultar o aceptar propuestas de una solicitud que no le pertenece
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

### User Story 2 - Consultar el detalle del servicio contratado [UC050] (Priority: P1)

Como cliente o prestador, quiero consultar el detalle del servicio que contraté o que me contrataron, para conocer en todo momento sus condiciones y su estado actual.

**Why this priority**: Ambas partes necesitan una referencia única y confiable del compromiso, en lugar de depender de lo acordado informalmente en mensajes.

**Independent Test**: Con un servicio contratado entre un Cliente y un Prestador, ambos consultan su detalle y verifican que ven la misma información; un tercero intenta consultarlo y es rechazado.

**Acceptance Scenarios**:

1. **Scenario**: Consulta exitosa por cualquiera de las dos partes
    
    - **Given** existe un servicio contratado entre un Cliente y un Prestador
    - **When** cualquiera de los dos consulta su detalle
    - **Then** el sistema muestra la solicitud original, la propuesta aceptada y el estado actual del servicio
2. **Scenario**: Consulta por un actor ajeno al servicio
    
    - **Given** un actor que no es ni el Cliente ni el Prestador de ese servicio intenta consultar su detalle
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

### User Story 3 - Gestionar el ciclo de vida del servicio contratado [UC051, UC052, UC053, UC054] (Priority: P1)

Como prestador, quiero marcar el servicio en ejecución y como terminado, y como cliente quiero confirmar su finalización o, si es necesario, cancelar el servicio contratado, para que el estado del servicio refleje siempre la realidad de lo que está ocurriendo.

**Why this priority**: Sin estados claros, ninguna de las partes puede saber si el servicio ya empezó, si ya terminó o si sigue pendiente, reintroduciendo la fragmentación que el proyecto busca resolver.

**Independent Test**: Con un servicio recién contratado, marcarlo en ejecución, luego como terminado, y confirmar su finalización como Cliente, verificando en cada paso el estado resultante; en un servicio distinto, cancelarlo antes de finalizar y verificar que ya no admite otras transiciones.

**Acceptance Scenarios**:

1. **Scenario**: Marcar el servicio en ejecución [UC051]
    
    - **Given** un Prestador tiene un servicio contratado pendiente de iniciar
    - **When** lo marca como en ejecución
    - **Then** el sistema actualiza el estado del servicio y lo refleja para ambas partes
2. **Scenario**: Marcar el servicio como terminado [UC052]
    
    - **Given** un Prestador tiene un servicio en ejecución
    - **When** lo marca como terminado
    - **Then** el sistema actualiza el estado del servicio, dejándolo pendiente de confirmación por el Cliente
3. **Scenario**: Confirmar la finalización [UC053]
    
    - **Given** un Cliente tiene un servicio marcado como terminado por el Prestador
    - **When** confirma su finalización
    - **Then** el sistema cierra el servicio como finalizado de forma definitiva
4. **Scenario**: Cancelar un servicio contratado [UC054]
    
    - **Given** un Cliente o un Prestador tiene un servicio contratado que aún no ha sido confirmado como finalizado
    - **When** solicita su cancelación
    - **Then** el sistema marca el servicio como cancelado y lo deja fuera de cualquier transición posterior
5. **Scenario**: Intento de cancelar un servicio ya finalizado
    
    - **Given** un servicio ya fue confirmado como finalizado
    - **When** el Cliente o el Prestador intenta cancelarlo
    - **Then** el sistema rechaza la cancelación y conserva el estado finalizado
6. **Scenario**: Transiciones simultáneas sobre el mismo servicio
    
    - **Given** ambas partes intentan cambiar el estado del mismo servicio al mismo tiempo (por ejemplo, terminar y cancelar)
    - **When** ambas solicitudes llegan casi al mismo momento
    - **Then** el sistema aplica una sola transición válida, conserva un historial ordenado y rechaza la otra sin dejar el servicio en un estado ambiguo
7. **Scenario**: Actor no autorizado
    
    - **Given** un actor ajeno al servicio, o con un rol que no corresponde a la transición solicitada, intenta cambiar su estado
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

### User Story 4 - Consultar el historial de estados del servicio [UC055] (Priority: P1)

Como cliente o prestador, quiero consultar el historial completo de estados de mi servicio contratado, para verificar cómo evolucionó desde su contratación hasta su cierre.

**Why this priority**: Da trazabilidad a ambas partes ante cualquier desacuerdo sobre cuándo ocurrió cada transición.

**Independent Test**: Con un servicio que pasó por varias transiciones de estado, consultar su historial y verificar que aparecen todas en orden; un actor ajeno al servicio intenta consultarlo y es rechazado.

**Acceptance Scenarios**:

1. **Scenario**: Historial disponible
    
    - **Given** un servicio contratado registró una o más transiciones de estado
    - **When** el Cliente o el Prestador de ese servicio consulta su historial
    - **Then** el sistema muestra cada transición en el orden en que ocurrió
2. **Scenario**: Actor no autorizado
    
    - **Given** un actor ajeno al servicio intenta consultar su historial
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

### User Story 5 - Consultar datos de contacto autorizados [UC056] (Priority: P1)

Como cliente o prestador, quiero consultar los datos de contacto autorizados una vez contratado el servicio, para coordinar los detalles necesarios con la contraparte.

**Why this priority**: Permite coordinar el servicio mediante la información autorizada, respetando el momento y el alcance en que puede revelarse.

**Independent Test**: Con un servicio recién contratado, consultar los datos de contacto autorizados y verificar que solo las partes del servicio pueden verlos; intentar consultarlos antes de aceptar la propuesta y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Consulta de datos autorizados tras la aceptación [UC056]
    
    - **Given** un servicio contratado ya tiene sus datos de comunicación habilitados
    - **When** el Cliente o el Prestador consulta los datos autorizados de la contraparte
    - **Then** el sistema muestra únicamente la información de contacto aprobada para coordinar ese servicio
2. **Scenario**: Intento de consulta antes de la habilitación
    
    - **Given** una propuesta aún no ha sido aceptada
    - **When** el Cliente o el Prestador intentan consultar los datos de contacto
    - **Then** el sistema bloquea la consulta hasta que la aceptación de la propuesta habilite esos datos
3. **Scenario**: Actor ajeno al servicio
    
    - **Given** un actor que no es parte de ese servicio contratado intenta consultar sus datos de contacto
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

---

### Edge Cases

- Dos transiciones de estado del mismo servicio se intentan de forma simultánea: el sistema debe resolverlas conservando un único historial ordenado, sin aplicar ninguna transición no autorizada.
- Un cliente o un prestador intenta cancelar un servicio que ya fue confirmado como finalizado: el sistema debe rechazar la cancelación y conservar el estado finalizado.
- Se intenta consultar los datos de contacto autorizados antes de que la propuesta haya sido aceptada: el sistema debe bloquear la consulta hasta que esos datos queden habilitados.
- Un prestador marca un servicio como terminado sin haberlo marcado antes en ejecución: El sistema exige pasar primero por "en ejecución" o permite marcarlo terminado directamente.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-045**: El sistema DEBE permitir que un Cliente consulte todas las propuestas activas recibidas para una solicitud propia. _(UC045)_
- **FR-046**: El sistema DEBE permitir que un Cliente acepte una propuesta activa de su solicitud, y DEBE rechazar una segunda aceptación si la solicitud ya tiene un servicio contratado. _(UC046; genera las postcondiciones UC047, UC048 y UC049)_
- **FR-047**: El sistema DEBE cerrar automáticamente, como parte de la aceptación, todas las demás propuestas activas de la misma solicitud. _(Postcondición de UC046)_
- **FR-048**: El sistema DEBE registrar, como parte de la aceptación, un servicio contratado vinculado a la solicitud, la propuesta aceptada, el Cliente y el Prestador. _(Postcondición de UC046)_
- **FR-049**: El sistema DEBE habilitar, como parte de la aceptación, los datos de comunicación necesarios entre el Cliente y el Prestador de ese servicio. _(Postcondición de UC046)_
- **FR-050**: El sistema DEBE permitir que el Cliente o el Prestador de un servicio contratado consulten su detalle completo, y DEBE denegar el acceso a cualquier otro actor. _(UC050)_
- **FR-051**: El sistema DEBE permitir que el Prestador de un servicio contratado lo marque como en ejecución. _(UC051)_
- **FR-052**: El sistema DEBE permitir que el Prestador de un servicio en ejecución lo marque como terminado. _(UC052)_
- **FR-053**: El sistema DEBE permitir que el Cliente de un servicio marcado como terminado confirme su finalización, cerrándolo de forma definitiva. _(UC053)_
- **FR-054**: El sistema DEBE permitir que el Cliente o el Prestador de un servicio contratado lo cancelen mientras no haya sido confirmado como finalizado, y DEBE rechazar la cancelación si ya fue finalizado. _(UC054)_
- **FR-055**: El sistema DEBE permitir que el Cliente o el Prestador de un servicio consulten su historial completo de transiciones de estado, en orden. _(UC055)_
- **FR-056**: El sistema DEBE permitir consultar los datos de contacto autorizados únicamente después de que la aceptación haya habilitado los datos del servicio, mostrando solo la información aprobada. _(UC056; usa los datos habilitados por la postcondición UC049)_

### Key Entities _(include if feature involves data)_

- **Servicio contratado**: solicitud de origen, propuesta aceptada, Cliente, Prestador, estado (contratado, en ejecución, terminado, finalizado, cancelado) e historial ordenado de esas transiciones.
- **Datos de comunicación habilitados**: información mínima necesaria para que Cliente y Prestador se comuniquen a través del canal autorizado, sin exponer datos de contacto personales.
- **Actor asignado y autorización**: solo el Cliente y el Prestador de un servicio contratado pueden consultarlo, cambiarlo de estado o usar su canal de comunicación.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las aceptaciones de propuesta produce, en una sola operación, el cierre de las demás propuestas, el registro del servicio y la habilitación de comunicación.
- **SC-002**: El 100% de los intentos de aceptar una segunda propuesta para una solicitud ya contratada es rechazado.
- **SC-003**: El 100% de las transiciones de estado del servicio queda registrada en un historial ordenado, incluso ante intentos simultáneos.
- **SC-004**: El 100% de los intentos de cancelar un servicio ya finalizado es rechazado sin cambiar su estado.
- **SC-005**: El 100% de las consultas de datos de contacto autorizados ocurre solo después de que esos datos fueron habilitados y solo por las partes del servicio.
