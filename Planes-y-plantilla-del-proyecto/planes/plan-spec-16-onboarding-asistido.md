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
├── controller/ OnboardingAsistidoController
├── service/    OnboardingAsistidoService, CanalAcompanamiento
├── repository/ SesionAcompanamientoRepository
└── model/      SesionAcompanamiento
```

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
