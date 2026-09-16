# Feature Specification: SPEC-06 — Compatibilidad y oportunidades de servicio

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC034, UC035, UC036, UC037, UC038 
## User Scenarios & Testing _(mandatory)_

### User Story 1 - Ver y filtrar el tablero de oportunidades compatibles [UC034, UC035, UC036, UC038] (Priority: P1)

Como prestador, quiero ver un tablero con las solicitudes de servicio compatibles con mi perfil, poder filtrarlas, y ser notificado cuando aparezca una nueva oportunidad compatible, para no tener que revisar manualmente cada solicitud publicada en la plataforma.

**Why this priority**: Es el mecanismo central por el cual un Prestador se entera de la demanda real disponible; sin compatibilidad calculada correctamente, el tablero mostraría oportunidades irrelevantes o dejaría fuera solicitudes que el Prestador sí podría atender.

**Independent Test**: Con un perfil de Prestador con categorías, zonas y disponibilidad configuradas, y con solicitudes publicadas en distintas categorías y zonas, consultar el tablero y verificar que solo aparecen las solicitudes compatibles; aplicar un filtro y verificar que el resultado se acota; publicar una nueva solicitud compatible y verificar que se genera la notificación correspondiente.

**Acceptance Scenarios**:

1. **Scenario**: Ver el tablero con oportunidades compatibles [UC034]
    
    - **Given** un Prestador tiene su perfil configurado con categorías, zonas de atención y disponibilidad
    - **When** consulta su tablero de oportunidades
    - **Then** el sistema calcula la compatibilidad usando categoría, zona y disponibilidad, y muestra únicamente las solicitudes abiertas que coinciden con ese perfil
2. **Scenario**: Tablero sin oportunidades compatibles
    
    - **Given** un Prestador no tiene ninguna solicitud abierta que coincida con su categoría, zona o disponibilidad
    - **When** consulta su tablero
    - **Then** el sistema muestra el tablero vacío, sin producir un error
3. **Scenario**: Filtrar el tablero [UC036]
    
    - **Given** un Prestador tiene su tablero de oportunidades cargado
    - **When** aplica un filtro adicional (por ejemplo, por categoría o por urgencia)
    - **Then** el sistema muestra únicamente las oportunidades del tablero que además cumplen ese filtro, sin alterar el cálculo de compatibilidad original
4. **Scenario**: Filtro sin coincidencias
    
    - **Given** un Prestador aplica un filtro que ninguna oportunidad de su tablero cumple
    - **When** confirma el filtro
    - **Then** el sistema muestra el resultado vacío, sin producir un error ni descartar el filtro aplicado
5. **Scenario**: Notificar una nueva oportunidad compatible [UC038]
    
    - **Given** un Cliente publica una nueva solicitud que resulta compatible con el perfil de un Prestador
    - **When** el sistema determina esa compatibilidad
    - **Then** el sistema notifica al Prestador sobre la nueva oportunidad, sin necesidad de que este haya vuelto a consultar el tablero manualmente
6. **Scenario**: Solicitud sin datos suficientes para evaluar compatibilidad
    
    - **Given** una solicitud publicada no cuenta con categoría, zona o disponibilidad suficientes para ser evaluada
    - **When** el sistema calcula compatibilidad contra los perfiles de los prestadores
    - **Then** el sistema marca esa solicitud como no evaluable y no la muestra como compatible en ningún tablero
7. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador intenta consultar, filtrar o recibir notificaciones de un tablero de oportunidades
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

### User Story 2 - Consultar el detalle de una oportunidad [UC037] (Priority: P1)

Como prestador, quiero consultar el detalle completo de una oportunidad de mi tablero, para decidir con información suficiente si voy a proponerle un servicio al cliente.

**Why this priority**: El tablero resume varias oportunidades a la vez; el Prestador necesita el detalle completo de una en particular antes de invertir tiempo en cotizarla.

**Independent Test**: Con una oportunidad compatible visible en el tablero de un Prestador, consultar su detalle y verificar que muestra la información completa de la solicitud sin exponer datos privados del Cliente que la publicó.

**Acceptance Scenarios**:

