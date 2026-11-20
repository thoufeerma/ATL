import { WooCategory } from "./woocommerce-categories";
import { getCategoryRank } from "./category-order";
import { decodeEntities } from "./html";

export interface CategoryNode {
  title: string;
  slug: string;
  children?: CategoryNode[];
}

// Build a nested CategoryNode tree from a flat array of WooCategory items
export function buildCategoryTree(categories: WooCategory[]): CategoryNode[] {
  const categoryMap = new Map<number, CategoryNode & { id: number, parentId: number }>();
  
  // First pass: create node objects
  categories.forEach(cat => {
    // Skip the default "Uncategorized" category usually with slug "uncategorized"
    if (cat.slug === "uncategorized") return;

    categoryMap.set(cat.id, {
      id: cat.id,
      parentId: cat.parent,
      title: decodeEntities(cat.name),
      slug: cat.slug,
      children: []
    });
  });

  const tree: CategoryNode[] = [];

  // Second pass: build the hierarchy
  categoryMap.forEach(node => {
    if (node.parentId === 0) {
      tree.push(node);
    } else {
      const parent = categoryMap.get(node.parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      } else {
        // If parent is missing, treat as root (fallback)
        tree.push(node);
      }
    }
  });

  // Clean up empty children arrays to match the expected interface exactly
  const cleanEmptyChildren = (nodes: CategoryNode[]) => {
    nodes.forEach(node => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      } else if (node.children) {
        cleanEmptyChildren(node.children);
      }
    });
  };
  
  cleanEmptyChildren(tree);

  // Sort each level by the configured display order (see category-order.ts),
  // falling back to alphabetical for anything not configured.
  const sortLevel = (nodes: CategoryNode[], parentSlug: string) => {
    nodes.sort((a, b) => {
      const diff = getCategoryRank(parentSlug, a.slug) - getCategoryRank(parentSlug, b.slug);
      if (diff !== 0 && !Number.isNaN(diff)) return diff;
      return a.title.localeCompare(b.title);
    });
    nodes.forEach(node => {
      if (node.children) sortLevel(node.children, node.slug);
    });
  };

  sortLevel(tree, "root");

  return tree;
}

// Helper to get all descendant slugs for a given slug in the tree
export function getDescendantSlugs(categories: WooCategory[], targetSlug: string): string[] {
  const tree = buildCategoryTree(categories);
  let foundNode: CategoryNode | null = null;

  const findNode = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      if (node.slug === targetSlug) {
        foundNode = node;
        return;
      }
      if (node.children) {
        findNode(node.children);
      }
    }
  };

  findNode(tree);

  if (!foundNode) return [];

  const collectSlugs = (node: CategoryNode): string[] => {
    let slugs = [node.slug];
    if (node.children) {
      for (const child of node.children) {
        slugs = slugs.concat(collectSlugs(child));
      }
    }
    return slugs;
  };

  return Array.from(new Set(collectSlugs(foundNode)));
}

