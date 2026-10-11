'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './ProfileEditor.css';

import ProfileImages from './ProfileImages';
import ProfileBasicsEditor from './ProfileBasicsEditor';
import ProfileContentEditor from './ProfileContentEditor';
import SocialLinksEditor from './SocialLinksEditor';
import FieldArrayEditor from './FieldArrayEditor';

function normalizeInitialValue(value) {
  return Array.isArray(value)
    ? value
    : [];
}function normalizeLinkValue(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([, url]) => typeof url === 'string')
      .map(([label, url]) => ({ label, url }));
  }

  return [];
}


export default function ProfileEditor({
  profile,
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: profile.name || '',
    profession: profile.profession || '',
    headline: profile.headline || '',
    bio: profile.bio || '',
    location: profile.location || '',
    category: profile.category || '',
    about: profile.about || '',

    skills: normalizeInitialValue(
      profile.skills
    ),

    services: normalizeInitialValue(
      profile.services
    ),

    experience: normalizeInitialValue(
      profile.experience
    ),

    education: normalizeInitialValue(
      profile.education
    ),

    projects: normalizeInitialValue(
      profile.projects
    ),

    links: normalizeLinkValue(
      profile.links
    ),

    social_links: normalizeLinkValue(
      profile.social_links
    ),
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));

    setSaved(false);
  }

  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setErrors({});

    try {
      const response = await fetch(
        '/api/profile/update',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setErrors(
          result.errors || {
            form:
              result.error ||
              'Unable to save profile.',
          }
        );

        return;
      }

      setForm((current) => ({
  ...current,

  links: normalizeLinkValue(
    result.profile?.links,
  ),

  social_links: normalizeLinkValue(
    result.profile?.social_links,
  ),
}));


      setSaved(true);

      router.refresh();
    } catch {
      setErrors({
        form:
          'Network error. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-editor-layout">
      <form
        onSubmit={handleSave}
        className="profile-editor-form"
      >
        <ProfileBasicsEditor
          form={form}
          profile={profile}
          errors={errors}
          onChange={updateField}
        />

        <section className="profile-editor-card">
          <div className="profile-editor-card-heading">
            <div>
              <p className="dashboard-eyebrow">
                Profile Content
              </p>

              <h2>Skills & Services</h2>
            </div>
          </div>

          <FieldArrayEditor
            label="Skills"
            value={form.skills}
            onChange={(value) =>
              updateField('skills', value)
            }
            placeholder="e.g. Web Design"
          />

          <FieldArrayEditor
            label="Services"
            value={form.services}
            onChange={(value) =>
              updateField('services', value)
            }
            placeholder="e.g. Website Development"
          />
        </section>

        <ProfileContentEditor
          form={form}
          onChange={updateField}
        />

        <SocialLinksEditor
          value={form.social_links}
          onChange={(value) =>
            updateField(
              'social_links',
              value
            )
          }
        />

        <section className="profile-editor-card">
          <div className="profile-editor-card-heading">
            <div>
              <p className="dashboard-eyebrow">
                External Links
              </p>

              <h2>Projects, Websites & Links</h2>
            </div>
          </div>

          <FieldArrayEditor
            label="External Links"
            value={form.links}
            onChange={(value) =>
              updateField('links', value)
            }
            linkMode
            placeholder="https://example.com"
          />
        </section>

        {profile.status !== 'pending' && (
          <section className="profile-editor-card">
            <div className="profile-editor-card-heading">
              <div>
                <p className="dashboard-eyebrow">
                  Media
                </p>

                <h2>Profile Images</h2>
              </div>
            </div>

            <ProfileImages
              profile={profile}
            />
          </section>
        )}

        {profile.status === 'pending' && (
          <div className="profile-editor-notice">
            <strong>
              Profile changes are partially locked
            </strong>

            <p>
              Your payment is currently under review.
              Identity-critical information remains
              locked until the review is complete.
            </p>
          </div>
        )}

        {errors.form && (
          <div
            className="profile-form-error"
            role="alert"
          >
            {errors.form}
          </div>
        )}

        {saved && (
          <div
            className="profile-editor-success"
            role="status"
          >
            ✓ Profile saved successfully.
          </div>
        )}

        <div className="profile-editor-save-bar">
          <button
            type="submit"
            className="dashboard-action-primary"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}