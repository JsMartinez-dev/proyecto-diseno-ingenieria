# Implementation Plan: SPEC-03 — Descubrimiento de prestadores

**Date**: 2026-09-18
**Spec**: [spec-03-descubrimiento-prestadores](../../FASE-4-Prototipar/specs/spec-03-descubrimiento-prestadores.md)
**Depends on**: `plan-spec-01-autenticacion.md` (rol Cliente autenticado, interceptor de autorización por rol)

## Summary

SPEC-03 permite que un Cliente busque Prestadores por categoría/zona y consulte su perfil público, desde la búsqueda o por acceso directo, sin exponer nunca datos privados ni ubicación exacta. A diferencia de SPEC-01 y SPEC-02, **este SPEC no introduce entidades propias**: es un módulo de **solo lectura** que consulta datos que pertenecen a otros SPEC.

## Technical Context

**Language/Version**: Java 21 (LTS)
**Primary Dependencies**: Spring Boot 3.3.x — Spring Web, Spring Data JPA, Spring Security, Spring Validation, Flyway, BCrypt
**Build tool**: Maven
**Storage**: sin tablas propias, consultas de solo lectura sobre tablas de otros módulos.
**Constraints**: hereda RNF-004 (nunca exponer dirección exacta) a través de la misma regla ya centralizada en el  SPEC-02.
**Performance Goals**: búsqueda por categoría/zona en p95 < 300 ms bajo la carga del piloto (RNF-003)

## Data Model

Este SPEC no define entidades persistentes propias. Usa como **vistas de lectura** (DTO, no tablas):

| DTO                   | Campos                                                                                 | Origen real de los datos                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `PrestadorPublicoDTO` | `id`, `categorias[]`, `zonaCobertura`, `reputacionAgregada`, `disponibilidadDeclarada` | `PerfilProfesional`/`CategoriaOfrecida`/`ZonaCobertura` (SPEC-05/06, aún sin plan), `Reputacion` (SPEC-10, aún sin plan) |
| `CriterioBusqueda`    | `categoria`, `zona` (parámetros de consulta, no persistidos)                           | `Categoria`/`Zona` del catálogo administrable (SPEC-12, aún sin plan)                                                    |


## API Contracts

| Método | Endpoint | Request | Respuesta éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/descubrimiento/prestadores?categoria=&zona=` | query params | `200 [PrestadorPublicoDTO, ...]` *(lista vacía si no hay coincidencias, nunca error)*; si la categoría/zona no existe en el catálogo, `200` con `sugerencias: [...]` en vez de rechazar la solicitud | `403` si el actor no tiene rol Cliente |
| GET | `/api/v1/descubrimiento/prestadores/{id}/perfil` | — | `200 PrestadorPublicoDTO` *(idéntico sin importar si se llegó por búsqueda o por acceso directo — un único mapeo)* | `404` detalle no disponible (perfil incompleto, oculto o inexistente — mismo mensaje genérico para los tres casos); `403` si el actor no tiene rol Cliente |

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

- **Contract tests**: ambos endpoints, incluyendo el caso de lista vacía (200, no error) y el 404 genérico de perfil no disponible.
- **Integration tests**: uno por Acceptance Scenario del SPEC (búsqueda con/sin resultados, perfil desde búsqueda, perfil directo, perfil no disponible, actor no autorizado). Mientras SPEC-05/06/10/12 no existan, estos tests corren contra fixtures/mocks de esas entidades, dejando explícito en el propio test que es un doble de prueba, no el dato real.


## Project Structure

```text
backend/src/main/java/com/aliado/
└── descubrimiento/
    ├── application/
    │   ├── usecase/
    │   │   BuscarPrestadoresUseCase, ConsultarPerfilPublicoUseCase
    │   ├── service/
    │   │   BuscarPrestadoresService, ConsultarPerfilPublicoService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       ConsultaPerfilesPublicosPort, ConsultaConfianzaPort
    ├── infrastructure/
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   DescubrimientoController
        ├── dto/
        │   Request/Response HTTP según API Contracts
        └── mapper/
            Conversión HTTP ↔ Command/Query/Result
