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
├── application/service/           InsigniaFormalizacionService
└── application/dto/               InsigniaFormalizacionDTO
```

**Arquitectura por capas**: este SPEC conserva la organización modular y aplica Arquitectura Limpia según las secciones 7.1–7.5 de [plan-general-ALIADO](plan-general-ALIADO.md#7-estructura-lógica-del-repositorio). Las rutas del árbol son relativas a cada módulo: `domain/` contiene modelos, reglas y puertos; `application/` coordina los casos de uso; `presentation/` expone HTTP; `infrastructure/` implementa los detalles técnicos. El dominio no importa Spring, JPA ni DTO HTTP; la aplicación depende de contratos de dominio/aplicación, nunca de adaptadores concretos. Los DTO de aplicación van en `application/dto/` y los contratos HTTP en `presentation/dto/`, con conversión en presentación cuando corresponda.

Cuando haya persistencia, los `*Repository` del árbol son puertos en `domain/repository/`, sin heredar de Spring Data. Las tareas existentes de persistencia incluyen sus implementaciones en `infrastructure/persistence/`: `entity/` para entidades JPA, `jpa/` para repositorios Spring Data, `adapter/` para implementar los puertos y `mapper/` para convertir dominio y persistencia. Las integraciones externas se definen mediante puertos de aplicación y adaptadores en `infrastructure/adapter/`; los contratos compartidos existentes de `common/` permanecen libres de detalles técnicos. Las dependencias entre módulos utilizan contratos de dominio o servicios públicos de aplicación, sin acceder a entidades JPA ni adaptadores ajenos. Los filtros de seguridad y la configuración de Spring pertenecen a infraestructura técnica; los controladores y la traducción de errores HTTP pertenecen a presentación. Se crean solo las carpetas necesarias para las tareas ya definidas; se conservan sus identificadores, orden y dependencias.

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
