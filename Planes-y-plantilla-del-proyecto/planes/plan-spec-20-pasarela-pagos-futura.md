# Implementation Plan: SPEC-20

**Date**: 2026-10-02  
**Spec**: [spec-20-pasarela-pagos-futura](FASE-4-Prototipar/specs/spec-20-pasarela-pagos-futura)  
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

Tres Acceptance Scenarios + edge cases de timeout, confirmación duplicada y reconciliación. Se usa un fake/sandbox adapter; ninguna prueba requiere dinero real.

## Project Structure

```text
backend/src/main/java/com/aliado/pagos/
├── presentation/controller/       PagoPilotoController, PagoWebhookController
├── application/service/           PagoPilotoService, ReconciliacionPagoService
├── application/port/              PasarelaPago (interfaz)
├── infrastructure/adapter/        FakePasarelaPago
├── domain/repository/             TransaccionPagoRepository
└── domain/model/                  TransaccionPagoPiloto
```

**Arquitectura por capas**: este SPEC conserva la organización modular y aplica Arquitectura Limpia según las secciones 7.1–7.5 de [plan-general-ALIADO](plan-general-ALIADO.md#7-estructura-lógica-del-repositorio). Las rutas del árbol son relativas a cada módulo: `domain/` contiene modelos, reglas y puertos; `application/` coordina los casos de uso; `presentation/` expone HTTP; `infrastructure/` implementa los detalles técnicos. El dominio no importa Spring, JPA ni DTO HTTP; la aplicación depende de contratos de dominio/aplicación, nunca de adaptadores concretos. Los DTO de aplicación van en `application/dto/` y los contratos HTTP en `presentation/dto/`, con conversión en presentación cuando corresponda.

Cuando haya persistencia, los `*Repository` del árbol son puertos en `domain/repository/`, sin heredar de Spring Data. Las tareas existentes de persistencia incluyen sus implementaciones en `infrastructure/persistence/`: `entity/` para entidades JPA, `jpa/` para repositorios Spring Data, `adapter/` para implementar los puertos y `mapper/` para convertir dominio y persistencia. Las integraciones externas se definen mediante puertos de aplicación y adaptadores en `infrastructure/adapter/`; los contratos compartidos existentes de `common/` permanecen libres de detalles técnicos. Las dependencias entre módulos utilizan contratos de dominio o servicios públicos de aplicación, sin acceder a entidades JPA ni adaptadores ajenos. Los filtros de seguridad y la configuración de Spring pertenecen a infraestructura técnica; los controladores y la traducción de errores HTTP pertenecen a presentación. Se crean solo las carpetas necesarias para las tareas ya definidas; se conservan sus identificadores, orden y dependencias.

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
- [ ] T010 `PagoPilotoService`.
- [ ] T011 `ReconciliacionPagoService`.
- [ ] T012 Endpoints solo tras doble habilitación.
- [ ] T013 Adapter fake/sandbox.
- [ ] T014 Verificar que SPEC-08 funciona sin pagos.

## Dependencies & Execution Order

No bloquea ningún otro SPEC. Solo puede activarse después de una decisión de producto fuera de este plan.

## Notes

- `[NEEDS CLARIFICATION]`: proveedor, país/moneda, comisiones, flujo de dispersión, reembolsos, tratamiento tributario y cumplimiento aplicable.
- Un proveedor productivo no debe incorporarse hasta resolver esas decisiones.
- `resultado` se persiste como código/detalle sanitizado; no se almacenan secretos ni datos completos de instrumento de pago.
