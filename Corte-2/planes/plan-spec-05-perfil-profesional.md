# Implementation Plan: SPEC-05

**Date**: 2026-10-02
**Spec**: [spec-05-perfil-profesional](FASE-4-Prototipar/specs/spec-05-perfil-profesional)

## Summary

SPEC-05 cubre la creación y edición del perfil profesional del Prestador, la gestión de su portafolio de servicios, la configuración de disponibilidad/agenda, y la vista previa de su propio perfil. Reutiliza la infraestructura de autenticación/roles de SPEC-01 y el catálogo compartido de `CategoriaServicio`/`Zona` y el contrato `ArchivoStorageService` introducidos en SPEC-04.

## Technical Context

**Language/Version**: Java 21 (LTS) — reutilizado de SPEC-01
**Primary Dependencies**: Spring Boot 3.3.x (Web, Data JPA, Validation), Flyway — reutilizados de SPEC-01. No se agregan dependencias de framework nuevas.
**Build tool**: Maven
**Storage**: PostgreSQL 16 — nuevas tablas de este módulo. Las fotos del portafolio usan el mismo `ArchivoStorageService` de SPEC-04 `[NEEDS CLARIFICATION: proveedor concreto de almacenamiento `
**Testing**: JUnit 5 + Mockito, Spring Boot Test + Testcontainers (PostgreSQL), MockMvc/WebTestClient — reutilizados de SPEC-01
**Target Platform**: VPS Hostinger (Docker Compose) — reutilizado de SPEC-01
**Project Type**: Web + Mobile (backend único) — reutilizado de SPEC-01
**Performance Goals**: sin metas específicas nuevas de este SPEC
**Constraints**: RNF-002 (usabilidad baja alfabetización digital), RNF-004 (seguridad/privacidad), RNF-010 (Ley 1581)
**Scale/Scope**: ~50–100 Prestadores (piloto) — reutilizado de SPEC-01

## Data Model

| Entidad                               | Campos clave                                                                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PerfilProfesional`                   | `id`, `prestadorId` (FK Usuario, único), `datosGenerales` (campos a definir por UI), `estadoExposicionPublica`, `fechaCreacion`, `fechaActualizacion` |
| `PerfilCategoria` *(tabla puente)*    | `perfilId` (FK), `categoriaId` (FK `CategoriaServicio` de SPEC-04)                                                                                    |
| `PerfilZonaAtencion` *(tabla puente)* | `perfilId` (FK), `zonaId` (FK `Zona` de SPEC-04)                                                                                                      |
| `ExperienciaProfesional`              | `id`, `perfilId` (FK), `descripcion`, `fecha` o `periodo`                                                                                             |
| `ServicioPortafolio`                  | `id`, `perfilId` (FK), `descripcion`, `evidenciaUrl` (vía `ArchivoStorageService`)                                                                    |
| `Disponibilidad`                      | `id`, `perfilId` (FK), `diaSemana` o rango, `horaInicio`, `horaFin`                                                                                   |
| `CompromisoAgenda`                    | `id`, `perfilId` (FK), `fechaHoraInicio`, `fechaHoraFin`, `origen` (manual/sistema)                                                                   |

Relaciones: `Usuario` 1—1 `PerfilProfesional`, `PerfilProfesional` N—N `CategoriaServicio` (vía `PerfilCategoria`), `PerfilProfesional` N—N `Zona` (vía `PerfilZonaAtencion`), `PerfilProfesional` 1—N `ExperienciaProfesional`, `PerfilProfesional` 1—N `ServicioPortafolio`, `PerfilProfesional` 1—N `Disponibilidad`, `PerfilProfesional` 1—N `CompromisoAgenda`.

## API Contracts

| Método | Endpoint | Request body | Respuesta éxito | Errores |
|---|---|---|---|---|
| POST | `/api/v1/perfiles` | `{ datosGenerales, categoriaIds[], zonaIds[], experiencia[]? }` | `201 { id }` | `400` falta categoría o zona |
| PUT | `/api/v1/perfiles/mio` | datos generales editables | `200 { id }` | `404` perfil no existe; `403` no autorizado |
| PUT | `/api/v1/perfiles/mio/categorias` | `{ categoriaIds[] }` | `200` | `403/404` |
| POST | `/api/v1/perfiles/mio/experiencia` | `{ descripcion, ... }` | `201` | `403/404` |
| POST | `/api/v1/perfiles/mio/portafolio` | `{ descripcion, evidencia[] }` | `201 { id }` | `403/404` |
| DELETE | `/api/v1/perfiles/mio/portafolio/{id}` | — | `204` | `403/404` servicio ajeno o inexistente |
| PUT | `/api/v1/perfiles/mio/disponibilidad` | `{ bloques[] }` | `200` | `403/404` |
| POST \| PUT \| GET | `/api/v1/perfiles/mio/agenda` | `{ fechaHoraInicio, fechaHoraFin }` | `200/201` | `403/404`; `409` conflicto con disponibilidad |
| GET | `/api/v1/perfiles/mio/vista-previa` | — | `200 { ...perfil público }` | `403/404` |

Todos los endpoints restringidos a rol PRESTADOR mediante el filtro de autorización por rol de SPEC-01 (T018).

## Testing Strategy

- **Contract tests**: uno por endpoint de la tabla anterior.
- **Integration tests**: uno por Acceptance Scenario del SPEC (16 escenarios entre las 5 historias), con Testcontainers.
- **Unit tests**: validación de categoría+zona obligatorias al crear, lógica de "perfil ya existe → no duplicar", detección de conflicto disponibilidad/agenda, construcción de la vista pública (subconjunto expuesto) usada tanto por la vista previa de este SPEC como por SPEC-03.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── auth/            # SPEC-01 (reutilizado)
├── catalogo/         # SPEC-04 (reutilizado — CategoriaServicio, Zona)
├── solicitudes/      # SPEC-04 (reutilizado, sin cambios)
├── perfiles/         # nuevo
│   ├── controller/   PerfilController
│   ├── service/      PerfilService, DisponibilidadService
│   ├── repository/   PerfilProfesionalRepository, ExperienciaProfesionalRepository, ServicioPortafolioRepository, DisponibilidadRepository, CompromisoAgendaRepository
│   └── model/        PerfilProfesional, ExperienciaProfesional, ServicioPortafolio, Disponibilidad, CompromisoAgenda
└── common/           # SPEC-01/SPEC-04 (reutilizado)
    ├── config/
    ├── security/
    ├── exception/
    └── storage/       ArchivoStorageService (interfaz, SPEC-04, reutilizada)
```

