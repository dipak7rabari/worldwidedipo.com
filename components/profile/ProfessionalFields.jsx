'use client';

export default function ProfessionalFields({
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
    <section className="professional-fields">
      <h2>Professional identity</h2>

      <label>
        <span>Skills</span>

        <input
          value={
            Array.isArray(value.skills)
              ? value.skills.join(', ')
              : ''
          }
          onChange={(event) => {
            const skills =
              event.target.value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);

            update('skills', skills);
          }}
          placeholder="e.g. Web Design, Coding, Marketing"
        />
      </label>

      <label>
        <span>Services</span>

        <input
          value={
            Array.isArray(value.services)
              ? value.services.join(', ')
              : ''
          }
          onChange={(event) => {
            const services =
              event.target.value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);

            update(
              'services',
              services,
            );
          }}
          placeholder="e.g. Web Development, Consulting"
        />
      </label>

      <style jsx>{`
        .professional-fields {
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

        input {
          min-height: 44px;
          box-sizing: border-box;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          outline: none;
          font: inherit;
        }

        input:focus {
          border-color: #2563eb;
        }
      `}</style>
    </section>
  );
}