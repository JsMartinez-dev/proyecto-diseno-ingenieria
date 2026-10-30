# Implementation Plan: SPEC-20

**Date**: 2026-10-02  
**Spec**: [spec-20-pasarela-pagos-futura](../../FASE-4-Prototipar/specs/spec-20-pasarela-pagos-futura.md)
**Depends on**: `plan-spec-01-autenticacion.md`, `plan-spec-08-contratacion-ciclo-servicio.md`

## Summary

SPEC-20 define exclusivamente una capacidad `Future`: piloto de pago integrado. Debe permanecer inaccesible mientras no exista validación del modelo de monetización y aprobación explícita del producto.

El plan prepara contratos, idempotencia y modelo de transacción sin seleccionar ni conectar un proveedor real. El MVP de contratación de SPEC-08 continúa funcionando sin pagos.

## Technical Context

**Language/Version**: Java 21 LTS  
**Primary Dependencies**: infraestructura existente; cliente SDK de pasarela solo después de aprobación  
**Storage**: PostgreSQL 16 — `transacciones_pago_piloto`  
**Feature flag**: `pagos.piloto.enabled=false`  
**Constraints**: mayor riesgo financiero/regulatorio; no almacenar datos de tarjeta/credenciales financieras; confirmaciones idempotentes  
**Scale/Scope**: Future, no MVP

## Data Model

| Entidad | Campos |
|---|---|
| `TransaccionPagoPiloto` | `id`, `servicioId`, `proveedor`, `referenciaExterna`, `estado`, `resultado`, `claveIdempotencia`, `fechaCreacion`, `fechaActualizacion` |

No se agregan monto/moneda como requisitos obligatorios porque el SPEC no los define todavía.

## API Contracts

Solo cuando feature + aprobación estén activas:

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/api/v1/pagos/piloto` | iniciar transacción para servicio elegible |
| GET | `/api/v1/pagos/piloto/{id}` | consultar estado |
| POST | `/api/v1/pagos/piloto/webhooks/{proveedor}` | confirmación externa idempotente |

Con feature apagada, la UI no ofrece pagos y la API no ejecuta operaciones financieras.

## Testing Strategy

- **Arquitectura**: comprobar `Service implements UseCase`, constructores de entrada con interfaces, ausencia de Spring/JPA/HTTP en dominio/aplicación, mappers separados y transacciones verificadas con PostgreSQL cuando aplique.

Tres Acceptance Scenarios + edge cases de timeout, confirmación duplicada y reconciliación. Se usa un fake/sandbox adapter; ninguna prueba requiere dinero real.

## Project Structure

```text
backend/src/main/java/com/aliado/
└── pagos/
    ├── domain/
    │   ├── model/
    │   │   TransaccionPagoPiloto
    │   └── repository/
    │       TransaccionPagoRepository
    ├── application/
    │   ├── usecase/
    │   │   IniciarPagoPilotoUseCase, ConsultarPagoPilotoUseCase, ProcesarConfirmacionPagoUseCase,
    │   │   ReconciliarPagoPilotoUseCase
    │   ├── service/
    │   │   IniciarPagoPilotoService, ConsultarPagoPilotoService, ProcesarConfirmacionPagoService,
    │   │   ReconciliarPagoPilotoService
    │   ├── dto/
    │   │   Command/Query/Result de las operaciones del módulo (sin HTTP/JPA)
    │   └── port/
    │       PasarelaPago, ConsultaServicioElegiblePort
    ├── infrastructure/
    │   ├── persistence/
    │   │   ├── entity/
    │   │   │   TransaccionPagoPilotoEntity
    │   │   ├── mapper/
    │   │   │   TransaccionPagoPilotoMapper
    │   │   ├── jpa/
    │   │   │   TransaccionPagoJpaRepository
    │   │   └── adapter/
    │   │       TransaccionPagoPersistenceAdapter
    │   └── adapter/
    │       FakePasarelaPago; adaptador productivo solo tras aprobación
    └── presentation/
        ├── controller/
        │   PagoPilotoController, PagoWebhookController
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
| `pagos` | `IniciarPagoPilotoUseCase` | `IniciarPagoPilotoService` |
| `pagos` | `ConsultarPagoPilotoUseCase` | `ConsultarPagoPilotoService` |
| `pagos` | `ProcesarConfirmacionPagoUseCase` | `ProcesarConfirmacionPagoService` |
| `pagos` | `ReconciliarPagoPilotoUseCase` | `ReconciliarPagoPilotoService` |

