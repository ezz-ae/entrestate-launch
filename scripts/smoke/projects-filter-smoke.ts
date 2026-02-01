import assert from 'node:assert/strict';
import { filterProjects, paginateProjects } from '../../src/lib/projects/filter.ts';
import { ENTRESTATE_INVENTORY } from '../../src/data/entrestate-inventory.ts';

function requireNonEmpty<T>(items: T[], message: string) {
  if (!items.length) {
    throw new Error(message);
  }
}

function run() {
  const dubaiProjects = filterProjects(ENTRESTATE_INVENTORY, { city: 'Dubai' });
  requireNonEmpty(dubaiProjects, 'Expected to find Dubai projects in the Entrestate catalog');
  dubaiProjects.forEach((project) => {
    if (project.location) {
      assert.equal(project.location.city, 'Dubai', 'City filter should scope results to Dubai');
    }
  });

  const emeraldQuery = filterProjects(ENTRESTATE_INVENTORY, { query: 'emerald' });
  requireNonEmpty(emeraldQuery, 'Search query "emerald" should return at least one project');
  assert.equal(emeraldQuery[0].id, 'emerald-vista', 'Query should match developer/title text');

  const rangedProjects = filterProjects(ENTRESTATE_INVENTORY, { minPrice: 2000000, maxPrice: 2800000 });
  requireNonEmpty(rangedProjects, 'Price bounded search should return projects');
  rangedProjects.forEach((project) => {
    if (project.price && typeof project.price.from === 'number') {
      assert.ok(
        project.price.from >= 1000000 && project.price.from <= 2000000,
        'Price should be within the specified range'
      );
    }
  });

  const pagination = paginateProjects(ENTRESTATE_INVENTORY, 2, 2);
  assert.equal(pagination.meta.page, 2);
  assert.equal(pagination.meta.pageSize, 2);
  assert.equal(pagination.meta.total, ENTRESTATE_INVENTORY.length);

  const safetyPagination = paginateProjects(ENTRESTATE_INVENTORY, -1, 0);
  assert.equal(safetyPagination.meta.page, 1, 'Page should clamp to 1');
  assert.equal(safetyPagination.meta.pageSize, 1, 'Limit should clamp to 1');
  assert.equal(safetyPagination.pageItems.length, 1, 'Safe pagination should still return data');

  console.log('✅ Entrestate project smoke checks passed');
}

run();
