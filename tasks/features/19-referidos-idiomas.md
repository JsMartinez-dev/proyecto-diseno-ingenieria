# F19 — Referidos e idiomas adicionales

**Alcance:** Could OFF. **Estado:** planificado, sin implementación.
**Dependencias:** 01 02; aprobación Could. **Decisiones relacionadas:** D-16 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Dos capacidades independientes: atribución de referidos e idiomas con respaldo español.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-19-referidos-e-idiomas.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-19-referidos-e-idiomas.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F19-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Programa de referidos `<<Could>>` [UC089] (Priority: P3)
- User Story 2 - Idiomas adicionales `<<Could>>` [UC092] (Priority: P3)

## Base de datos

- [ ] **F19-DB-01** Implementar o verificar posterior a V6: `referidos`, `idiomas_soportados`, `preferencias_idioma`. Aplicar columnas, PK/FK, nulabilidad y CHECK del manual; las tablas compartidas se crean una sola vez.
- [ ] **F19-DB-02** Agregar/verificar restricciones e índices de esta feature según 02-base-de-datos.md; probar integridad con PostgreSQL 16 y Flyway, incluyendo inserciones inválidas y concurrencia.
- [ ] **F19-DB-03** Implementar modelos de dominio independientes, puertos, entidades JPA, repositorios Spring Data, mappers y adaptadores; no serializar entidades JPA en API.

## Backend — integración y arquitectura

- [ ] **F19-BE-01** Concretar los contratos de F19 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F19-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F19-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.
- [ ] **F19-BE-04** No implementar ni activar proveedor productivo durante MVP: cerrar decisiones y flags de forma independiente antes de ejecutar esta feature opcional.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `referidos` | `GenerarReferidoUseCase` | `GenerarReferidoService` |
| `referidos` | `AtribuirReferidoUseCase` | `AtribuirReferidoService` |
| `internacionalizacion` | `ConsultarIdiomasUseCase` | `ConsultarIdiomasService` |
| `internacionalizacion` | `ConsultarPreferenciaIdiomaUseCase` | `ConsultarPreferenciaIdiomaService` |
| `internacionalizacion` | `ActualizarPreferenciaIdiomaUseCase` | `ActualizarPreferenciaIdiomaService` |

Puertos de salida previstos: reglas/puertos de atribución e idiomas independientes del controlador de registro. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

Mantener flag OFF y condición de aprobación de esta feature; la tabla no autoriza activación de proveedores.

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F19-T001** Flags OFF.
- [ ] **F19-T002** Migraciones de referidos/preferencias solo preparadas; no activación funcional automática.
- [ ] **F19-T003** Español configurado como idioma base/fallback.
- [ ] **F19-T004** Tests feature off.
- [ ] **F19-T005** Tests referido válido, auto-referido y duplicado.
- [ ] **F19-T006** Modelo/repositorio `Referido`.
- [ ] **F19-T007** `ReferidoService` con atribución idempotente.
- [ ] **F19-T008** Integración opcional con registro de SPEC-01 sin hacerla bloqueante.
- [ ] **F19-T009** Endpoints.
- [ ] **F19-T010** Tests feature off, idioma habilitado y fallback.
- [ ] **F19-T011** Catálogo `IdiomaSoportado`.
- [ ] **F19-T012** Preferencia por Usuario.
- [ ] **F19-T013** Endpoints.
- [ ] **F19-T014** Integrar archivos/catálogo i18n en React Native y panel web.
- [ ] **F19-T015** Si se retira un idioma soportado, fallback automático a español.

### Contratos API de origen

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/api/v1/referidos` | generar mecanismo de referido |
| POST | `/api/v1/referidos/atribuir` | consumido por registro/activación, idempotente |
| GET/PUT | `/api/v1/preferencias/idioma` | consultar/cambiar idioma |
| GET | `/api/v1/idiomas` | catálogo habilitado |


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F19-FE-01** Compartir identificador/enlace y estado de atribución solo bajo reglas acordadas.
- [ ] **F19-FE-02** Selector de idiomas y diccionario de mensajes propios por feature, respaldo español uniforme.
- [ ] **F19-FE-03** No ofrecer beneficio no definido; no interrumpir registro por referido inválido.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F19-QA-01** Idempotencia de atribución, auto-referido y duplicados; integrar F01 por puerto opcional.
- [ ] **F19-QA-02** Claves faltantes y error de carga usan español; no mostrar mezcla confusa.
- [ ] **F19-QA-03** Dos flags OFF mantienen registro y textos del MVP intactos.
- [ ] **F19-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-19/FR-xxx y SPEC-19/SC-xxx.

- **FR-089**: El sistema PUEDE implementar un programa de referidos, sujeto a reglas explícitas de elegibilidad, atribución y prevención de auto-referido/duplicados, y DEBE permanecer deshabilitado sin afectar el MVP mientras no exista aprobación explícita. [UC089]
- **FR-092**: El sistema PUEDE admitir idiomas adicionales, con un comportamiento de respaldo en español para cualquier texto sin traducción disponible, y DEBE permanecer deshabilitado (operando solo en español) sin afectar el MVP mientras no exista aprobación explícita. [UC092]
- **SC-001**: 0 beneficios de referido se otorgan por auto-referido o cuentas duplicadas, en el 100% de los casos de prueba.
- **SC-002**: El 100% de los textos sin traducción disponible se muestra con el respaldo en español, sin mezclar idiomas de forma confusa.
- **SC-003**: La desactivación de ambas capacidades no impide completar ningún flujo comprometido en UC-01 a UC-06.
