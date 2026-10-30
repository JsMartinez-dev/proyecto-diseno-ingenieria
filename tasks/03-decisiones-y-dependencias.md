# Decisiones, diferencias y orden de ejecución

Las decisiones pendientes bloquean únicamente su trabajo dependiente. Se puede completar infraestructura y contratos no afectados sin inventar reglas de negocio. Responsable propuesto: producto para reglas, responsable técnico para stack/contratos y operación para proveedores. Registrar resolución, fecha, fuente y migración/API afectada en este archivo antes de cerrar la tarea dependiente.

## Diferencias resueltas para este plan

| Tema | Tratamiento |
|---|---|
| Capas tradicionales | Mantener módulos/capas con Clean Architecture y dependencias hacia dentro |
| UseCase y Service | Interfaces en application/usecase; Service las implementa; controllers/filtros dependen de interfaces por constructor, según el ejemplo del usuario |
| Sesión y token | SesionAutenticada es contrato puro de aplicación; contexto Spring solo en adaptador. Generación aleatoria segura y hash SHA-256 son responsabilidades distintas |
| Notificaciones puntuales de SPEC-06/07 | Plan general y manual nuevo definen una sola tabla `notificaciones`; no crear las tablas puntuales de planes antiguos |
| Roles ADMIN/ADMINISTRADOR | Contrato del manual: `ADMINISTRADOR`; adaptar cualquier alias de UI sin persistir valores incompatibles |
| Sesiones/JWT | Plan general y manual respaldan token opaco con hash; jjwt del repositorio guía no se incorpora |
| Estado TERMINADO | SPEC-08/FR-052 indica servicio en ejecución; seguir EN_EJECUCION → TERMINADO. No habilitar atajo CONTRATADO → TERMINADO por una nota antigua |
| Consentimientos | Manual admite N por usuario: conservar historial por versión; no imponer una sola fila por usuario |
| MVP/Could | Mensajes REST de servicio son MVP F08; chat realtime F15 es Could. No confundirlos |
| Base de datos entregada | Manual afirma esquema real V1–V6, pero no hay scripts ni conexión adjunta. Es evidencia del modelo, no una base accesible/verificada |
| Prototipo | Datos y cuentas locales no son implementación; precio, contactos compartidos o límites de demo no añaden requisitos productivos |

## Registro de decisiones abiertas

| ID | Decisión / evidencia que falta | Afecta | Criterio de cierre |
|---|---|---|---|
| D-01 | Boot 3.3.x documental frente a Boot 4.0.5 de referencia; versiones de clientes/tooling | F00 y builds | ADR con versiones concretas compatibles, soporte revisado, BOM/lockfiles y compilación de prueba; no mezclar starters |
| D-02 | Catálogo válido de categorías/zonas, granularidad/coincidencia y modelo categoría/oferta/portafolio | F03/04/05/12 | Catálogo aprobado y contrato inequívoco; puentes del manual no sustituyen definición de oferta |
| D-03 | Solicitud no tiene ventana temporal; propuesta tiene disponibilidad VARCHAR, agenda usa instantes/horarios | F04/05/06/07/08 | Regla temporal formal, DTO/campos/zonas horarias y migración si aplica; matriz evaluable/no evaluable. No prometer matching horario completo sin esto |
| D-04 | Duración de sesión, sesión simultánea, transporte/almacenamiento web y proveedor de recuperación | F01/F00 | Configuración/documentación y pruebas revocación, expiración, CORS/CSRF según transporte |
| D-05 | Eliminación/anonimización con FK, historial y auditoría; qué datos se retienen | F02, integración F08 | Política aprobada y test de cuenta con servicios activos/cerrados; ninguna cascada destructiva accidental |
| D-06 | Storage productivo, credenciales, ciclo de vida de objetos y backups | F04 y piloto | Adaptador S3-compatible probado, URLs privadas y restauración; desarrollo puede avanzar con MinIO |
| D-07 | MIME/tamaño/cantidad de fotos, portafolio, documentos/evidencias y documentos exigidos | F04/05/10/11 | Parámetros aprobados y consistentes API/UI; no usar 250 KB de demo como regla definitiva |
| D-08 | FCM/correo productivos, registro de tokens de dispositivos ausente del modelo, reintentos/claim del worker y unicidad multicanal | F06/07/09/14 y piloto | Contrato y migración aditiva para dispositivos/cola si se necesitan; backoff y deduplicación por evento/canal; mock explícito en desarrollo |
| D-09 | Edición/recuperación de propuesta propia tras reinicio; propuestas repetidas; precio de demo no existe en modelo | F07/F08 | Contrato navegable y política de duplicidad; aprobar endpoint o campos nuevos si se requieren. No inventar precio |
| D-10 | Envío/lectura de mensajes al cancelar/finalizar; precisión de agenda al contratar | F08/F15 | Máquina de estados de comunicación aprobada; tests de participantes y estados cerrados |
| D-11 | Revisión administrativa de verificación: falta API explícita, motivo/revisor en esquema | F10/F12 | Definir aprobar/rechazar, justificación, revisor/auditoría y si requieren nuevas columnas; distinguir nivel básico/ampliado de certificado |
| D-12 | Criterios de alto riesgo, consolidación de reportes y revisión por el mismo administrador que resuelve | F11/F12 | Política aprobada de equivalencia/resolución/riesgo y pruebas concurrentes; no ampliar reglas silenciosamente |
| D-13 | Fuente y responsable de formalización; progreso SMALLINT agregado sin detalle por paso | F13/F18 | Fórmula y comando permitido aprobados; si hay checklist persistente por paso, diseñar migración. No fingir que el agregado contiene cada respuesta |
| D-14 | Nulabilidad/CHECK/UNIQUE/default/índices y DDL de V1–V6 no adjuntos; UUID y claves sensibles | DB/F00/F01 | Recuperar scripts originales o reconstruir con diferencias registradas; snapshot y pruebas que cubran las 42 tablas |
| D-15 | Fórmulas de indicadores y exportación (formato, límites y snapshot) | F14 | Dataset esperado y fórmula versionada; mantener inclusión de cancelados/en moderación de UC084; consulta/exportación equivalentes |
| D-16 | Could: proveedor mapa, chat, WhatsApp/gestores, referidos/idiomas | F15–F19 | Decisión separada por capacidad, contrato, proveedor operativo y flag; no bloquea MVP |
| D-17 | Pagos: monetización, aprobación, proveedor, moneda, comisiones, conciliación y reembolsos | F20 | Aprobación de producto y diseño piloto antes de proveedor real; no bloquea MVP |
| D-18 | PK idempotency_keys=(clave,operacion), usuario nullable, sin hash de payload | F00/04/07/08 | Aislamiento por actor y operación; rechazar misma clave con payload distinto; resolver registro preautenticado y carrera antes de persistir respuestas. Migración si requiere ampliar esquema |

