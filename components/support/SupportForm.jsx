'use client';

import { useState } from 'react';
import { SUPPORT_CATEGORIES } from '@/lib/support/support-validation';

export default function SupportForm() {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          category,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit request.');
      }

      setSubject('');
      setMessage('');
      setCategory('general');

      setResult({
        type: 'success',
        message: 'Support request submitted successfully.',
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="dipo-support-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="support-category">Category</label>

        <select
          id="support-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          disabled={loading}
        >
          {SUPPORT_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="support-subject">Subject</label>

        <input
          id="support-subject"
          type="text"
          maxLength={120}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="What do you need help with?"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="support-message">Message</label>

        <textarea
          id="support-message"
          maxLength={5000}
          rows={7}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Describe your issue or question..."
          required
          disabled={loading}
        />
      </div>

      {result && (
        <div
          className={`dipo-support-result dipo-support-result-${result.type}`}
          role="status"
        >
          {result.message}
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit Support Request'}
      </button>
    </form>
  );
}