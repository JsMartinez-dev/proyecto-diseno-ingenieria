# Feature Specification: UC-02 — Cliente: descubrimiento y solicitudes

**Creado**: 2026-09-11  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Publicar solicitud [US-034] (Priority: P1)

Como cliente, quiero publicar una solicitud de servicio para que pueda convertirse en una oportunidad visible para prestadores compatibles.

**Why this priority**: Activa el marketplace desde el lado de la demanda y habilita cotizaciones.

**Independent Test**: Se prueba preparando una solicitud con los datos obligatorios y publicándola; debe quedar en estado abierto sin revelar dirección exacta.

**Acceptance Scenarios**:

1. **Scenario**: Publicación válida
   - **Given** un cliente autenticado tiene una solicitud con categoría, descripción y zona aproximada válidas
   - **When** publica la solicitud
   - **Then** la solicitud queda abierta y disponible conforme a las reglas de compatibilidad

2. **Scenario**: Publicación incompleta
   - **Given** faltan datos obligatorios de la solicitud
   - **When** el cliente intenta publicarla
   - **Then** el sistema mantiene la solicitud sin publicar e identifica los campos pendientes

---

### User Story 2 - Definir categoría y descripción [US-031] (Priority: P1)

Como cliente, quiero indicar la categoría y describir la necesidad para que los prestadores comprendan el trabajo solicitado.

**Why this priority**: Son datos mínimos para clasificar y entender una solicitud.

**Independent Test**: Se prueba guardando una solicitud con categoría y descripción válidas y comprobando que ambos datos quedan asociados al borrador.

**Acceptance Scenarios**:

1. **Scenario**: Datos principales válidos
   - **Given** existe un borrador editable
   - **When** el cliente selecciona una categoría y agrega una descripción válida
   - **Then** los datos quedan guardados en la solicitud

---

### User Story 3 - Definir zona aproximada y urgencia [US-033] (Priority: P1)

Como cliente, quiero indicar una zona aproximada y urgencia sin exponer mi dirección exacta para contextualizar el servicio de forma segura.

**Why this priority**: La zona soporta matching y la protección de dirección es una regla explícita de diseño.

**Independent Test**: Se prueba configurando zona y urgencia y consultando la solicitud desde otra cuenta para confirmar que solo se expone la zona aproximada.

**Acceptance Scenarios**:

1. **Scenario**: Ubicación segura
   - **Given** un cliente edita una solicitud
   - **When** define zona aproximada y urgencia
   - **Then** la solicitud conserva esos datos y no publica la dirección exacta

---

### User Story 4 - Descubrir prestadores por categoría y zona [US-026] (Priority: P1)

Como cliente, quiero encontrar prestadores relevantes por categoría y zona para identificar opciones adecuadas.

**Why this priority**: Es el flujo central de descubrimiento previo a la contratación.

**Independent Test**: Se prueba seleccionando una categoría y zona y verificando que los resultados cumplen los criterios disponibles.

**Acceptance Scenarios**:

1. **Scenario**: Descubrimiento con coincidencias
   - **Given** existen prestadores visibles asociados a la categoría y zona consultadas
   - **When** el cliente realiza la búsqueda
   - **Then** el sistema presenta los prestadores que cumplen los criterios

2. **Scenario**: Sin coincidencias
   - **Given** no existen prestadores compatibles con los criterios
   - **When** el cliente realiza la búsqueda
   - **Then** el sistema informa que no hay resultados sin presentar perfiles incompatibles como coincidencias

---

### User Story 5 - Consultar perfil público del prestador [US-024] (Priority: P1)

Como cliente, quiero revisar el perfil público de un prestador para evaluar si es adecuado antes de contratar.

**Why this priority**: Permite tomar decisiones informadas y conecta descubrimiento con reputación/perfil.

**Independent Test**: Se prueba abriendo un resultado de prestador y verificando que solo se muestran campos públicos autorizados.

**Acceptance Scenarios**:

