# Plan completo de desarrollo ALIADO — backend y frontend

Fecha: **2026-10-30**. Estado: **planificado, sin implementar**.

Este plan convierte la documentación de ingeniería, la demo y el modelo de datos entregado en trabajo por feature para `../backend/` y `../frontend/`. Conserva requisitos/historias y tareas de los 20 SPEC, añade el trabajo de clientes, provisión de datos e integración y aplica Arquitectura Limpia dentro de cada módulo.

## Cómo usarlo

1. Leer [arquitectura y stack](01-arquitectura-y-stack.md), [base de datos](02-base-de-datos.md) y [decisiones/dependencias](03-decisiones-y-dependencias.md) y [estructura UseCase/Service](04-estructura-y-casos-de-uso.md).
2. Ejecutar [F00 — Fundación](00-fundacion.md) y cerrar las decisiones que bloqueen la primera entrega.
3. Seguir las features por dependencia y hito, no por número de archivo: F04/F05 preceden al descubrimiento real F03; F09.base precede a los productores de notificaciones.
4. En cada feature completar DB → contrato/backend → cliente → integración y aceptación. Se pueden construir pantallas con mocks de contrato, pero no cerrarlas como integradas hasta probar la API real.
5. Completar [F21 — Integración y piloto](21-integracion-piloto.md). Las features Could/Future se planifican, pero no se activan como parte del MVP.

## Entregables y alcance

| Entregable | Ubicación prevista / documento |
|---|---|
| Backend único Java/Spring Boot con Clean Architecture por módulo | `../backend/` — [arquitectura](01-arquitectura-y-stack.md) |
| App React Native Cliente/Prestador | `../frontend/app-movil/` — trabajo FE por feature |
| Panel React Administrador | `../frontend/panel-admin/` — F01, F12 y base compartida |
| PostgreSQL 16, migraciones, roles, índices, seeds y validación | [Plan de DB](02-base-de-datos.md), F00 y tareas DB por feature |
| API/contratos, storage, correo, notificaciones y seguridad | F00, F01, F04, F09 y contratos de cada feature |
| Pruebas, CI, backups/restauración y preparación del despliegue | F00, QA por feature y F21 |
| Backlog tabular de 713 tareas planificadas | [backlog.csv](backlog.csv) |
| Fuentes reproducibles: 20 specs, 20 planes, plan general, PDF, manual y pom de referencia | [fuentes](fuentes/README.md) |

El MVP corresponde a SPEC-01–14, salvo vinculación institucional UC080. SPEC-15–19 son Could y SPEC-20 Future: flags OFF, no bloquean MVP. El nombre de la carpeta de trabajo sigue siendo `develoment-Aliado`.

## Índice por feature

| Feature | Alcance | Dependencias principales | Persistencia |
|---|---|---|---|
| [F01 — Acceso, identidad y sesiones](features/01-acceso-identidad.md) | MVP | 00 | V1 |
| [F02 — Perfil personal, privacidad y eliminación](features/02-perfil-privacidad.md) | MVP | 01 | V1 |
| [F03 — Descubrimiento y perfil público](features/03-descubrimiento.md) | MVP | 01 04 05 10.publico | lectura |
| [F04 — Solicitudes, catálogos y archivos](features/04-solicitudes-catalogo-storage.md) | MVP | 01 00 | V2 |
| [F05 — Perfil profesional, portafolio, disponibilidad y agenda](features/05-perfil-profesional.md) | MVP | 01 04 | V2 |
| [F06 — Compatibilidad y oportunidades](features/06-compatibilidad-oportunidades.md) | MVP | 01 04 05 09.base | V3 compartida |
| [F07 — Creación, edición y retiro de propuestas](features/07-propuestas.md) | MVP | 01 04 05 06 09.base | V3 compartida |
| [F08 — Contratación, ciclo del servicio y comunicación](features/08-contratacion-servicio.md) | MVP | 01 04 07 09.base | V3 |
| [F09 — Notificaciones unificadas y entrega](features/09-notificaciones.md) | MVP | 01; productores 06 07 08 | V3 |
| [F10 — Calificaciones, reseñas, reputación y verificación](features/10-confianza.md) | MVP | 01 04 05 08 | V4 |
| [F11 — Reportes de cuentas/servicios y evidencias](features/11-reportes-evidencias.md) | MVP | 01 04 08 10 | V4 compartida |
| [F12 — Administración, moderación, riesgo y auditoría](features/12-administracion.md) | MVP | 01 04 05 10 11 | V5 |
| [F13 — Ruta y progreso orientativo de formalización](features/13-formalizacion.md) | MVP | 01 05 | V6 |
| [F14 — Preferencias, historial, exportación, indicadores y actividad](features/14-preferencias-historial.md) | MVP | 01 08 09 10 | V6 |
| [F15 — Chat realtime y soporte WhatsApp](features/15-chat-soporte.md) | Could OFF | 08 09; aprobación Could | opcional |
| [F16 — Onboarding asistido](features/16-onboarding-asistido.md) | Could OFF | 01 02 05; aprobación Could | posterior a V6 |
| [F17 — Mapa aproximado de Prestadores](features/17-mapa.md) | Could OFF | 02 03 05; aprobación Could | lectura |
| [F18 — Insignia de progreso de formalización](features/18-insignia.md) | Could OFF | 13; aprobación Could | lectura |
| [F19 — Referidos e idiomas adicionales](features/19-referidos-idiomas.md) | Could OFF | 01 02; aprobación Could | posterior a V6 |
| [F20 — Piloto futuro de pagos](features/20-pagos.md) | Future OFF | 08; aprobación monetización y Future | posterior a V6 |
## Reglas del backlog

