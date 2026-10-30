# Estructura de referencia: interfaces UseCase, servicios y adaptadores

Este documento concreta el ejemplo y las dos imágenes proporcionadas por el usuario. Es el contrato de implementación del plan; no son clases ya creadas. El ejemplo es coherente con la variante de Arquitectura Limpia elegida: `application/usecase` expone interfaces de entrada; `application/service` contiene sus implementaciones; los controladores dependen de las interfaces.

La estructura por carpetas se acompaña de reglas de dependencia y composición verificables. Mantener los modelos, tablas, endpoints y funcionalidades previamente definidos. Los nombres del ejemplo son una guía para dividir responsabilidades, no autorización para agregar CRUD de usuarios o endpoints nuevos.

## Árbol de auth

```text
backend/src/main/java/com/aliado/
├── auth/
│   ├── domain/
│   │   ├── model/
│   │   │   └── Usuario, RolUsuario, Consentimiento, Sesion, TokenRecuperacion
│   │   ├── repository/
│   │   │   └── UsuarioRepository, ConsentimientoRepository,
│   │   │       SesionRepository, TokenRecuperacionRepository
│   │   └── exception/
│   │       └── CorreoYaRegistradoException, TerminosNoAceptadosException,
│   │           CredencialesInvalidasException, TokenRecuperacionInvalidoException,
│   │           CuentaBloqueadaException
│   ├── application/
│   │   ├── usecase/
│   │   │   └── RegistrarUsuarioUseCase, IniciarSesionUseCase, CerrarSesionUseCase,
│   │   │       ResolverSesionUseCase, SolicitarRecuperacionAccesoUseCase,
│   │   │       ConfirmarRecuperacionAccesoUseCase, ConsultarUsuarioActualUseCase
│   │   ├── service/
│   │   │   └── RegistrarUsuarioService, IniciarSesionService, CerrarSesionService,
│   │   │       ResolverSesionService, SolicitarRecuperacionAccesoService,
│   │   │       ConfirmarRecuperacionAccesoService, ConsultarUsuarioActualService
│   │   ├── dto/
│   │   │   └── RegistroCommand, ResultadoRegistro, LoginCommand, ResultadoLogin,
│   │   │       UsuarioActual, RecuperacionCommand, ConfirmarRecuperacionCommand
│   │   ├── port/
│   │   │   └── HasheadorPassword, GeneradorTokenSesion, HuellaToken,
│   │   │       NotificadorRecuperacion, UsuarioConsultaPort, SesionAutenticada
│   │   └── exception/                 # solo si surge un error propio de aplicación
│   ├── infrastructure/
│   │   ├── persistence/
│   │   │   ├── entity/
│   │   │   │   └── UsuarioEntity, ConsentimientoEntity,
│   │   │   │       SesionEntity, TokenRecuperacionEntity
│   │   │   ├── mapper/
│   │   │   │   └── UsuarioMapper, ConsentimientoMapper,
│   │   │   │       SesionMapper, TokenRecuperacionMapper
│   │   │   ├── jpa/
│   │   │   │   └── UsuarioJpaRepository, ConsentimientoJpaRepository,
│   │   │   │       SesionJpaRepository, TokenRecuperacionJpaRepository
│   │   │   └── adapter/
│   │   │       └── UsuarioPersistenceAdapter, ConsentimientoPersistenceAdapter,
│   │   │           SesionPersistenceAdapter, TokenRecuperacionPersistenceAdapter
│   │   └── adapter/
│   │       └── BCryptHasheadorAdapter, GeneradorTokenSeguroAdapter,
│   │           HuellaTokenSha256Adapter, CorreoRecuperacionAdapter,
│   │           SesionAutenticadaAdapter, UsuarioConsultaAdapter
│   └── presentation/
│       ├── controller/               AuthController
│       ├── dto/                      RegistroRequest, RegistroResponse,
│       │                             LoginRequest, LoginResponse,
│       │                             RecuperacionRequest, ConfirmarRecuperacionRequest
│       └── mapper/                   AuthPresentationMapper
└── common/
    ├── config/                       PasswordConfig, ApplicationConfig
    ├── security/                     SecurityConfig, AutorizacionRolFilter,
    │                                 @RequiereRol, CurrentUser
    ├── exception/                    GlobalExceptionHandler, ErrorResponse
    ├── idempotency/                  IdempotencyService, IdempotencyFilter
    └── observability/                TraceIdFilter
```

