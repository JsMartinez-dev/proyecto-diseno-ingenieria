# Implementation Plan: SPEC-19

**Date**: 2026-10-02  
**Spec**: [spec-19-referidos-e-idiomas](FASE-4-Prototipar/specs/spec-19-referidos-e-idiomas)  
**Depends on**: `plan-spec-01-autenticacion.md`

## Summary

SPEC-19 agrupa dos capacidades `Could` independientes: programa de referidos e idiomas adicionales. Ambas permanecen deshabilitadas por defecto y no bloquean el MVP.

Referidos registra atribución sin permitir auto-referido ni atribución duplicada. Idiomas mantiene español como fallback obligatorio y separa la preferencia del usuario de los recursos de traducción del frontend/backend.

## Technical Context

**Storage**: PostgreSQL 16 — `referidos`, `idiomas_soportados`, `preferencias_idioma` si las features se habilitan  
**Feature flags**: `referidos.enabled=false`, `i18n.additional-languages.enabled=false`  
**Constraints**: antifraude básico; fallback español

## Data Model

| Entidad | Campos |
|---|---|
| `Referido` | `id`, `referenteId`, `referidoId?`, `codigo/mecanismo`, `estadoAtribucion`, `fechaCreacion`, `fechaAtribucion` |
| `IdiomaSoportado` | `codigo`, `nombre`, `habilitado` |
| `PreferenciaIdioma` | `usuarioId`, `idiomaCodigo`, `fechaActualizacion` |

## API Contracts

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/api/v1/referidos` | generar mecanismo de referido |
| POST | `/api/v1/referidos/atribuir` | consumido por registro/activación, idempotente |
| GET/PUT | `/api/v1/preferencias/idioma` | consultar/cambiar idioma |
| GET | `/api/v1/idiomas` | catálogo habilitado |

## Testing Strategy

6 Acceptance Scenarios; auto-referido, duplicado y fallback por texto ausente. Feature off debe ocultar ambas capacidades.

## Project Structure

```text
backend/src/main/java/com/aliado/
├── referidos/
│   ├── presentation/controller/
│   ├── application/service/
│   ├── domain/repository/
│   └── domain/model/
└── internacionalizacion/
    ├── presentation/controller/
    ├── application/service/
    ├── domain/repository/
    └── domain/model/
```

**Arquitectura por capas**: este SPEC conserva la organización modular y aplica Arquitectura Limpia según las secciones 7.1–7.5 de [plan-general-ALIADO](plan-general-ALIADO.md#7-estructura-lógica-del-repositorio). Las rutas del árbol son relativas a cada módulo: `domain/` contiene modelos, reglas y puertos; `application/` coordina los casos de uso; `presentation/` expone HTTP; `infrastructure/` implementa los detalles técnicos. El dominio no importa Spring, JPA ni DTO HTTP; la aplicación depende de contratos de dominio/aplicación, nunca de adaptadores concretos. Los DTO de aplicación van en `application/dto/` y los contratos HTTP en `presentation/dto/`, con conversión en presentación cuando corresponda.

Cuando haya persistencia, los `*Repository` del árbol son puertos en `domain/repository/`, sin heredar de Spring Data. Las tareas existentes de persistencia incluyen sus implementaciones en `infrastructure/persistence/`: `entity/` para entidades JPA, `jpa/` para repositorios Spring Data, `adapter/` para implementar los puertos y `mapper/` para convertir dominio y persistencia. Las integraciones externas se definen mediante puertos de aplicación y adaptadores en `infrastructure/adapter/`; los contratos compartidos existentes de `common/` permanecen libres de detalles técnicos. Las dependencias entre módulos utilizan contratos de dominio o servicios públicos de aplicación, sin acceder a entidades JPA ni adaptadores ajenos. Los filtros de seguridad y la configuración de Spring pertenecen a infraestructura técnica; los controladores y la traducción de errores HTTP pertenecen a presentación. Se crean solo las carpetas necesarias para las tareas ya definidas; se conservan sus identificadores, orden y dependencias.

---

## Phase 1: Feature flags / Setup

- [ ] T001 Flags OFF.
- [ ] T002 Migraciones de referidos/preferencias solo preparadas; no activación funcional automática.
- [ ] T003 Español configurado como idioma base/fallback.

## Phase 2: User Story 1 - Programa de referidos [UC089] (Priority: P3)

- [ ] T004 Tests feature off.
- [ ] T005 Tests referido válido, auto-referido y duplicado.
- [ ] T006 Modelo/repositorio `Referido`.
- [ ] T007 `ReferidoService` con atribución idempotente.
- [ ] T008 Integración opcional con registro de SPEC-01 sin hacerla bloqueante.
- [ ] T009 Endpoints.

## Phase 3: User Story 2 - Idiomas adicionales [UC092] (Priority: P3)

- [ ] T010 Tests feature off, idioma habilitado y fallback.
- [ ] T011 Catálogo `IdiomaSoportado`.
- [ ] T012 Preferencia por Usuario.
- [ ] T013 Endpoints.
- [ ] T014 Integrar archivos/catálogo i18n en React Native y panel web.
- [ ] T015 Si se retira un idioma soportado, fallback automático a español.

## Notes

- `[NEEDS CLARIFICATION]`: beneficio, campañas, elegibilidad y controles antifraude avanzados de referidos.
- `[NEEDS CLARIFICATION]`: primer idioma adicional y alcance exacto de traducción.
- Una persona invitada puede no tener todavía cuenta; `referidoId` es nullable hasta atribución válida.
