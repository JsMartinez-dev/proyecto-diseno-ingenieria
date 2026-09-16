# Feature Specification: SPEC-05 — Creación y gestión del perfil profesional

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC024, UC025, UC026, UC027, UC028, UC029, UC030, UC031, UC032, UC033 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Crear el perfil profesional [UC024, UC026, UC027, UC028] (Priority: P1)

Como prestador, quiero crear mi perfil profesional definiendo obligatoriamente mis categorías de servicio y mis zonas de atención, y registrando mi experiencia si lo deseo, para que los clientes puedan encontrarme y confiar en la información que ven.

**Why this priority**: Sin un perfil creado, el Prestador no existe para el descubrimiento del Cliente  ni puede recibir oportunidades, es el requisito previo a cualquier otra capacidad de esta especificación.

**Independent Test**: Con una cuenta de Prestador sin perfil, completar el formulario de creación sin categorías o sin zonas y verificar el rechazo, repetir completando ambos datos obligatorios sin experiencia y verificar que el perfil se crea,  repetir agregando experiencia profesional y verificar que también queda registrada.

**Acceptance Scenarios**:

1. **Scenario**: Creación completa con datos obligatorios [UC026 , UC027]
    
    - **Given** un Prestador sin perfil indica sus datos básicos, al menos una categoría de servicio y al menos una zona de atención
    - **When** confirma la creación
    - **Then** el sistema crea el perfil profesional con esas categorías y zonas asociadas
2. **Scenario**: Intento de crear el perfil sin categorías o sin zonas
    
    - **Given** un Prestador intenta crear su perfil sin haber elegido ninguna categoría de servicio o ninguna zona de atención
    - **When** confirma la creación
    - **Then** el sistema rechaza la creación y señala el dato obligatorio faltante, sin dejar un perfil a medio crear
3. **Scenario**: Registrar experiencia profesional de forma opcional [UC028]
    
    - **Given** un Prestador está creando su perfil
    - **When** agrega su experiencia profesional antes de confirmar
    - **Then** el sistema la asocia al perfil; si no la agrega, la creación se completa igualmente sin experiencia registrada
4. **Scenario**: Actualizar categorías o experiencia después de creado el perfil [UC026, UC028]
    
    - **Given** un Prestador ya tiene un perfil creado
    - **When** actualiza sus categorías de servicio o agrega nueva experiencia profesional de forma independiente, sin pasar por el flujo de creación
    - **Then** el sistema guarda el cambio sobre el perfil existente sin crear un perfil nuevo
5. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador intenta crear o completar un perfil profesional
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

### User Story 2 - Editar los datos generales del perfil [UC025] (Priority: P1)

Como prestador, quiero editar los datos generales de mi perfil ya creado, para mantenerlo actualizado a medida que cambian mi información o mi forma de trabajar.

**Why this priority**: Un perfil desactualizado reduce la confianza del Cliente y puede mostrar información incorrecta durante el descubrimiento.

**Independent Test**: Con un perfil ya creado, modificar uno de sus datos generales y verificar que el cambio se refleja; intentar editar un perfil inexistente o ajeno y verificar el rechazo.

**Acceptance Scenarios**:

1. **Scenario**: Edición exitosa
    
    - **Given** un Prestador tiene un perfil ya creado
    - **When** modifica uno de sus datos generales y confirma
    - **Then** el sistema guarda el cambio y muestra el estado actualizado del perfil
2. **Scenario**: Edición de un perfil inexistente
    
    - **Given** un Prestador aún no tiene perfil creado
    - **When** intenta editarlo
    - **Then** el sistema rechaza la operación e indica que primero debe crear su perfil
3. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador, o un Prestador que intenta editar un perfil que no es el suyo
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación sin modificar ningún registro

### User Story 3 - Gestionar el portafolio de servicios [UC029, UC030] (Priority: P1)

Como prestador, quiero agregar o eliminar servicios de mi portafolio, para mostrar a los clientes ejemplos concretos de trabajos que ofrezco.

**Why this priority**: El portafolio es evidencia tangible de la calidad del trabajo del Prestador y complementa la información declarada del perfil.

**Independent Test**: Con un perfil ya creado, agregar un servicio al portafolio y verificar que aparece disponible, eliminarlo y verificar que deja de mostrarse.

**Acceptance Scenarios**:

1. **Scenario**: Agregar un servicio al portafolio [UC029]
    
    - **Given** un Prestador con perfil creado agrega un servicio con su descripción y evidencia (por ejemplo, fotos)
    - **When** confirma la operación
    - **Then** el sistema guarda el servicio en el portafolio del Prestador
2. **Scenario**: Eliminar un servicio del portafolio [UC030]
    
    - **Given** un Prestador tiene un servicio propio en su portafolio
    - **When** solicita eliminarlo
    - **Then** el sistema lo retira del portafolio visible, conservando el resto de los servicios sin cambios
3. **Scenario**: Actor no autorizado o servicio ajeno
    
    - **Given** un actor sin rol Prestador, o un Prestador que intenta agregar o eliminar un servicio de un portafolio que no es el suyo
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación sin modificar el portafolio

### User Story 4 - Configurar disponibilidad y gestionar la agenda [UC031, UC032] (Priority: P1)

Como prestador, quiero configurar mi disponibilidad horaria y gestionar mi agenda, para organizar mis compromisos y que el sistema pueda evaluar correctamente qué oportunidades son compatibles conmigo.

**Why this priority**: La disponibilidad es uno de los tres criterios que SPEC-06 usa para determinar compatibilidad de oportunidades; sin ella, el tablero de oportunidades no puede filtrar correctamente.

**Independent Test**: Con un perfil ya creado, configurar la disponibilidad horaria y verificar que queda guardada; registrar un compromiso en la agenda y verificar que aparece reflejado sin duplicar información.

