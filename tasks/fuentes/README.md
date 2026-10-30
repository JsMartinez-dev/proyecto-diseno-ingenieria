# Fuentes y procedencia

Corte de lectura: 2026-10-30.

| Fuente | Uso |
|---|---|
| `specs/spec-01…20` | Copias de `proyecto-diseno-ingenieria/FASE-4-Prototipar/specs/`: requisitos, historias, escenarios y criterios de éxito |
| `planes/plan-spec-01…20` | Copias de `proyecto-diseno-ingenieria/Planes-y-plantilla-del-proyecto/planes/`, rama docs/specs-capas-arquitectura-limpia: tareas/backend y capas ajustadas |
| `plan-general-ALIADO.md` | Arquitectura, alcance, infraestructura, seguridad, decisiones y secuencia transversal |
| `manual-base-de-datos-aliado.md` | Adjunto del usuario: diccionario y relaciones de 42 tablas MVP; afirma derivación desde V1–V6 |
| `modelo-logico-ALIADO.pdf` | Adjunto del usuario: dos páginas de modelo lógico exportado desde dbdiagram.io; complementa el manual |
| `backend-rifas-pom.xml` | POM leído mediante conexión GitHub, rama develop, blob ee32550407b47c290eb67cf0057365bdb867e1dc; guía de dependencias, no arquitectura/dominio |
| `manifest.json` | SHA-256 y tamaño de los 44 archivos fuente copiados; no incluye este README ni el propio manifiesto |

Referencia externa: https://github.com/SeumaRayo/backend-rifas/blob/develop/pom.xml y README del mismo ref. Documentación técnica consultada: https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide y https://springdoc.org/faq.html.

Demo revisada en `../../../demo-exp_ing/README.md`, `package.json` y catálogo de pantallas/componentes en src. Sus limitaciones de datos locales, autenticación simulada y React web impiden tratarla como backend/cliente móvil terminado. No se copió ni alteró su código.

Las copias fuente se conservan para trazabilidad. Los planes de ejecución están en el nivel superior y features/; no editar estas copias para simular que las discrepancias ya estaban resueltas en origen. Las reglas explícitas del plan nuevo y sus decisiones registradas aclaran cómo implementar las notas antiguas contradictorias.
