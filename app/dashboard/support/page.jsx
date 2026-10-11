import SupportForm from '@/components/support/SupportForm';
import SupportRequestList from '@/components/support/SupportRequestList';
import { getSupportRequests } from '@/lib/support/get-support-requests';

export const metadata = {
  title: 'Support | Worldwide DIPO',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SupportPage() {
  const result = await getSupportRequests();

  return (
    <main className="dipo-dashboard-page">
      <section className="dipo-dashboard-section">
        <div className="dipo-dashboard-heading">
          <p className="dipo-eyebrow">DIPO SUPPORT</p>

          <h1>How can we help?</h1>

          <p>
            Ask a question or report an issue related to your Worldwide DIPO
            profile, payment, renewal, verification, or technical setup.
          </p>
        </div>

        <SupportForm />
      </section>

      <section className="dipo-dashboard-section">
        <div className="dipo-dashboard-heading">
          <h2>Your Support Requests</h2>

          <p>
            Check the status of your previous requests and replies from
            Worldwide DIPO Support.
          </p>
        </div>

        {!result.ok && (
          <div className="dipo-support-result dipo-support-result-error">
            {result.error}
          </div>
        )}

        <SupportRequestList requests={result.data} />
      </section>
    </main>
  );
}