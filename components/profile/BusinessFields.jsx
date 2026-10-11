'use client';

export default function BusinessFields({
  value = {},
  onChange,
}) {
  function update(key, fieldValue) {
    onChange?.({
      ...value,
      [key]: fieldValue,
    });
  }

  return (
    <section className="business-fields">
      <h2>Business information</h2>

      <label>
        <span>Business name</span>

        <input
          value={value.businessName ?? ''}
          onChange={(event) =>
            update(
              'businessName',
              event.target.value,
            )
          }
          placeholder="Your shop or business name"
        />
      </label>

      <label>
        <span>Business description</span>

        <textarea
          value={value.description ?? ''}
          rows={5}
          onChange={(event) =>
            update(
              'description',
              event.target.value,
            )
          }
          placeholder="Describe your business."
        />
      </label>

      <style jsx>{`
        .business-fields {
          display: grid;
          gap: 16px;
        }

        h2 {
          margin: 0;
          color: #0f172a;
          font-size: 18px;
        }

        label {
          display: grid;
          gap: 7px;
        }

        span {
          color: #334155;
          font-size: 13px;
          font-weight: 600;
        }

        input,
        textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          outline: none;
          font: inherit;
        }

        input {
          min-height: 44px;
        }

        textarea {
          resize: vertical;
        }

        input:focus,
        textarea:focus {
          border-color: #2563eb;
        }
      `}</style>
    </section>
  );
}