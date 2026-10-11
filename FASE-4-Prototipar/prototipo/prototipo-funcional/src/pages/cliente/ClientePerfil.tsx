import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useApp } from '@/store/AppContext';
import { User, MapPin, Shield, Lock, Info, ChevronRight, LogOut } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import PageContainer from '@/components/layout/PageContainer';
import type { ClientePageProps } from './types';

export default function ClientePerfil({ onNavigate }: ClientePageProps) {
  const { currentClient, zones, updateClient, deletionRequested, requestDeletion, setRole } = useApp();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentClient.name);
  const [zone, setZone] = useState(currentClient.zone);
  return (
    <PageContainer>
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-3">
          {currentClient.name.charAt(0)}
        </div>
        <h1 className="text-lg font-bold text-gray-900">{currentClient.name}</h1>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm text-gray-500">Ubicación aproximada: {currentClient.zone}, Santa Marta</span>
        </div>
      </div>

      <Card className="p-4 mb-3" onClick={() => setEditing(true)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Datos personales</p>
            <p className="text-xs text-gray-500">{currentClient.name} - {currentClient.zone}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </div>
      </Card>

      <Card className="p-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Privacidad</p>
            <p className="text-xs text-gray-500">Tu dirección no es visible públicamente</p>
          </div>
          <Badge color="green" size="sm">Activo</Badge>
        </div>
      </Card>

      <Card className="p-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Consentimiento de datos</p>
            <p className="text-xs text-gray-500">Cuenta de ejemplo de la demo</p>
          </div>
          <Badge color="blue" size="sm">Simulado</Badge>
        </div>
      </Card>

      <Card className="p-4 mb-3">
        <button onClick={() => onNavigate('acerca')} className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 text-sm">Acerca de ALIADO</p>
            <p className="text-xs text-gray-500">Proyecto académico - Universidad del Magdalena</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
      </Card>

      <Card className="p-4 mb-6">
        <button onClick={() => onNavigate('proximas')} className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 text-sm">Próximas funciones</p>
            <p className="text-xs text-gray-500">Lo que viene en ALIADO</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
      </Card>

      <div className="space-y-2">
        <Button variant="ghost" fullWidth className="text-gray-500" disabled={deletionRequested} onClick={() => {
          if (window.confirm('¿Registrar una solicitud de eliminación de tu cuenta?')) requestDeletion();
        }}>
          {deletionRequested ? 'Eliminación pendiente de revisión' : 'Solicitar eliminación de cuenta'}
        </Button>
        <Button variant="danger" fullWidth onClick={() => setRole(null)}>
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
      <Modal open={editing} onClose={() => setEditing(false)} title="Datos personales">
        <div className="space-y-4">
          <label className="block">Nombre<input aria-label="Nombre" value={name} onChange={e => setName(e.target.value)} className="block w-full p-3 border rounded-xl" /></label>
          <label className="block">Zona aproximada<select aria-label="Zona aproximada" value={zone} onChange={e => setZone(e.target.value)} className="block w-full p-3 border rounded-xl">{zones.filter(z => z.active).map(z => <option key={z.id}>{z.name}</option>)}</select></label>
          <Button disabled={!name.trim() || !zone} fullWidth onClick={() => { updateClient({ name, zone }); setEditing(false); }}>Guardar datos</Button>
        </div>
      </Modal>
    </PageContainer>
  );
}