1. **Scenario**: Perfil público visible
   - **Given** existe un prestador con perfil visible
   - **When** el cliente abre su perfil
   - **Then** el sistema muestra la información pública autorizada del prestador

---

### User Story 6 - Crear borrador [US-030] (Priority: P2)

Como cliente, quiero iniciar una solicitud como borrador para completarla antes de hacerla visible.

**Why this priority**: Reduce fricción y permite captura incremental sin publicar información incompleta.

**Independent Test**: Se prueba creando un borrador y saliendo del flujo; al regresar, el borrador debe seguir disponible para edición.

**Acceptance Scenarios**:

1. **Scenario**: Persistencia del borrador
   - **Given** un cliente autenticado inicia una nueva solicitud
   - **When** guarda información parcial sin publicarla
   - **Then** la solicitud queda como borrador y no se ofrece a prestadores

---

### User Story 7 - Adjuntar fotos [US-032] (Priority: P2)

Como cliente, quiero adjuntar fotos a la solicitud para aportar contexto visual sobre el trabajo requerido.

**Why this priority**: Mejora la calidad de la solicitud, pero no debe bloquear el caso básico si las fotos son opcionales.

**Independent Test**: Se prueba agregando y consultando un adjunto permitido desde el borrador/solicitud.

**Acceptance Scenarios**:

1. **Scenario**: Adjunto válido
   - **Given** un cliente edita una solicitud
   - **When** adjunta una foto aceptada
   - **Then** la foto queda asociada a la solicitud y disponible en su detalle autorizado

2. **Scenario**: Adjunto no permitido
   - **Given** el cliente selecciona un archivo que incumple las reglas aceptadas
   - **When** intenta adjuntarlo
   - **Then** el sistema rechaza el archivo sin perder el resto de la solicitud

---

### User Story 8 - Explorar categorías [US-025] (Priority: P2)

Como cliente, quiero explorar las categorías disponibles para identificar el tipo de servicio que necesito.

**Why this priority**: Facilita navegación y es un subflujo obligatorio del descubrimiento por categoría.

**Independent Test**: Se prueba abriendo el catálogo y verificando que solo se muestran categorías disponibles para clientes.

**Acceptance Scenarios**:

1. **Scenario**: Listado de categorías
   - **Given** existen categorías activas
   - **When** el cliente explora servicios
   - **Then** el sistema muestra las categorías disponibles

---

### User Story 9 - Filtrar y ordenar prestadores [US-027] (Priority: P2)

Como cliente, quiero filtrar u ordenar los prestadores descubiertos para comparar mejor las alternativas.

**Why this priority**: Mejora eficiencia del descubrimiento cuando hay múltiples resultados.

**Independent Test**: Se prueba aplicando un filtro/orden disponible y verificando que el conjunto/orden de resultados cambia de acuerdo con el criterio.

**Acceptance Scenarios**:

1. **Scenario**: Aplicar filtro
   - **Given** una búsqueda devuelve múltiples prestadores
   - **When** el cliente aplica un filtro válido
   - **Then** los resultados mostrados respetan el filtro

2. **Scenario**: Aplicar orden
   - **Given** una búsqueda contiene varios resultados
   - **When** el cliente selecciona un criterio de ordenamiento
   - **Then** los resultados se presentan según dicho criterio

---

### User Story 10 - Editar solicitud abierta [US-035] (Priority: P2)

Como cliente, quiero modificar una solicitud mientras está abierta para corregir o actualizar la necesidad.

**Why this priority**: Permite mantener vigente la demanda antes de la contratación.

**Independent Test**: Se prueba editando una solicitud en estado abierto y verificando que los cambios permitidos quedan reflejados.

**Acceptance Scenarios**:

1. **Scenario**: Edición de solicitud abierta
   - **Given** una solicitud pertenece al cliente y está abierta
   - **When** el cliente modifica un campo editable
   - **Then** el sistema guarda el cambio y conserva el estado válido

2. **Scenario**: Edición fuera de estado
   - **Given** la solicitud ya no está abierta
   - **When** el cliente intenta editarla como solicitud abierta
   - **Then** el sistema rechaza la operación o limita los cambios según el estado

