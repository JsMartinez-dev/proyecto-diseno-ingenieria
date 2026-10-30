# Arquitectura, stack y contratos de implementación

Fecha de corte: 2026-10-30. Este documento prescribe el trabajo a implementar; no acredita un backend o clientes terminados.

## Backend

Monolito modular Java 21, Maven Wrapper y PostgreSQL 16. Cada feature pertenece a un módulo funcional; no crear capas globales de negocio. Conservar los nombres de módulos del plan general: `auth`, `perfil`, `catalogo`, `solicitudes`, `perfiles`, `descubrimiento`, `oportunidades`, `propuestas`, `servicios`, `notificaciones`, `confianza`, `reportes`, `administracion`, `auditoria`, `formalizacion` y módulos de consultas de SPEC-14.

```text
backend/
  pom.xml
  src/main/java/com/aliado/<modulo>/
    domain/model/                         # Java, reglas e invariantes
    domain/repository/                    # puertos de persistencia
    domain/exception/                     # excepciones de negocio
    application/usecase/                  # interfaces de entrada *UseCase
    application/service/                  # *Service implements *UseCase
    application/port/                     # storage, correo, entrega y otras salidas
    application/dto/                      # Command/Query/Result sin HTTP
    application/exception/                # solo si existe un error de aplicación propio
    infrastructure/persistence/entity/    # JPA, @Version
    infrastructure/persistence/jpa/       # Spring Data
    infrastructure/persistence/mapper/    # persistencia <-> dominio
    infrastructure/persistence/adapter/   # implementaciones de puertos
    infrastructure/adapter/               # proveedores externos
    infrastructure/config/                # wiring, transacciones/configuración técnica
    presentation/controller/              # HTTP
    presentation/dto/                     # contratos HTTP
    presentation/mapper/                  # HTTP <-> aplicación
    presentation/exception/               # errores HTTP
  src/main/resources/db/migration/
  src/test/java/com/aliado/
  compose.yaml
  .env.example
```

Crear directorios solo al tener una responsabilidad real. Dominio sin Spring/JPA/HTTP; aplicación sin controladores, entidades JPA ni SDK concretos. Cada interfaz `application/usecase/*UseCase` define una operación de entrada; su implementación `application/service/*Service` implementa esa interfaz. Los controladores y filtros reciben interfaces UseCase por constructor, nunca servicios concretos. Infraestructura implementa puertos de salida; presentación transforma DTO HTTP y delega en UseCase. Transacciones en el límite de aplicación mediante configuración/decoración de infraestructura; dominio no recibe anotaciones técnicas. `common/` contiene contratos y utilidades transversales acotadas, nunca repositorio genérico para todos los dominios. Seguridad/configuración compartidas son técnicas y no entran al dominio.

Una operación que coordina varios módulos (aceptar propuesta) tiene un solo límite transaccional y utiliza interfaces UseCase/puertos públicos; nunca importa implementaciones Service de otro módulo. Pruebas de arquitectura o verificación equivalente en CI impiden importar entidades/repositorios JPA ajenos.

## Contrato arquitectónico obligatorio

La convención del ejemplo del usuario se concreta en [04 — estructura y contratos de casos de uso](04-estructura-y-casos-de-uso.md), con árbol completo de `auth` y asignación por feature. `usecase/` y `service/` tienen responsabilidades distintas y coexisten en cada operación planificada: interfaz de entrada y clase que la implementa. No se generan clases vacías ni CRUD fuera de los SPEC para llenar carpetas.

| Elemento | Dependencias admitidas | Restricciones |
|---|---|---|
| `domain/model`, `domain/exception` | Java y tipos propios del dominio | Sin Spring, JPA, HTTP ni DTO de aplicación/presentación |
| `domain/repository` | Modelos del dominio | Interfaz propia, nunca `JpaRepository` |
| `application/usecase` | Command/Query/Result de aplicación y tipos de dominio necesarios | Interfaz sin Spring/HTTP, sin implementación ni adaptador concreto |
| `application/service` | UseCase que implementa, dominio, puertos de salida | Sin controladores, SDK, contexto de Spring Security ni clases JPA |
| `application/port` | Tipos internos independientes de tecnología | Contrato del consumidor, implementado por adaptadores; no expone `HttpServletRequest`, `Authentication`, `MultipartFile`, `Page` de Spring Data o entidades JPA |
| `infrastructure` | Contratos de dominio/aplicación y tecnologías concretas | JPA, BCrypt, correo, storage y contexto de seguridad quedan aquí o en infraestructura transversal |
| `presentation` | Interfaces UseCase, DTO y mappers de presentación | Constructor con interfaces; no inyecta `*Service`, `JpaRepository` ni adaptadores concretos |
| `common/config` | Implementaciones y contratos para ensamblarlos | Composition root; crea beans/decoradores y límites transaccionales, no ejecuta reglas de negocio |

Flujo de una llamada: `Request HTTP → PresentationMapper → Command/Query → UseCase → Service → puertos → adaptadores`. La secuencia de ejecución no cambia la dirección de dependencias: Service conoce la interfaz del puerto; el adaptador implementa esa interfaz y conoce la tecnología. La respuesta vuelve como Result de aplicación y se transforma a Response HTTP en presentación.

