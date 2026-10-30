
Cada SPEC debe representar una funcionalidad coherente, independiente y comprobable, por lo cual, se decidió implementar un total de 20 SPEC que cumple con este objetivo.

| SPEC    | Nombre propuesto                                | Casos de uso correspondientes | Diagrama |
| ------- | ----------------------------------------------- | ----------------------------- | -------- |
| SPEC-01 | Autenticación, registro y control de acceso     | CU001–CU007                   | UC-01    |
| SPEC-02 | Gestión de perfil y privacidad                  | CU008–CU013                   | UC-01    |
| SPEC-03 | Descubrimiento de prestadores                   | CU014–CU015                   | UC-02    |
| SPEC-04 | Gestión de solicitudes de servicio              | CU016–CU023                   | UC-02    |
| SPEC-05 | Creación y gestión del perfil profesional       | CU024–CU033                   | UC-03    |
| SPEC-06 | Compatibilidad y oportunidades de servicio      | CU034–CU038                   | UC-03    |
| SPEC-07 | Creación y gestión de propuestas                | CU039–CU047                   | UC-04    |
| SPEC-08 | Contratación y ciclo de vida del servicio       | CU048–CU056                   | UC-04    |
| SPEC-09 | Notificaciones de propuestas y servicios        | CU057–CU058                   | UC-04    |
| SPEC-10 | Calificaciones, reseñas y verificación          | CU059–CU064                   | UC-05    |
| SPEC-11 | Reportes y evidencias                           | CU065–CU067                   | UC-05    |
| SPEC-12 | Administración, moderación y gestión de riesgos | CU068–CU076                   | UC-05    |
| SPEC-13 | Ruta de formalización                           | CU077–CU080                   | UC-06    |
| SPEC-14 | Preferencias, historial e indicadores           | CU081–CU085                   | UC-06    |
| SPEC-15 | Chat interno y soporte por WhatsApp             | CU086 y CU090                 | UC-07    |
| SPEC-16 | Onboarding asistido                             | CU091                         | UC-07    |
| SPEC-17 | Mapa visual de prestadores                      | CU087                         | UC-07    |
| SPEC-18 | Insignia y progreso de formalización            | CU088                         | UC-07    |
| SPEC-19 | Programa de referidos e idiomas adicionales     | CU089 y CU092                 | UC-07    |
| SPEC-20 | Pasarela de pagos futura                        | CU093                         | UC-07    |

### Resumen por diagrama

| Diagrama  | Casos de uso    | SPEC resultantes |
| --------- | --------------- | ---------------- |
| UC-01     | CU001–CU013     | 2                |
| UC-02     | CU014–CU023     | 2                |
| UC-03     | CU024–CU038     | 2                |
| UC-04     | CU039–CU058     | 3                |
| UC-05     | CU059–CU076     | 3                |
| UC-06     | CU077–CU085     | 2                |
| UC-07     | CU086–CU093     | 6                |
| **Total** | **CU001–CU093** | **20 SPEC**      |

La agrupación conserva la trazabilidad con los diagramas y permite que cada SPEC tenga sus propias historias de usuario, requisitos funcionales, entidades, escenarios de aceptación y criterios de éxito medibles.

### Arquitectura de implementación actualizada

Los 20 SPEC y sus planes técnicos originales incluyen interfaces `application/usecase/*UseCase`, clases `application/service/*Service implements *UseCase`, puertos/adaptadores y controladores que reciben interfaces por constructor. Consultar las secciones «Arquitectura y trazabilidad de implementación» de cada SPEC y «Project Structure» del plan correspondiente. [Plan general](../../Planes-y-plantilla-del-proyecto/planes/plan-general-ALIADO.md#7-estructura-lógica-del-repositorio).

El consolidado `TODOS LOS SPEC.md` conserva los SPEC-01–14 que ya incluía y sus mismas restricciones arquitectónicas. No cambia requisitos, historias ni criterios de aceptación y no reemplaza los 20 archivos individuales. La copia histórica de `tasks/fuentes` se conserva como evidencia de su fecha de captura.
