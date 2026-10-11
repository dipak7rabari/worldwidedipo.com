import FieldArrayEditor from './FieldArrayEditor';

const SOCIAL_EXAMPLES = [
  'Instagram',
  'YouTube',
  'LinkedIn',
  'Facebook',
  'X',
];

export default function SocialLinksEditor({
  value,
  onChange,
}) {
  return (
    <section className="profile-editor-card">
      <div className="profile-editor-card-heading">
        <div>
          <p className="dashboard-eyebrow">
            Social Identity
          </p>

          <h2>Social Profiles</h2>
        </div>
      </div>

      <p className="profile-editor-description">
        Apne public social profiles ke links add
        karein.
      </p>

      <div className="profile-social-examples">
        {SOCIAL_EXAMPLES.map((item) => (
          <span key={item}>
            {item}
          </span>
        ))}
      </div>

      <FieldArrayEditor
        label="Social Links"
        value={value}
        onChange={onChange}
        linkMode
        placeholder="https://..."
      />
    </section>
  );
}