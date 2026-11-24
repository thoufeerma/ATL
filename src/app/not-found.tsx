import NotFoundView from "@/components/layout/NotFoundView";

export default function NotFound() {
  return (
    <NotFoundView
      title="This page has moved or never existed."
      text="The link may be old. Browse the catalogue, or tell us what you need and we'll point you to it."
      primary={{ href: "/products", label: "Browse products" }}
    />
  );
}
