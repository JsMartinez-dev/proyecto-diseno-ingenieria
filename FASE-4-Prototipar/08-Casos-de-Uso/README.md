# Diagramas de casos de uso 




## 1. Actores identificados

| Actor | Responsabilidad principal |
|---|---|
| **Cliente** | Buscar prestadores, publicar solicitudes, comparar propuestas, contratar, gestionar el servicio, calificar y reportar. |
| **Prestador** | Construir su perfil, recibir oportunidades, cotizar, ejecutar servicios, construir reputación y consultar su ruta de formalización. |
| **Administrador** | Gestionar catálogos, moderación, reportes, bloqueos y auditoría. |
| **Proveedor de notificaciones** | Entregar avisos asociados a oportunidades, propuestas y cambios de estado. |
| **Portal / entidad institucional** | Destino externo para rutas y enlaces oficiales de formalización. |
| **Gestor comunitario / WhatsApp / Pasarela de pago** | Actores externos asociados a capacidades Could/Future. |

## 2. División recomendada

| Diagrama | Alcance                                   |
| -------- | ----------------------------------------- |
| UC-01    | Acceso, cuenta y privacidad               |
| UC-02    | Cliente: descubrimiento y solicitudes     |
| UC-03    | Prestador: perfil y oportunidades         |
| UC-04    | Propuestas, contratación y servicio       |
| UC-05    | Confianza, reportes y administración      |
| UC-06    | Formalización, notificaciones e historial |
| UC-07    | Capacidades Could/Future                  |

---

## UC-01 — Acceso, identidad, cuenta y privacidad

```plantuml
@startuml
title CONectaSM - UC-01 Acceso, identidad, cuenta y privacidad
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor "Usuario" as Usuario
actor "Cliente" as Cliente
actor "Prestador" as Prestador

Usuario <|-- Cliente
Usuario <|-- Prestador

rectangle "CONectaSM" {
  usecase "Registrarse como cliente\n[US-001]" as UC001
  usecase "Registrarse como prestador\n[US-002]" as UC002
  usecase "Iniciar sesión\n[US-003]" as UC003
  usecase "Cerrar sesión\n[US-004]" as UC004
  usecase "Recuperar acceso\n[US-005]" as UC005
  usecase "Acceder según rol\n[US-006]" as UC006
  usecase "Aceptar términos y\ntratamiento de datos\n[US-007]" as UC007

  usecase "Editar datos básicos\n[US-008]" as UC008
  usecase "Gestionar zona aproximada\n[US-009]" as UC009
  usecase "Controlar visibilidad\nde datos personales\n[US-010]" as UC010
  usecase "Consultar datos almacenados\n[US-011]" as UC011
  usecase "Solicitar eliminación\nde cuenta\n[US-012]" as UC012
  usecase "Separar ubicación aproximada\ny dirección exacta\n[US-013]" as UC013
}

Cliente --> UC001
Prestador --> UC002

Usuario --> UC003
Usuario --> UC004
Usuario --> UC005
Usuario --> UC008
Usuario --> UC009
Usuario --> UC010
Usuario --> UC011
Usuario --> UC012

UC001 .> UC007 : <<include>>
UC002 .> UC007 : <<include>>
UC003 .> UC006 : <<include>>
UC009 .> UC013 : <<include>>
UC010 .> UC013 : <<include>>

note right of UC013
La dirección exacta no se
expone durante una solicitud
abierta.
end note
@enduml
```

## UC-02 — Cliente: descubrimiento y solicitudes