---

### User Story 11 - Cancelar solicitud abierta [US-036] (Priority: P2)

Como cliente, quiero cancelar una solicitud abierta cuando ya no necesito recibir propuestas.

**Why this priority**: Evita oportunidades obsoletas y mantiene coherencia del marketplace.

**Independent Test**: Se prueba cancelando una solicitud abierta y comprobando que deja de comportarse como oportunidad activa.

**Acceptance Scenarios**:

1. **Scenario**: Cancelación válida
   - **Given** una solicitud del cliente está abierta
   - **When** el cliente confirma la cancelación
   - **Then** la solicitud cambia a un estado no abierto y deja de admitir nuevas propuestas

---

### User Story 12 - Consultar mis solicitudes [US-037] (Priority: P2)

Como cliente, quiero ver mis solicitudes para hacer seguimiento a lo que he publicado o guardado.

**Why this priority**: Centraliza el seguimiento del lado cliente.

**Independent Test**: Se prueba con una cuenta que posea solicitudes en distintos estados y verificando que aparecen únicamente sus registros.

**Acceptance Scenarios**:

1. **Scenario**: Listado propio
   - **Given** un cliente tiene solicitudes creadas
   - **When** consulta Mis solicitudes
   - **Then** el sistema muestra las solicitudes asociadas a su cuenta

---

### User Story 13 - Consultar detalle y estado de solicitud [US-038] (Priority: P2)

Como cliente, quiero abrir una solicitud propia y consultar su estado para entender su situación actual.

**Why this priority**: Da trazabilidad y soporta decisiones como editar, cancelar o revisar propuestas.

**Independent Test**: Se prueba abriendo una solicitud desde el listado y verificando información y estado actual.

**Acceptance Scenarios**:

1. **Scenario**: Detalle de solicitud
   - **Given** una solicitud pertenece al cliente
   - **When** abre su detalle
   - **Then** el sistema muestra los datos autorizados y el estado actual de la solicitud


### User Story 14 - Crear solicitud de servicio [US-039] (Priority: P1)

Como cliente, quiero crear una solicitud de servicio proporcionando la información necesaria para registrar mi necesidad y posteriormente publicarla o conservarla como borrador.

**Why this priority**: Es el flujo principal para registrar una necesidad de servicio y agrupa la construcción de una solicitud a partir de sus datos básicos y opcionales.

**Independent Test**: Se prueba iniciando una nueva solicitud, proporcionando los datos requeridos y verificando que el sistema cree correctamente la solicitud asociada al cliente, ya sea como borrador o como solicitud lista para publicación según el flujo ejecutado.

**Acceptance Scenarios**:

1. **Scenario**: Creación de solicitud válida
   - **Given** un cliente autenticado inicia una nueva solicitud de servicio
   - **When** proporciona los datos obligatorios de la solicitud
   - **Then** el sistema crea la solicitud asociada al cliente y permite continuar con su edición o publicación

2. **Scenario**: Creación con información opcional
   - **Given** un cliente está creando una solicitud de servicio válida
   - **When** agrega información opcional como fotografías
   - **Then** el sistema asocia dicha información a la solicitud sin impedir su creación

3. **Scenario**: Solicitud incompleta
   - **Given** un cliente inicia la creación de una solicitud
   - **When** intenta continuar sin proporcionar los datos obligatorios
   - **Then** el sistema identifica la información pendiente y no permite completar la creación como solicitud publicable

---

### Edge Cases

- Una categoría se desactiva mientras existe un borrador que la usa: debe definirse si el borrador puede publicarse o debe seleccionar otra categoría. 
- El cliente publica mientras una foto todavía no pudo validarse/cargarse: la publicación debe ser atómica respecto de los datos obligatorios y aplicar la regla definida para adjuntos opcionales.
- Una solicitud abierta recibe propuestas y luego el cliente cambia categoría/zona: debe preservarse consistencia con propuestas existentes y recalcularse compatibilidad según política. 
- El cliente cancela una solicitud concurrentemente con la llegada de una propuesta: solo un estado final coherente debe persistir; una solicitud cancelada no admite nuevas propuestas.
- Una búsqueda no tiene resultados: se informa explícitamente sin relajar de forma silenciosa los criterios del cliente.
- Un usuario intenta consultar o modificar una solicitud ajena: el sistema deniega acceso.