Cada Service del árbol implementa el UseCase con el mismo nombre base. Entidades, puertos, excepciones y mappers se crean conforme se implemente una responsabilidad real; `application/exception` no se crea vacío. No hace falta duplicar una excepción de negocio en cada capa.

`ResultadoRegistro` y `RegistroResponse` expresan los campos `id`, `email`, `rol` ya presentes en el contrato de registro; no agregan campos a la tabla. `UsuarioConsultaAdapter` implementa el puerto de consulta cuando exista un consumidor real. `ConsultarUsuarioActualUseCase` puede servir a consumidores internos: no se añade automáticamente un endpoint `/me` al contrato original.

## Separación explícita entre entrada y salida

| Entrada a aplicación | Implementación | Salidas que consume |
|---|---|---|
| `RegistrarUsuarioUseCase` | `RegistrarUsuarioService` | UsuarioRepository, ConsentimientoRepository, HasheadorPassword |
| `IniciarSesionUseCase` | `IniciarSesionService` | UsuarioRepository, SesionRepository, HasheadorPassword, GeneradorTokenSesion, HuellaToken |
| `CerrarSesionUseCase` | `CerrarSesionService` | SesionRepository y contexto de identidad puro cuando corresponda |
| `ResolverSesionUseCase` | `ResolverSesionService` | SesionRepository, UsuarioRepository, HuellaToken |
| `SolicitarRecuperacionAccesoUseCase` | `SolicitarRecuperacionAccesoService` | UsuarioRepository, TokenRecuperacionRepository, generador seguro, HuellaToken, NotificadorRecuperacion |
| `ConfirmarRecuperacionAccesoUseCase` | `ConfirmarRecuperacionAccesoService` | TokenRecuperacionRepository, UsuarioRepository, HuellaToken, HasheadorPassword y revocación de sesión según política |
| `ConsultarUsuarioActualUseCase` | `ConsultarUsuarioActualService` | SesionAutenticada, UsuarioConsultaPort, si existe consumidor interno |

`domain/repository` son contratos puros y permanecen separados de `infrastructure/persistence/jpa`. `application/port` abstrae hashing, aleatoriedad, correo y datos/contexto requeridos por el caso de uso; ninguna firma expone clases del SDK, Spring Security, servlet o JPA. El servicio de aplicación invoca el puerto; el proveedor concreto solo se decide en composición.

El puerto de notificación de recuperación no envía correo antes del commit. Implementar la entrega diferida/persistente definida en F00/F01 y la prueba de fallo correspondiente; no sacrificar atomicidad por ubicar una interfaz correctamente.

## Constructor de controlador

El siguiente fragmento ilustra la dependencia de la segunda imagen aplicada a auth; no implementa endpoints adicionales:

```java
public final class AuthController {
    private final RegistrarUsuarioUseCase registrarUsuario;
    private final IniciarSesionUseCase iniciarSesion;
    private final CerrarSesionUseCase cerrarSesion;
    private final SolicitarRecuperacionAccesoUseCase solicitarRecuperacion;
    private final ConfirmarRecuperacionAccesoUseCase confirmarRecuperacion;
    private final AuthPresentationMapper mapper;

    public AuthController(
            RegistrarUsuarioUseCase registrarUsuario,
            IniciarSesionUseCase iniciarSesion,
            CerrarSesionUseCase cerrarSesion,
            SolicitarRecuperacionAccesoUseCase solicitarRecuperacion,
            ConfirmarRecuperacionAccesoUseCase confirmarRecuperacion,
            AuthPresentationMapper mapper) {
        this.registrarUsuario = registrarUsuario;
        this.iniciarSesion = iniciarSesion;
        this.cerrarSesion = cerrarSesion;
        this.solicitarRecuperacion = solicitarRecuperacion;
        this.confirmarRecuperacion = confirmarRecuperacion;
        this.mapper = mapper;
    }
}
```

Al implementar, las anotaciones `@RestController`, mappings, validación de Request y serialización pertenecen a esta frontera. Se conservan `/api/v1/auth/*` y sus status; `/api/usuarios` de la foto no sustituye contratos de ALIADO. Un método convierte el Request a Command, invoca `useCase.ejecutar(command)` y convierte el resultado a Response; no calcula hashes, consulta JPA ni toma decisiones de negocio.

