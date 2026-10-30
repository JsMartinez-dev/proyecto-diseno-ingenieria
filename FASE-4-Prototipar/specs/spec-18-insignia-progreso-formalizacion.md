# Feature Specification: SPEC-18 — Insignia y progreso de formalización

**Creado**: 2026-09-16
**Casos de uso cubiertos**: UC088 
## User Scenarios & Testing _(mandatory)_

### User Story 1 - Insignia de progreso de formalización `<<Could>>` [UC088] (Priority: P3)

Como Cliente o Prestador, quiero ver una insignia que resuma el progreso de formalización de un Prestador, para tener una referencia visual rápida sin leer el detalle completo de su ruta.

**Why this priority**: Es una capa visual de conveniencia sobre datos que ya existirían en `spec-13`; no aporta información nueva, solo la resume.

**Independent Test**: Con un Prestador con distintos niveles de progreso de formalización, mostrar su insignia y verificar que nunca se presenta como una certificación.

**Acceptance Scenarios**:

1. **Scenario**: Capacidad deshabilitada (comportamiento por defecto)
    
    - **Given** la insignia no está habilitada
    - **When** un Cliente o Prestador consulta un perfil
    - **Then** el sistema no la presenta como disponible; el progreso detallado sigue siendo consultable en `spec-13`
2. **Scenario**: Insignia no engañosa
    
    - **Given** la insignia está habilitada y un Prestador tiene progreso declarado en `spec-13`
    - **When** se muestra su insignia
    - **Then** el sistema la presenta junto con una indicación explícita de que representa progreso orientativo y no una certificación o estatus legal
3. **Scenario**: Progreso al máximo nivel
    
    - **Given** un Prestador alcanza el nivel más alto de progreso definido
    - **When** se muestra su insignia
    - **Then** el sistema mantiene la misma indicación de que no equivale a certificación, igual que en cualquier otro nivel

---

### Edge Cases

- Recalcular el progreso base no debe convertir retroactivamente ninguna insignia histórica en una certificación.
- Si el progreso base se elimina o resetea, la insignia debe reflejar el nuevo valor de inmediato, no un valor cacheado.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-088**: El sistema PUEDE mostrar una insignia de progreso de formalización derivada del progreso definido en `spec-13` (UC079), pero NO DEBE representarla como estado legal o certificación en ningún nivel, y DEBE permanecer deshabilitada sin afectar `spec-13` mientras no exista aprobación explícita. [UC088]

### Key Entities _(include if feature involves data)_

- **Insignia de formalización**: representación visual resumida del progreso definido en `spec-13`; no es una entidad de datos independiente, sino una vista derivada.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las insignias mostradas incluye la indicación de que no equivalen a certificación o estatus legal, en cualquier nivel de progreso.
- **SC-002**: La desactivación de la insignia no impide consultar el progreso detallado definido en `spec-13`.

## Arquitectura y trazabilidad de implementación

Este SPEC se implementa como parte del monolito modular con Arquitectura Limpia. Se conservan historias, requisitos, entidades conceptuales y criterios de éxito anteriores; esta sección fija la separación técnica de responsabilidades.

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

El [plan técnico de SPEC-18](../../Planes-y-plantilla-del-proyecto/planes/plan-spec-18-insignia-progreso-formalizacion.md) contiene el árbol de paquetes, puertos, persistencia, tareas backend, frontend e integración actualizados.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `formalizacion` | `ConsultarInsigniaFormalizacionUseCase` | `ConsultarInsigniaFormalizacionService` |

Puertos de salida: ConsultaProgresoFormalizacionPort; sin tabla adicional de insignias. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: lecturas/proyecciones o extensión de tablas existentes; no crear tablas de lectura propias. Cualquier tabla opcional se diseña/aplica solo con aprobación de la feature; no es parte de las 42 tablas MVP. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.