## Requirements *(mandatory)*

### Requisitos Funcionales

- **FR-001**: El sistema DEBE permitir a los Clientes explorar las categorías de servicio activas. 
- **FR-002**: El sistema DEBE permitir a los Clientes descubrir Prestadores visibles utilizando criterios de categoría y zona aproximada. 
- **FR-003**: El sistema DEBE admitir el filtrado y ordenamiento de los Prestadores descubiertos mediante criterios definidos por el producto.
- **FR-004**: El sistema DEBE exponer un perfil público del Prestador que contenga únicamente los campos autorizados para visibilidad pública. 
- **FR-005**: El sistema DEBE permitir a los Clientes crear y conservar borradores de solicitudes de servicio no publicados. 
- **FR-006**: El sistema DEBE requerir una categoría de servicio y una descripción antes de que una solicitud pueda ser publicada. 
- **FR-007**: El sistema DEBE admitir el adjunto de fotografías a una solicitud bajo las reglas de archivos definidas. 
- **FR-008**: El sistema DEBE capturar la zona aproximada y la urgencia de manera separada de la dirección exacta y NO DEBE exponer la dirección exacta mientras la solicitud esté abierta. 
- **FR-009**: El sistema DEBE publicar una solicitud válida en un estado abierto elegible para la coincidencia (*matching*) de oportunidades.
- **FR-010**: El sistema DEBE permitir al propietario editar una solicitud mientras permanezca abierta, sujeto a las reglas de estado. 
- **FR-011**: El sistema DEBE permitir al propietario cancelar una solicitud abierta y DEBE dejar de aceptar nuevas propuestas tras la cancelación.
- **FR-012**: El sistema DEBE permitir a los Clientes listar únicamente sus propias solicitudes de servicio. 
- **FR-013**: El sistema DEBE permitir a los Clientes consultar los detalles y el estado actual de sus propias solicitudes.
- **FR-014**: El sistema DEBE definir si las ediciones en una solicitud abierta afectan a las notificaciones o propuestas de los prestadores que ya fueron enviadas. 
- **FR-015**: El sistema DEBE definir los valores de urgencia disponibles, los filtros de prestadores y los criterios de ordenamiento. 

### Key Entities *(include if feature involves data)*

- **Categoría de servicio**: Clasificación administrable utilizada para búsqueda, solicitud y compatibilidad.
- **Perfil público de prestador**: Vista autorizada de información profesional visible al Cliente.
- **Solicitud de servicio**: Demanda creada por un Cliente; incluye propietario, categoría, descripción, estado, zona aproximada, urgencia y metadatos.
- **Borrador de solicitud**: Solicitud aún no publicada y no visible como oportunidad.
- **Adjunto de solicitud**: Foto asociada a una solicitud y sometida a reglas de archivo/visibilidad.
- **Zona aproximada**: Referencia geográfica no exacta utilizada para descubrimiento y matching.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al menos 95% de clientes de prueba completan la publicación de una solicitud válida sin asistencia.
- **SC-002**: 100% de solicitudes abiertas verificadas en aceptación muestran zona aproximada y no dirección exacta a terceros.
- **SC-003**: 100% de solicitudes canceladas dejan de aceptar nuevas propuestas.
- **SC-004**: Los resultados de descubrimiento cumplen categoría y zona seleccionadas en 100% de los casos de prueba deterministas.
- **SC-005**: 100% de los accesos a “Mis solicitudes” y detalle están aislados por propietario.
- **SC-006**: Un borrador no se convierte en oportunidad visible hasta que el Cliente ejecuta una publicación válida.
