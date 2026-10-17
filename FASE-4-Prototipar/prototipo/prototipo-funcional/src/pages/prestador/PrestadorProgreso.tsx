import { useApp } from '@/store/AppContext';
import { CheckCircle, Circle, Info, ExternalLink, AlertTriangle, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import PageContainer from '@/components/layout/PageContainer';
import type { PrestadorPageProps } from '../cliente/types';

export default function PrestadorProgreso({ onNavigate }: PrestadorPageProps) {
  const { providers, updateProviderProfile } = useApp();
  const provider = providers.find(p => p.id === 'prov-1')!;

  const checklist = [
    { label: 'Perfil profesional completado', done: true },
    { label: 'Información de contacto', done: true },
    { label: 'Registro Único Tributario — RUT', done: false },
    { label: 'Registro de ingresos', done: false },
    { label: 'Seguridad social', done: false },
    { label: 'Capacitación', done: false },
    { label: 'Programas institucionales', done: false },
  ].map(item => ({ ...item, done: (provider.formalizationSteps || []).includes(item.label) }));

  const doneCount = checklist.filter((c) => c.done).length;
  const progress = Math.round((doneCount / checklist.length) * 100);

  const resources = [
    { href: 'https://www.dian.gov.co/', name: 'DIAN', desc: 'Registro tributario y declaraciones', icon: '📋' },
    { href: 'https://www.ccsm.org.co/', name: 'Cámara de Comercio', desc: 'Matrícula de comerciante', icon: '🏛️' },
    { href: 'https://www.sena.edu.co/', name: 'SENA', desc: 'Capacitación y apoyo', icon: '🚀' },

  ];

  return (
    <PageContainer>
      <button onClick={() => onNavigate('perfil')} className="text-sm text-blue-600 font-medium mb-3">
        ← Volver
      </button>

      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">Mi progreso</h1>
      </div>

      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-gray-900 text-sm">Progreso declarado</p>
          <span className="text-2xl font-bold text-blue-700">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{doneCount} de {checklist.length} pasos completados</p>
      </Card>

      <Card className="p-5 mb-4">
        <h2 className="font-bold text-gray-900 mb-4">Checklist de formalización</h2>
        <div className="space-y-3">
          {checklist.map((item) => (
            <button type="button" aria-pressed={item.done} key={item.label} className="flex items-center gap-3 text-left" onClick={() => {
              const steps = provider.formalizationSteps || [];
              updateProviderProfile(provider.id, { formalizationSteps: item.done ? steps.filter(step => step !== item.label) : [...steps, item.label] });
            }}>
              {item.done ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
              )}
              <span className={`text-sm ${item.done ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Esta herramienta es únicamente orientativa y no certifica el estado legal o tributario del prestador.
          </p>
        </div>
      </div>

      <h2 className="font-bold text-gray-900 mb-3">Recursos para formalización</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {resources.map((res) => (
          <Card key={res.name} className="p-4">
            <div className="text-2xl mb-2">{res.icon}</div>
            <p className="font-semibold text-gray-900 text-sm">{res.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{res.desc}</p>
            <a href={res.href} target="_blank" rel="noreferrer" className="flex items-center gap-1 mt-2 text-blue-600">
              <span className="text-xs font-medium">Visitar sitio oficial</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900">¿Por qué formalizarse?</p>
            <p className="text-xs text-gray-600 mt-1">
              La formalización te permite acceder a beneficios, proteger tus ingresos y crecer profesionalmente.
              Estos recursos son solo orientativos.
            </p>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
