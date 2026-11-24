import Link from "next/link";

// Link whose label rolls up on hover: the text slides out the top while a copy slides in from below.
export default function RollLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string;
  children: string;
  className?: string;
  external?: boolean;
}) {
  const inner = (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/roll:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/roll:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
  const cls = `group/roll inline-block ${className ?? ""}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
