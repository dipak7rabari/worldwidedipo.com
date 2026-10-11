export default function ProfileBasicsEditor({
  form,
  profile,
  errors,
  onChange,
}) {
  const pending =
    profile?.status === 'pending';

  return (
    <section className="profile-editor-card">
      <div className="profile-editor-card-heading">
        <div>
          <p className="dashboard-eyebrow">
            Identity
          </p>

          <h2>Basic Information</h2>
        </div>

        <span className="profile-editor-status">
          {profile?.status}
        </span>
      </div>

      <label className="profile-editor-field">
        <span>Full Name *</span>

        <input
          type="text"
          value={form.name}
          onChange={(event) =>
            onChange(
              'name',
              event.target.value
            )
          }
          maxLength={60}
          disabled={pending}
        />

        {errors.name && (
          <small>{errors.name}</small>
        )}
      </label>

      <label className="profile-editor-field">
        <span>Profession *</span>

        <input
          type="text"
          value={form.profession}
          onChange={(event) =>
            onChange(
              'profession',
              event.target.value
            )
          }
          maxLength={60}
          disabled={pending}
        />

        {errors.profession && (
          <small>{errors.profession}</small>
        )}
      </label>

      <div className="profile-editor-locked-field">
        <span>Profile URL</span>

        <code>
          worldwidedipo.com/p/{profile?.slug}
        </code>

        <small>
          Profile URLs are kept stable after creation.
        </small>
      </div>

      <label className="profile-editor-field">
        <span>Headline</span>

        <input
          type="text"
          value={form.headline}
          onChange={(event) =>
            onChange(
              'headline',
              event.target.value
            )
          }
          maxLength={120}
        />

        {errors.headline && (
          <small>{errors.headline}</small>
        )}
      </label>

      <label className="profile-editor-field">
        <span>Short Bio</span>

        <textarea
          value={form.bio}
          onChange={(event) =>
            onChange(
              'bio',
              event.target.value
            )
          }
          maxLength={250}
          rows={4}
        />

        {errors.bio && (
          <small>{errors.bio}</small>
        )}
      </label>

      <div className="profile-editor-two-column">
        <label className="profile-editor-field">
          <span>Location</span>

          <input
            type="text"
            value={form.location}
            onChange={(event) =>
              onChange(
                'location',
                event.target.value
              )
            }
            maxLength={120}
          />

          {errors.location && (
            <small>{errors.location}</small>
          )}
        </label>

        <label className="profile-editor-field">
          <span>Category</span>

          <input
            type="text"
            value={form.category}
            onChange={(event) =>
              onChange(
                'category',
                event.target.value
              )
            }
            maxLength={80}
          />

          {errors.category && (
            <small>{errors.category}</small>
          )}
        </label>
      </div>

      <label className="profile-editor-field">
        <span>About</span>

        <textarea
          value={form.about}
          onChange={(event) =>
            onChange(
              'about',
              event.target.value
            )
          }
          maxLength={3000}
          rows={8}
        />

        {errors.about && (
          <small>{errors.about}</small>
        )}
      </label>
    </section>
  );
}