### Identidad, excepciones y transacciones

- El ejemplo ubica `SesionAutenticada` en `common/security`. Para impedir que la aplicación dependa del paquete que contiene Spring Security, el plan sitúa este **contrato puro en `auth/application/port/SesionAutenticada`**; `SesionAutenticadaAdapter` consulta el contexto técnico. `CurrentUser`, `@RequiereRol` y filtros son componentes de la frontera HTTP. No pasar principal/Authentication a dominio o aplicación.
- `AutorizacionRolFilter` depende de `ResolverSesionUseCase`; los controladores reciben los UseCase correspondientes. Autorización de propietario/participante se valida además en el caso de uso. Proteger dependencias entre módulos por tipos públicos concretos, evitando un permiso general para importar todo `common`.
- Excepciones de negocio en `domain/exception`; excepciones exclusivamente de coordinación en `application/exception` si llegan a existir. Un `GlobalExceptionHandler` de la frontera HTTP mapea ambas a `ErrorResponse`, sin colocar status HTTP en dominio.
- `common/config/ApplicationConfig` o configuración de módulo conecta `RegistrarUsuarioUseCase` con `RegistrarUsuarioService` y sus puertos; los servicios no usan `@Service` ni `@Transactional` en esta variante. El límite transaccional se aplica mediante decorador/proxy de infraestructura que conserva la interfaz UseCase. Probarlo sobre PostgreSQL real, no solo inspeccionar carpetas.
- Idempotencia tiene filtro HTTP y coordinación/persistencia técnica; no contiene reglas de contratación o de registro. El replay, la autorización y la transacción se verifican juntos según D-18. `TraceIdFilter` es infraestructura de entrada.
- Un generador de sesión debe producir bytes aleatorios criptográficamente seguros; SHA-256 calcula la huella que se persiste y no sustituye la generación aleatoria. Se distinguen `GeneradorTokenSeguroAdapter` y `HuellaTokenSha256Adapter` para evitar ambigüedad de `Sha256GeneradorTokenAdapter` del ejemplo.

### Verificación exigida en F00 y cada feature

Validar: clases Service implementan UseCase, constructor de controlador/filtro depende de interfaces, DTO HTTP no cruza hacia aplicación, repositorios de dominio no heredan Spring Data, aplicación/dominio no importan Spring/JPA, composición y transacciones quedan en infraestructura. Comprobar también llamadas a puertos falsos en pruebas unitarias y a adaptadores reales en integración. Las 20 features detallan sus contratos de entrada y mantienen los mismos IDs del backlog.

## Referencia Spring Boot y dependencias

