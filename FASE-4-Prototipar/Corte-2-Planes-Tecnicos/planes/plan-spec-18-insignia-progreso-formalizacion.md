# Implementation Plan: SPEC-18

**Date**: 2026-10-02  
**Spec**: [spec-18-insignia-progreso-formalizacion](FASE-4-Prototipar/specs/spec-18-insignia-progreso-formalizacion)  
**Depends on**: `plan-spec-13-ruta-formalizacion.md`, `plan-spec-05-perfil-profesional.md`

## Summary

SPEC-18 es una capacidad `Could` de presentación. La insignia no introduce entidad persistente: es una vista derivada del progreso de formalización de SPEC-13. Debe permanecer deshabilitada por defecto y mostrar siempre que el progreso es orientativo, no certificación ni estatus legal.

## Technical Context

**Storage**: ninguna tabla nueva  
**Feature flag**: `insignia-formalizacion.enabled=false`  
**Constraints**: la vista debe reflejar el progreso actual sin cache obsoleto que lo convierta en dato independiente

## Data Model

`InsigniaFormalizacionDTO`: `nivelVisual`, `progreso`, `textoOrientativo`. Derivado de `ProgresoFormalizacion`.

## API Contracts

Puede integrarse dentro del DTO público de Prestador o mediante `GET /api/v1/prestadores/{id}/insignia-formalizacion` solo si la feature está habilitada.

## Testing Strategy

Tres Acceptance Scenarios: feature off, insignia no engañosa y máximo progreso. Test adicional: reset del progreso actualiza inmediatamente la vista.

## Project Structure

```text
backend/src/main/java/com/aliado/formalizacion/insignia/
├── service/ InsigniaFormalizacionService
└── dto/     InsigniaFormalizacionDTO
```

## Phase 1: Setup

- [ ] T001 Feature flag OFF.
- [ ] T002 Definir mapping progreso→nivel visual sin persistencia.

## Phase 2: User Story 1 - Insignia de progreso [UC088] (Priority: P3)

- [ ] T003 Tests de los tres escenarios.
- [ ] T004 `InsigniaFormalizacionService`.
- [ ] T005 Integrar opcionalmente en perfil público.
- [ ] T006 Forzar disclaimer en todos los niveles.
- [ ] T007 No cachear independientemente del progreso o invalidar de forma atómica.

## Notes

- No se crea tabla `insignias`.
- Si cambia la definición visual, no modifica el progreso base.