```plantuml
@startuml
title CONectaSM - UC-02 Cliente: descubrimiento y solicitudes
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor "Cliente" as Cliente

rectangle "CONectaSM" {
  usecase "Explorar categorías\n[US-025]" as UC025
  usecase "Descubrir prestadores\npor categoría y zona\n[US-026]" as UC026
  usecase "Filtrar y ordenar\nprestadores\n[US-027]" as UC027
  usecase "Consultar perfil público\ndel prestador\n[US-024]" as UC024

  usecase "Crear solicitud de servicio" as CrearSolicitud
  usecase "Crear borrador\n[US-030]" as UC030
  usecase "Definir categoría\ny descripción\n[US-031]" as UC031
  usecase "Adjuntar fotos\n[US-032]" as UC032
  usecase "Definir zona aproximada\ny urgencia\n[US-033]" as UC033
  usecase "Publicar solicitud\n[US-034]" as UC034

  usecase "Editar solicitud abierta\n[US-035]" as UC035
  usecase "Cancelar solicitud abierta\n[US-036]" as UC036
  usecase "Consultar mis solicitudes\n[US-037]" as UC037
  usecase "Consultar detalle y estado\nde solicitud\n[US-038]" as UC038
}

Cliente --> UC025
Cliente --> UC026
Cliente --> UC027
Cliente --> UC024
Cliente --> CrearSolicitud
Cliente --> UC035
Cliente --> UC036
Cliente --> UC037
Cliente --> UC038

UC026 .> UC025 : <<include>>
UC027 .> UC026 : <<extend>>
UC026 .> UC024 : <<extend>>

CrearSolicitud .> UC030 : <<include>>
CrearSolicitud .> UC031 : <<include>>
CrearSolicitud .> UC032 : <<include>>
CrearSolicitud .> UC033 : <<include>>
CrearSolicitud .> UC034 : <<include>>

UC037 .> UC038 : <<extend>>

note right of UC033
La solicitud usa zona aproximada.
La dirección exacta permanece
protegida hasta la contratación.
end note
@enduml
```

## UC-03 — Prestador: perfil y oportunidades

```plantuml
@startuml
title CONectaSM - UC-03 Prestador: perfil y oportunidades
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor "Prestador" as Prestador
actor "Proveedor de notificaciones" as Notif

rectangle "CONectaSM" {
  usecase "Crear perfil profesional\n[US-014]" as UC014
  usecase "Editar perfil profesional\n[US-015]" as UC015
  usecase "Seleccionar categorías\nde servicio\n[US-016]" as UC016
  usecase "Configurar zonas\nde atención\n[US-017]" as UC017
  usecase "Registrar experiencia\nprofesional\n[US-018]" as UC018
  usecase "Cargar portafolio\n[US-019]" as UC019
  usecase "Eliminar elemento\nde portafolio\n[US-020]" as UC020
  usecase "Configurar disponibilidad\ngeneral\n[US-021]" as UC021
  usecase "Gestionar agenda y\nfranjas horarias\n[US-022]" as UC022
  usecase "Consultar vista previa\ndel perfil\n[US-023]" as UC023

  usecase "Determinar compatibilidad\nde solicitudes\n[US-039]" as UC039
  usecase "Ver tablero de\noportunidades\n[US-040]" as UC040
  usecase "Filtrar oportunidades\n[US-041]" as UC041
  usecase "Consultar detalle\nde oportunidad\n[US-042]" as UC042
  usecase "Validar elegibilidad\npara cotizar\n[US-043]" as UC043
  usecase "Notificar nueva oportunidad\ncompatible\n[US-044]" as UC044
}

Prestador --> UC014
Prestador --> UC015
Prestador --> UC019
Prestador --> UC020
Prestador --> UC021
Prestador --> UC022
Prestador --> UC023
Prestador --> UC040
Prestador --> UC041
Prestador --> UC042

UC014 .> UC016 : <<include>>
UC014 .> UC017 : <<include>>
UC014 .> UC018 : <<include>>
UC015 .> UC016 : <<include>>
UC015 .> UC017 : <<include>>

UC040 .> UC039 : <<include>>
UC041 .> UC040 : <<extend>>
UC042 .> UC043 : <<include>>
UC039 .> UC044 : <<extend>>

Notif --> UC044
@enduml
```

## UC-04 — Propuestas, contratación y ciclo de vida

