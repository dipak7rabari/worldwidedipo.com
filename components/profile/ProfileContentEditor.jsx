import FieldArrayEditor from './FieldArrayEditor';

export default function ProfileContentEditor({
  form,
  onChange,
}) {
  return (
    <section className="profile-editor-card">
      <div className="profile-editor-card-heading">
        <div>
          <p className="dashboard-eyebrow">
            Experience
          </p>

          <h2>Professional Information</h2>
        </div>
      </div>

      <FieldArrayEditor
        label="Experience"
        value={form.experience}
        onChange={(value) =>
          onChange(
            'experience',
            value
          )
        }
        placeholder="e.g. 3 years at ABC Company"
      />

      <FieldArrayEditor
        label="Education"
        value={form.education}
        onChange={(value) =>
          onChange(
            'education',
            value
          )
        }
        placeholder="e.g. B.Com — XYZ College"
      />

      <FieldArrayEditor
        label="Projects"
        value={form.projects}
        onChange={(value) =>
          onChange(
            'projects',
            value
          )
        }
        placeholder="e.g. Built an ecommerce website"
      />
    </section>
  );
}