1. **Scenario**: Detalle disponible
    
    - **Given** un Prestador tiene una oportunidad compatible en su tablero
    - **When** consulta su detalle
    - **Then** el sistema muestra la información completa de la solicitud (categoría, descripción, zona aproximada, urgencia y fotos si existen), sin revelar la dirección exacta ni datos privados del Cliente
2. **Scenario**: Intento de consultar una oportunidad no compatible o inexistente
    
    - **Given** un Prestador intenta consultar el detalle de una solicitud que no es compatible con su perfil o que ya no existe
    - **When** realiza la consulta
    - **Then** el sistema rechaza la operación sin revelar información de esa solicitud
3. **Scenario**: Actor no autorizado
    
    - **Given** un actor sin rol Prestador intenta consultar el detalle de una oportunidad
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso

---

### Edge Cases

- Una solicitud de servicio no tiene datos suficientes de categoría, zona o disponibilidad para evaluar su compatibilidad: el sistema debe marcarla como no evaluable, sin mostrarla como compatible en ningún tablero.
- Un prestador aplica un filtro sobre el tablero que ninguna oportunidad cumple: el sistema debe mostrar el resultado vacío sin descartar el filtro ni producir un error.
- Se genera una nueva oportunidad compatible mientras el prestador no tiene sesión activa: El sistema debe mantener la notificación pendiente hasta la próxima conexión del prestador.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-035**: El sistema DEBE permitir que un Prestador consulte un tablero que muestre únicamente las solicitudes abiertas compatibles con su perfil (categoría, zona y disponibilidad), incluyendo el caso de tablero vacío. _(UC035, incluye a UC034)_
- **FR-034**: El sistema DEBE calcular la compatibilidad de cada solicitud contra cada perfil usando categoría, zona y disponibilidad, y DEBE marcar como no evaluable toda solicitud que no tenga datos suficientes para ese cálculo. _(UC034, incluido en UC035)_
- **FR-036**: El sistema DEBE permitir que un Prestador filtre su tablero de oportunidades por criterios adicionales, sin alterar el cálculo de compatibilidad subyacente. _(UC036, extiende a UC035)_
- **FR-037**: El sistema DEBE permitir que un Prestador consulte el detalle completo de una oportunidad compatible de su tablero, sin exponer datos privados del Cliente que la publicó, y DEBE rechazar la consulta si la oportunidad no es compatible con su perfil o no existe. _(UC037)_
- **FR-038**: El sistema DEBE notificar a un Prestador cuando el cálculo de compatibilidad detecte una nueva oportunidad para su perfil, sin requerir que el Prestador esté consultando el tablero en ese momento. _(UC038, extiende a UC034)_

### Key Entities _(include if feature involves data)_

- **Oportunidad de servicio**: solicitud publicada por un Cliente  vista desde la perspectiva de un Prestador compatible, incluye estado de compatibilidad (compatible, no evaluable) y los datos necesarios para decidir si cotizarla.
- **Criterio de compatibilidad**: categoría, zona y disponibilidad usados para emparejar solicitudes con perfiles de prestador (ver SPEC-05).
- **Filtro de tablero**: criterios adicionales que un Prestador aplica sobre su propio tablero, sin modificar el cálculo de compatibilidad.
- **Notificación de oportunidad**: aviso generado cuando una nueva solicitud resulta compatible con el perfil de un Prestador.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las oportunidades mostradas en un tablero corresponde a solicitudes cuya categoría, zona y disponibilidad coinciden con el perfil del Prestador que consulta.
- **SC-002**: El 100% de las solicitudes sin datos suficientes para evaluar compatibilidad se marca como no evaluable y no aparece como compatible en ningún tablero.
- **SC-003**: El 100% de las consultas de detalle de oportunidad no expone datos privados del Cliente que publicó la solicitud.
- **SC-004**: El 100% de las nuevas solicitudes compatibles genera una notificación hacia el Prestador correspondiente.
- **SC-005**: Ante datos faltantes, oportunidad inexistente o rol incorrecto, ninguna operación de esta especificación modifica datos y la interfaz informa la causa.