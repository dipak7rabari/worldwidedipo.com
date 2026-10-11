'use client';

import { useState } from 'react';

const initialForm = {
  name: '',
  slug: '',
  profession: '',
  headline: '',
  bio: '',
  location: '',
  phone: '',
  whatsapp: '',
  category: '',
  about: '',
};

export default function ProfileForm({
  profile = null,
  onSaved,
}) {
  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [errors, setErrors] =
    useState({});

  const isEditing = Boolean(profile?.id);
function getInitialForm(profile) {
  if (!profile) {
    return initialForm;
  }

  return {
    name: profile.name ?? '',
    slug: profile.slug ?? '',
    profession: profile.profession ?? '',
    headline: profile.headline ?? '',
    bio: profile.bio ?? '',
    location: profile.location ?? '',
    phone: profile.phone ?? '',
    whatsapp: profile.whatsapp ?? '',
    category: profile.category ?? '',
    about: profile.about ?? '',
  };
}

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));

    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      const endpoint = isEditing
        ? '/api/profile/update'
        : '/api/profile/create';

      const method = isEditing
        ? 'PATCH'
        : 'POST';

      const response = await fetch(
        endpoint,
        {
          method,
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(form),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        setErrors(
          result.errors || {},
        );

        setMessage(
          result.error ||
            'Please check your information.',
        );

        return;
      }

      setMessage(
        'Profile saved successfully.',
      );

      onSaved?.(result.profile);
    } catch {
      setMessage(
        'Network error. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="profile-form"
    >
      <section>
        <h2>Basic information</h2>

        <div className="grid">
          <Field
            label="Full name"
            value={form.name}
            onChange={(value) =>
              updateField('name', value)
            }
            error={errors.name}
            required
          />

          <Field
            label="DIPO URL"
            value={form.slug}
            onChange={(value) =>
              updateField(
                'slug',
                value.toLowerCase(),
              )
            }
            error={errors.slug}
            prefix="worldwidedipo.com/p/"
            required
          />

          <Field
            label="Profession"
            value={form.profession}
            onChange={(value) =>
              updateField(
                'profession',
                value,
              )
            }
            error={errors.profession}
            required
          />

          <Field
            label="Category"
            value={form.category}
            onChange={(value) =>
              updateField(
                'category',
                value,
              )
            }
          />

          <Field
            label="Headline"
            value={form.headline}
            onChange={(value) =>
              updateField(
                'headline',
                value,
              )
            }
          />

          <Field
            label="Location"
            value={form.location}
            onChange={(value) =>
              updateField(
                'location',
                value,
              )
            }
          />
        </div>

        <label className="field">
          <span>Short bio</span>

          <textarea
            value={form.bio}
            maxLength={250}
            rows={4}
            onChange={(event) =>
              updateField(
                'bio',
                event.target.value,
              )
            }
            placeholder="Tell people briefly about yourself."
          />

          <small>
            {form.bio.length}/250
          </small>

          {errors.bio ? (
            <em>{errors.bio}</em>
          ) : null}
        </label>

        <label className="field">
          <span>About</span>

          <textarea
            value={form.about}
            maxLength={3000}
            rows={7}
            onChange={(event) =>
              updateField(
                'about',
                event.target.value,
              )
            }
            placeholder="Add a detailed introduction."
          />
        </label>
      </section>

      <section>
        <h2>Contact</h2>

        <div className="grid">
          <Field
            label="Phone"
            value={form.phone}
            onChange={(value) =>
              updateField(
                'phone',
                value,
              )
            }
          />

          <Field
            label="WhatsApp"
            value={form.whatsapp}
            onChange={(value) =>
              updateField(
                'whatsapp',
                value,
              )
            }
          />
        </div>
      </section>

      {message ? (
        <div className="message">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? 'Saving...'
          : isEditing
            ? 'Save profile'
            : 'Create DIPO profile'}
      </button>

      <style jsx>{`
        .profile-form {
          display: grid;
          gap: 24px;
        }

        section {
          padding: 22px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #fff;
        }

        h2 {
          margin: 0 0 18px;
          color: #0f172a;
          font-size: 18px;
        }

        .grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .field {
          display: grid;
          gap: 7px;
          margin-top: 16px;
        }

        .field span {
          color: #334155;
          font-size: 13px;
          font-weight: 600;
        }

        input,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          padding: 11px 12px;
          outline: none;
          color: #0f172a;
          background: #fff;
          font: inherit;
        }

        textarea {
          resize: vertical;
        }

        input:focus,
        textarea:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px
            rgb(37 99 235 / 10%);
        }

        small {
          color: #94a3b8;
          font-size: 11px;
        }

        em {
          color: #b91c1c;
          font-size: 12px;
          font-style: normal;
        }

        .message {
          padding: 12px;
          border-radius: 9px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 13px;
        }

        button {
          min-height: 48px;
          border: 0;
          border-radius: 10px;
          background: #2563eb;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 700px) {
          .grid {
            grid-template-columns: 1fr;
          }

          section {
            padding: 17px;
          }
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  required = false,
  prefix,
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? ' *' : ''}
      </span>

      {prefix ? (
        <small className="prefix">
          {prefix}
        </small>
      ) : null}

      <input
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      {error ? (
        <em>{error}</em>
      ) : null}

      <style jsx>{`
        .field {
          display: grid;
          gap: 7px;
        }

        .field span {
          color: #334155;
          font-size: 13px;
          font-weight: 600;
        }

        .prefix {
          color: #64748b;
          font-size: 11px;
        }

        input {
          width: 100%;
          box-sizing: border-box;
          min-height: 44px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          padding: 10px 12px;
          outline: none;
          color: #0f172a;
          background: #fff;
          font: inherit;
        }

        input:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px
            rgb(37 99 235 / 10%);
        }

        em {
          color: #b91c1c;
          font-size: 12px;
          font-style: normal;
        }
      `}</style>
    </label>
  );
}