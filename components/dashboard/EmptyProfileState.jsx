import Link from 'next/link';

export default function EmptyProfileState() {
  return (
    <section className="dashboard-empty-card">
      <div className="dashboard-empty-icon">
        ✦
      </div>

      <p className="dashboard-eyebrow">
        Welcome to Worldwide DIPO
      </p>

      <h1>
        Create your Personal Digital Identity
      </h1>

      <p>
        Aapka kaam chhota ho sakta hai, par aapki
        digital pehchan chhoti nahi honi chahiye.
      </p>

      <Link
        href="/onboarding"
        className="dashboard-action-primary"
      >
        Start Profile Setup
      </Link>
    </section>
  );
}