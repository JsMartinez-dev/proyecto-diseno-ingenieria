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

## Límites de la demostración

La corrección de estos comportamientos no equivale a implementar todas las veinte SPEC en producción. Quedan por desarrollar:

- Autenticación, registro, recuperación y consentimiento real de SPEC-01; privacidad configurable y procesamiento de eliminación de SPEC-02.
- Portafolio, agenda por franjas, vista previa profesional y verificación documental. El matching actual utiliza disponibilidad general, sin comprobar conflictos de agenda por fecha/hora.
- Edición de propuestas, adjuntos de evidencia de reportes, moderación de contenido puntual, categorías de alto riesgo.
- Canal de coordinación autorizado de SPEC-08, preferencias de notificación y recursos institucionales oficiales configurados. El chat en tiempo real continúa como función futura.
- Backend, persistencia compartida entre dispositivos y autorización en servidor. Los controles del prototipo operan sobre los dos participantes de ejemplo; no representan seguridad para usuarios reales.

Los registros precargados son ejemplos, incluidas las verificaciones. Los servicios existentes solo tienen un estado inicial; no se reconstruye un historial inexistente. Las nuevas transiciones sí registran fecha y actor.

## Validación

- TypeScript, ESLint, compilación de producción y pruebas de reglas de dominio.
- Recorrido de navegador con viewport móvil: solicitud, propuesta, contratación, ejecución, terminación, confirmación, calificación y recarga.

## Separación de categorías y servicios

Se reemplazó la lista mixta del perfil por identificadores de categorías y una colección independiente de servicios del prestador. Cada servicio tiene identificador, categoría, nombre y descripción. Solo el prestador propietario puede crearlo, editarlo o eliminarlo; las categorías se eligen del catálogo activo y del perfil. No se permite retirar una categoría mientras conserve servicios asociados: primero deben eliminarse o reasignarse. El matching y la búsqueda utilizan las categorías, sin tratar el nombre de una oferta como categoría. La migración conserva los perfiles guardados y convierte los servicios concretos anteriores en ofertas relacionadas.