**Structure Decision**: se mantiene el patrón modular por funcionalidad ya usado en `auth/` y `solicitudes/`. `perfiles/` reutiliza el catálogo compartido de `catalogo/` (SPEC-04) en vez de redefinir categorías o zonas, y reutiliza `ArchivoStorageService` de `common/storage/` para la evidencia del portafolio, sin crear un segundo mecanismo de almacenamiento. `DisponibilidadService` se separa de `PerfilService` dentro del mismo módulo porque su lógica de validación de conflictos (agenda vs. disponibilidad) es independiente de los datos generales del perfil y será consumida directamente por SPEC-06 para el cálculo de compatibilidad.

---

## Phase 1: Setup

- [ ] T001 Crear el paquete `perfiles/` con sus subcarpetas en capas
- [ ] T002 Migración Flyway: tablas `perfiles_profesionales`, `perfil_categoria`, `perfil_zona_atencion`, `experiencia_profesional`, `servicio_portafolio`, `disponibilidad`, `compromiso_agenda`

---

## Phase 2: Foundational

No se requieren tareas fundacionales nuevas para este SPEC: autenticación/roles (SPEC-01), catálogo de categorías/zonas y `ArchivoStorageService` (SPEC-04) ya están disponibles y se reutilizan directamente.

**Checkpoint**: sin bloqueo adicional — las historias de usuario de este plan pueden iniciar apoyándose en Phase 1 de este plan más la infraestructura ya existente.

---

## Phase 3: User Story 1 - Crear el perfil profesional [UC024, UC026, UC027, UC028] (Priority: P1)

**Goal**: un Prestador sin perfil puede crear uno con al menos una categoría y una zona obligatorias, y experiencia opcional.

**Independent Test**: intentar crear sin categorías o sin zonas (rechazo); crear con ambos datos obligatorios sin experiencia (éxito); repetir agregando experiencia.

### Tests

- [ ] T003 [P] [US1] Contract test `POST /perfiles` (201, 400) — `tests/contract/test_perfiles_crear.java`
- [ ] T004 [P] [US1] Integration test: creación completa, sin categorías, sin zonas, con/sin experiencia, actualizar categorías/experiencia después de creado sin duplicar perfil, actor no autorizado — `tests/integration/test_crear_perfil.java`