Firmas ilustrativas del contrato y la implementación:

```java
public interface RegistrarUsuarioUseCase {
    ResultadoRegistro ejecutar(RegistroCommand command);
}
```

`RegistrarUsuarioService implements RegistrarUsuarioUseCase` define `ejecutar` y recibe UsuarioRepository, ConsentimientoRepository y HasheadorPassword por constructor. Coordina reglas y persistencia sin dependencias HTTP/JPA/Spring. Spring conecta el bean en `ApplicationConfig`/configuración del módulo. Un decorador transaccional puede implementar el mismo UseCase y envolver el Service, sin anotar ni acoplar el servicio puro a Spring.

## Ajustes deliberados al ejemplo

1. **Identidad:** `SesionAutenticada` se coloca en `auth/application/port`, porque es una abstracción requerida por aplicación. Su adaptador consulta el contexto de seguridad; filtros/configuración permanecen en `common/security`. Evitar que importar la identidad permita depender de todas las clases técnicas de seguridad.
2. **Token:** `GeneradorTokenSeguroAdapter` genera valor aleatorio de alta entropía; `HuellaTokenSha256Adapter` calcula SHA-256 para almacenamiento. El nombre `Sha256GeneradorTokenAdapter` no debe llevar a usar hashes deterministas como generador de sesiones.
3. **Transacciones:** composición/decoración en infraestructura preserva registro/consentimiento o aceptación/cierre de propuestas/historial/notificación como una operación atómica. La separación por interfaz no permite repartir esas escrituras en transacciones independientes.
4. **Seguridad compartida:** `CurrentUser`, anotación de rol y filtros son técnicos. El filtro de autorización consume `ResolverSesionUseCase`; dominio/aplicación reciben UUID/rol o contrato puro. Nunca obtienen `SecurityContextHolder` directamente.
5. **Excepciones:** errores de negocio permanecen en dominio y se traducen a HTTP en GlobalExceptionHandler. No propagar detalles SQL/SDK ni insertar `ResponseStatus` en excepciones del dominio.

## Aplicación a todas las features

Cada archivo en [features](README.md#índice-por-feature) incluye una tabla **Interfaces de entrada e implementaciones** con módulo, UseCase y Service. F00-BE-02 y Fnn-BE-02 exigen construir y verificar esa separación. El desglose conserva funcionalidad, IDs y orden de tareas; un servicio agrupado del plan de origen es referencia de responsabilidades que ahora se reparten por operación.

Para features con varios módulos (F04 catálogo/solicitudes, F10 confianza/reportes, F12 administración/auditoría, F14 consultas y F19 referidos/idiomas), las tablas distinguen el propietario. Los consumidores llaman interfaces públicas del propietario y las dependencias salientes se adaptan donde haga falta. No usar Service concreto de otro módulo ni copiar modelos JPA entre ellos.

En F06/F09 hay entradas internas y workers, no solo HTTP: también dependen de UseCase. Las interfaces de orquestación/cálculo de F06 no obligan a que una regla pura del dominio dependa de aplicación; el Service coordina y delega el cálculo puro al dominio. F15 reutiliza mensajes F08 mediante contratos públicos. F15–F20 y UC080 conservan sus flags/condiciones de aprobación.

## Criterios verificables

- Cada Service planificado implementa su UseCase; las firmas expresan comandos/consultas y resultados independientes de transporte.
- Constructor de controller/filtro/gateway/worker usa interfaces de entrada, sin Service concreto ni repositorio JPA. El mapper HTTP es de presentación.
- Unitarias del Service sustituyen puertos con dobles; pruebas de contrato ejercitan controlador/mapping/errores; integración valida adaptadores JPA y transacciones con PostgreSQL.
- Verificación automática de dependencias: dominio y aplicación sin Spring/JPA/HTTP; presentación sin adaptadores/JPA/Service; sin implementación concreta de otro módulo; composición exceptuada explícitamente en configuración.
- Contratos/repositorios no exponen entidades JPA; mapper de persistencia no se reutiliza como mapper HTTP. La identidad técnica no entra a dominio/aplicación.
- Pruebas de concurrencia, idempotencia y rollback siguen siendo obligatorias. El árbol correcto por sí solo no acredita que el comportamiento sea correcto.
