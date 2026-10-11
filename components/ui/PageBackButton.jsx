import Link from "next/link";

export default function PageBackButton({
  href = "/",
  label = "Home",
  className = "",
}) {
  return (
    <Link
      href={href}
      className={`dipo-page-back ${className}`.trim()}
      aria-label={`Go to ${label}`}
    >
      <span className="dipo-page-back-arrow" aria-hidden="true">
        ←
      </span>

      <span>{label}</span>
    </Link>
  );
}