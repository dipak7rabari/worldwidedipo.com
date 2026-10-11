// app/dashboard/payment/layout.jsx

export const metadata = {
  title: 'Payment | Worldwide DIPO',
  description: 'Complete your Worldwide DIPO subscription payment.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentLayout({ children }) {
  return (
    <main className="min-h-screen bg-white">
      {children}
    </main>
  );
}