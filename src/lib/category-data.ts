export interface CategoryNode {
  title: string;
  slug: string;
  children?: CategoryNode[];
}

export const categoryTree: CategoryNode[] = [
  {
    title: "Weighing Scale",
    slug: "weighing-scale",
    children: [
      {
        title: "Retail Scales",
        slug: "retail-scales",
        children: [
          { title: "Table Top Front &Back Scales", slug: "table-top-front-back-scales" },
          { title: "Table Top Scale with Pole", slug: "table-top-scale-with-pole" },
          { title: "Price Computing Scales", slug: "price-computing-scales" }
        ]
      },
      {
        title: "Portable Scales",
        slug: "portable-scales",
        children: [
          { title: "Portable/Chicken Weighing Scale", slug: "portable-chicken-weighing-scale" }
        ]
      },
      {
        title: "Platform Scales",
        slug: "platform-scales",
        children: [
          { title: "Platform Weighing Scale", slug: "platform-weighing-scale" },
          { title: "ATL PF MS", slug: "atl-pf-ms" }
        ]
      },
      {
        title: "Hanging Scales",
        slug: "hanging-scales",
        children: [
          { title: "Hanging Scales", slug: "hanging-scales" } // Note: Using actual names as slugs for simplicity, if WC has duplicates it might append -1 etc. Assuming exact match for now.
        ]
      },
      {
        title: "Jewellery Scales",
        slug: "jewellery-scales",
        children: [
          { title: "Jewellery Scales", slug: "jewellery-scales" },
          { title: "Analytical Balance", slug: "analytical-balance" }
        ]
      },
      {
        title: "Personal Weighing",
        slug: "personal-weighing",
        children: [
          { title: "Baby Weighing Scale", slug: "baby-weighing-scale" },
          { title: "Personal Scales", slug: "personal-scales" },
          { title: "Hanging Scales", slug: "hanging-scales" }
        ]
      },
      {
        title: "Lab & Analytical Scales",
        slug: "lab-analytical-scales",
        children: [
          { title: "Analytical Balance", slug: "analytical-balance" },
          { title: "Jewellery Scales", slug: "jewellery-scales" },
          { title: "Table Top Front &Back Scales", slug: "table-top-front-back-scales" }
        ]
      },
      {
        title: "Industrial Scales",
        slug: "industrial-scales",
        children: [
          { title: "Table Top Front &Back Scales", slug: "table-top-front-back-scales" },
          { title: "Platform Weighing Scale", slug: "platform-weighing-scale" }
        ]
      }
    ]
  },
  {
    title: "Billing Solutions",
    slug: "billing-solutions",
    children: [
      {
        title: "Keypad Billing Machines",
        slug: "keypad-billing-machines",
        children: [
          { title: "Billing Machine", slug: "billing-machine" }
        ]
      },
      {
        title: "Android Touch Billing",
        slug: "android-touch-billing",
        children: [
          { title: "Android Billing Devices", slug: "android-billing-devices" }
        ]
      },
      {
        title: "Windows Touch Billing",
        slug: "windows-touch-billing",
        children: [
          { title: "Touch POS Systems", slug: "touch-pos-systems" }
        ]
      },
      {
        title: "POS Printers",
        slug: "pos-printers",
        children: [
          { title: "Thermal Printer", slug: "thermal-printer" },
          { title: "Android Billing Devices", slug: "android-billing-devices" }
        ]
      },
      {
        title: "Label Printers",
        slug: "label-printers",
        children: [
          { title: "Label Printer", slug: "label-printer" },
          { title: "Thermal Printer", slug: "thermal-printer" },
          { title: "Android Billing Devices", slug: "android-billing-devices" }
        ]
      },
      {
        title: "Barcode Scanners",
        slug: "barcode-scanners",
        children: [
          { title: "Barcode Scanner", slug: "barcode-scanner" }
        ]
      },
      {
        title: "Accessories",
        slug: "accessories",
        children: [
          { title: "Cloud", slug: "cloud" },
          { title: "Cash Drawer", slug: "cash-drawer" },
          { title: "General", slug: "general" }
        ]
      }
    ]
  }
];

// Helper to get all descendant slugs for a given slug in the tree
export function getDescendantSlugs(targetSlug: string): string[] {
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

  findNode(categoryTree);

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
