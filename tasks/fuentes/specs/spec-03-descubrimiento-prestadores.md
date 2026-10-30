# Feature Specification: SPEC-03 — Descubrimiento de prestadores

**Creado**: 2026-09-16 
**Casos de uso cubiertos**: UC014, UC015 

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Buscar y explorar prestadores [UC014, UC015] (Priority: P1)

Como cliente, quiero buscar prestadores por categoría y zona, y consultar el perfil público de cualquiera de ellos ya sea desde los resultados de la búsqueda o de forma directa, para decidir a quién contactar sin necesitar ni exponer ubicaciones exactas.

**Why this priority**: Es el punto de entrada al valor central de CONectaSM para el Cliente, sin descubrimiento no existe forma de llegar a publicar una solicitud dirigida ni de comparar prestadores antes de contratar.

**Independent Test**: Con una cuenta de Cliente, buscar por categoría y zona, abrir el perfil de un resultado de esa búsqueda, y además consultar un perfil por acceso directo (sin pasar por la búsqueda); verificar que ambos caminos muestran el mismo perfil público y que en ningún momento se revela información privada o ubicación exacta.

**Acceptance Scenarios**:

1. **Scenario**: Búsqueda con resultados [UC014]
    
    - **Given** un Cliente autenticado indica una categoría de servicio y una zona de Santa Marta
    - **When** ejecuta la búsqueda
    - **Then** el sistema devuelve la lista de prestadores que ofrecen esa categoría en esa zona, mostrando únicamente su zona de cobertura declarada, no su dirección exacta
    
2. **Scenario**: Búsqueda sin resultados [UC014]
    
    - **Given** un Cliente busca una combinación de categoría y zona sin prestadores disponibles
    - **When** ejecuta la búsqueda
    - **Then** el sistema indica que no hay resultados para esos criterios, sin producir un error, y permite ajustar la búsqueda
3. **Scenario**: Consultar perfil desde un resultado de búsqueda [UC015]
    
    - **Given** un Cliente tiene una lista de resultados de UC014
    - **When** selecciona uno de los prestadores listados
    - **Then** el sistema muestra el perfil público de ese prestador (categorías que ofrece, reputación agregada, disponibilidad declarada) sin salir del contexto de la búsqueda
4. **Scenario**: Consultar perfil por acceso directo [UC015]
    
    - **Given** un Cliente cuenta con la referencia a un prestador sin haber pasado por una búsqueda (por ejemplo, un enlace compartido o una solicitud previa)
    - **When** consulta su perfil directamente
    - **Then** el sistema muestra el mismo perfil público que vería desde el flujo de búsqueda
5. **Scenario**: Perfil sin información pública disponible[UC015]
    
    - **Given** un prestador no ha completado o no tiene visible su perfil
    - **When** un Cliente intenta consultarlo, por cualquiera de los dos caminos
    - **Then** el sistema indica que el detalle no está disponible, sin distinguir si la causa es un perfil incompleto, oculto o inexistente
6. **Scenario**: Actor no autorizado[UC015]
    
    - **Given** un actor sin rol Cliente (por ejemplo un Prestador, un Administrador o un visitante sin sesión) intenta buscar prestadores o consultar un perfil
    - **When** realiza la solicitud
    - **Then** el sistema deniega el acceso a la funcionalidad

---

### Edge Cases

- Un cliente consulta el perfil de un prestador que no tiene información pública disponible: el sistema debe indicar que el detalle no está disponible, sin revelar datos privados ni el motivo exacto de la falta de información.
- Un cliente busca prestadores usando una categoría o zona que no existe en el catálogo vigente:  El sistema debe sugerir alternativas que se asemejan a lo consultado.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-014**: El sistema DEBE permitir que un Cliente busque prestadores filtrando por categoría de servicio y zona, devolviendo únicamente prestadores cuya zona de cobertura declarada coincida, sin revelar direcciones exactas ni concederla a otros roles. _(UC014)_
- **FR-015**: El sistema DEBE permitir que un Cliente consulte el perfil público de un prestador, tanto desde un resultado de búsqueda (extensión de UC014) como por acceso directo, mostrando en ambos casos la misma información pública y sin exponer datos privados del prestador ni concederla a otros roles. _(UC015)_

### Key Entities _(include if feature involves data)_

- **Prestador (vista pública)**: categorías que ofrece, zona de cobertura declarada, reputación/calificación agregada y disponibilidad declarada; excluye datos privados o de contacto directo.
- **Criterio de búsqueda**: categoría de servicio y zona indicados por el Cliente.
- **Resultado de búsqueda**: conjunto de prestadores coincidentes, incluyendo el caso de resultado vacío.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las búsquedas ejecutadas por un Cliente devuelve únicamente prestadores que coinciden con la categoría y zona indicadas, sin exponer ubicación exacta.
- **SC-002**: El 100% de las consultas de perfil, sin importar si se originan desde una búsqueda o de forma directa, muestra la misma información pública y ninguna información privada.
- **SC-003**: El 100% de los intentos de búsqueda o consulta de perfil por un actor sin rol Cliente es denegado.
- **SC-004**: Ante un perfil sin información pública disponible, el sistema informa la falta de detalle en el 100% de los casos sin revelar la causa específica.
- **SC-005**: [NEEDS CLARIFICATION: definir] catálogo válido de categorías y zonas, y la política de coincidencia (exacta, parcial, por cercanía) antes de implementar.