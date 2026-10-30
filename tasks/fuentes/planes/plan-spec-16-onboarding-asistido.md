# Implementation Plan: SPEC-16

**Date**: 2026-10-02  
**Spec**: [spec-16-onboarding-asistido](FASE-4-Prototipar/specs/spec-16-onboarding-asistido)  
**Depends on**: `plan-spec-01-autenticacion.md`, `plan-spec-02-perfil.md`; opcionalmente `plan-spec-15-chat-soporte-whatsapp.md` para canal WhatsApp configurado

## Summary

SPEC-16 implementa una capacidad `Could` de acompañamiento humano para Prestadores mediante WhatsApp o Gestor comunitario. Debe permanecer deshabilitada por defecto y jamás convertir la asistencia en prerrequisito del registro autónomo.

## Technical Context

**Storage**: PostgreSQL 16 si se registra trazabilidad de sesiones  
**Dependencies**: infraestructura base existente; no se agrega framework obligatorio  
**Constraints**: RNF-002, RNF-004, RNF-010; privacidad equivalente al resto del producto  
**Feature flag**: `onboarding-asistido.enabled=false`

## Data Model

| Entidad | Campos |
|---|---|
| `SesionAcompanamiento` | `id`, `prestadorId`, `canal`, `gestorReferencia?`, `estado`, `fechaSolicitud`, `fechaAtencion` |
| `GestorComunitario` | referencia operativa/configurable; no necesita ser Usuario del sistema salvo decisión futura |

## API Contracts

| Método | Endpoint | Resultado |
|---|---|---|
| POST | `/api/v1/onboarding/asistencia` | `202 { sesionId, estado }` si feature habilitada |
| GET | `/api/v1/onboarding/asistencia/{id}` | estado propio |

## Testing Strategy

Tres Acceptance Scenarios + edge cases de fuera de horario y acceso a datos privados.

## Project Structure

```text
backend/src/main/java/com/aliado/onboarding/
├── presentation/controller/       OnboardingAsistidoController
├── application/port/              CanalAcompanamiento
├── application/service/           OnboardingAsistidoService
├── domain/repository/             SesionAcompanamientoRepository
└── domain/model/                  SesionAcompanamiento
```

**Arquitectura por capas**: este SPEC conserva la organización modular y aplica Arquitectura Limpia según las secciones 7.1–7.5 de [plan-general-ALIADO](plan-general-ALIADO.md#7-estructura-lógica-del-repositorio). Las rutas del árbol son relativas a cada módulo: `domain/` contiene modelos, reglas y puertos; `application/` coordina los casos de uso; `presentation/` expone HTTP; `infrastructure/` implementa los detalles técnicos. El dominio no importa Spring, JPA ni DTO HTTP; la aplicación depende de contratos de dominio/aplicación, nunca de adaptadores concretos. Los DTO de aplicación van en `application/dto/` y los contratos HTTP en `presentation/dto/`, con conversión en presentación cuando corresponda.

Cuando haya persistencia, los `*Repository` del árbol son puertos en `domain/repository/`, sin heredar de Spring Data. Las tareas existentes de persistencia incluyen sus implementaciones en `infrastructure/persistence/`: `entity/` para entidades JPA, `jpa/` para repositorios Spring Data, `adapter/` para implementar los puertos y `mapper/` para convertir dominio y persistencia. Las integraciones externas se definen mediante puertos de aplicación y adaptadores en `infrastructure/adapter/`; los contratos compartidos existentes de `common/` permanecen libres de detalles técnicos. Las dependencias entre módulos utilizan contratos de dominio o servicios públicos de aplicación, sin acceder a entidades JPA ni adaptadores ajenos. Los filtros de seguridad y la configuración de Spring pertenecen a infraestructura técnica; los controladores y la traducción de errores HTTP pertenecen a presentación. Se crean solo las carpetas necesarias para las tareas ya definidas; se conservan sus identificadores, orden y dependencias.

---

## Phase 1: Setup

- [ ] T001 Feature flag OFF.
- [ ] T002 Migración `sesiones_acompanamiento` si se aprueba persistencia.
- [ ] T003 Configurar adaptadores `WHATSAPP` y `GESTOR` sin acoplar registro base.

## Phase 2: User Story 1 - Onboarding asistido [UC091] (Priority: P3)

- [ ] T004 Contract tests feature off/on.
- [ ] T005 Integration test: derivación exitosa.
- [ ] T006 Integration test: canal/gestor no disponible no marca ATENDIDA.
- [ ] T007 Implementar `OnboardingAsistidoService`.
- [ ] T008 Endpoints.
- [ ] T009 Aplicar política de privacidad: Gestor nunca recibe dirección exacta salvo autorización explícita ajena a este SPEC.

## Dependencies & Execution Order

Puede implementarse después del registro/perfil, pero no es una dependencia de estos. El MVP funciona con la feature apagada.

## Notes

- `[NEEDS CLARIFICATION]`: si una solicitud de ayuda puede iniciarse antes de que exista `Usuario`; el Key Entity del SPEC referencia Prestador, por lo que este plan no inventa identidad anónima.
- Horarios y disponibilidad de Gestores son decisiones operativas.
