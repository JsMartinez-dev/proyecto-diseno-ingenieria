# F20 — Piloto futuro de pagos

**Alcance:** Future OFF. **Estado:** planificado, sin implementación.
**Dependencias:** 08; aprobación monetización y Future. **Decisiones relacionadas:** D-17 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Pasarela desacoplada solo para piloto aprobado; no pertenece a la entrega MVP.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-20-pasarela-pagos-futura.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-20-pasarela-pagos-futura.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F20-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Piloto de pasarela de pago `<<Future>>` [UC093] (Priority: P4)

## Base de datos

- [ ] **F20-DB-01** Implementar o verificar posterior a V6: `transacciones_pago_piloto`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F20-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F20-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F20-BE-01** Concretar los contratos de F20 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F20-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F20-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.
- [ ] **F20-BE-04** No implementar ni activar proveedor productivo durante MVP: cerrar decisiones y flags de forma independiente antes de ejecutar esta feature opcional.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `pagos` | `IniciarPagoPilotoUseCase` | `IniciarPagoPilotoService` |
| `pagos` | `ConsultarPagoPilotoUseCase` | `ConsultarPagoPilotoService` |
| `pagos` | `ProcesarConfirmacionPagoUseCase` | `ProcesarConfirmacionPagoService` |
| `pagos` | `ReconciliarPagoPilotoUseCase` | `ReconciliarPagoPilotoService` |

Puertos de salida previstos: PasarelaPago y ConsultaServicioElegiblePort; FakePasarelaPago implementa el mismo puerto antes del proveedor. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

Mantener flag OFF y condición de aprobación de esta feature; la tabla no autoriza activación de proveedores.

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F20-T001** Feature flag OFF y aprobación separada `pagos.piloto.approved=false`.
- [ ] **F20-T002** Migración `transacciones_pago_piloto`.
- [ ] **F20-T003** Interfaz `PasarelaPago`, sin proveedor productivo.
- [ ] **F20-T004** Clave de idempotencia única.
- [ ] **F20-T005** Prohibir persistencia de PAN/CVV u otros datos financieros sensibles.
- [ ] **F20-T006** Test: feature/aprobación apagadas → capacidad inaccesible.
- [ ] **F20-T007** Test: transacción de sandbox asociada a servicio elegible.
- [ ] **F20-T008** Test: webhook duplicado produce una sola transición lógica.
- [ ] **F20-T009** Test: timeout + reconciliación.
- [ ] **F20-T010** `PagoPilotoService`.
- [ ] **F20-T011** `ReconciliacionPagoService`.
- [ ] **F20-T012** Endpoints solo tras doble habilitación.
- [ ] **F20-T013** Adapter fake/sandbox.
- [ ] **F20-T014** Verificar que SPEC-08 funciona sin pagos.

### Contratos API de origen

Solo cuando feature + aprobación estén activas:

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/api/v1/pagos/piloto` | iniciar transacción para servicio elegible |
| GET | `/api/v1/pagos/piloto/{id}` | consultar estado |
| POST | `/api/v1/pagos/piloto/webhooks/{proveedor}` | confirmación externa idempotente |

Con feature apagada, la UI no ofrece pagos y la API no ejecuta operaciones financieras.


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F20-FE-01** Con flag y aprobación habilitados: inicio piloto, estado pendiente, reintento y resultado confirmado por servidor.
- [ ] **F20-FE-02** Nunca declarar pago exitoso por redirección del navegador; consultar estado backend.
- [ ] **F20-FE-03** No capturar datos de instrumento en ALIADO; navegación a proveedor seleccionado al aprobar integración.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F20-QA-01** FakePasarelaPago antes de proveedor real; webhooks verificados, tardíos, duplicados y fuera de orden.
- [ ] **F20-QA-02** Una interpretación final por transacción, conciliación y auditoría sanitizada.
- [ ] **F20-QA-03** Flag OFF o ausencia de aprobación: UI oculta/API inoperante; contratación MVP funciona sin pagos.
- [ ] **F20-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-20/FR-xxx y SPEC-20/SC-xxx.

- **FR-093**: El sistema DEBE mantener la funcionalidad de pasarela de pagos fuera del MVP inicial, y SOLO DEBE habilitar un piloto después de validar el modelo de monetización y registrar una aprobación explícita del producto. Si se habilita, DEBE procesar las confirmaciones de forma idempotente. [UC093]
- **SC-001**: El piloto de pagos permanece inaccesible mientras la aprobación de producto no esté habilitada.
- **SC-002**: Antes de habilitar pagos, el 100% de los escenarios de prueba de reintento/confirmación tardía preserva una única interpretación del estado de la transacción.
- **SC-003**: La desactivación del piloto no impide completar ningún flujo comprometido en UC-01 a UC-06.
