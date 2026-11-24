import NotFoundView from "@/components/layout/NotFoundView";

export default function ProductNotFound() {
  return (
    <NotFoundView
      title="We couldn't find that product."
      text="It may have been renamed or removed from the catalogue. Have a look at the full range, or ask us for the model."
      primary={{ href: "/products", label: "Browse all products" }}
    />
  );
}
