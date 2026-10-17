# Correcciones contra el proyecto de referencia

Referencia revisada: `proyecto-diseno-ingenieria` (commit `d349406`), plantilla ALIADO de Corte-2, historias de usuario, matriz MoSCoW y especificaciones de FASE-4. El README general y varias fichas de esa fase están vacíos o pendientes; se usaron los documentos desarrollados como fuente del comportamiento.

| Referencia | Diferencia encontrada | Corrección en esta demo |
| --- | --- | --- |
| Plantilla ALIADO | Nombre CONectaSM y favicon/metadata genéricos | Nombre ALIADO en acceso, navegación, información y metadatos; favicon propio |
| SPEC-02 | Datos personales y eliminación sin acción | Edición del nombre y zona del cliente; solicitud de eliminación confirmada y registrada localmente |
| SPEC-03 / SPEC-12 | Perfiles suspendidos seguían apareciendo | Exclusión de descubrimiento y del detalle público |
| SPEC-04 | Sin borradores, edición o cancelación; foto sin acción | Borradores retomables, edición de solicitud publicada sin propuestas, cancelación, foto con validación de formato/tamaño y dirección exacta separada |
| SPEC-05 | Categorías y zonas como texto libre | Selectores de catálogo activo; validación de mínimos; cambios guardados localmente |
| SPEC-06 | Todas las solicitudes se presentaban como compatibles; distancia inventada | Matching por categoría, zona y disponibilidad general; filtros de categoría/urgencia; acceso a detalle compatible; eliminación de distancias sin cálculo |
| SPEC-07 | Precio inválido y repetición de propuestas posibles | Precio positivo y disponibilidad obligatoria; rechazo de propuesta activa duplicada; retiro de propuesta pendiente |
| SPEC-08 | Cliente podía ejecutar trabajo; prestador finalizaba directamente; sin cancelación/historial | Contratado → En ejecución → Terminado → Finalizado; prestador ejecuta, cliente confirma; cancelación antes del cierre; historial de transiciones; aceptación única y dirección del formulario |
| SPEC-09 | Avisos de ejemplo compartidos entre roles; no se generaban nuevos avisos | Nuevos avisos por oportunidad, propuesta, aceptación y cambio de estado; separación por rol y navegación al registro actual |
| SPEC-10 | Reseñas repetibles; calificar incrementaba trabajos completados | Solo cliente participante, servicio finalizado y una reseña; reputación recalculada con reseñas; contador incrementado al confirmar el servicio |
| SPEC-12 | Suspensión solo añadía auditoría; resolución sin justificación | Creación, edición y desactivación de categorías/zonas; restricciones de cuenta y perfil; estado de suspensión persistente; motivo obligatorio; resolución o descarte justificado y auditado |
| SPEC-13 | Checklist fijo sin interacción | Progreso declarado editable y persistente; aclaración de que no certifica estado legal |
| SPEC-14 | Sin descarga; datos perdidos al recargar | Exportación del historial propio sin dirección/contactos; persistencia local de solicitudes, servicios, perfiles, reportes, avisos y catálogos |
| SPEC-15–20 / MoSCoW | Insignias por reputación e incentivos de referidos no documentados; faltaban onboarding e idiomas | Descripciones alineadas: insignia de progreso orientativo, referidos sin incentivo definido, onboarding e idiomas como futuros; pagos fuera del MVP |

## Recorridos completados en `feature/cambios-final-final`

| Referencia | Representación en la demo |
| --- | --- |
| SPEC-01 | Registro local Cliente/Prestador con consentimiento, inicio de sesión, salida y recuperación por código temporal mostrado en un correo simulado; contraseñas derivadas localmente con PBKDF2; acceso rápido conservado |
| SPEC-02 / SPEC-14 | Preferencias persistentes de nombre público/alias y visibilidad del catálogo, avisos opcionales, aceptación de términos con fecha, consulta y descarga de datos propios; solicitud de eliminación para ambos roles |
| SPEC-05 | Experiencia editable, portafolio con descripción/evidencia, eliminación de trabajos, agenda por fecha y franjas, vista previa pública |
| SPEC-06 / SPEC-07 | Compatibilidad con fecha/periodo cuando hay agenda; propuesta con fecha/hora concreta y edición activa; validación de franja y hora reservada; retirada y cierre diferenciados |
| SPEC-08 | Mensajes locales privados del servicio contratado entre sus participantes, cierre del envío al finalizar/cancelar; vínculo con la propuesta aceptada; acceso al servicio desde la solicitud durante todo su ciclo |
| SPEC-10 / SPEC-12 | Solicitud documental única pendiente, revisión administrativa justificada, resultado persistente; reporte de reseña y ocultamiento de su contenido con auditoría |
| SPEC-11 | Evidencias de ejemplo descargables por administración, objetivo identificado, reportes desde ambos participantes del servicio, consolidación de reportes abiertos duplicados |
| SPEC-13 | Enlaces externos a portales oficiales; progreso declarado sin certificación |

## Límites de la demostración

Estos recorridos representan las funciones propuestas y no sustituyen los servicios del producto final. El registro personaliza la cuenta de ejemplo de cada rol y reemplaza sus credenciales de acceso; no crea participantes independientes para múltiples personas. La recuperación muestra el código localmente y no envía correos. La selección rápida de rol permite presentar sin credenciales.

Siguen pendientes para el producto real el backend, la persistencia compartida, autenticación/autorización de servidor, procesamiento efectivo de eliminaciones, verificación real de documentos, entrega de avisos entre dispositivos y garantías de seguridad, concurrencia y auditoría inmutable. La agenda reserva únicamente la hora de inicio, sin duración de trabajos. El canal local de coordinación no equivale al chat en tiempo real futuro.

Las capacidades Could/Future y pagos continúan fuera del recorrido comprometido del MVP. Los registros precargados, reseñas y verificaciones son ejemplos. Los servicios antiguos solo muestran un estado inicial; no se reconstruye un historial inexistente. Las nuevas transiciones registran fecha y actor.

## Validación

- TypeScript, ESLint, compilación de producción y pruebas de reglas de dominio.
- Recorrido de navegador con viewport móvil: solicitud, propuesta, contratación, ejecución, terminación, confirmación, calificación y recarga.

## Separación de categorías y servicios

Se reemplazó la lista mixta del perfil por identificadores de categorías y una colección independiente de servicios del prestador. Cada servicio tiene identificador, categoría, nombre y descripción. Solo el prestador propietario puede crearlo, editarlo o eliminarlo; las categorías se eligen del catálogo activo y del perfil. No se permite retirar una categoría mientras conserve servicios asociados: primero deben eliminarse o reasignarse. El matching y la búsqueda utilizan las categorías, sin tratar el nombre de una oferta como categoría. La migración conserva los perfiles guardados y convierte los servicios concretos anteriores en ofertas relacionadas.
