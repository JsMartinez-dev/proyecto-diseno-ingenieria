import { GraduationCap, Target, Users, Layers, BookOpen, ArrowLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageContainer from '@/components/layout/PageContainer';

interface AcercaDeProps {
  onBack: () => void;
}

export default function AcercaDe({ onBack }: AcercaDeProps) {
  return (
    <PageContainer>
      <button onClick={onBack} className="text-sm text-blue-600 font-medium mb-4 flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
          A
        </div>
        <h1 className="text-2xl font-bold text-gray-900">ALIADO</h1>
        <p className="text-sm text-gray-500">Servicios locales. Personas de confianza.</p>
      </div>

      <Card className="p-5 mb-4 text-center bg-blue-50 border-blue-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-blue-700" />
          <Badge color="blue">Proyecto académico</Badge>
        </div>
        <p className="font-bold text-gray-900">Ingeniería de Sistemas</p>
        <p className="text-sm text-gray-600">Universidad del Magdalena</p>
        <p className="text-xs text-gray-400 mt-1">Periodo 2026-2</p>
      </Card>

      <Card className="p-5 mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          ALIADO busca mejorar la gestión de oportunidades comerciales y la contratación confiable
          de servicios técnicos independientes en Santa Marta.
        </p>
      </Card>

      <Card className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-gray-900">Problema identificado</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Los trabajadores técnicos independientes consiguen y coordinan clientes mediante voz a voz,
          WhatsApp, llamadas y redes sociales. Esto genera gestión fragmentada: solicitudes sin responder,
          citas olvidadas, falta de historial, poca trazabilidad y pérdida de clientes. Los clientes,
          por su parte, tienen dificultad para encontrar prestadores confiables, incertidumbre sobre precios
          y desconfianza al permitir que un desconocido entre a su vivienda.
        </p>
      </Card>

      <Card className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-teal-600" />
          <h2 className="font-bold text-gray-900">Usuarios del sistema</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge color="blue" size="sm">Cliente</Badge>
            <p className="text-sm text-gray-600">Persona que necesita contratar un servicio técnico a domicilio.</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge color="teal" size="sm">Prestador</Badge>
            <p className="text-sm text-gray-600">Trabajador independiente que ofrece servicios técnicos.</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge color="gray" size="sm">Admin</Badge>
            <p className="text-sm text-gray-600">Gestiona la plataforma, usuarios, reportes y configuración.</p>
          </div>
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-green-600" />
          <h2 className="font-bold text-gray-900">Objetivo</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Conectar clientes y prestadores de servicios técnicos en Santa Marta, organizando todo el ciclo
          del servicio: desde la solicitud hasta la calificación, generando confianza, cercanía,
          simplicidad y seguridad.
        </p>
      </Card>

      <Card className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-gray-900">Arquitectura propuesta</h2>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Aplicación móvil multiplataforma (React Native)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            Backend Java + Spring Boot
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Base de datos PostgreSQL
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Panel web administrativo en React
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            Esta demo: aplicación web responsive (React + TypeScript + Tailwind)
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <h2 className="font-bold text-gray-900">Casos de uso</h2>
        </div>
        <div className="space-y-2">
          {[
            { code: 'UC-01', title: 'Acceso, identidad, cuenta y privacidad' },
            { code: 'UC-02', title: 'Cliente: descubrimiento y solicitudes' },
            { code: 'UC-03', title: 'Prestador: perfil y oportunidades' },
            { code: 'UC-04', title: 'Propuestas, contratación y ciclo del servicio' },
            { code: 'UC-05', title: 'Confianza, verificación, reportes y administración' },
            { code: 'UC-06', title: 'Formalización progresiva, notificaciones e historial' },
            { code: 'UC-07', title: 'Capacidades futuras' },
          ].map((uc) => (
            <div key={uc.code} className="flex items-start gap-2">
              <Badge color="blue" size="sm">{uc.code}</Badge>
              <p className="text-sm text-gray-600">{uc.title}</p>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
