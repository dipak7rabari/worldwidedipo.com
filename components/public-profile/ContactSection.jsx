export default function ContactSection({
  profile,
}) {
  const phone =
    typeof profile?.phone ===
    'string'
      ? profile.phone.trim()
      : '';

  const whatsapp =
    typeof profile?.whatsapp ===
    'string'
      ? profile.whatsapp.trim()
      : '';

  const hasContact =
    Boolean(phone || whatsapp);

  if (!hasContact) {
    return null;
  }

  return (
    <section className="public-profile-section">
      <div className="public-profile-section-heading">
        <p>Contact</p>

        <h2>
          Get in Touch
        </h2>
      </div>

      <div className="public-profile-contact-list">
        {phone && (
          <a
            href={`tel:${encodeURIComponent(
              phone
            )}`}
            className="public-profile-contact-item"
          >
            <span>
              Call
            </span>

            <strong>
              {phone}
            </strong>
          </a>
        )}

        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(
              /[^\d]/g,
              ''
            )}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="public-profile-contact-item"
          >
            <span>
              WhatsApp
            </span>

            <strong>
              Message on WhatsApp
            </strong>
          </a>
        )}
      </div>
    </section>
  );
}