### Implementation

- [ ] T005 [P] [US1] Modelos `PerfilProfesional`, `ExperienciaProfesional` y tablas puente `PerfilCategoria`/`PerfilZonaAtencion` — `perfiles/model`
- [ ] T006 [US1] `PerfilProfesionalRepository`, `ExperienciaProfesionalRepository` — `perfiles/repository`
- [ ] T007 [US1] `PerfilService.crear()`: valida al menos una categoría y una zona (FR-024), asocia categorías existentes del catálogo (FR-026, reutiliza `CategoriaServicioRepository` de SPEC-04), asocia zonas (FR-027, reutiliza `ZonaRepository` de SPEC-04), registra experiencia opcional (FR-028) (depends on T005, T006)
- [ ] T008 [US1] `PerfilService.actualizarCategorias()`, `agregarExperiencia()`: operan sobre perfil existente sin crear uno nuevo (depends on T007)
- [ ] T009 [US1] Endpoints `POST /api/v1/perfiles`, `PUT /api/v1/perfiles/mio/categorias`, `POST /api/v1/perfiles/mio/experiencia`, restringidos a rol PRESTADOR — `perfiles/controller`

**Checkpoint**: un Prestador puede crear su perfil con los datos obligatorios de forma independiente.

---

## Phase 4: User Story 2 - Editar los datos generales del perfil [UC025] (Priority: P1)

**Goal**: un Prestador puede editar los datos generales de un perfil ya creado.

**Independent Test**: modificar un dato general y verificar el cambio; intentar editar un perfil inexistente o ajeno y verificar el rechazo.

### Tests

- [ ] T010 [P] [US2] Contract test `PUT /perfiles/mio` (200, 403, 404) — `tests/contract/test_perfiles_editar.java`
- [ ] T011 [P] [US2] Integration test: edición exitosa, perfil inexistente, actor no autorizado — `tests/integration/test_editar_perfil.java`

### Implementation

- [ ] T012 [US2] `PerfilService.editarDatosGenerales()`: valida existencia y propiedad del perfil, rechaza si no existe o no pertenece al Prestador (FR-025) (depends on T007)
- [ ] T013 [US2] Endpoint `PUT /api/v1/perfiles/mio` — `perfiles/controller`

**Checkpoint**: el Prestador puede mantener actualizado su perfil de forma independiente.

---

## Phase 5: User Story 3 - Gestionar el portafolio de servicios [UC029, UC030] (Priority: P1)

**Goal**: el Prestador puede agregar o eliminar servicios de su portafolio.

**Independent Test**: agregar un servicio con evidencia y verificar que aparece disponible; eliminarlo y verificar que deja de mostrarse sin afectar los demás.

### Tests

- [ ] T014 [P] [US3] Contract test `POST /perfiles/mio/portafolio`, `DELETE /perfiles/mio/portafolio/{id}` (201, 204, 403, 404) — `tests/contract/test_portafolio.java`
- [ ] T015 [P] [US3] Integration test: agregar servicio, eliminar servicio propio, eliminar servicio ajeno (rechazo), actor no autorizado — `tests/integration/test_gestionar_portafolio.java`

### Implementation

- [ ] T016 [P] [US3] Modelo `ServicioPortafolio` — `perfiles/model` (depends on T005)
- [ ] T017 [US3] `ServicioPortafolioRepository` — `perfiles/repository`
- [ ] T018 [US3] `PerfilService.agregarServicioPortafolio()`: sube evidencia vía `ArchivoStorageService` de SPEC-04, asocia al perfil propio (FR-029) (depends on T017, dependencia externa: `ArchivoStorageService` de SPEC-04 T006)
- [ ] T019 [US3] `PerfilService.eliminarServicioPortafolio()`: valida propiedad, elimina sin afectar otros servicios (FR-030) (depends on T017)
- [ ] T020 [US3] Endpoints `POST /api/v1/perfiles/mio/portafolio`, `DELETE /api/v1/perfiles/mio/portafolio/{id}` — `perfiles/controller`

**Checkpoint**: el portafolio del Prestador puede gestionarse de forma independiente.

---

## Phase 6: User Story 4 - Configurar disponibilidad y gestionar la agenda [UC031, UC032] (Priority: P1)

