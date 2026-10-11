import {
  getPaymentPlan,
} from './payment-config';

export function getOfficialUpiId() {
  return (
    process.env.NEXT_PUBLIC_UPI_ID?.trim() || ''
  );
}

export function getPayeeName() {
  return (
    process.env.NEXT_PUBLIC_PAYEE_NAME?.trim() ||
    'Worldwide DIPO'
  );
}

export function createUpiPaymentUrl(plan) {
  const config = getPaymentPlan(plan);

  if (!config) {
    throw new Error(
      'Invalid payment plan.'
    );
  }

  const upiId = getOfficialUpiId();

  if (!upiId) {
    throw new Error(
      'Official UPI ID is not configured.'
    );
  }

  const payeeName = getPayeeName();

  const transactionNote =
    `Worldwide DIPO - ${config.name}`;

      if (!(Number(config.amount) > 0)) {
    throw new Error('Invalid payment amount.');
  }


  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: Number(config.amount).toFixed(2),
    cu: 'INR',
    tn: transactionNote.slice(0, 80),
  });

  return `upi://pay?${params.toString()}`;
}
export function createUpiAppUrl(plan, app) {
  const url = createUpiPaymentUrl(plan);
  const query = url.split('?')[1];

  const schemes = {
    gpay: 'gpay://upi/pay?',
    phonepe: 'phonepe://pay?',
    paytm: 'paytmmp://pay?',
  };

  return schemes[app] ? schemes[app] + query : url;
}