## Dependencias y entregas parciales

- F00: build backend/clientes, DB y contratos transversales. F01 crea auth y datos base; luego F02 y base de clientes.
- F04 introduce catálogo/storage/solicitudes. F05 usa catálogos y storage. F03 integra perfiles reales tras F05; la sección de confianza se integra al completar F10, sin inventar datos.
- **F09.base tras F01:** puerto de notificación + persistencia unificada + fake. Es prerrequisito de F06/F07/F08 para evitar crear notificaciones puntuales y rehacerlas. No espera a que todos los productores existan.
- F06 requiere F04/F05 y D-03. F07 requiere F06. F08 requiere F07. F09.integracion conecta eventos F06–F08 y entrega confiable. F14.preferences puede exponerse por puerto a notificaciones sin dependencia circular.
- F02 básico puede cerrarse temprano; eliminación completa espera F08 para verificar servicios activos. No declarar la eliminación completa con un stub permisivo.
- Tras F08: F10 → F11 → F12; F13 puede avanzar como línea separada; F14 se integra después de F09/F10. Administración de catálogo F12 parcial puede adelantarse tras F04.
- F21 integra y prepara piloto después del MVP. App/panel se integran en cada feature, no se posponen completos al final.
- F15–F20 solo tras decisión aplicable, siempre sin dependencias bloqueantes hacia MVP.

## Secuencia de hitos

| Hito | Entrega verificable | Puerta de salida |
|---|---|---|
| H0 | F00, DB vacía/migrada, API/cliente base | Builds, migraciones y contrato mínimo en CI; D-01 resuelta |
| H1 | F01 + F02 básico + F09.base | Sesiones reales, aislamiento y perfil; eliminación final aún pendiente si F08 falta |
| H2 | F04 → F05 → F03 básico | Solicitud publicada, perfil real y búsqueda; sin matching horario ficticio |
| H3 | F06 → F07 → F08 + F09.integracion | Contratación concurrente segura, ciclo completo y avisos; cerrar eliminación F02 |
| H4 | F10/F11/F12 + F13 + F14 | Confianza, moderación, ruta, preferencias e historial conectados; F03 integra confianza |
| H5 | F21 | Restauración, seguridad, carga y E2E app/panel; pendientes productivos cerrados |
| H6 | Could/Future aprobados | Flags y pruebas de aislamiento; ninguna activación implícita |

No asignar fechas ficticias sin disponibilidad del equipo. Estimar cada tarjeta al asignarla y revisar ruta crítica H0 → H1 → H2 → H3 → H4 → H5. Pueden repartirse tareas que compartan contratos ya definidos, sin adelantar decisiones bloqueantes.
