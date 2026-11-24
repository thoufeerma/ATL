// Brochures and other files kept in this repo, for products whose files aren't in WordPress.
//
// Put the file in public/brochures/ and add an entry keyed by the product's SKU (or its URL
// slug). `file` is the path under public/; `name` is optional (it falls back to the file name).
//
// Example:
//   "ATL-FL-AUTOMA-SEMI-AUTOMATIC-CAN-SEALING-MACHINE": [
//     { name: "Product brochure", file: "/brochures/can-sealing-machine.pdf" },
//     { name: "User manual", file: "/brochures/can-sealing-machine-manual.pdf" },
//   ],
export const LOCAL_BROCHURES: Record<string, { name?: string; file: string }[]> = {};
