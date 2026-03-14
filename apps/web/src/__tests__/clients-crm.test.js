import test from 'node:test';
import assert from 'node:assert/strict';
import { isCrmAllowed } from '../lib/auth.js';
import { searchAndFilterClients, seedClients, validateClientInput } from '../lib/clients-crm.js';

test('validateClientInput requires first/last/contact path', () => {
  assert.equal(validateClientInput({ firstName: '', lastName: 'B', email: '', phone: '' }), 'First name is required.');
  assert.equal(validateClientInput({ firstName: 'A', lastName: '', email: '', phone: '' }), 'Last name is required.');
  assert.equal(validateClientInput({ firstName: 'A', lastName: 'B', email: '', phone: '' }), 'At least one contact path (email or phone) is required.');
  assert.equal(validateClientInput({ firstName: 'A', lastName: 'B', email: 'a@b.com', phone: '' }), null);
});

test('search/filter foundation works', () => {
  const filtered = searchAndFilterClients(seedClients, 'wong', 'inactive');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'cl-003');
});

test('server-aware auth gate foundation role logic', () => {
  assert.equal(isCrmAllowed('owner'), true);
  assert.equal(isCrmAllowed('admin'), true);
  assert.equal(isCrmAllowed('contributor'), true);
  assert.equal(isCrmAllowed('client'), false);
});