**Acceptance Scenarios**:

1. **Scenario**: Configurar disponibilidad horaria [UC031]
    
    - **Given** un Prestador con perfil creado
    - **When** define sus horarios disponibles
    - **Then** el sistema guarda la disponibilidad y la deja lista para ser usada en la evaluación de compatibilidad
2. **Scenario**: Gestionar la agenda [UC032]
    
    - **Given** un Prestador con disponibilidad configurada
    - **When** agrega, modifica o consulta un compromiso en su agenda
    - **Then** el sistema refleja el cambio sin afectar los demás compromisos existentes
3. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador intenta configurar disponibilidad o gestionar una agenda ajena
    - **When** realiza la solicitud
    - **Then** el sistema deniega la operación

### User Story 5 - Consultar la vista previa del perfil [UC033] (Priority: P1)

Como prestador, quiero consultar cómo ven mi perfil los clientes antes de que quede expuesto públicamente, para revisar que la información mostrada sea la correcta.

**Why this priority**: Permite al Prestador validar que su información pública (SPEC-03) es la que realmente desea mostrar, sin necesidad de exponer datos incompletos o erróneos.

**Independent Test**: Con un perfil ya creado, consultar su vista previa y verificar que coincide exactamente con lo que un Cliente vería al consultar ese mismo perfil (UC015 de SPEC-03).

**Acceptance Scenarios**:

1. **Scenario**: Vista previa disponible
    
    - **Given** un Prestador tiene un perfil creado
    - **When** consulta su vista previa
    - **Then** el sistema muestra el perfil exactamente como lo vería un Cliente, incluyendo únicamente la información configurada para exposición pública
2. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador, o un Prestador que intenta ver la vista previa de otro perfil
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

---

### Edge Cases

- Un prestador intenta crear su perfil sin haber elegido categorías de servicio o zonas de atención: el sistema debe rechazar la creación y señalar el dato obligatorio faltante, sin dejar un perfil a medio crear.
- Un prestador edita categorías, zonas de atención o agenda y la operación se interrumpe a mitad de camino (por ejemplo, por pérdida de conexión): el sistema debe evitar guardar un estado parcial y conservar los últimos datos confirmados.
- Un prestador configura una disponibilidad horaria que entra en conflicto con un compromiso ya registrado en su agenda: el sistema debe rechazar el cambio y advertir el conflicto.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-024**: El sistema DEBE permitir que un Prestador cree su perfil profesional únicamente cuando incluya al menos una categoría de servicio y al menos una zona de atención, y DEBE rechazar la creación si falta alguno de estos datos obligatorios. _(UC024, incluye a UC026 y UC027)_
- **FR-026**: El sistema DEBE permitir que un Prestador escoja o actualice sus categorías de servicio, tanto durante la creación del perfil como de forma independiente después de creado. _(UC026)_
- **FR-027**: El sistema DEBE permitir que un Prestador configure sus zonas de atención como parte obligatoria de la creación del perfil. _(UC027, incluido en UC024)_
- **FR-028**: El sistema DEBE permitir, de forma opcional, registrar experiencia profesional en el perfil, tanto durante su creación como de forma independiente después de creado, sin que su ausencia impida crear el perfil. _(UC028, extiende a UC024)_
- **FR-025**: El sistema DEBE permitir que un Prestador edite los datos generales de un perfil ya creado, y DEBE rechazar la edición si el perfil no existe o no le pertenece. _(UC025)_
- **FR-029**: El sistema DEBE permitir que un Prestador agregue un servicio, con su descripción y evidencia, al portafolio de su propio perfil. _(UC029)_
- **FR-030**: El sistema DEBE permitir que un Prestador elimine un servicio de su propio portafolio sin afectar los demás servicios registrados. _(UC030)_
- **FR-031**: El sistema DEBE permitir que un Prestador configure su disponibilidad horaria, dejándola disponible para el cálculo de compatibilidad de oportunidades. _(UC031)_
- **FR-032**: El sistema DEBE permitir que un Prestador gestione los compromisos de su propia agenda sin afectar los de otros prestadores. _(UC032)_
- **FR-033**: El sistema DEBE permitir que un Prestador consulte la vista previa de su propio perfil, mostrando exactamente la misma información pública que vería un Cliente. _(UC033)_

### Key Entities _(include if feature involves data)_

- **Perfil profesional**: datos generales del Prestador, categorías de servicio, zonas de atención, experiencia profesional (opcional) y estado de exposición pública.
- **Categoría de servicio:** corresponde a la especialidad o tipo de trabajo que identifica al prestador.
* **Servicio:** corresponde a una actividad específica que el trabajador ofrece dentro de una categoría de servicio.
- **Portafolio de servicios**: lista de servicios del Prestador, cada uno con descripción y evidencia asociada.
- **Disponibilidad y agenda**: horarios disponibles declarados por el Prestador y compromisos registrados sobre esos horarios.
- **Vista pública del perfil**: subconjunto del perfil profesional visible para los clientes, que solo incluye lo configurado explícitamente para exposición.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de los perfiles creados incluye al menos una categoría de servicio y una zona de atención; ninguno se crea sin estos datos.
- **SC-002**: El 100% de las ediciones de categorías, zonas, experiencia, portafolio, disponibilidad o agenda solo afecta al perfil del Prestador autenticado que la solicita.
- **SC-003**: La vista previa del perfil coincide, en el 100% de los casos de prueba, con la información pública que un Cliente ve al consultar ese mismo perfil.
- **SC-004**: Ante datos obligatorios faltantes, registro inexistente o rol incorrecto, ninguna operación de esta especificación modifica datos y la interfaz informa la causa.
