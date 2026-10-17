# ALIADO — Demo académica

Prototipo web responsive de la plataforma para gestionar y contratar servicios técnicos a domicilio en Santa Marta. Se alinea con `Planes-y-plantilla-del-proyecto/Plantilla-Proyecto-ALIADO.md` y las especificaciones de `FASE-4-Prototipar/specs/` del repositorio `JsMartinez-dev/proyecto-diseno-ingenieria`.

## Ejecutar

Requiere Node.js 24 y npm.

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

## Recorrido de demostración

1. Entrar como Cliente (Patricia Mercado). Crear una solicitud de **Plomería** en **Bavaria**, o guardar un borrador y retomarlo desde Mis solicitudes.
2. Salir y entrar como Prestador (Jorge Ortiz). Abrir Oportunidades: solo aparecen solicitudes abiertas compatibles con sus categorías, zonas y disponibilidad general. Enviar una propuesta con precio positivo, fecha y hora.
3. Volver como Cliente y aceptar la propuesta. Solo se crea un servicio por solicitud; las otras propuestas se cierran. La dirección exacta se comparte exclusivamente en el servicio contratado.
4. Como Prestador, iniciar el servicio y marcarlo como terminado. Como Cliente, confirmar la finalización. Ambas partes consultan el mismo historial de estados.
5. Como Cliente, calificar el servicio finalizado una sola vez. Consultar o descargar el historial propio.
6. Como Administrador, gestionar reportes y justificar su resolución o descarte. Suspender una cuenta indicando el motivo; un prestador suspendido deja de aparecer en descubrimiento y no puede proponer servicios.

Los datos de la demo se guardan en el navegador con claves `aliado-v1-*`. Salir cambia el rol sin borrar los datos; recargar vuelve al acceso a la demo. Para reiniciar los ejemplos, borrar el almacenamiento local de este sitio desde las herramientas del navegador.

## Alcance

Esta demo utiliza cuentas y datos de ejemplo. Incluye recorridos locales de registro con consentimiento, inicio de sesión y recuperación mediante un correo simulado en pantalla. También conserva el acceso rápido por rol para presentar. El registro personaliza y reemplaza la cuenta de acceso de ejemplo del rol elegido; no crea un escenario multiusuario independiente. No implementa identidad ni autorización de servidor. No enviar datos personales reales.

El proyecto objetivo contempla React Native para Cliente/Prestador, un panel React para administración y Java/Spring Boot/PostgreSQL. Esta demo es un prototipo React/TypeScript/Vite, sin esos servicios conectados.

El chat en tiempo real, mapas, insignia de progreso de formalización, referidos, soporte WhatsApp, onboarding asistido, idiomas y pagos permanecen como capacidades futuras. No se prometen incentivos de referidos ni se infiere una certificación legal a partir del checklist orientativo.

Ver [CORRECCIONES.md](CORRECCIONES.md) para la trazabilidad y las limitaciones por especificación.

## Categorías y servicios del prestador

En Mi perfil, **Categorías de servicio** indica las actividades del prestador (por ejemplo, Plomería). **Servicios que ofrece** contiene ofertas concretas creadas por él (por ejemplo, Reparación de fugas), con nombre, descripción y categoría asociada. Puede crear, editar y eliminar sus servicios. El cliente los consulta agrupados por categoría, sin controles de edición. Los datos antiguos de la demo se separan automáticamente al cargarse.

## Recorridos finales para la presentación

- **Acceso:** entrar a la demo → Registrarme → elegir Cliente/Prestador → aceptar términos → crear cuenta de ejemplo. Salir e iniciar sesión con ese correo; desde Recuperar acceso solicitar el código que aparece en el correo simulado y cambiar la contraseña. Las credenciales iniciales son `cliente@aliado.demo`, `prestador@aliado.demo` y `admin@aliado.demo`, con contraseña `Aliado123!`. El registro sustituye las credenciales iniciales de su rol. El acceso rápido sigue disponible.
- **Perfil profesional:** como Prestador, abrir Perfil. Editar experiencia, añadir un trabajo al portafolio con imagen y crear franjas de agenda. Abrir la vista previa; como Cliente buscar ese prestador y consultar el mismo portafolio y agenda. Se pueden eliminar trabajos y franjas propios.
- **Propuestas:** publicar una solicitud de Plomería en Bavaria. Si se configuró agenda, usar una fecha y periodo compatibles. Como Prestador, proponer una fecha/hora dentro de una franja; abrir de nuevo la oportunidad y editar el precio, disponibilidad o mensaje. Retirar deja el estado Retirada; contratar cierra las otras propuestas activas con estado Cerrada.
- **Coordinación:** aceptar la propuesta como Cliente → detalle del servicio → enviar mensaje. Cambiar a Prestador y abrir el mismo servicio para leer y responder. Al finalizar o cancelar se conserva el historial de mensajes y se cierra el envío. Este canal local demuestra la coordinación posterior a contratar; el chat entre dispositivos en tiempo real sigue siendo futuro.
- **Reportes:** desde un servicio, ambas partes pueden reportar un problema con evidencia. Desde el perfil público se puede reportar al prestador o una reseña concreta. Como Administrador, abrir Reportes, consultar/descargar la evidencia y justificar una decisión. Una reseña reportada puede ocultarse de la vista pública sin alterar su calificación ni eliminar el registro de auditoría.
- **Verificación:** como Prestador, adjuntar documentos ficticios y solicitar verificación. Como Administrador, abrir Prestadores y aprobar o rechazar con justificación. Volver como Prestador para consultar el resultado; una solicitud pendiente impide enviar otra. El nivel básico/ampliado se explica en el perfil público y no certifica estado legal ni calidad.
- **Preferencias:** desde Perfil, cambiar visibilidad del nombre, avisos opcionales y, para Prestador, aparición en el catálogo. Comprobar el efecto al cambiar de rol. Los avisos de aceptación y cambios de estado permanecen obligatorios. Consultar consentimiento, descargar datos propios de ejemplo o solicitar eliminación.
- **Formalización:** desde Mi progreso abrir los sitios oficiales externos de DIAN, Cámara de Comercio de Santa Marta y SENA. Los enlaces no completan trámites ni implican convenios.

Los nuevos datos se conservan en este navegador. Los adjuntos admiten JPG, PNG, WebP o PDF de hasta 250 KB, hasta tres por reporte o solicitud de verificación; el portafolio acepta una imagen por trabajo y hasta seis trabajos. Si se agota el almacenamiento se informa que los cambios solo duran la sesión. No usar documentos ni datos personales reales.

La agenda comprueba fecha, franja y conflictos de la hora de inicio de contratos activos. No modela duración de trabajos ni un calendario sincronizado entre dispositivos. Los datos iniciales con fechas relativas (Hoy/Mañana) se conservan; las propuestas nuevas usan fecha y hora concretas.
