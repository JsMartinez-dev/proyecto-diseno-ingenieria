# Plan de creación y validación de la base de datos

## Evidencia y alcance

Fuente: [manual entregado](fuentes/manual-base-de-datos-aliado.md) y [modelo lógico PDF de dos páginas](fuentes/modelo-logico-ALIADO.pdf). El manual describe **42 tablas MVP** y afirma que fueron extraídas de PostgreSQL 16 con V1–V6. No se adjuntaron SQL, dump, DBML ni acceso al servidor. No se ha creado o modificado ninguna base de datos durante esta planificación.

El manual es referencia de columnas/tipos/relaciones; no permite deducir por sí solo cada índice, CHECK, valor por defecto o cláusula ON DELETE de los scripts originales. Recuperar estos scripts es la primera opción; si no están disponibles, reconstruirlos como implementación nueva y registrar cada restricción añadida. No afirmar que coinciden byte a byte con V1–V6 originales.

## Trabajo de provisión

1. Crear PostgreSQL 16 para desarrollo mediante Compose, volumen persistente y healthcheck; puerto solo local. Testcontainers levanta instancia aislada en CI.
2. Separar rol de migración (DDL) y rol de aplicación (DML mínimo); base `aliado`, esquema acordado y credenciales por variables. Definir permisos especiales de auditoría para que la app no pueda modificarla/eliminarla.
3. Recuperar V1–V6 o reconstruir esquema en instancia limpia. Si existe una base aplicada, inspeccionar `flyway_schema_history`, dumps y checksums antes de generar nuevas versiones. No usar `repair`/`baseline` para esconder diferencias.
4. Aplicar scripts por Flyway en orden topológico y ejecutar `validate`. Hibernate usa `ddl-auto=validate`; no `update/create` como mecanismo productivo.
5. Persistir UUID, TIMESTAMPTZ, JSONB y CHECK de enumeraciones del manual; claves de objetos en vez de binarios. Mapear columnas explícitamente en JPA y no mezclar nombre de campo Java con esquema SQL.
6. Separar seeds de catálogo aprobados de fixtures falsos por entorno. No cuentas/contraseñas reales en migraciones; provisionar primer Administrador por proceso controlado, sin endpoint público.
7. Verificar inicio desde cero, reinicio sin cambios, migración incremental con datos existentes e idempotencia de arranque. Obtener snapshot SQL/diccionario y compararlo con las 42 tablas esperadas, excluyendo `flyway_schema_history` y tablas técnicas aprobadas.
8. Documentar backup/restauración PostgreSQL y objetos. Demostrar restauración aislada y consistencia entre claves en DB y objetos disponibles antes del piloto.

## Agrupación de migraciones propuesta

**Esta distribución es propuesta de reconstrucción; no se conocen los nombres ni el contenido original de V1–V6.** Mantener scripts originales si se recuperan. Features que comparten una migración no vuelven a crear tablas: verifican/mapean su parte. Una nueva modificación de schema se publica con versión posterior, nunca editando una migración aplicada.

| Versión propuesta | Tablas/objetivo | Features propietarias | Dependencias |
|---|---|---|---|
| V1 | usuarios, consentimientos, sesiones, tokens_recuperacion, idempotency_keys, perfiles, ubicaciones, solicitudes_eliminacion | F01, F02, transversal | usuarios primero; demás FK después |
| V2 | categorías, zonas, solicitudes/fotos/historial y perfil profesional/puentes/experiencia/portafolio/disponibilidad/agenda | F04, F05 | V1, catálogo antes de referencias |
| V3 | propuestas, servicios_contratados, historial_estado_servicio, mensajes_servicio, notificaciones | F07, F08, F09; F06 usa notificaciones | V1/V2; propuestas antes de servicios; notificaciones puede anticiparse para F09.base |
| V4 | calificaciones, resenas, reputaciones_prestador, solicitudes_verificacion, documentos_verificacion, reportes, evidencias_reporte | F10, F11 | V1/V3; reseña antes de reporte |
| V5 | bloqueos_preventivos, acciones_moderacion, marcas_alto_riesgo, auditoria_administrativa y protección append-only | F12 | V1/V3/V4 según FK |
| V6 | rutas_formalizacion, pasos_formalizacion, enlaces_institucionales, progreso_formalizacion, preferencias_notificacion, descargas_historial | F13, F14 | V1, rutas antes de pasos/progreso, pasos antes de enlaces |
| Posteriores | Correcciones aprobadas en D-03/08/11/13/18, índices/seeds y opcionales según necesidad | Decisión respectiva | Nunca reescribir V1–V6 aplicadas |