**Goal**: el Prestador puede configurar su disponibilidad horaria y gestionar compromisos en su agenda.

**Independent Test**: configurar disponibilidad y verificar que queda guardada; registrar un compromiso y verificar que se refleja sin duplicar información.

### Tests

- [ ] T021 [P] [US4] Contract test `PUT /perfiles/mio/disponibilidad`, `POST/PUT/GET /perfiles/mio/agenda` (200, 201, 403, 404, 409) — `tests/contract/test_disponibilidad_agenda.java`
- [ ] T022 [P] [US4] Integration test: configurar disponibilidad, agregar/modificar/consultar compromiso sin afectar otros, conflicto disponibilidad-agenda (edge case), actor no autorizado — `tests/integration/test_disponibilidad_agenda.java`

### Implementation

- [ ] T023 [P] [US4] Modelos `Disponibilidad`, `CompromisoAgenda` — `perfiles/model` (depends on T005) 
- [ ] T024 [US4] `DisponibilidadRepository`, `CompromisoAgendaRepository` — `perfiles/repository`
- [ ] T025 [US4] `DisponibilidadService.configurar()`: guarda disponibilidad del perfil (FR-031) (depends on T024)
- [ ] T026 [US4] `DisponibilidadService.gestionarCompromiso()`: agrega/modifica/consulta compromisos propios sin afectar los de otros prestadores (FR-032), rechaza si entra en conflicto con disponibilidad ya registrada (edge case del SPEC) (depends on T024, T025)
- [ ] T027 [US4] Endpoints `PUT /api/v1/perfiles/mio/disponibilidad`, `POST|PUT|GET /api/v1/perfiles/mio/agenda` — `perfiles/controller`

**Checkpoint**: disponibilidad y agenda quedan configuradas y listas para ser consumidas por SPEC-06.

---

## Phase 7: User Story 5 - Consultar la vista previa del perfil [UC033] (Priority: P1)

**Goal**: el Prestador puede ver su perfil exactamente como lo vería un Cliente.

**Independent Test**: consultar la vista previa y verificar que coincide con la información pública configurada.

### Tests

- [ ] T028 [P] [US5] Contract test `GET /perfiles/mio/vista-previa` (200, 403, 404) — `tests/contract/test_vista_previa.java`
- [ ] T029 [P] [US5] Integration test: vista previa disponible y coincide con subconjunto público, actor no autorizado o perfil ajeno — `tests/integration/test_vista_previa.java`

### Implementation

- [ ] T030 [US5] `PerfilService.construirVistaPublica()`: define el subconjunto de datos expuestos públicamente a partir del perfil completo (FR-033); esta misma construcción debe ser la que use SPEC-03 (UC015) para no divergir (depends on T007, T018, T025) 
- [ ] T031 [US5] Endpoint `GET /api/v1/perfiles/mio/vista-previa` — `perfiles/controller`

**Checkpoint**: el Prestador puede validar su información pública antes de exponerla.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** → depende de SPEC-01 (auth/roles) y SPEC-04 (catálogo, `ArchivoStorageService`) ya completos.
- **Foundational (Phase 2)** → no aplica; no bloquea nada adicional.
- **User Story 1 (Phase 3)** → depende de Setup. Es prerrequisito de todas las demás historias de este plan (requieren un perfil ya creado).
- **User Story 2 (Phase 4)** → depende de User Story 1.
- **User Story 3 (Phase 5)** → depende de User Story 1 y de `ArchivoStorageService` (SPEC-04).
- **User Story 4 (Phase 6)** → depende de User Story 1.
- **User Story 5 (Phase 7)** → depende de User Story 1, 3 y 4 (la vista previa expone datos generales, portafolio y disponibilidad).

## Notes

- Este plan reutiliza en su totalidad la infraestructura de SPEC-01 (auth/roles) y SPEC-04 (catálogo `CategoriaServicio`/`Zona`, `ArchivoStorageService`); ningún plan posterior debe redefinir estos componentes.
- `DisponibilidadService` queda expuesto como dependencia explícita para SPEC-06 (cálculo de compatibilidad usa categoría + zona + disponibilidad).
- Pendientes de aclaración: estructura exacta de "experiencia profesional", granularidad del modelo de `Disponibilidad` (recurrente vs. fechas puntuales), y si el contrato de "vista pública del perfil" ya fue definido en SPEC-03 (no entregado aún en esta conversación) o si este SPEC lo define por primera vez.
