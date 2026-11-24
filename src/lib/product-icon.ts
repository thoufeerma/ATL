import { Banknote, Droplets, Package, Printer, Receipt, Scale, ScanBarcode, Tag, type LucideIcon } from "lucide-react";

// Picks an icon that matches a product or category name, for products without a photo.
export function iconFor(text: string): LucideIcon {
  const t = text.toLowerCase();
  if (/barcode|scanner/.test(t)) return ScanBarcode;
  if (/print|label/.test(t)) return Printer;
  if (/scale|weigh|balance|platform|crane/.test(t)) return Scale;
  if (/bill|pos|touch|keypad|android|windows|cash|drawer/.test(t)) return Receipt;
  if (/count|currency|coin|note/.test(t)) return Banknote;
  if (/fill|liquid|milk|paste/.test(t)) return Droplets;
  if (/coder|inkjet|tag/.test(t)) return Tag;
  return Package;
}
