import { Fragment } from "react";

// Word-by-word blur-in for headlines, done in CSS so the words appear even before
// JavaScript loads. Words stay real text for screen readers and search engines.
export default function BlurText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="inline-block animate-blur-in" style={{ animationDelay: `${delay + i * stagger}s` }}>
            {w}
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