Puede desplegarse el esquema base completo antes de los casos de uso: crear una tabla no significa que una feature esté operativa. Las tablas opcionales de Could/Future no forman parte de las 42 ni se exigen para arrancar MVP.

## Integridad que debe probarse

| Área | Restricción/verificación prevista | Verificación necesaria |
|---|---|---|
| Identidad | Email único con política explícita de normalización; rol CLIENTE/PRESTADOR/ADMINISTRADOR; hashes, expiración | Dos altas concurrentes del mismo correo producen una cuenta; token no guardado en claro |
| Consentimiento | N registros por usuario, historial por versión | Múltiples versiones permitidas, sin duplicar aceptación lógica |
| Sesión/recuperación | Hash único si corresponde; expiración; recuperación de un uso | Dos confirmaciones simultáneas no cambian contraseña dos veces |
| Idempotencia | Aislamiento por usuario/operación y payload, carrera y expiración | Una clave ajena no revela respuesta; misma clave/payload retorna mismo resultado; payload distinto se rechaza (D-18) |
| Perfil/ubicación | PK=usuario_id; versión; dirección exacta cifrada | Un perfil/ubicación por usuario; control de concurrencia sin sobreescribir cambios |
| Eliminación | Solo una solicitud PENDIENTE por usuario; expiración 24 h del manual | Índice parcial o mecanismo equivalente y bloqueo por servicios activos |
| Catálogo | Desactivación lógica, sin perder FK históricas | Solicitudes anteriores siguen consultables con catálogo inactivo |
| Solicitud | Estados válidos; publicación exige categoría/descripcion/zona/urgencia; borrador privado | `urgencia` nullable en manual exige validación condicional al publicar; D-03 si cambia modelo temporal |
| Puentes profesionales | PK compuestas sin duplicados; perfil único por prestador | Múltiples categorías/zonas válidas, sin referencias inexistentes |
| Agenda | Fecha fin posterior a inicio; reglas de solape coherentes | Carrera al crear compromisos; horario de solicitud todavía requiere D-03 |
| Propuesta | Disponibilidad no vacía, estado válido, versión | Edición/retiro simultáneos y aceptación; no añadir UNIQUE por prestador/solicitud sin D-09 |
| Servicio | UNIQUE(solicitud_id) y UNIQUE(propuesta_id); estado, versión, historial | Aceptaciones concurrentes: un servicio y una transición consistente con cierre de propuestas |
| Mensajes | FK servicio/remitente; participación y habilitación en aplicación | Usuario externo no lee/escribe; no requiere tabla de chat paralela |
| Notificaciones | Evento lógico único según tipo/aggregate/destinatario/version; entrega posterior | Evitar duplicación bajo reintento y claim concurrente; D-08 define multicanal y datos de dispositivo |
| Calificación/reseña | UNIQUE(servicio_id), CHECK valor 1–5; UNIQUE(calificacion_id) en reseña | Cliente propio y servicio FINALIZADO; reputación reconstruible, reseña oculta no borra calificación |
| Verificación | Una PENDIENTE por prestador; documentos privados con FK | Carreras simultáneas y revisión administrativa pendiente de D-11 |
| Reporte | Exactamente un objetivo, compatible con tipo; generado objetivo_ref | Consolidación abierta y estados/revisión/justificación; fórmula GENERATED y unicidad real requieren DDL original/D-12 |
| Evidencia | FK reporte preexistente y clave privada de objeto | Sin metadata huérfana ni descarga ajena; compensación storage |
| Riesgo/bloqueo | Una marca de riesgo activa por servicio y controles aprobados de bloqueo | Acciones administrativas concurrentes no crean estados contradictorios |
| Auditoría | INSERT append-only; impedir UPDATE/DELETE por trigger y permisos | Probar con rol de app que mutación/destrucción se rechaza; operación y auditoría atómicas |
| Formalización | Progreso por prestador/ruta; rango orientativo del manual | D-13 antes de inferir checklist; 100% no es certificación |
| Preferencias | PK compuesta usuario/tipo/canal; configurabilidad | Aviso obligatorio no se desactiva ni por API; no copiar tipo sin canal |
| Exportación | Clave privada y propietario; estados | Descarga coincide con consulta autorizada en mismo corte y sin filtrar datos adicionales |

