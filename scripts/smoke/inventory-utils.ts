import type { InventoryProject } from "./inventory-fixture"

type FilterOptions = {
  city?: string
  query?: string
  minPrice?: number
  maxPrice?: number
}

export function filterProjects(projects: InventoryProject[], options: FilterOptions) {
  return projects.filter((project) => {
    if (options.city && project.location?.city !== options.city) {
      return false
    }

    if (options.query) {
      const haystack = `${project.title} ${project.developer} ${project.location?.area ?? ""}`.toLowerCase()
      if (!haystack.includes(options.query.toLowerCase())) {
        return false
      }
    }

    const priceFrom = project.price?.from ?? project.price?.value ?? 0

    if (typeof options.minPrice === "number" && priceFrom < options.minPrice) {
      return false
    }

    if (typeof options.maxPrice === "number" && priceFrom > options.maxPrice) {
      return false
    }

    return true
  })
}

export function paginateProjects(projects: InventoryProject[], page = 1, pageSize = 10) {
  const safePage = Math.max(1, page)
  const safePageSize = Math.max(1, pageSize)
  const start = (safePage - 1) * safePageSize

  return {
    pageItems: projects.slice(start, start + safePageSize),
    meta: {
      page: safePage,
      pageSize: safePageSize,
      total: projects.length,
    },
  }
}
