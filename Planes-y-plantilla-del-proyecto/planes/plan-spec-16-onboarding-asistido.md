# Implementation Plan: SPEC-16

**Date**: 2026-10-02  
**Spec**: [spec-16-onboarding-asistido](../../FASE-4-Prototipar/specs/spec-16-onboarding-asistido.md)
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

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

Tres Acceptance Scenarios + edge cases de fuera de horario y acceso a datos privados.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── onboarding/
    ├── domain/
    │   ├── model/
    │   │   SesionAcompanamiento
    │   └── repository/
    │       SesionAcompanamientoRepository
    ├── application/
    │   ├── usecase/
    │   │   SolicitarAcompanamientoUseCase, ConsultarAcompanamientoUseCase
    │   ├── service/
    │   │   SolicitarAcompanamientoService, ConsultarAcompanamientoService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       CanalAcompanamiento
    ├── infrastructure/
    │   ├── persistence/
    │   │   ├── entity/
    │   │   │   SesionAcompanamientoEntity
    │   │   ├── mapper/
    │   │   │   SesionAcompanamientoMapper
    │   │   ├── jpa/
    │   │   │   SesionAcompanamientoJpaRepository
    │   │   └── adapter/
    │   │       SesionAcompanamientoPersistenceAdapter
    │   └── adapter/
    │       Adaptadores de puertos requeridos; reutilizar contratos existentes
    └── presentation/
        ├── controller/
        │   OnboardingAsistidoController
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
| `onboarding` | `SolicitarAcompanamientoUseCase` | `SolicitarAcompanamientoService` |
| `onboarding` | `ConsultarAcompanamientoUseCase` | `ConsultarAcompanamientoService` |

Puertos de salida: CanalAcompanamiento y SesionAutenticada; adaptadores de gestor/WhatsApp cuando se aprueben. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `sesiones_acompanamiento`. Cualquier tabla opcional se diseña/aplica solo con aprobación de la feature; no es parte de las 42 tablas MVP. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.


---

## Phase 1: Setup

- [ ] T001 Feature flag OFF.
- [ ] T002 Migración `sesiones_acompanamiento` si se aprueba persistencia.
- [ ] T003 Configurar adaptadores `WHATSAPP` y `GESTOR` sin acoplar registro base.

## Phase 2: User Story 1 - Onboarding asistido [UC091] (Priority: P3)

- [ ] T004 Contract tests feature off/on.
- [ ] T005 Integration test: derivación exitosa.
- [ ] T006 Integration test: canal/gestor no disponible no marca ATENDIDA.
- [ ] T007 Implementar `SolicitarAcompanamientoService implements SolicitarAcompanamientoUseCase` y `ConsultarAcompanamientoService implements ConsultarAcompanamientoUseCase`.
- [ ] T008 Endpoints.
- [ ] T009 Aplicar política de privacidad: Gestor nunca recibe dirección exacta salvo autorización explícita ajena a este SPEC.

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F16-FE-01** Acceso opcional a ayuda, solicitud, estado y canal real de respuesta.
- [ ] **F16-FE-02** No anunciar acompañamiento completado si gestor/canal no respondió.
- [ ] **F16-FE-03** Permitir continuar registro/perfil sin usar asistencia con flag OFF o proveedor caído.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F16-QA-01** Propiedad de sesión de ayuda, caducidad y transición validada.
- [ ] **F16-QA-02** No crear identidad anónima sin decisión D-16.
- [ ] **F16-QA-03** Desactivar asistencia y completar registro del Prestador de extremo a extremo.
- [ ] **F16-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

Puede implementarse después del registro/perfil, pero no es una dependencia de estos. El MVP funciona con la feature apagada.

## Notes

- `[NEEDS CLARIFICATION]`: si una solicitud de ayuda puede iniciarse antes de que exista `Usuario`; el Key Entity del SPEC referencia Prestador, por lo que este plan no inventa identidad anónima.
- Horarios y disponibilidad de Gestores son decisiones operativas.
