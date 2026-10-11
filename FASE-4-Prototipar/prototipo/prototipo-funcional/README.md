# ALIADO — Demo académica

Prototipo web responsive de la plataforma para gestionar y contratar servicios técnicos a domicilio en Santa Marta. Se alinea con `Corte-2/Plantilla-Proyecto-ALIADO.md` y las especificaciones de `FASE-4-Prototipar/specs/` del repositorio `JsMartinez-dev/proyecto-diseno-ingenieria`.

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

Esta demo utiliza cuentas y datos de ejemplo. La selección de rol simula el acceso; no implementa autenticación real, registro de cuentas, recuperación de credenciales ni las garantías de autorización del backend. No enviar datos personales reales.

El proyecto objetivo contempla React Native para Cliente/Prestador, un panel React para administración y Java/Spring Boot/PostgreSQL. Esta demo es un prototipo React/TypeScript/Vite, sin esos servicios conectados.

El chat en tiempo real, mapas, insignia de progreso de formalización, referidos, soporte WhatsApp, onboarding asistido, idiomas y pagos permanecen como capacidades futuras. No se prometen incentivos de referidos ni se infiere una certificación legal a partir del checklist orientativo.

Ver [CORRECCIONES.md](CORRECCIONES.md) para la trazabilidad y las limitaciones por especificación.

## Categorías y servicios del prestador

En Mi perfil, **Categorías de servicio** indica las actividades del prestador (por ejemplo, Plomería). **Servicios que ofrece** contiene ofertas concretas creadas por él (por ejemplo, Reparación de fugas), con nombre, descripción y categoría asociada. Puede crear, editar y eliminar sus servicios. El cliente los consulta agrupados por categoría, sin controles de edición. Los datos antiguos de la demo se separan automáticamente al cargarse.
