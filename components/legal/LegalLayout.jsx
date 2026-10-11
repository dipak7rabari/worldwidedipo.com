import Link from 'next/link';
import LegalHeader from './LegalHeader';

export default function LegalLayout({
  children,
  title,
  description,
  eyebrow = 'WORLDWIDE DIPO',
}) {
  return (
    <main className="dipo-legal-page">
      <div className="dipo-legal-container">

        <div
          style={{
            paddingTop: '22px',
            marginBottom: '10px',
          }}
        >
          <Link
            href="/"
            className="dipo-page-back"
            aria-label="Go to Home"
          >
            <span
              className="dipo-page-back-arrow"
              aria-hidden="true"
            >
              ←
            </span>

            <span>Home</span>
          </Link>
        </div>

        <LegalHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="dipo-legal-content">
          {children}
        </div>
      </div>
    </main>
  );
}