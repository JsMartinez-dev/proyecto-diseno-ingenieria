import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { clients } from '@/data/mockData';
import { Search, Ban, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { AdminPageProps } from '../cliente/types';

export default function AdminUsuarios({ onNavigate: _onNavigate }: AdminPageProps) {
  const { addToast, suspendUser, warnUser, suspendedUsers } = useApp();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const allUsers = [
    ...clients.map((c) => ({ id: c.id, name: c.name, role: 'Cliente', zone: c.zone, status: 'Activo' as const })),
  ];

  const filtered = allUsers.filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()));

  const handleSuspend = (name: string) => {
    const reason = window.prompt('Motivo de la suspensión');
    if (!reason?.trim()) return;
    suspendUser(name, reason);
    addToast(`Usuario ${name} suspendido`, 'success');
    setSelectedUser(null);
  };

  const handleWarn = (name: string) => {
    warnUser(name);
    addToast(`Advertencia enviada a ${name}`, 'success');
    setSelectedUser(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Usuarios</h1>
        <p className="text-sm text-gray-500">Gestión de clientes registrados</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-md pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Zona</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.role}</td>
                  <td className="px-4 py-3 text-gray-500">{user.zone}</td>
                  <td className="px-4 py-3">
                    {suspendedUsers.includes(user.id) ? (
                      <Badge color="red">Suspendido</Badge>
                    ) : (
                      <Badge color="green">Activo</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary" onClick={() => setSelectedUser(user.name)}>
                      Gestionar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)} title={`Gestionar: ${selectedUser}`} size="sm">
        <div className="space-y-3">
          <Button variant="secondary" fullWidth onClick={() => selectedUser && handleWarn(selectedUser)}>
            <AlertCircle className="w-4 h-4" />
            Advertir usuario
          </Button>
          <Button variant="danger" fullWidth onClick={() => selectedUser && handleSuspend(selectedUser)}>
            <Ban className="w-4 h-4" />
            Suspender cuenta
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setSelectedUser(null)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