- `Fnn-Txxx` conserva la tarea `Txxx` del plan del SPEC correspondiente. Prefijo necesario porque cada SPEC reinicia la numeración. Se conservan IDs, orden y alcance de las 379 tareas de origen; la redacción arquitectónica de ejecución se actualiza al contrato UseCase/Service; no se reutiliza `T001` como identificador global.
- `Fnn-DB/BE/FE/QA-xx` desglosa trabajo complementario de base de datos, arquitectura/integración, clientes y aceptación. F00/F21 añaden infraestructura y validación transversal.
- Las tareas de origen y suplementos forman un único trabajo: una tarea DB de feature verifica/reutiliza una tabla ya creada por F00, no la crea de nuevo. Una prueba QA puede acreditar varios criterios a la vez.
- Todas las filas empiezan `pendiente`; ninguna tarea aparece completada por existir documentación. El CSV contiene área, alcance, dependencia descriptiva y documento fuente; es un backlog de planificación, no una importación ejecutada al tablero de `task-dev`.
- Las notas antiguas de origen no prevalecen sobre correcciones explícitas de [03](03-decisiones-y-dependencias.md). Se preservan como evidencia, no como instrucciones de duplicar tablas o crear JWT.
- Cada feature enlaza los escenarios completos del SPEC, reproduce sus FR/SC e incluye DB, backend, frontend, integración y aceptación. Referenciar requisitos como `SPEC-xx/FR-xxx`, porque sus IDs no siempre son globalmente únicos.

## Corrección arquitectónica del ejemplo

Las 20 features ahora detallan interfaces `*UseCase` y clases `*Service` que las implementan. Los controladores inyectan interfaces por constructor; persistencia, hashing, correo y sesión técnica se conectan mediante puertos/adaptadores. El [árbol de auth y contrato de referencia](04-estructura-y-casos-de-uso.md) sustituye la interpretación de `service/` como API concreta del controlador. Se mantienen 713 IDs del backlog, requisitos, esquema de 42 tablas y alcance frontend. Las copias en `fuentes/` permanecen intactas como evidencia.

## Cuándo se considera terminada una feature

Contrato revisado, reglas y permisos de servidor implementados, migraciones validadas en PostgreSQL, UI conectada a datos reales, casos de aceptación aprobados y decisiones bloqueantes resueltas. Conservar evidencia del caso exitoso, recurso ajeno, fallo/reintento y concurrencia cuando aplique. Los criterios exactos de los SPEC son obligatorios; una captura de pantalla o un mock no acredita DB/API real.

No sustituir estas condiciones por un porcentaje genérico de cobertura. No introducir funcionalidades de demo que no figuren en contratos/modelo sin decisión formal.

## Hallazgos que requieren atención antes de implementar

- El modelo entregado tiene 42 tablas, pero no se recibieron los SQL V1–V6. Está planificada su recuperación/reconstrucción y comparación; no hay base creada por este trabajo.
- Falta ventana temporal explícita en solicitud para matching horario; cerrar D-03 antes de prometer compatibilidad completa.
- El esquema no incluye tokens de dispositivo push, precio de propuesta ni detalle de checklist por paso. Cualquier incorporación requiere contrato y migración aprobados.
- La revisión administrativa de documentos necesita cerrar API/metadata de revisión. El manual tampoco especifica todo el DDL de restricciones/índices.
- `backend-rifas` es guía de dependencias: su Boot 4.0.5/JWT no cambia automáticamente la línea base Boot 3.3.x/sesiones opacas de ALIADO.
- La demo React/Vite usa datos locales. Se usa para recorridos y referencia visual; el objetivo mantiene React Native + panel React y autorización real en Spring Boot.

Los detalles técnicos de compatibilidad están sustentados en la [guía oficial Spring Boot 4](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide) y [matriz springdoc](https://springdoc.org/faq.html); la evidencia específica del repositorio guía está en [su pom revisado](https://github.com/SeumaRayo/backend-rifas/blob/develop/pom.xml).

Este trabajo deja documentación local en `tasks/`: no genera implementación, no provisiona servicios, no importa tarjetas al orquestador, no hace commit/push, merge ni despliegue.
