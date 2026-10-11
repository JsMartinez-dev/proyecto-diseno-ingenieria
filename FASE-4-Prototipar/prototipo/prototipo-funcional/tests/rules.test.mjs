import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/store/rules.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { isCompatible: match, nextStage, canCancel, canAccept } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const catalog = [{ id: 'cat-2', name: 'Plomería', active: true }, { id: 'cat-4', name: 'Pintura', active: true }];
const isCompatible = (request, provider, categories = catalog, zones) => match(request, provider, categories, zones);
const provider = { available: true, specialty: 'Plomería', categoryIds: ['cat-2'], offeredServices: [], zones: ['Centro'] };
const request = { status: 'PUBLICADA', category: 'Plomería', zone: 'Centro', preferredDate: 'Flexible', preferredTime: 'Flexible', clientId: 'client-1', proposals: [{ id: 'p1', status: 'pendiente' }] };
const service = { clientId: 'client-1', providerId: 'prov-1', stage: 'CONTRATADO' };
test('matching requires category, zone, availability, open status and unsuspended profile', () => {
  assert.equal(isCompatible(request, provider), true);
  assert.equal(isCompatible(request, provider, [{ id: 'cat-2', name: 'Plomería', active: false }]), false);
  assert.equal(isCompatible(request, provider, undefined, [{ name: 'Centro', active: false }]), false);
  for (const patch of [{ category: 'Pintura' }, { zone: 'Gaira' }, { status: 'BORRADOR' }, { status: 'CONTRATADA' }, { preferredTime: '' }]) assert.equal(isCompatible({ ...request, ...patch }, provider), false);
  for (const patch of [{ available: false }, { suspended: true }]) assert.equal(isCompatible(request, { ...provider, ...patch }), false);
});
test('provider starts and finishes; only client confirms closure', () => {
  assert.equal(nextStage(service, 'cliente'), null);
  assert.equal(nextStage(service, 'prestador'), 'EN_PROCESO');
  assert.equal(nextStage({ ...service, stage: 'EN_PROCESO' }, 'prestador'), 'TERMINADO');
  assert.equal(nextStage({ ...service, stage: 'TERMINADO' }, 'prestador'), null);
  assert.equal(nextStage({ ...service, stage: 'TERMINADO' }, 'cliente'), 'FINALIZADO');
  for (const role of ['cliente', 'prestador', 'admin', null]) for (const stage of ['FINALIZADO', 'CANCELADO']) assert.equal(nextStage({ ...service, stage }, role), null);
});
test('unauthorized participants cannot transition or cancel', () => {
  assert.equal(nextStage({ ...service, providerId: 'other' }, 'prestador'), null);
  assert.equal(nextStage({ ...service, stage: 'TERMINADO', clientId: 'other' }, 'cliente'), null);
  assert.equal(canCancel(service, 'admin'), false);
  assert.equal(canCancel(service, 'cliente'), true);
  assert.equal(canCancel({ ...service, stage: 'FINALIZADO' }, 'cliente'), false);
  assert.equal(canCancel({ ...service, stage: 'CANCELADO' }, 'prestador'), false);
});
test('only owner can accept active proposals once', () => {
  assert.equal(canAccept(request, 'p1', 'cliente'), true);
  assert.equal(canAccept(request, 'p1', 'prestador'), false);
  assert.equal(canAccept({ ...request, clientId: 'other' }, 'p1', 'cliente'), false);
  assert.equal(canAccept({ ...request, serviceId: 's1' }, 'p1', 'cliente'), false);
  assert.equal(canAccept({ ...request, status: 'CANCELADA' }, 'p1', 'cliente'), false);
  assert.equal(canAccept(request, 'missing', 'cliente'), false);
});

test('matching uses category IDs, never the name of a custom service or stale specialty', () => {
  assert.equal(isCompatible({ ...request, category: 'Pintura' }, { ...provider, offeredServices: [{ name: 'Pintura', categoryId: 'cat-2' }] }), false);
  assert.equal(isCompatible(request, { ...provider, categoryIds: ['cat-4'] }), false);
});