Puertos de salida: PasarelaPago y ConsultaServicioElegiblePort; FakePasarelaPago implementa el mismo puerto antes del proveedor. Las interfaces de entrada no crean endpoints nuevos; mantener API Contracts y las condiciones Could/Future. Las tareas existentes conservan IDs, historias, dependencias y orden: los nombres de servicio agrupado de origen se descomponen en estas operaciones, sin añadir tareas funcionales.

Persistencia de referencia: `transacciones_pago_piloto`. Cualquier tabla opcional se diseña/aplica solo con aprobación de la feature; no es parte de las 42 tablas MVP. El [manual entregado](../../tasks/fuentes/manual-base-de-datos-aliado.md) detalla el modelo MVP; no implica que los scripts V1–V6 ya estén disponibles o ejecutados.


---

## Phase 1: Preparación segura

- [ ] T001 Feature flag OFF y aprobación separada `pagos.piloto.approved=false`.
- [ ] T002 Migración `transacciones_pago_piloto`.
- [ ] T003 Interfaz `PasarelaPago`, sin proveedor productivo.
- [ ] T004 Clave de idempotencia única.
- [ ] T005 Prohibir persistencia de PAN/CVV u otros datos financieros sensibles.

## Phase 2: User Story 1 - Piloto de pasarela [UC093] (Priority: P4)

- [ ] T006 Test: feature/aprobación apagadas → capacidad inaccesible.
- [ ] T007 Test: transacción de sandbox asociada a servicio elegible.
- [ ] T008 Test: webhook duplicado produce una sola transición lógica.
- [ ] T009 Test: timeout + reconciliación.
- [ ] T010 `IniciarPagoPilotoService implements IniciarPagoPilotoUseCase` y `ConsultarPagoPilotoService implements ConsultarPagoPilotoUseCase`.
- [ ] T011 `ReconciliarPagoPilotoService implements ReconciliarPagoPilotoUseCase` y `ProcesarConfirmacionPagoService implements ProcesarConfirmacionPagoUseCase`.
- [ ] T012 Endpoints solo tras doble habilitación.
- [ ] T013 Adapter fake/sandbox.
- [ ] T014 Verificar que SPEC-08 funciona sin pagos.

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F20-FE-01** Con flag y aprobación habilitados: inicio piloto, estado pendiente, reintento y resultado confirmado por servidor.
- [ ] **F20-FE-02** Nunca declarar pago exitoso por redirección del navegador; consultar estado backend.
- [ ] **F20-FE-03** No capturar datos de instrumento en ALIADO; navegación a proveedor seleccionado al aprobar integración.

Aplicar [estados y contrato de cliente](../../tasks/01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación de la feature

- [ ] **F20-QA-01** FakePasarelaPago antes de proveedor real; webhooks verificados, tardíos, duplicados y fuera de orden.
- [ ] **F20-QA-02** Una interpretación final por transacción, conciliación y auditoría sanitizada.
- [ ] **F20-QA-03** Flag OFF o ausencia de aprobación: UI oculta/API inoperante; contratación MVP funciona sin pagos.
- [ ] **F20-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Dependencies & Execution Order

No bloquea ningún otro SPEC. Solo puede activarse después de una decisión de producto fuera de este plan.

## Notes

- `[NEEDS CLARIFICATION]`: proveedor, país/moneda, comisiones, flujo de dispersión, reembolsos, tratamiento tributario y cumplimiento aplicable.
- Un proveedor productivo no debe incorporarse hasta resolver esas decisiones.
- `resultado` se persiste como código/detalle sanitizado; no se almacenan secretos ni datos completos de instrumento de pago.
