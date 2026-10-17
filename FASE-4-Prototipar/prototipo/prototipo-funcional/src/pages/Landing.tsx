import { useState } from 'react';
import DemoAccess from '@/components/DemoAccess';
import { useApp } from '@/store/AppContext';
import { MapPin, ArrowRight, CheckCircle, Star, Lock } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function Landing() {
  const { providers } = useApp();
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const categories = [
    { icon: '⚡', name: 'Electricidad' },
    { icon: '🔧', name: 'Plomería' },
    { icon: '❄️', name: 'Aires acondicionados' },
    { icon: '🎨', name: 'Pintura' },
    { icon: '🔌', name: 'Electrodomésticos' },
    { icon: '🔨', name: 'Mantenimiento' },
  ];

  if (showRoleSelector) return <DemoAccess onBack={() => setShowRoleSelector(false)} />;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ALIADO</h1>
              <p className="text-blue-200 text-sm">Gestión y contratación de servicios técnicos.</p>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-2xl mb-4">
            Encuentra servicios confiables cerca de ti.
          </h2>
          <p className="text-blue-100 text-lg max-w-xl mb-8">
            Conectamos personas que necesitan resolver problemas cotidianos con trabajadores independientes de Santa Marta.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowRoleSelector(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold bg-white text-blue-900 hover:bg-blue-50 active:bg-blue-100 shadow-sm transition-all duration-200"
            >
              Entrar a la demo
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('categorias');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold border-2 border-white text-white hover:bg-white/10 active:bg-white/20 transition-all duration-200"
            >
              Explorar servicios
            </button>
          </div>

          <div className="flex flex-wrap gap-6 mt-10">
            <div className="flex items-center gap-2 text-blue-100">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">Perfiles y reseñas de ejemplo</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <MapPin className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">Zonas de Santa Marta</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Lock className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">Direcciones protegidas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div id="categorias" className="max-w-5xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Servicios disponibles</h3>
        <p className="text-gray-500 text-center mb-8">Explora las categorías de servicios técnicos a domicilio</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.name} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{cat.icon}</div>
              <p className="font-semibold text-gray-800">{cat.name}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Cómo funciona */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Cómo funciona</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl mb-4">
                1
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Publica tu solicitud</h4>
              <p className="text-sm text-gray-500">Describe el problema, la zona y la urgencia. Recibe propuestas de prestadores cercanos.</p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl mb-4">
                2
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Compara y elige</h4>
              <p className="text-sm text-gray-500">Revisa perfiles, calificaciones y precios. Selecciona al prestador de tu confianza.</p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl mb-4">
                3
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Califica el servicio</h4>
              <p className="text-sm text-gray-500">Consulta el estado del servicio y comparte tu experiencia para ayudar a otros.</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Prestadores destacados */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Prestadores destacados</h3>
        <p className="text-gray-500 text-center mb-8">Trabajadores con mejor reputación en Santa Marta</p>
        <div className="grid md:grid-cols-3 gap-4">
          {providers.filter(p => !p.suspended).slice().sort((a,b) => b.rating - a.rating).slice(0,3).map((p) => (
            <Card key={p.name} className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-700">{p.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{p.jobsCompleted} trabajos</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">¿Listo para explorar la plataforma?</h3>
          <p className="text-blue-200 mb-6">Entra a la demo y recorre el sistema como cliente, prestador o administrador.</p>
          <button
            onClick={() => setShowRoleSelector(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold bg-white text-blue-900 hover:bg-blue-50 active:bg-blue-100 shadow-sm transition-all duration-200"
          >
            Entrar a la demo
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-blue-900 font-bold text-xs">A</span>
            </div>
            <span className="font-bold text-white">ALIADO</span>
          </div>
          <p className="text-gray-400 text-sm">Gestión y contratación de servicios técnicos.</p>
          <p className="text-gray-500 text-xs mt-2">Proyecto académico - Ingeniería de Sistemas - Universidad del Magdalena - 2026-2</p>
        </div>
      </footer>
    </div>
  );
}
