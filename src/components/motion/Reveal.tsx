// Fades, lifts and un-blurs its children as they scroll into view (see `.reveal` in globals.css).
// Pure CSS: the content is always rendered visible, so nothing depends on JavaScript loading.
export default function Reveal({
  children,
  className,
  delay = 0,
  as: Comp = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger, in seconds-ish: each 0.1 starts the reveal 40px later in the scroll. */
  delay?: number;
  as?: "div" | "li" | "section" | "span";
}) {
  return (
    <Comp
      className={`reveal ${className ?? ""}`}
      style={delay ? ({ "--reveal-offset": `${Math.round(delay * 400)}px` } as React.CSSProperties) : undefined}
    >
      {children}
    </Comp>
  );
}