```

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `descubrimiento` | `BuscarPrestadoresUseCase` | `BuscarPrestadoresService` |
| `descubrimiento` | `ConsultarPerfilPublicoUseCase` | `ConsultarPerfilPublicoService` |

Puertos de salida: ConsultaPerfilesPublicosPort, ConsultaConfianzaPort y consultas públicas del catálogo. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: lecturas/proyecciones o extensión de tablas existentes; no crear tablas de lectura propias. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.


---

## Phase 1: Setup

- [ ] T001 Crear el paquete `descubrimiento/` con `application/usecase`, `application/service`, `application/dto`, `application/port` y `presentation` con controller/dto/mapper
- [ ] T002 Definir fixtures/mocks de `PerfilProfesional`, `Reputacion` y catálogo de `Categoria`/`Zona` para poder probar este módulo antes de que existan SPEC-05/06, SPEC-10 y SPEC-12

---

## Phase 2: User Story 1 - Buscar y explorar prestadores [UC014, UC015] (Priority: P1)

**Goal**: un Cliente busca Prestadores por categoría/zona y consulta su perfil público, por cualquiera de los dos caminos, sin exponer datos privados.

**Independent Test**: buscar por categoría y zona, abrir un perfil desde los resultados y el mismo perfil por acceso directo, y verificar que ambos caminos devuelven exactamente lo mismo.

### Tests

- [ ] T003 [P] [US1] Contract tests `GET /descubrimiento/prestadores` (con y sin resultados), `GET /descubrimiento/prestadores/{id}/perfil` (200, 404) — `tests/contract/test_descubrimiento.java`
- [ ] T004 [P] [US1] Integration test: búsqueda con resultados, búsqueda sin resultados, perfil desde búsqueda, perfil directo, perfil no disponible, actor no autorizado — `tests/integration/test_descubrimiento.java` (sobre fixtures mientras SPEC-05/06/10/12 no existan)

### Implementation

- [ ] T005 [P] [US1] DTO `PrestadorPublicoDTO` y `CriterioBusqueda` — `descubrimiento/application/dto`
- [ ] T006 [US1] `BuscarPrestadoresUseCase.ejecutar(categoria, zona)` — consulta cross-módulo (depends on T002; depends en producción de los contratos públicos reales de SPEC-05/06, SPEC-10 y catálogo SPEC-04/12)
- [ ] T007 [US1] `ConsultarPerfilPublicoUseCase.ejecutar(id)` — mapeo único reutilizado tanto desde búsqueda como desde acceso directo, garantizando SC-002
- [ ] T008 [US1] Reutilizar el interceptor de autorización por rol de SPEC-01 (T018) para restringir ambos endpoints a Cliente
- [ ] T009 [US1] Endpoints `GET /prestadores`, `GET /prestadores/{id}/perfil` — `descubrimiento/presentation/controller`


**Checkpoint**: un Cliente puede descubrir Prestadores y consultar su perfil público de forma consistente, aunque los datos reales subyacentes todavía vengan de fixtures hasta que SPEC-05/06, SPEC-10 y SPEC-12 se implementen.

---

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F03-FE-01** Lista de Prestadores con filtros de catálogos servidos por API, paginación y restablecimiento de filtros.
- [ ] **F03-FE-02** Detalle público accesible desde resultados y enlace directo con el mismo DTO de exposición.
- [ ] **F03-FE-03** Mostrar portafolio, cobertura, reputación y verificación solo cuando estén disponibles; conectar confianza al completar F10.
- [ ] **F03-FE-04** Mostrar sin resultados o detalle no disponible sin revelar si hubo bloqueo o privacidad.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F03-QA-01** Contrato idéntico al consultar desde lista o enlace directo y a la vista previa del Prestador.
- [ ] **F03-QA-02** Datos de distintos clientes/prestadores para comprobar rol, cobertura y privacidad.
- [ ] **F03-QA-03** Medir p95 < 300 ms con el dataset del piloto.
- [ ] **F03-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

- **Depende externamente de**: `plan-spec-01-autenticacion.md` (rol Cliente, interceptor de autorización).
- **Dependencia de datos pendiente (no bloqueante para empezar, sí para terminar)**: SPEC-05/06 (perfil profesional del Prestador), SPEC-10 (reputación), SPEC-12 (catálogo de categorías/zonas). Se puede avanzar Phase 1-2 con fixtures, pero las integration tests de T004 no pueden considerarse definitivamente verdes hasta integrar los contratos públicos reales.
- **Setup (Phase 1)** → depende solo de `plan-spec-01-autenticacion.md`.
- **User Story 1 (Phase 2)** → depende de Phase 1.

## Notes

- Este plan documenta una dependencia de datos que contradice el orden superficial de los diagramas (UC-02 antes que UC-03/UC-05); se deja explícita para que, al planear SPEC-05/06/10/12, el equipo recuerde volver aquí y reemplazar los fixtures por los contratos públicos reales.