## Índices y rendimiento

Partir de los accesos del plan general: usuarios(email), sesiones(token_hash/estado/expiración), solicitudes(cliente/estado y categoría/zona/estado), puentes por categoría/zona, propuestas(solicitud/estado y prestador/estado), servicios(cliente/estado y prestador/estado), notificaciones(destinatario/estado). Añadir índices de FK/colas y únicos parciales solo con necesidad y definición registradas. Medir `EXPLAIN ANALYZE` y latencia con ~50–100 prestadores y ~200–500 clientes, contemplando volumen de solicitudes/servicios, no solo conteo de usuarios.

PostgreSQL/Testcontainers es la validación de referencia: H2 no acredita UUID, JSONB, índices parciales, columnas generadas, triggers ni concurrencia de este esquema.

## Inventario de las 42 tablas

El inventario siguiente se extrae del manual adjunto; nombres, tipos y nulabilidad completos permanecen en la fuente enlazada. Cada tabla tiene un único propietario o núcleo compartido.

| Tabla | Propietario / consumidores | PK del manual | Columnas del manual |
|---|---|---|---|
| `usuarios` | F01 | `id` | `id`, `email`, `password_hash`, `rol`, `estado_cuenta`, `fecha_creacion` |
| `consentimientos` | F01 | `id` | `id`, `usuario_id`, `version_terminos`, `fecha_aceptacion` |
| `sesiones` | F01 | `id` | `id`, `usuario_id`, `token_hash`, `fecha_inicio`, `fecha_expiracion`, `fecha_cierre`, `estado` |
| `tokens_recuperacion` | F01 | `id` | `id`, `usuario_id`, `codigo_hash`, `fecha_creacion`, `fecha_expiracion`, `usado` |
| `idempotency_keys` | F00, F01 | `clave, operacion` | `clave`, `operacion`, `usuario_id`, `status_code`, `respuesta`, `fecha_creacion`, `fecha_expiracion` |
| `perfiles` | F02 | `usuario_id` | `usuario_id`, `nombre`, `telefono`, `preferencia_visibilidad`, `version` |
| `ubicaciones` | F02 | `usuario_id` | `usuario_id`, `zona_aproximada`, `direccion_exacta_cifrada`, `version` |
| `solicitudes_eliminacion` | F02 | `id` | `id`, `usuario_id`, `fecha_solicitud`, `fecha_expiracion`, `estado`, `fecha_confirmacion` |
| `categorias_servicio` | F04 | `id` | `id`, `nombre`, `estado` |
| `zonas` | F04 | `id` | `id`, `nombre`, `cobertura_geografica`, `estado` |
| `solicitudes` | F04 | `id` | `id`, `cliente_id`, `categoria_id`, `zona_id`, `descripcion`, `urgencia`, `estado`, `fecha_creacion`, `fecha_actualizacion`, `version` |
| `fotos_solicitud` | F04 | `id` | `id`, `solicitud_id`, `archivo_key`, `orden` |
| `historial_estado_solicitud` | F04 | `id` | `id`, `solicitud_id`, `estado_anterior`, `estado_nuevo`, `fecha` |
| `perfiles_profesionales` | F05 | `id` | `id`, `prestador_id`, `datos_generales`, `estado_exposicion_publica`, `fecha_creacion`, `fecha_actualizacion` |
| `perfil_categoria` | F05 | `perfil_id, categoria_id` | `perfil_id`, `categoria_id` |
| `perfil_zona_atencion` | F05 | `perfil_id, zona_id` | `perfil_id`, `zona_id` |
| `experiencias_profesionales` | F05 | `id` | `id`, `perfil_id`, `descripcion`, `fecha_inicio`, `fecha_fin` |
| `servicios_portafolio` | F05 | `id` | `id`, `perfil_id`, `descripcion`, `evidencia_key`, `fecha_creacion` |
| `disponibilidades` | F05 | `id` | `id`, `perfil_id`, `dia_semana`, `hora_inicio`, `hora_fin` |
| `compromisos_agenda` | F05 | `id` | `id`, `perfil_id`, `fecha_hora_inicio`, `fecha_hora_fin`, `origen` |
| `propuestas` | F07 | `id` | `id`, `solicitud_id`, `prestador_id`, `disponibilidad`, `mensaje`, `estado`, `fecha_creacion`, `fecha_actualizacion`, `version` |
| `servicios_contratados` | F08 | `id` | `id`, `solicitud_id`, `propuesta_id`, `cliente_id`, `prestador_id`, `estado`, `comunicacion_habilitada`, `fecha_contratacion`, `version` |
| `historial_estado_servicio` | F08 | `id` | `id`, `servicio_id`, `estado_anterior`, `estado_nuevo`, `actor_id`, `fecha` |
| `mensajes_servicio` | F08 | `id` | `id`, `servicio_id`, `remitente_id`, `contenido`, `fecha_envio` |
| `notificaciones` | F06, F07, F09 | `id` | `id`, `destinatario_id`, `tipo`, `aggregate_id`, `event_version`, `detalle`, `canal`, `estado_entrega`, `intentos`, `fecha_generacion`, `fecha_entrega` |
| `calificaciones` | F10 | `id` | `id`, `servicio_id`, `cliente_id`, `prestador_id`, `valor`, `fecha` |
| `resenas` | F10 | `id` | `id`, `calificacion_id`, `texto`, `fecha_creacion`, `estado_visibilidad` |
| `reputaciones_prestador` | F10 | `prestador_id` | `prestador_id`, `valor_agregado`, `cantidad_calificaciones`, `fecha_calculo` |
| `solicitudes_verificacion` | F10 | `id` | `id`, `prestador_id`, `estado`, `fecha_solicitud`, `fecha_revision` |
| `documentos_verificacion` | F10 | `id` | `id`, `solicitud_verificacion_id`, `archivo_key`, `fecha_carga` |
| `reportes` | F10, F11 | `id` | `id`, `tipo`, `reportante_id`, `resena_id`, `usuario_objetivo_id`, `servicio_id`, `motivo`, `estado`, `detalle_revisado_en`, `justificacion_resolucion`, `revisado_por`, `fecha_creacion`, `fecha_resolucion`, `version`, `objetivo_ref` |
| `evidencias_reporte` | F11 | `id` | `id`, `reporte_id`, `archivo_key`, `tipo_contenido`, `fecha_carga` |
| `bloqueos_preventivos` | F12 | `id` | `id`, `usuario_id`, `administrador_id`, `motivo`, `fecha_inicio`, `fecha_fin`, `activo` |
| `acciones_moderacion` | F12 | `id` | `id`, `administrador_id`, `tipo`, `objetivo_tipo`, `objetivo_id`, `motivo`, `fecha` |
| `marcas_alto_riesgo` | F12 | `id` | `id`, `servicio_id`, `criterio`, `administrador_id`, `fecha`, `activa` |
| `auditoria_administrativa` | F12 | `id` | `id`, `administrador_id`, `accion`, `objetivo_tipo`, `objetivo_id`, `detalle`, `fecha`, `trace_id` |
| `rutas_formalizacion` | F13 | `id` | `id`, `nombre`, `descripcion`, `activa` |
| `pasos_formalizacion` | F13 | `id` | `id`, `ruta_id`, `titulo`, `descripcion`, `orden` |
| `enlaces_institucionales` | F13 | `id` | `id`, `paso_id`, `nombre`, `url`, `estado` |
| `progreso_formalizacion` | F13 | `id` | `id`, `prestador_id`, `ruta_id`, `valor_orientativo`, `fecha_actualizacion` |
| `preferencias_notificacion` | F14 | `usuario_id, tipo_aviso, canal` | `usuario_id`, `tipo_aviso`, `canal`, `habilitada`, `configurable` |
| `descargas_historial` | F14 | `id` | `id`, `usuario_id`, `fecha_generacion`, `archivo_key`, `estado` |

## Tablas opcionales y lecturas

F03, F17 y F18 no crean tablas. F06 calcula oportunidades desde datos vigentes. F14 deriva historial/actividad/indicadores; `descargas_historial` solo guarda metadata. F15 reutiliza `mensajes_servicio`; `interacciones_soporte` solo si se aprueba persistirlas. F16 puede crear `sesiones_acompanamiento`. F19 requiere diseño de `referidos`, `idiomas_soportados`, `preferencias_idioma`. F20 `transacciones_pago_piloto`. Todas las adiciones necesitan diccionario, migración nueva, autorización y flag OFF; no se inventan columnas fuera del manual como si fueran parte del modelo entregado.
