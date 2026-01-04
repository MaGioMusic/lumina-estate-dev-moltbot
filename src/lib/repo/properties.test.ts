import assert from 'node:assert/strict';
import test from 'node:test';
import { PropertyStatus, PropertyType, TransactionType } from '@prisma/client';
import { __test } from './properties';

test('buildWhere applies filters and search safely', () => {
  const where = __test.buildWhere({
    city: 'Tbilisi',
    district: 'Vake',
    propertyType: PropertyType.apartment,
    transactionType: TransactionType.sale,
    priceMin: 100000,
    priceMax: 250000,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['balcony', 'parking'],
    search: 'river view',
  });

  assert.equal(where.status, PropertyStatus.active);
  assert.deepEqual(where.city, { equals: 'Tbilisi', mode: 'insensitive' });
  assert.deepEqual(where.district, { equals: 'Vake', mode: 'insensitive' });
  assert.deepEqual(where.price, { gte: 100000, lte: 250000 });
  assert.deepEqual(where.bedrooms, { gte: 2 });
  assert.deepEqual(where.bathrooms, { gte: 2 });
  assert.deepEqual(where.amenities, { hasEvery: ['balcony', 'parking'] });
  assert.ok(Array.isArray(where.OR));
  assert.equal(where.OR?.length, 4);
});

test('buildWhere handles empty and trimmed search', () => {
  const where = __test.buildWhere({ search: '   ' });
  assert.equal(where.status, PropertyStatus.active);
  assert.equal(where.OR, undefined);
});

test('buildOrderBy preserves deterministic ordering', () => {
  assert.deepEqual(__test.buildOrderBy('price', 'asc'), [
    { price: 'asc' },
    { createdAt: 'desc' },
  ]);

  assert.deepEqual(__test.buildOrderBy('views', 'desc'), [
    { viewsCount: 'desc' },
    { createdAt: 'desc' },
  ]);

  assert.deepEqual(__test.buildOrderBy(undefined, undefined), [{ createdAt: 'desc' }]);
});
