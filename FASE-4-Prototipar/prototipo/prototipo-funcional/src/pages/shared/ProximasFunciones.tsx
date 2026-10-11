import {
  MessageSquare, Map, Award, Gift, Phone, CreditCard, Building,
  ArrowLeft, Lock,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageContainer from '@/components/layout/PageContainer';

interface ProximasFuncionesProps {
  onBack: () => void;
}

export default function ProximasFunciones({ onBack }: ProximasFuncionesProps) {
  const features = [
    { icon: MessageSquare, name: 'Chat interno', desc: 'Comunicación directa entre cliente y prestador dentro de la plataforma.' },
    { icon: Map, name: 'Mapa visual', desc: 'Ubicación aproximada de prestadores, respetando la privacidad.' },
    { icon: Award, name: 'Insignia de progreso de formalización', desc: 'Progreso declarado en la ruta orientativa; no certifica un estado legal.' },
    { icon: Gift, name: 'Programa de referidos', desc: 'Invitaciones trazables, sin incentivos económicos definidos.' },
    { icon: Phone, name: 'Soporte por WhatsApp', desc: 'Canal de atención al usuario mediante WhatsApp Business.' },
    { icon: CreditCard, name: 'Pagos en la plataforma', desc: 'Procesamiento de pagos seguro dentro de ALIADO.' },
    { icon: Building, name: 'Onboarding asistido e idiomas', desc: 'Acompañamiento por WhatsApp o gestor comunitario e idiomas adicionales.' },
  ];

  return (
    <PageContainer>
      <button onClick={onBack} className="text-sm text-blue-600 font-medium mb-4 flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Próximas funciones</h1>
        <p className="text-sm text-gray-500">Funcionalidades planificadas que no hacen parte del MVP</p>
      </div>

      <div className="grid gap-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.name} className="p-4 opacity-60 cursor-not-allowed">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-700 text-sm">{feature.name}</p>
                    <Badge color="gray" size="sm">
                      <Lock className="w-3 h-3" />
                      Fase futura
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
        <p className="text-xs text-blue-800 text-center">
          Estas funciones están planificadas para futuras versiones de la plataforma
          y no están disponibles en esta demo académica.
        </p>
      </div>
    </PageContainer>
  );
}
