export default function LegalHeader({
  eyebrow = 'WORLDWIDE DIPO',
  title,
  description,
}) {
  return (
    <header className="dipo-legal-header">
      <p className="dipo-eyebrow">{eyebrow}</p>

      <h1>{title}</h1>

      {description && <p>{description}</p>}
    </header>
  );
}