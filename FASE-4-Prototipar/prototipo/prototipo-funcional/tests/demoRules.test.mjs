import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/store/demoRules.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { validSlot, proposalFitsAgenda, canCoordinate, notificationEnabled, defaultPreferences, validAttachment } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('agenda rejects empty/reversed and overlapping slots, allows adjoining slots', () => {
 const slots = [{ id: 'a', date: '2026-10-20', start: '09:00', end: '12:00' }];
 assert.equal(validSlot({ date:'2026-10-20', start:'09:99', end:'10:00' }, slots), false);
 assert.equal(validSlot({ date:'', start:'09:00', end:'10:00' }, slots), false);
 assert.equal(validSlot({ date:'2026-10-20', start:'10:00', end:'10:00' }, slots), false);
 assert.equal(validSlot({ date:'2026-10-20', start:'11:00', end:'13:00' }, slots), false);
 assert.equal(validSlot({ date:'2026-10-20', start:'12:00', end:'13:00' }, slots), true);
 assert.equal(validSlot({ date:'2026-10-21', start:'09:00', end:'12:00' }, slots), true);
});
test('a proposal must fit the configured date and time, end is exclusive', () => {
 const slots = [{ date: '2026-10-20', start: '09:00', end: '12:00' }];
 assert.equal(proposalFitsAgenda('2026-10-20','09:00', slots), true);
 assert.equal(proposalFitsAgenda('2026-10-20','12:00', slots), false);
 assert.equal(proposalFitsAgenda('2026-10-21','09:00', slots), false);
 assert.equal(proposalFitsAgenda('2026-10-20','09:00', []), true);
});
test('coordination is private to participants and closes on finalization/cancellation', () => {
 const service = { clientId:'client-1', providerId:'prov-1', stage:'CONTRATADO' };
 assert.equal(canCoordinate(service, 'cliente'), true);
 assert.equal(canCoordinate(service, 'prestador'), true);
 assert.equal(canCoordinate(service, 'admin'), false);
 assert.equal(canCoordinate(service, null), false);
 assert.equal(canCoordinate({ ...service, clientId:'other' }, 'cliente'), false);
 assert.equal(canCoordinate({ ...service, providerId:'other' }, 'prestador'), false);
 for (const stage of ['FINALIZADO','CANCELADO']) assert.equal(canCoordinate({ ...service, stage }, 'cliente'), false);
});
test('optional notifications honour preferences and mandatory events stay enabled', () => {
 const preferences = { ...defaultPreferences, opportunities:false, proposals:false };
 assert.equal(notificationEnabled(preferences, 'oportunidad'), false);
 assert.equal(notificationEnabled(preferences, 'propuesta'), false);
 for (const type of ['aceptada','estado']) assert.equal(notificationEnabled(preferences,type), true);
});
test('attachments enforce content type, size, and portfolio image restriction', () => {
 assert.equal(validAttachment({size:100,type:'image/png'}, true), true);
 assert.equal(validAttachment({size:100,type:'application/pdf'}), true);
 assert.equal(validAttachment({size:100,type:'application/pdf'}, true), false);
 assert.equal(validAttachment({size:100,type:'image/svg+xml'}), false);
 assert.equal(validAttachment({size:256001,type:'image/jpeg'}), false);
 assert.equal(validAttachment({size:0,type:'image/jpeg'}), false);
});
