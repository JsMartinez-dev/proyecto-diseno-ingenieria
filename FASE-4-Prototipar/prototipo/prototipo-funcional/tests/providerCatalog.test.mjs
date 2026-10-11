import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/store/providerCatalog.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { migrateProvider } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const categories = [{ id: 'plumbing', name: 'Plomería' }, { id: 'maintenance', name: 'Mantenimiento' }];
const legacy = { id: 'prov-1', specialty: 'Plomería', services: ['Plomería', 'Reparación de fugas', 'Instalación de grifería', 'Mantenimiento'], bio: 'Mi perfil guardado' };
test('saved mixed lists split into categories and concrete offerings without losing profile data', () => {
  const result = migrateProvider(legacy, categories);
  assert.deepEqual(result.categoryIds, ['plumbing', 'maintenance']);
  assert.deepEqual(result.offeredServices.map(s => s.name), ['Reparación de fugas', 'Instalación de grifería']);
  assert.ok(result.offeredServices.every(s => s.categoryId === 'plumbing'));
  assert.equal(result.bio, legacy.bio);
  assert.equal(result.services, undefined);
});
test('migration is idempotent and preserves user-created service IDs and category links', () => {
  const current = { ...migrateProvider(legacy, categories), offeredServices: [{ id: 'custom', name: 'Limpieza', description: 'Detalles propios', categoryId: 'maintenance' }] };
  assert.deepEqual(migrateProvider(current, categories), current);
});