Referencia inspeccionada: [backend-rifas/develop/pom.xml](https://github.com/SeumaRayo/backend-rifas/blob/develop/pom.xml), blob `ee32550407b47c290eb67cf0057365bdb867e1dc`. Copia de evidencia: [pom.xml](fuentes/backend-rifas-pom.xml). Su README identifica JWT, correo persistente, Flyway y provisión controlada de administrador. No copiar dominio de rifas, permisos adicionales ni su base de datos.

**Línea base documental de ALIADO: Spring Boot 3.3.x.** D-01 exige fijar versión concreta y comprobar soporte/compatibilidad antes de generar el proyecto. `backend-rifas` usa Boot **4.0.5**, Java **21**, springdoc **3.0.2** y jjwt **0.12.6**: son versiones observadas en esa referencia, no versiones aprobadas automáticamente para ALIADO. Adoptar Boot 4 exige ADR y actualizar la línea base, no mezclar dependencias Boot 4 con un parent Boot 3.

| Capacidad       | En backend-rifas                               | Plan ALIADO                                                                                                |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| REST MVC        | `spring-boot-starter-webmvc` (Boot 4)          | `spring-boot-starter-web` en línea Boot 3; adaptar a webmvc solo si D-01 adopta Boot 4                     |
| JPA             | `spring-boot-starter-data-jpa`                 | Usar en infraestructura; versión por BOM/parent                                                            |
| Seguridad       | `spring-boot-starter-security`                 | Usar con sesiones opacas, BCrypt y autorización por recurso                                                |
| Validación      | `spring-boot-starter-validation`               | DTO HTTP y reglas de aplicación/dominio correspondientes                                                   |
| PostgreSQL      | `org.postgresql:postgresql`, runtime           | Usar PostgreSQL 16 y driver administrado                                                                   |
| Flyway          | starter Flyway + `flyway-database-postgresql`  | Boot 3: resolver `flyway-core` + soporte PostgreSQL compatible; Boot 4: starter; un único mecanismo de DDL |
| Correo          | `spring-boot-starter-mail`                     | Puerto de recuperación y adaptador SMTP; capturador local en dev                                           |
| OpenAPI         | springdoc webmvc UI 3.0.2                      | Seleccionar springdoc 2.x para Boot 3 o 3.x para Boot 4; contrato revisado y versionado                    |
| Lombok          | Opcional, annotation processor                 | Opcional en infraestructura; no condicionar el dominio a generación opaca                                  |
| Devtools        | Opcional runtime                               | Solo desarrollo                                                                                            |
| Pruebas         | Starters de prueba por tecnología (Boot 4), H2 | Boot 3: starter-test + spring-security-test; Testcontainers/PostgreSQL como validación real de SQL/JPA     |
| JWT             | jjwt API/impl/Jackson 0.12.6                   | No incluir: ALIADO usa sesión opaca revocable, salvo cambio explícito de D-04                              |
| Imágenes WebP   | TwelveMonkeys 3.15.3                           | Solo si formatos aprobados requieren decodificar/reprocesar WebP; no obligatorio por copiar referencia     |
| Plantillas      | Mustache y Thymeleaf                           | Elegir uno únicamente si se necesitan correos HTML; no incorporar dos motores por defecto                  |
| Salud/métricas  | No observado en el pom revisado                | Añadir Actuator para objetivos del plan general; acceso restringido                                        |
| Storage/entrega | No observado en ese pom                        | Seleccionar SDK S3-compatible y proveedor push en D-06/D-08; adaptadores sustituibles                      |
| Arquitectura    | No se usa como modelo limpio                   | Añadir verificación de dependencias hacia dentro, automatizada en CI                                       |

La nomenclatura de starters cambió en Boot 4; comprobar la [guía oficial de migración](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide). La [matriz de springdoc](https://springdoc.org/faq.html) distingue Boot 3/4. Estas fuentes respaldan la separación de líneas; no se fija una versión soportada sin validarla en F00.

## Frontend

```text
frontend/
  app-movil/                 # React Native + TypeScript: Cliente/Prestador
    src/features/<feature>/  # pantallas, hooks, casos de uso, validaciones de interacción
    src/shared/api/          # cliente HTTP, errores, sesión, idempotencia
    src/shared/ui/
    src/navigation/
  panel-admin/               # React + TypeScript: Administrador
    src/features/<feature>/
    src/shared/api/
    src/shared/ui/
    src/routes/
  packages/contracts/        # tipos/cliente generados o mantenidos desde OpenAPI
```

La carpeta única `frontend` contiene **dos clientes**, conforme al plan general. React Native/React se mantienen; elegir versiones y herramientas compatibles en F00 (no trasladar sin revisión las versiones del prototipo). Se propone navegación móvil con una librería mantenida y panel construido con Vite; fijar elección/lockfiles en D-01 antes de instalar. No convertir la demo web en reemplazo silencioso de la app móvil. Reutilizar recorridos, copy y patrones visuales compatibles; componentes DOM/Tailwind requieren adaptación nativa.

Por cada pantalla: carga, vacío, datos válidos, error recuperable, validación de campos, sesión vencida, permiso denegado y conflicto de versión cuando aplique. Etiquetas accesibles, foco, lector de pantalla, tamaño táctil y navegación atrás. Deshabilitar envío duplicado sin ocultar fallo; solo mostrar éxito tras confirmación API. Reintentos de un comando conservan su Idempotency-Key; una intención nueva obtiene otra. No reintentar automáticamente todos los POST.

Almacenamiento seguro para token móvil; en panel, token en memoria como base propuesta y reautenticación al recargar. Si se decide cookie HttpOnly/BFF para persistencia web, documentar contrato de cookie, CSRF y CORS en D-04 antes de adoptarlo. No tokens/hash/contraseñas en logs ni localStorage. Guardas UI no sustituyen permisos backend. La app no accede directo a PostgreSQL/Supabase.

## API y operación transversal

- `/api/v1`, JSON UTF-8, UUID, ISO-8601; almacenar timestamps en UTC y presentar America/Bogota. Conservar formatos de cada contrato fuente, resolver listas/paginación en OpenAPI antes de desarrollar clientes.
- `Authorization: Bearer <token-opaco>`; hash SHA-256 del token en DB; contraseña BCrypt; expiración/revocación reales. Rol persistido y expuesto de manera coherente como `ADMINISTRADOR`, nunca aceptar registro público de administrador.
- Error estándar: `timestamp`, `status`, `code`, `message`, `path`, `traceId`. Conservar 400/401/403/404/409 y 413/415 donde estén definidos; no filtrar SQL, stacktrace ni datos de cuentas ajenas.
- Autorización por rol **y recurso** en servidor; contacto privado no se deriva de pertenencia al perfil público. La comunicación MVP es mediada por servicio autorizado.
- Notificación/evento persistido en misma transacción de negocio; correo/push fuera de esa transacción. Un worker del propio monolito basta inicialmente; no exige otro microservicio/broker.
- Catálogos reales vienen de API; datos ficticios solo en desarrollo y pruebas. Desacoplar mocks para que CI/E2E pueda conectarse al backend real.
- Archivos privados, MIME validado por contenido, clave de servidor, URLs temporales y autorización previa; compensación para objetos sin metadatos.
- Flags servidor/cliente coordinados, siempre validados en servidor; Could y Future OFF por defecto, incluyendo UC080. Ocultar UI y bloquear endpoint; ninguna tabla opcional bloquea arranque MVP.
