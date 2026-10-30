# F18 — Insignia de progreso de formalización

**Alcance:** Could OFF. **Estado:** planificado, sin implementación.
**Dependencias:** 13; aprobación Could. **Decisiones relacionadas:** D-13 D-16 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Insignia derivada del progreso, sin nueva fuente de datos ni certificación.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-18-insignia-progreso-formalizacion.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-18-insignia-progreso-formalizacion.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F18-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Insignia de progreso de formalización `<<Could>>` [UC088] (Priority: P3)

## Base de datos

- [ ] **F18-DB-01** No crear tablas propias: consultar modelos existentes mediante contratos del módulo propietario y proyecciones autorizadas; cualquier columna adicional exige registrar migración y decisión.
- [ ] **F18-DB-02** Verificar planes de consulta e índices de las tablas consultadas con dataset representativo; no duplicar fuentes de verdad.

## Backend — integración y arquitectura

- [ ] **F18-BE-01** Concretar los contratos de F18 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F18-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F18-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.
- [ ] **F18-BE-04** No implementar ni activar proveedor productivo durante MVP: cerrar decisiones y flags de forma independiente antes de ejecutar esta feature opcional.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `formalizacion` | `ConsultarInsigniaFormalizacionUseCase` | `ConsultarInsigniaFormalizacionService` |

Puertos de salida previstos: ConsultaProgresoFormalizacionPort; sin tabla adicional de insignias. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

Mantener flag OFF y condición de aprobación de esta feature; la tabla no autoriza activación de proveedores.

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F18-T001** Feature flag OFF.
- [ ] **F18-T002** Definir mapping progreso→nivel visual sin persistencia.
- [ ] **F18-T003** Tests de los tres escenarios.
- [ ] **F18-T004** `InsigniaFormalizacionService`.
- [ ] **F18-T005** Integrar opcionalmente en perfil público.
- [ ] **F18-T006** Forzar disclaimer en todos los niveles.
- [ ] **F18-T007** No cachear independientemente del progreso o invalidar de forma atómica.

### Contratos API de origen

Puede integrarse dentro del DTO público de Prestador o mediante `GET /api/v1/prestadores/{id}/insignia-formalizacion` solo si la feature está habilitada.


## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F18-FE-01** Componente de insignia con leyenda y enlace al progreso orientativo.
- [ ] **F18-FE-02** Integrarlo en perfil público/previsualización solo con flag y exposición autorizada.
- [ ] **F18-FE-03** Desactivación retira componente sin alterar progreso ni la ruta.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F18-QA-01** Proyección coincide con progreso y leyenda visible incluso en máximo nivel.
- [ ] **F18-QA-02** No crear tabla insignias ni actualizar estatus legal.
- [ ] **F18-QA-03** Accesibilidad de etiqueta, contraste y respaldo textual.
- [ ] **F18-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-18/FR-xxx y SPEC-18/SC-xxx.

- **FR-088**: El sistema PUEDE mostrar una insignia de progreso de formalización derivada del progreso definido en `spec-13` (UC079), pero NO DEBE representarla como estado legal o certificación en ningún nivel, y DEBE permanecer deshabilitada sin afectar `spec-13` mientras no exista aprobación explícita. [UC088]
- **SC-001**: El 100% de las insignias mostradas incluye la indicación de que no equivalen a certificación o estatus legal, en cualquier nivel de progreso.
- **SC-002**: La desactivación de la insignia no impide consultar el progreso detallado definido en `spec-13`.
