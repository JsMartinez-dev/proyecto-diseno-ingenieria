# PLANTILLA DE PROYECTO: CONectaSM


---

## INFORMACIÓN GENERAL

* **Programa:** Ingeniería de Sistemas (Universidad del Magdalena)
* **Curso:** Experiencia final de diseño en ingeniería
* **Código del curso:** 9011655
* **Créditos:** 4
* **Periodo académico:** 2026-2
* **Semestre:** Décimo

---

## 1. IDENTIFICACIÓN DEL PROYECTO

* **Título del proyecto:** CONectaSM - Plataforma para la gestión y contratación confiable de servicios técnicos a domicilio en Santa Marta.


* **Tipo de proyecto:**
  - [x] Productivo
  - [ ] Investigación aplicada
  - [ ] Innovación / transferencia tecnológica
  - [ ] Intervención agroambiental

* **Contexto real del problema:** Trabajadores técnicos independientes y clientes
  de Santa Marta que coordinan servicios a domicilio mediante voz a voz, llamadas, WhatsApp, redes sociales y agendas o notas personales. Los oficios considerados
  incluyen reparación de aires acondicionados, electricidad, plomería, pintura, mantenimiento, reparación de electrodomésticos e instalación de equipos.

* **Duración del proyecto:**  Periodo académico 2026-2.

