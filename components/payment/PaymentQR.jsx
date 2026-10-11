'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function PaymentQR({
  value,
  amount,
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
      <p className="mb-3 text-sm font-medium text-gray-700">
        Scan to Pay
      </p>

      <div className="mx-auto flex w-fit items-center justify-center rounded-xl border border-gray-100 bg-white p-3">
        <QRCodeSVG
          value={value}
          size={240}
          level="M"
          marginSize={4}
          title={`Worldwide DIPO payment QR for ₹${amount}`}
        />
      </div>

      <p className="mt-4 text-lg font-semibold text-gray-900">
        ₹{amount}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Your UPI app may show the payment amount before
        confirmation.
      </p>
    </div>
  );
}