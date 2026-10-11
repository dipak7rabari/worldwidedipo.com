export default function ProfileHeader({
  profile,
}) {
  const name =
    profile?.name?.trim() ||
    'Worldwide DIPO User';

  const profession =
    profile?.profession?.trim() ||
    '';

  const headline =
    profile?.headline?.trim() ||
    '';

  const location =
    profile?.location?.trim() ||
    '';

  const avatarUrl =
    profile?.avatar_url?.trim() ||
    '';

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join('') || 'D';

  return (
    <header
      className="public-profile-header dipo-profile-header"
      aria-labelledby="public-profile-name"
    >
      {/* --------------------------------------------------
          PREMIUM BACKDROP
          -------------------------------------------------- */}

      <div
        className="dipo-profile-header-bg"
        aria-hidden="true"
      >
        <span className="dipo-header-orb dipo-header-orb-one" />
        <span className="dipo-header-orb dipo-header-orb-two" />
        <span className="dipo-header-grid" />
      </div>

      {/* --------------------------------------------------
          TOP BRAND
          -------------------------------------------------- */}

      <div className="dipo-profile-brand-row">
        <a
          href="/"
          className="dipo-profile-brand"
          aria-label="Worldwide DIPO home"
        >
          <span
            className="dipo-profile-brand-mark"
            aria-hidden="true"
          >
            D
          </span>

          <span className="dipo-profile-brand-name">
            WORLDWIDE DIPO
          </span>
        </a>

        <span className="dipo-profile-brand-label">
          DIGITAL IDENTITY
        </span>
      </div>

      {/* --------------------------------------------------
          MAIN IDENTITY
          -------------------------------------------------- */}

      <div className="dipo-profile-header-main">

        {/* Avatar */}

        <div className="dipo-profile-avatar-wrap">
          <div
            className="public-profile-avatar dipo-profile-avatar"
            aria-hidden={
              avatarUrl ? undefined : true
            }
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                loading="eager"
                decoding="async"
              />
            ) : (
              <span>
                {initials}
              </span>
            )}
          </div>

          {profile?.verified && (
            <div
              className="public-profile-verified dipo-verified-badge"
              title="Worldwide DIPO internal verification indicator"
              aria-label="Worldwide DIPO Verified"
            >
              <span
                className="dipo-verified-check"
                aria-hidden="true"
              >
                ✓
              </span>

              <span>
                DIPO Verified
              </span>
            </div>
          )}
        </div>

        {/* Identity */}

        <div className="public-profile-identity dipo-profile-identity">

          <div className="dipo-profile-kicker">
            WORLDWIDE DIPO
          </div>

          <div className="public-profile-name-row dipo-profile-name-row">
            <h1
              id="public-profile-name"
              className="dipo-profile-name"
            >
              {name}
            </h1>
          </div>

          {profession && (
            <p className="public-profile-profession dipo-profile-profession">
              {profession}
            </p>
          )}

          {headline && (
            <p className="public-profile-headline dipo-profile-headline">
              {headline}
            </p>
          )}

          {location && (
            <div className="public-profile-location dipo-profile-location">
              <span
                className="dipo-location-icon"
                aria-hidden="true"
              >
                ⌖
              </span>

              <span>
                {location}
              </span>
            </div>
          )}

          {/* ------------------------------------------------
              IDENTITY MICRO LABEL
              ------------------------------------------------ */}

          <div className="dipo-profile-identity-meta">
            <span>
              Public DIPO
            </span>

            <span
              className="dipo-meta-dot"
              aria-hidden="true"
            />

            <span>
              Discoverable profile
            </span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          PROFILE INTRO STRIP
          -------------------------------------------------- */}

      {(headline || profession || location) && (
        <div className="dipo-profile-intro-strip">
          <div className="dipo-intro-item">
            <span
              className="dipo-intro-icon"
              aria-hidden="true"
            >
              ✦
            </span>

            <div>
              <span className="dipo-intro-label">
                IDENTITY
              </span>

              <strong>
                {profession ||
                  'Worldwide DIPO'}
              </strong>
            </div>
          </div>

          {location && (
            <div className="dipo-intro-item">
              <span
                className="dipo-intro-icon"
                aria-hidden="true"
              >
                ⌖
              </span>

              <div>
                <span className="dipo-intro-label">
                  LOCATION
                </span>

                <strong>
                  {location}
                </strong>
              </div>
            </div>
          )}

          <div className="dipo-intro-item">
            <span
              className="dipo-intro-icon"
              aria-hidden="true"
            >
              ↗
            </span>

            <div>
              <span className="dipo-intro-label">
                PROFILE
              </span>

              <strong>
                One link. Complete identity.
              </strong>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}