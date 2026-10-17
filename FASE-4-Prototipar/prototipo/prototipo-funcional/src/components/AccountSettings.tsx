import { useApp } from '@/store/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AccountSettings() {
  const { role, preferences, savePreferences, consentDate, acceptConsent, requestDeletion, deletionRequested, currentClient, providers, requests, services, reports, verifications, messages } = useApp();
  return <Card className="p-4 mb-4 space-y-4">
    <h2 className="font-bold">Privacidad y notificaciones</h2>
    <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={preferences.publicName} onChange={e => savePreferences({ publicName: e.target.checked })} />Mostrar mi nombre a otros usuarios</label>
    <p className="text-xs text-gray-500">Si lo desactivas se usa un alias. La zona aproximada se usa para buscar servicios; la dirección exacta se comparte al contratar.</p>
    {role === 'prestador' && <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={preferences.profileVisible} onChange={e => savePreferences({ profileVisible: e.target.checked })} />Aparecer en el catálogo público</label>}
    {role === 'prestador' && <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={preferences.opportunities} onChange={e => savePreferences({ opportunities: e.target.checked })} />Recibir avisos de nuevas oportunidades</label>}
    {role === 'cliente' && <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={preferences.proposals} onChange={e => savePreferences({ proposals: e.target.checked })} />Recibir avisos de nuevas propuestas</label>}
    <p className="text-xs text-gray-500">Canal de esta demo: avisos dentro de la aplicación. La aceptación y los cambios de estado son obligatorios y permanecen activos.</p>
    <div className="border-t pt-3 space-y-2"><h3 className="font-semibold text-sm">Consentimiento de datos · versión demo 1</h3>
      <p className="text-xs text-gray-500">Los datos ficticios se usan para demostrar solicitudes, propuestas y servicios y se guardan en este navegador. Puedes consultar tus datos y solicitar su eliminación.</p>
      {consentDate ? <p className="text-sm">Aceptado: {new Date(consentDate).toLocaleString('es-CO')}</p> : <Button variant="secondary" onClick={acceptConsent}>Aceptar términos y tratamiento de datos de ejemplo</Button>}
    </div>
    <details className="text-sm"><summary className="cursor-pointer font-semibold">Consultar mis datos almacenados</summary><p className="mt-2">{role === 'cliente' ? currentClient.name : providers.find(p => p.id === 'prov-1')?.name}</p><p>Preferencias: nombre {preferences.publicName ? 'visible' : 'con alias'}; avisos en la aplicación.</p><p>Las solicitudes, contratos y reportes propios se consultan en sus respectivas secciones.</p>
      <Button variant="secondary" className="mt-2" onClick={() => {
        const actorId = role === 'cliente' ? 'client-1' : 'prov-1';
        const ownServices = services.filter(s => role === 'cliente' ? s.clientId === actorId : s.providerId === actorId);
        const data = { profile: role === 'cliente' ? currentClient : providers.find(p => p.id === actorId), preferences, consentDate,
          requests: role === 'cliente' ? requests.filter(r => r.clientId === actorId) : requests.filter(r => r.proposals.some(p => p.providerId === actorId)).map(r => ({ id: r.id, title: r.title, proposals: r.proposals.filter(p => p.providerId === actorId) })),
          services: ownServices, reports: reports.filter(r => r.reporterId === actorId), verifications,
          messages: messages.filter(m => ownServices.some(s => s.id === m.serviceId)) };
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a'); link.href = url; link.download = `aliado-mis-datos-${role}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}>Descargar mis datos de ejemplo</Button></details>
    {role === 'prestador' && <Button variant="ghost" disabled={deletionRequested} onClick={() => { if (window.confirm('¿Solicitar la eliminación de tu cuenta de ejemplo?')) requestDeletion(); }}>{deletionRequested ? 'Eliminación pendiente de revisión' : 'Solicitar eliminación de cuenta'}</Button>}
  </Card>;
}
