# Implementation Plan: SPEC-18

**Date**: 2026-10-02  
**Spec**: [spec-18-insignia-progreso-formalizacion](../../FASE-4-Prototipar/specs/spec-18-insignia-progreso-formalizacion.md)
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

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

Tres Acceptance Scenarios: feature off, insignia no engañosa y máximo progreso. Test adicional: reset del progreso actualiza inmediatamente la vista.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── formalizacion/
    ├── application/
    │   ├── usecase/
    │   │   ConsultarInsigniaFormalizacionUseCase
    │   ├── service/
    │   │   ConsultarInsigniaFormalizacionService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       ConsultaProgresoFormalizacionPort
    └── infrastructure/
        └── adapter/
            Adaptadores de puertos requeridos; reutilizar contratos existentes
```

**Contrato de arquitectura**: cada operación tiene una interfaz `application/usecase/*UseCase` y una implementación `application/service/*Service implements *UseCase`. Controllers, filtros, gateways y workers inyectan las interfaces por constructor; no servicios concretos ni repositorios JPA. Los servicios coordinan dominio y puertos sin importar Spring, JPA o HTTP. Dominio contiene modelos, reglas, excepciones de negocio y repositorios propios; infraestructura implementa los puertos y configura transacciones. Los DTO HTTP y sus mappers pertenecen a presentación; Command/Query/Result de aplicación son independientes del transporte.

Los contratos entre módulos son interfaces públicas de aplicación; no se accede a Service concreto, repositorio interno o entidad JPA de otro módulo. Cuando se requiera persistencia se separan `domain/repository`, `infrastructure/persistence/entity`, `mapper`, `jpa` y `adapter`. La configuración de Spring conecta puertos y adaptadores, y conserva la transacción completa del caso de uso. Solo crear clases/carpetas con responsabilidad real. `common` contiene infraestructura/contratos transversales acotados; el contexto de Spring Security no entra a aplicación. `SesionAutenticada` es contrato puro en `auth/application/port`; generación aleatoria segura del token y huella SHA-256 son responsabilidades separadas.

### Interfaces de entrada e implementaciones

| Módulo | UseCase (interfaz) | Service (implementación) |
|---|---|---|
| `formalizacion` | `ConsultarInsigniaFormalizacionUseCase` | `ConsultarInsigniaFormalizacionService` |

Puertos de salida: ConsultaProgresoFormalizacionPort; sin tabla adicional de insignias. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: lecturas/proyecciones o extensión de tablas existentes; no crear tablas de lectura propias. Cualquier tabla opcional se diseña/aplica solo con aprobación de la feature; no es parte de las 42 tablas MVP. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.


## Phase 1: Setup

- [ ] T001 Feature flag OFF.
- [ ] T002 Definir mapping progreso→nivel visual sin persistencia.

## Phase 2: User Story 1 - Insignia de progreso [UC088] (Priority: P3)

- [ ] T003 Tests de los tres escenarios.
- [ ] T004 `ConsultarInsigniaFormalizacionService implements ConsultarInsigniaFormalizacionUseCase`.
- [ ] T005 Integrar opcionalmente en perfil público.
- [ ] T006 Forzar disclaimer en todos los niveles.
- [ ] T007 No cachear independientemente del progreso o invalidar de forma atómica.

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F18-FE-01** Componente de insignia con leyenda y enlace al progreso orientativo.
- [ ] **F18-FE-02** Integrarlo en perfil público/previsualización solo con flag y exposición autorizada.
- [ ] **F18-FE-03** Desactivación retira componente sin alterar progreso ni la ruta.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F18-QA-01** Proyección coincide con progreso y leyenda visible incluso en máximo nivel.
- [ ] **F18-QA-02** No crear tabla insignias ni actualizar estatus legal.
- [ ] **F18-QA-03** Accesibilidad de etiqueta, contraste y respaldo textual.
- [ ] **F18-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Notes

- No se crea tabla `insignias`.
- Si cambia la definición visual, no modifica el progreso base.