* **Trabajo:**
  - [ ] Individual
  - [x] En equipo (Número de integrantes: 
    * *Integrantes:* 
	    * Juan Sebastian Martinez Uribe   - 2022214031
	    * Abraham Ceballos Rodriguez     - 2022214004
	    * Daniel de Jesús Florez Martinez - 2022214050
	    * Seuma Numtshen Rayo Sauna   - 2022214033
	    * Jenifer Tatiana Roa Correa          - 2022214006

---

## 2. DESCRIPCIÓN DEL PROBLEMA DE INGENIERÍA

### Situación problemática identificada

En Santa Marta existe una cantidad importante de personas que trabajan de manera independiente ofreciendo servicios técnicos a domicilio. Una parte de estos trabajadores obtiene sus clientes mediante mecanismos informales: voz a voz, llamadas telefónicas, WhatsApp, publicaciones en redes sociales, recomendaciones de conocidos o contacto directo por sectores de la ciudad.

Aunque estos mecanismos permiten conseguir clientes, la **gestión de las oportunidades de trabajo se encuentra fragmentada y depende en gran medida de procesos manuales**. Un trabajador puede recibir simultáneamente solicitudes por distintos canales, para cada una debe identificar la necesidad del cliente, solicitar ubicación, conocer disponibilidad, acordar horario, estimar costo, desplazarse y luego recordar o registrar la información del servicio, sin ningún sistema de apoyo.

Esta afirmación, inicialmente planteada como hipótesis, fue confirmada mediante evidencia directa en las entrevistas realizadas:

- Yuranis Martínez (instalaciones eléctricas) reportó que recibe solicitudes simultáneas por Facebook, WhatsApp y llamadas, y que "muchas solicitudes se me quedan acumuladas sin responder"; además perdió una cita por no transcribir una dirección a su bloc de notas.
- Jorge Ortiz (plomería) reportó que no lleva ningún registro de trabajos ni materiales, que ha perdido citas por anotar direcciones en papel suelto, y que ha perdido clientes porque "el cliente ya resolvió con otro plomero" mientras él no podía revisar el teléfono.
- Richard Núñez (aires acondicionados) confirmó que no registra los trabajos realizados y que le sería útil una bitácora para saber si su trabajo es rentable.
- Desde el lado del cliente, Patricia Mercado, Gladys Jiménez y Liliana Pulido reportaron dificultades de coordinación: falta de aviso ante retrasos, incertidumbre sobre el precio final, falta de mecanismos de confianza para dejar entrar a un desconocido a su vivienda.

### Necesidad o demanda del entorno

La necesidad de intervenir se sustenta en dos tipos de evidencia:

1. **Evidencia de contexto estadístico (DANE - EMICRON 2024/2025):** Santa Marta presenta la mayor proporción de trabajadores por cuenta propia (98,8%) entre las 24 ciudades principales del país, y la mayor participación de micronegocios de servicios (66,2%). A nivel nacional, la mayoría de estos micronegocios son unipersonales, informales (sin RUT ni matrícula mercantil) y una proporción alta no usa dispositivos electrónicos, aunque sí usa teléfono celular. Esto confirma que el segmento objetivo es numeroso, informal y depende de herramientas manuales, pero **no mide directamente** la fragmentación de la gestión de oportunidades, por eso se complementó con entrevistas.

2. **Evidencia directa (entrevistas):** las 6 entrevistas realizadas confirman de forma consistente los síntomas descritos en el planteamiento del problema: solicitudes sin responder, citas olvidadas, falta de registro, pérdida de oportunidades comerciales y desconfianza del cliente ante la informalidad del trabajador.

Ver evidencia completa y gráficas en [01-definición técnica del problema](FASE-1-Empatizar/01-definicion-tecnica-del-problema.md)
	
### Usuarios o beneficiarios

- **Cliente:** persona natural en Santa Marta que necesita contratar un servicio técnico a domicilio y que actualmente depende de mecanismos informales para encontrar, evaluar y coordinar con un trabajador independiente.

- **Prestador (trabajador independiente):** persona que ofrece servicios técnicos a domicilio de forma independiente y que actualmente gestiona sus solicitudes, agenda y desplazamientos de forma manual y fragmentada.
### Justificación técnica y social del proyecto

* **Justificación social:** el problema afecta directamente los ingresos y la productividad de un grupo poblacional numeroso y mayoritariamente informal (según EMICRON, Santa Marta concentra la mayor proporción de trabajadores por cuenta propia del país). Mejorar la gestión de oportunidades comerciales de este grupo tiene un impacto potencial en su estabilidad de ingresos. Del lado del cliente, resolver el problema también responde a una necesidad de confianza y transparencia.

* **Justificación técnica**: Los archivos [spec-01](FASE-4-Prototipar/08-Casos-de-Uso/Caso-de-uso-1/spec-01-acceso-identidad-cuenta-privacidad.md) a [spec-07](FASE-4-Prototipar/08-Casos-de-Uso/Caso-de-uso-7/spec-07-capacidades-could-future.md) ya documentan un análisis técnico avanzado, que evidencia viabilidad técnica del enfoque de plataforma digital.

---

## 3. RESTRICCIONES Y CONDICIONANTES DEL DISEÑO

Seleccionen cuáles de las siguientes restricciones aplican e indican cómo se incorporan en el diseño de su solución:
*   [x] **Técnicas** (Limitaciones de tecnología disponible, velocidad, arquitectura, infraestructura, etc.)
*   [ ] **Económicas** (Presupuestos, costos de operación, viabilidad de desarrollo, etc.)
*   [ ] **Ambientales** (Sostenibilidad, consumo energético, huella de carbono digital, etc.)
*   [x] **Sociales y culturales** (Accesibilidad, facilidad de uso, lenguaje, inclusión, etc.)
*   [x] **Normativas y legales** (Protección de datos - Ley 1581, propiedad intelectual, normatividad sectorial, etc.)
*   [x] **Salud y seguridad** (Seguridad de la información, ciberseguridad, ergonomía de interfaces, etc.)
*   [x] **Éticas** (Transparencia en algoritmos, manejo responsable de información, sesgos, etc.)


- **Incorporación de las restricciones:** Las restricciones se incorporan mediante separación de roles entre Cliente, Prestador y Administrador, consentimiento explícito en el registro, visibilidad de zona aproximada durante el descubrimiento, entrega de la dirección exacta solo cuando las reglas del servicio lo permitan validación de elegibilidad antes de crear propuestas, estados controlados para solicitudes y servicios, prevención de calificaciones duplicadas y reportes para moderación. El alcance MoSCoW reserva para fases posteriores los pagos y las integraciones de alta complejidad.
## 4. PROCESO DE DISEÑO DE INGENIERÍA


 1. **Definición de requerimientos del diseño:** 
	
**Requerimientos funcionales (RF):** documentados en el repositorio, organizados por caso de uso.

| Caso de uso | Archivo                                                                                                                                                             | Alcance                                                   | N.º de RF |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------- |
| UC-01       | [spec-01-acceso-identidad-cuenta-privacidad](FASE-4-Prototipar/08-Casos-de-Uso/Caso-de-uso-1/spec-01-acceso-identidad-cuenta-privacidad.md)                         | Registro, autenticación, roles, privacidad de ubicación   | 15        |
| UC-02       | [spec-02-cliente-descubrimiento-solicitudes](FASE-4-Prototipar/08-Casos-de-Uso/Caso-de-uso-2/spec-02-cliente-descubrimiento-solicitudes.md)                         | Publicación de solicitudes, descubrimiento de prestadores | 15        |
| UC-03       | [spec-03-prestador-perfil-oportunidades](FASE-4-Prototipar/08-Casos-de-Uso/Caso-de-uso-3/spec-03-prestador-perfil-oportunidades.md)                                 | Perfil profesional, tablero de oportunidades              | 16        |
| UC-04       | [spec-04-propuestas-contratacion-ciclo-servicio](FASE-4-Prototipar/08-Casos-de-Uso/Caso-de-uso-4/spec-04-propuestas-contratacion-ciclo-servicio.md)                 | Propuestas, contratación, ciclo de vida del servicio      | 20        |
| UC-05       | [spec-05-confianza-verificacion-reportes-administracion](FASE-4-Prototipar/08-Casos-de-Uso/Caso-de-uso-5/spec-05-confianza-verificacion-reportes-administracion.md) | Calificaciones, reportes, moderación, administración      | 19        |
| UC-06       | [spec-06-formalizacion-notificaciones-historial](FASE-4-Prototipar/08-Casos-de-Uso/Caso-de-uso-6/spec-06-formalizacion-notificaciones-historial.md)                 | Formalización progresiva, notificaciones, historial       | 12        |
| UC-07       | [spec-07-capacidades-could-future](FASE-4-Prototipar/08-Casos-de-Uso/Caso-de-uso-7/spec-07-capacidades-could-future.md)                                             | Capacidades Could/Future (fuera del MVP)                  | 10        |

**Total: 107 requerimientos funcionales**, cada uno con Historia de Usuario, Escenarios de Aceptación, Casos Límite y Criterios de Éxito medibles.

**Requerimientos no funcionales y de sistema (RNF):** 

| ID      | Categoría                                  | Requisito no funcional / de sistema                                                                                                                                                                      |
| ------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RNF-001 | Disponibilidad / conectividad              | El sistema DEBE seguir siendo operable en condiciones de conectividad móvil intermitente o de baja velocidad.                                                                                            |
| RNF-002 | Usabilidad                                 | La interfaz DEBE ser operable por usuarios con baja alfabetización digital, con navegación simple, elementos táctiles grandes y mínima carga cognitiva por pantalla.                                     |
| RNF-003 | Rendimiento                                | El tablero de oportunidades  y la lista de solicitudes abiertas DEBEN cargar en un tiempo que permita revisión ágil durante pausas cortas de trabajo del Prestador.                                      |
| RNF-004 | Seguridad y privacidad                     | El sistema DEBE cifrar en tránsito y en reposo los datos sensibles de ubicación exacta y datos de contacto, y DEBE aplicar control de acceso basado en roles de forma consistente en toda la plataforma. |
| RNF-005 | Trazabilidad / auditoría                   | Toda acción administrativa sobre cuentas, reportes o contenido DEBE quedar registrada de forma inmutable y consultable.                                                                                  |
| RNF-006 | Integridad transaccional                   | Las operaciones de cambio de estado del ciclo de vida del servicio DEBEN ser atómicas y no permitir estados inconsistentes ante fallos o reintentos.                                                     |
| RNF-007 | Notificaciones en tiempo casi real         | Las notificaciones de nueva oportunidad, propuesta recibida o cambio de estado DEBEN entregarse en un tiempo cercano al evento que las origina, dentro de las preferencias configuradas por el usuario.  |
| RNF-008 | Escalabilidad                              | La arquitectura DEBE soportar el crecimiento del número de Prestadores, Clientes y solicitudes concurrentes propio de una ciudad como Santa Marta sin degradar el cumplimiento de RNF-003.               |
| RNF-009 | Compatibilidad de plataforma               | El sistema DEBE ser accesible al menos desde teléfonos inteligentes de gama media/baja, dado que la mayoría de los micronegocios de la ciudad opera con teléfono celular y no con computador.            |
| RNF-010 | Cumplimiento normativo de datos personales | El tratamiento de datos personales DEBE ajustarse a la Ley 1581 de 2012 (protección de datos personales en Colombia).                                                                                    |

---

2.  **Formulación de alternativas de solución:** 

Con base en los requerimientos anteriores, se formulan tres alternativas de arquitectura y plataforma:

**Alternativa A — Aplicación web responsiva (PWA)**
Backend en Java con Spring Boot y PostgreSQL como base de datos relacional. Frontend en React, implementado como Progressive Web App instalable desde el navegador, con geolocalización vía API del navegador y notificaciones push web. Un único código base de cliente para Cliente, Prestador y Administrador, diferenciado por rol.

**Alternativa B — Aplicación móvil nativa (Android) con backend independiente**
Aplicaciones nativas Android separadas para Cliente y Prestador, comunicándose con un backend Java/Spring Boot + PostgreSQL vía API REST. Notificaciones push nativas mediante Firebase Cloud Messaging. El rol Administrador se gestiona desde un panel aparte.

**Alternativa C — Aplicación móvil multiplataforma (React Native) + panel web de administración**
App móvil única para Cliente y Prestador construida en React Native, consumiendo el mismo backend Java/Spring Boot + PostgreSQL. El rol Administrador se atiende mediante un panel web separado en React, ya que sus tareas son de escritorio/administrativas y no requieren app móvil.

---

3.  **Análisis y comparación de alternativas:** 

(Escala: 1 = deficiente, 5 = óptimo para el criterio)

| Criterio                                                   | Peso | Se relaciona con | A: Web (PWA) | B: App nativa Android | C: Híbrida + panel web |
| ---------------------------------------------------------- | ---- | ---------------- | ------------ | --------------------- | ---------------------- |
| Disponibilidad con conectividad débil                      | 25%  | RNF-001          | 3            | 5                     | 4                      |
| Usabilidad para baja alfabetización digital                | 20%  | RNF-002          | 3            | 5                     | 4                      |
| Compatibilidad con gama media/baja de celulares            | 15%  | RNF-009          | 4            | 3                     | 4                      |
| Alineación con las capacidades técnicas del equipo         | 15%  | —                | 5            | 4                     | 4                      |
| Costo/tiempo de desarrollo dentro del semestre             | 15%  | —                | 5            | 3                     | 3                      |
| Necesidad real de un panel administrativo separado (UC-05) | 10%  | RNF-005          | 2            | 2                     | 5                      |

**Cálculo del puntaje ponderado:**

- **A (Web PWA):** 3,65
- **B (App nativa Android):**  3,95
- **C (Híbrida + panel web):**  3,95

---
4.  **Selección de la alternativa óptima:** 

**Alternativa seleccionada:** C - Aplicación móvil multiplataforma (React Native) + panel web de administración.

**Justificación:**

1. Obtiene el mismo puntaje ponderado que la Alternativa B, pero sin el sobrecosto de mantener apps nativas separadas por sistema operativo, lo cual es más viable dentro del tiempo de un semestre.
2. Resuelve mejor que A y B la necesidad identificada en UC-05 (moderación, reportes, auditoría), que por su naturaleza de trabajo de escritorio encaja mejor en un panel web que en una app móvil.
3. Mantiene el Backend en Java/Spring Boot + PostgreSQL en las tres alternativas, por lo que la selección no compromete la instrumentación de RNF-004 (seguridad), RNF-005 (trazabilidad) ni RNF-006 (integridad transaccional), que dependen del Backend y no del cliente elegido.
4. Se descarta la Alternativa A porque su desempeño en RNF-001 y RNF-002 es notoriamente inferior, y estos dos RNF están directamente respaldados por evidencia de entrevistas, no son suposiciones.
---
5.  **Desarrollo del diseño final:** 

**Conceptualización general del sistema:**

- **Backend:** Java + Spring Boot, expuesto como API REST, organizado por dominio alineado a los 7 casos de uso.

- **Base de datos:** PostgreSQL, con separación explícita entre datos de ubicación aproximada y dirección exacta, y con registro de auditoría inmutable para acciones administrativas.

- **Cliente móvil (React Native):** app única para los roles Cliente y Prestador, con navegación diferenciada por rol  y diseño orientado a usabilidad para baja alfabetización digital.

- **Panel web de administración (React):** interfaz separada exclusiva para el rol Administrador, cubriendo cola de reportes, moderación, auditoría, gestión de categorías/zonas.

- **Notificaciones:** servicio de notificaciones desacoplado del resto del Backend, con preferencias configurables por usuario.

- **Capacidades Could/Future :** quedan modeladas como módulos independientes y desactivables: chat interno, mapa visual, insignias, referidos, soporte WhatsApp, piloto de pagos. De forma que su ausencia no bloquea ningún flujo del MVP.
   
## 5. DESCRIPCIÓN DE LA SOLUCIÓN FINAL

## 6. RESULTADOS Y DESEMPEÑO DEL DISEÑO

## 7. TRABAJO EN EQUIPO Y GESTIÓN DEL PROYECTO
## 8. CONSIDERACIONES ÉTICAS, AMBIENTALES Y PROFESIONALES


---
