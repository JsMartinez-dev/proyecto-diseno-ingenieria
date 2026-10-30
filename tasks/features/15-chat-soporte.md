# F15 — Chat realtime y soporte WhatsApp

**Alcance:** Could OFF. **Estado:** planificado, sin implementación.
**Dependencias:** 08 09; aprobación Could. **Decisiones relacionadas:** D-10 D-16 (ver [registro](../03-decisiones-y-dependencias.md)).

## Resultado esperado

Extensión realtime del canal existente y acceso a soporte externo, con flags independientes OFF.

## Fuentes y trazabilidad

- [SPEC original](../fuentes/specs/spec-15-chat-soporte-whatsapp.md): historias, escenarios, requisitos y criterios de éxito.
- [Plan de origen](../fuentes/planes/plan-spec-15-chat-soporte-whatsapp.md): fases, tareas y dependencias detalladas.
- [Manual de datos](../fuentes/manual-base-de-datos-aliado.md), [modelo PDF](../fuentes/modelo-logico-ALIADO.pdf) y [reglas transversales](../01-arquitectura-y-stack.md).

Los IDs `F15-Txxx` conservan el identificador Txxx de origen, ahora con prefijo para evitar colisiones entre SPEC. No implican que el trabajo ya exista. Las tareas adicionales DB/BE/FE/QA desglosan integración y clientes, sin reemplazar requisitos. Las correcciones explícitas de 03 prevalecen sobre notas antiguas del plan fuente; no implementar tablas puntuales de notificaciones ni JWT por copiar una referencia.

## Historias cubiertas

- User Story 1 - Chat interno en tiempo real `<<Could>>` [UC086] (Priority: P3)
- User Story 2 - Soporte por WhatsApp `<<Could>>` [UC090] (Priority: P3)

## Base de datos

- [ ] **F15-DB-01** No crear tablas propias: consultar modelos existentes mediante contratos del módulo propietario y proyecciones autorizadas; cualquier columna adicional exige registrar migración y decisión.
- [ ] **F15-DB-02** Verificar planes de consulta e índices de las tablas consultadas con dataset representativo; no duplicar fuentes de verdad.

## Backend — integración y arquitectura

- [ ] **F15-BE-01** Concretar los contratos de F15 en OpenAPI: DTO request/response, validación, rol, propiedad, paginación, errores e idempotencia, conservando endpoints fuente salvo decisión explícita.
- [ ] **F15-BE-02** Definir las interfaces `application/usecase/*UseCase` y sus implementaciones `application/service/*Service implements *UseCase` según la tabla de esta feature. Inyectar solo interfaces por constructor en controladores/filtros/worker. Service usa dominio y puertos; ninguna dependencia hacia Spring/JPA/HTTP/adaptadores concretos. Llamadas entre módulos mediante interfaces públicas, nunca clases Service ni repositorios JPA ajenos.
- [ ] **F15-BE-03** Integrar los casos de uso de las tareas de origen con transacciones, autorización por recurso y tratamiento de fallos. Donde aplique, notificación persistida junto al negocio y entrega externa posterior al commit.
- [ ] **F15-BE-04** No implementar ni activar proveedor productivo durante MVP: cerrar decisiones y flags de forma independiente antes de ejecutar esta feature opcional.

### Interfaces de entrada e implementaciones

Esta tabla concreta la separación del ejemplo del usuario: cada nombre base origina una interfaz `<Nombre>UseCase` en `application/usecase/` y una clase `<Nombre>Service implements <Nombre>UseCase` en `application/service/`, dentro del módulo indicado. Son nombres previstos de contratos, no endpoints nuevos ni prueba de implementación. Conservar responsabilidades y dependencias de las tareas de origen; sus nombres de servicio agrupado se descomponen conforme a esta tabla.

| Módulo | Interfaz de entrada | Implementación |
|---|---|---|
| `comunicacion` | `AutorizarConversacionRealtimeUseCase` | `AutorizarConversacionRealtimeService` |
| `comunicacion` | `EnviarMensajeRealtimeUseCase` | `EnviarMensajeRealtimeService` |
| `soporte` | `SolicitarSoporteWhatsAppUseCase` | `SolicitarSoporteWhatsAppService` |

Puertos de salida previstos: consulta de participantes/estado del servicio, contratos públicos de mensajes de F08 y canal oficial de soporte. Los repositorios siguen siendo contratos en `domain/repository/`; los puertos externos/consultas requeridos por aplicación van en `application/port/`, con adaptadores de infraestructura. No crear un puerto adicional cuando ya exista un contrato público equivalente.

Controllers reciben UseCase por constructor y convierten Request/Response mediante mapper de presentación. Commands/Queries/Results de aplicación no contienen objetos HTTP o JPA. Excepciones de negocio en `domain/exception/`; wiring/transacciones en infraestructura/configuración. Ver [árbol completo y reglas](../04-estructura-y-casos-de-uso.md).

