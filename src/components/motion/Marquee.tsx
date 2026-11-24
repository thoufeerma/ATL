// Infinite horizontal strip: the content is rendered twice and slid by half its width.
// Pure CSS, so it works in server components; pauses on hover and for reduced motion.
export default function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`group/marquee flex overflow-hidden mask-fade-x ${className ?? ""}`}>
      <div
        className="flex w-max shrink-0 animate-marquee group-hover/marquee:[animation-play-state:paused]"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