```plantuml
@startuml
title CONectaSM - UC-04 Propuestas, contratación y ciclo de vida del servicio
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor "Cliente" as Cliente
actor "Prestador" as Prestador
actor "Proveedor de notificaciones" as Notif

rectangle "CONectaSM" {
  usecase "Crear propuesta\n[US-045]" as UC045
  usecase "Definir precio o rango\n[US-046]" as UC046
  usecase "Indicar disponibilidad\n[US-047]" as UC047
  usecase "Agregar mensaje\n[US-048]" as UC048
  usecase "Editar propuesta activa\n[US-049]" as UC049
  usecase "Retirar propuesta\n[US-050]" as UC050
  usecase "Notificar propuesta recibida\n[US-051]" as UC051

  usecase "Consultar propuestas\nrecibidas\n[US-052]" as UC052
  usecase "Comparar propuestas\ny perfiles\n[US-053]" as UC053
  usecase "Aceptar propuesta\n[US-054]" as UC054
  usecase "Cerrar propuestas\nno seleccionadas\n[US-055]" as UC055

  usecase "Crear registro de\nservicio contratado\n[US-056]" as UC056
  usecase "Habilitar datos de\ncoordinación\n[US-057]" as UC057
  usecase "Consultar detalle\ndel servicio\n[US-058]" as UC058
  usecase "Marcar servicio\nen ejecución\n[US-059]" as UC059
  usecase "Marcar trabajo\ncomo terminado\n[US-060]" as UC060
  usecase "Confirmar finalización\n[US-061]" as UC061
  usecase "Cancelar servicio\ncontratado\n[US-062]" as UC062
  usecase "Consultar historial\nde estados\n[US-063]" as UC063
  usecase "Usar canal de coordinación\nautorizado\n[US-064]" as UC064

  usecase "Notificar aceptación\nde propuesta\n[US-089]" as UC089
  usecase "Notificar cambios de estado\ndel servicio\n[US-090]" as UC090
}

Prestador --> UC045
Prestador --> UC049
Prestador --> UC050
Prestador --> UC058
Prestador --> UC059
Prestador --> UC060
Prestador --> UC062
Prestador --> UC063
Prestador --> UC064

Cliente --> UC052
Cliente --> UC053
Cliente --> UC054
Cliente --> UC058
Cliente --> UC061
Cliente --> UC062
Cliente --> UC063
Cliente --> UC064

UC045 .> UC046 : <<include>>
UC045 .> UC047 : <<include>>
UC045 .> UC048 : <<include>>
UC045 .> UC051 : <<include>>

UC052 .> UC053 : <<extend>>
UC054 .> UC055 : <<include>>
UC054 .> UC056 : <<include>>
UC054 .> UC057 : <<include>>
UC054 .> UC089 : <<include>>
UC057 .> UC064 : <<include>>

UC059 .> UC090 : <<include>>
UC060 .> UC090 : <<include>>
UC061 .> UC090 : <<include>>
UC062 .> UC090 : <<include>>

Notif --> UC051
Notif --> UC089
Notif --> UC090

note bottom of UC064
El canal concreto depende de la
decisión de producto: chat interno,
teléfono tras aceptación o WhatsApp.
end note
@enduml
```

## UC-05 — Confianza, verificación, reportes y administración

```plantuml
@startuml
title CONectaSM - UC-05 Confianza, verificación, reportes y administración
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor "Cliente" as Cliente
actor "Prestador" as Prestador
actor "Administrador" as Admin
actor "Usuario" as Usuario

Usuario <|-- Cliente
Usuario <|-- Prestador

rectangle "CONectaSM" {
  usecase "Calificar servicio finalizado\n[US-065]" as UC065
  usecase "Impedir calificación duplicada\n[US-066]" as UC066
  usecase "Agregar reseña textual\n[US-067]" as UC067
  usecase "Calcular reputación agregada\n[US-068]" as UC068
  usecase "Mostrar nivel de verificación\ncon significado explícito\n[US-069]" as UC069
  usecase "Solicitar verificación\ndocumental ampliada\n[US-070]" as UC070
  usecase "Reportar reseña o reputación\nproblemática\n[US-071]" as UC071

  usecase "Reportar usuario\n[US-072]" as UC072
  usecase "Reportar solicitud,\npropuesta o servicio\n[US-073]" as UC073
  usecase "Adjuntar evidencia\na reporte\n[US-074]" as UC074

  usecase "Administrar categorías\n[US-028]" as UC028
  usecase "Administrar zonas\n[US-029]" as UC029
  usecase "Consultar cola de reportes\n[US-075]" as UC075
  usecase "Revisar detalle de reporte\n[US-076]" as UC076
  usecase "Cambiar estado y\nresolver reporte\n[US-077]" as UC077
  usecase "Bloquear preventivamente\nuna cuenta\n[US-078]" as UC078
  usecase "Moderar perfil o contenido\n[US-079]" as UC079
  usecase "Buscar usuarios y perfiles\n[US-080]" as UC080
  usecase "Auditar acciones\nadministrativas\n[US-081]" as UC081
  usecase "Gestionar categorías/servicios\nregulados o de alto riesgo\n[US-082]" as UC082
}

Cliente --> UC065
Prestador --> UC070
Usuario --> UC069
Usuario --> UC071
Usuario --> UC072
Usuario --> UC073

UC065 .> UC066 : <<include>>
UC065 .> UC067 : <<extend>>
UC065 .> UC068 : <<include>>
UC071 .> UC074 : <<extend>>
UC072 .> UC074 : <<extend>>
UC073 .> UC074 : <<extend>>

Admin --> UC028
Admin --> UC029
Admin --> UC075
Admin --> UC076
Admin --> UC077
Admin --> UC078
Admin --> UC079
Admin --> UC080
Admin --> UC082

UC075 .> UC076 : <<extend>>
UC076 .> UC077 : <<extend>>
UC077 .> UC081 : <<include>>
UC078 .> UC081 : <<include>>
UC079 .> UC081 : <<include>>
UC028 .> UC081 : <<include>>
UC029 .> UC081 : <<include>>
UC082 .> UC081 : <<include>>

note right of UC069
"Verificado" debe indicar
exactamente qué fue validado.
end note
@enduml
```