El gateway realtime reutiliza F08 mediante sus interfaces de mensajes y autorización; no reimplementa la persistencia de conversaciones. Toda esta feature permanece Could OFF.

### Tareas existentes del plan fuente

Conservar el orden por fases y las dependencias `Txxx` del documento de origen; una referencia `SPEC-n/Txxx` se interpreta como `Fn-Txxx`. Las rutas de origen son relativas a `backend/`. Si una tarea habla de crear una tabla ya incluida en V1–V6, se verifica/reutiliza esa tabla en lugar de crearla de nuevo. Si hace referencia a entidades de notificación puntuales, adaptar al módulo y tabla unificados.

- [ ] **F15-T001** `chat-interno.enabled=false`.
- [ ] **F15-T002** `soporte-whatsapp.enabled=false`.
- [ ] **F15-T003** Asegurar que UI/API base no dependen de ambas capacidades.
- [ ] **F15-T004** Tests de feature deshabilitada.
- [ ] **F15-T005** Tests de autorización Cliente/Prestador vs tercero.
- [ ] **F15-T006** Añadir gateway realtime solo bajo feature flag.
- [ ] **F15-T007** Reutilizar `MensajeServicio`/autorización de SPEC-08.
- [ ] **F15-T008** Sincronizar persistencia y entrega realtime.
- [ ] **F15-T009** Definir política de conversación tras cancelación/finalización antes de producción.
- [ ] **F15-T010** Tests disabled/enabled.
- [ ] **F15-T011** Configurar canal oficial externo por entorno.
- [ ] **F15-T012** `SoporteWhatsAppService` genera/entrega derivación sin simular conversación.
- [ ] **F15-T013** Opcional: persistir `InteraccionSoporte` para métricas operativas.

Los endpoints/canales de este SPEC se definen en el plan fuente; cerrar contratos de Could antes de habilitarlo.

## Frontend — app móvil y/o panel

Destino principal: app-movil (React Native); panel-admin solo para superficies administrativas definidas.

- [ ] **F15-FE-01** Conversación reutiliza mensajes_servicio, autenticación y reglas del canal; reconectar y deduplicar por id.
- [ ] **F15-FE-02** WhatsApp claramente externo, con URL oficial y disponibilidad real; estado no disponible honesto.
- [ ] **F15-FE-03** Ocultar ambas entradas con flags OFF sin bloquear comunicación REST del MVP.

Aplicar [estados y contrato de cliente](../01-arquitectura-y-stack.md#frontend) y reutilizar la demo como referencia de recorrido, no como autoridad de seguridad o esquema. No agregar CRUD administrativos o interfaces Cliente/Prestador fuera de lo especificado.

## Integración y aceptación

- [ ] **F15-QA-01** No transmitir a terceros; revalidar sesión/participación al conectar, suscribirse y enviar.
- [ ] **F15-QA-02** Reconexion y entrega duplicada conservan un mensaje lógico; cierre sigue política D-10.
- [ ] **F15-QA-03** Flags OFF y regresión completa de contratación sin realtime.
- [ ] **F15-QA-04** Ejecutar escenarios Given/When/Then del SPEC y todos los SC incluidos abajo con actores y datos independientes; adjuntar evidencia de API, DB y UI.

Validación arquitectónica adicional: verificar Service implements UseCase, constructor de controlador/filtro solo con interfaces, dominio/aplicación sin Spring/JPA/HTTP, mappers separados y un test de integración que acredite el límite transaccional cuando haya mutaciones.

Para cerrar esta feature: contratos y migraciones versionados, tareas de origen y suplementos aplicables terminados, escenarios del SPEC aprobados con API real, UI conectada, evidencia de aislamiento por rol y ninguna decisión bloqueante sin resolver. Las funciones OFF se cierran como preparadas/aisladas, nunca como disponibles para usuarios.

## Requisitos y criterios de éxito de origen

Los identificadores FR/SC son locales al SPEC: deben referenciarse como SPEC-15/FR-xxx y SPEC-15/SC-xxx.

- **FR-086**: El sistema PUEDE proporcionar un chat interno en tiempo real, únicamente a los Usuarios autorizados por la relación de coordinación correspondiente, y DEBE permanecer deshabilitado sin afectar UC-01 a UC-06 mientras no exista aprobación explícita. [UC086]
- **FR-090**: El sistema PUEDE proporcionar acceso a soporte mediante una integración oficial de WhatsApp, identificada claramente como canal externo, y DEBE permanecer deshabilitado sin afectar UC-01 a UC-06 mientras no exista aprobación explícita. [UC090]
- **SC-001**: 0 usuarios no autorizados acceden a una conversación interna en los casos de prueba del chat, si llega a habilitarse.
- **SC-002**: El 100% de las superficies de CONectaSM no presenta UC086 ni UC090 como disponibles mientras no exista una decisión de habilitación documentada.
- **SC-003**: La desactivación de ambas capacidades no impide completar ningún flujo comprometido en UC-01 a UC-06.
