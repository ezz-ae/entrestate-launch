import assert from 'node:assert/strict';
import { INVENTORY_FIXTURE } from './inventory-fixture';
import { filterProjects, paginateProjects } from './inventory-utils';

function requireNonEmpty<T>(items: T[], message: string) {
  if (!items.length) {
    throw new Error(message);
  }
}

function run() {
  const dubaiProjects = filterProjects(INVENTORY_FIXTURE, { city: 'Dubai' });
  requireNonEmpty(dubaiProjects, 'Expected to find Dubai projects in the inventory catalog');
  dubaiProjects.forEach((project) => {
    assert.equal(project.location?.city, 'Dubai', 'City filter should scope results to Dubai');
  });

  const emeraldQuery = filterProjects(INVENTORY_FIXTURE, { query: 'emerald' });
  requireNonEmpty(emeraldQuery, 'Search query "emerald" should return at least one project');
  assert.equal(emeraldQuery[0].id, 'emerald-vista', 'Query should match developer/title text');

  const rangedProjects = filterProjects(INVENTORY_FIXTURE, { minPrice: 2000000, maxPrice: 2800000 });
  requireNonEmpty(rangedProjects, 'Price bounded search should return projects');
  rangedProjects.forEach((project) => {
    const priceFrom = project.price?.from ?? project.price?.value ?? 0;
    assert.ok(priceFrom >= 2000000, 'Min price filter should exclude cheaper assets');
    assert.ok(priceFrom <= 2800000, 'Max price filter should exclude expensive assets');
  });

  const pagination = paginateProjects(INVENTORY_FIXTURE, 2, 2);
  assert.equal(pagination.meta.page, 2);
  assert.equal(pagination.meta.pageSize, 2);
  assert.equal(pagination.meta.total, INVENTORY_FIXTURE.length);

  const safetyPagination = paginateProjects(INVENTORY_FIXTURE, -1, 0);
  assert.equal(safetyPagination.meta.page, 1, 'Page should clamp to 1');
  assert.equal(safetyPagination.meta.pageSize, 1, 'Limit should clamp to 1');
  assert.equal(safetyPagination.pageItems.length, 1, 'Safe pagination should still return data');

  console.log('✅ Inventory project smoke checks passed');
}

run();