## UC-06 — Formalización progresiva, notificaciones e historial

```plantuml
@startuml
title CONectaSM - UC-06 Formalización progresiva, notificaciones e historial
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor "Usuario" as Usuario
actor "Cliente" as Cliente
actor "Prestador" as Prestador
actor "Portal / entidad institucional" as Entidad
actor "Proveedor de notificaciones" as Notif

Usuario <|-- Cliente
Usuario <|-- Prestador

rectangle "CONectaSM" {
  usecase "Consultar ruta de\nformalización\n[US-083]" as UC083
  usecase "Consultar checklist por\ncuatro dimensiones\n[US-084]" as UC084
  usecase "Registrar avance declarado\nen checklist\n[US-085]" as UC085
  usecase "Abrir enlaces oficiales\nde formalización\n[US-086]" as UC086
  usecase "Mostrar progreso sin declarar\nestatus legal\n[US-087]" as UC087
  usecase "Vincular ruta institucional\nfutura\n[US-088]" as UC088

  usecase "Configurar preferencias\nde notificación\n[US-091]" as UC091
  usecase "Consultar historial\nde trabajos\n[US-092]" as UC092
  usecase "Descargar historial\n[US-093]" as UC093
  usecase "Consultar indicadores\nbásicos del prestador\n[US-094]" as UC094
  usecase "Consultar actividad reciente\n[US-095]" as UC095
}

Prestador --> UC083
Prestador --> UC084
Prestador --> UC085
Prestador --> UC086
Prestador --> UC087
Prestador --> UC088
Prestador --> UC094

Usuario --> UC091
Usuario --> UC092
Usuario --> UC093
Usuario --> UC095

UC083 .> UC084 : <<include>>
UC084 .> UC085 : <<extend>>
UC084 .> UC087 : <<include>>
UC083 .> UC086 : <<extend>>
UC086 --> Entidad
UC088 --> Entidad
UC092 .> UC093 : <<extend>>

Notif --> UC091

note bottom of UC087
El progreso es orientativo.
La plataforma no declara ni
automatiza el estatus legal.
end note
@enduml
```

## UC-07 — Evolución futura

```plantuml
@startuml
title CONectaSM - UC-07 Capacidades Could Have y evolución futura
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor "Usuario" as Usuario
actor "Cliente" as Cliente
actor "Prestador" as Prestador
actor "Gestor comunitario" as Gestor
actor "WhatsApp" as WA
actor "Pasarela de pago" as Pago

Usuario <|-- Cliente
Usuario <|-- Prestador

rectangle "CONectaSM - Evolución" {
  usecase "Chat interno en tiempo real\n[US-096] <<Could>>" as UC096
  usecase "Mapa visual de prestadores\n[US-097] <<Could>>" as UC097
  usecase "Insignia de progreso de\nformalización\n[US-098] <<Could>>" as UC098
  usecase "Programa de referidos\n[US-099] <<Could>>" as UC099
  usecase "Soporte por WhatsApp\n[US-100] <<Could>>" as UC100
  usecase "Onboarding asistido por\nWhatsApp o gestor\n[US-101] <<Could>>" as UC101
  usecase "Idiomas adicionales\n[US-102] <<Could>>" as UC102
  usecase "Piloto de pasarela de pago\n[US-103] <<Future>>" as UC103
}

Cliente --> UC096
Prestador --> UC096
Cliente --> UC097
Cliente --> UC098
Prestador --> UC098
Usuario --> UC099
Usuario --> UC100
Prestador --> UC101
Usuario --> UC102
Cliente --> UC103
Prestador --> UC103

UC100 --> WA
UC101 --> WA
Gestor --> UC101
UC103 --> Pago

note right of UC103
Fuera del MVP inicial.
Se reabre únicamente si se
valida el modelo de monetización.
end note
@enduml
```

