'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

import {
  createSuggestedSlug,
} from '@/lib/profile/slug';

import {
  validateCreateProfileInput,
} from '@/lib/profile/profile-validation';

import ProfileCreatePreview from './ProfileCreatePreview';

const STEPS = [
  {
    id: 1,
    label: 'Start',
    title: 'Start with you',
    description:
      'Bas essential details. Baaki baad mein.',
  },
  {
    id: 2,
    label: 'Personalize',
    title: 'Make it yours',
    description:
      'Apni page ko thoda personality do.',
  },
  {
    id: 3,
    label: 'Connect',
    title: 'Add your world',
    description:
      'Jo useful hai, wahi add karo.',
  },
];

const CATEGORIES = [
  'Creator',
  'Business',
  'Shop',
  'Online Business',
  'Professional',
  'Student',
  'Freelancer',
  'Artist',
  'Education',
  'Other',
];

const INITIAL_FORM = {
  name: '',
  slug: '',
  profession: '',
  headline: '',
  bio: '',
  location: '',
  category: '',
  about: '',
};

const OPTIONAL_FIELDS = [
  'headline',
  'bio',
  'location',
  'category',
  'about',
];

function cleanSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/g, '')
    .slice(0, 30);
}

function getInitialStep() {
  if (typeof window === 'undefined') {
    return 1;
  }

  const saved =
    window.localStorage.getItem(
      'worldwide-dipo-create-step'
    );

  const number = Number(saved);

  return number >= 1 && number <= 3
    ? number
    : 1;
}

function getSavedForm() {
  if (typeof window === 'undefined') {
    return INITIAL_FORM;
  }

  try {
    const saved =
      window.localStorage.getItem(
        'worldwide-dipo-create-draft'
      );

    if (!saved) {
      return INITIAL_FORM;
    }

    const parsed = JSON.parse(saved);

    return {
      ...INITIAL_FORM,
      ...(parsed || {}),
    };
  } catch {
    return INITIAL_FORM;
  }
}

export default function ProfileCreateForm() {
  const router = useRouter();

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [step, setStep] =
    useState(1);

  const [slugEdited, setSlugEdited] =
    useState(false);

  const [slugState, setSlugState] =
    useState('idle');

  const [slugMessage, setSlugMessage] =
    useState('');

  const [suggestions, setSuggestions] =
    useState([]);

  const [errors, setErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const [savedState, setSavedState] =
    useState('saved');

  const [showPreview, setShowPreview] =
    useState(false);

  const slugRequestRef =
    useRef(0);

  const slugTimerRef =
    useRef(null);

  const saveTimerRef =
    useRef(null);

  /*
   * ---------------------------------------------------------
   * RESTORE DRAFT
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const savedForm = getSavedForm();

    setForm(savedForm);
    setStep(getInitialStep());

    if (savedForm.slug) {
      setSlugEdited(true);
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * AUTO SAVE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (
      !form.name &&
      !form.profession &&
      !form.slug &&
      !form.headline &&
      !form.bio &&
      !form.location &&
      !form.category &&
      !form.about
    ) {
      return;
    }

    setSavedState('saving');

    window.clearTimeout(
      saveTimerRef.current
    );

    saveTimerRef.current =
      window.setTimeout(() => {
        try {
          window.localStorage.setItem(
            'worldwide-dipo-create-draft',
            JSON.stringify(form)
          );

          window.localStorage.setItem(
            'worldwide-dipo-create-step',
            String(step)
          );

          setSavedState('saved');
        } catch {
          setSavedState('offline');
        }
      }, 500);

    return () => {
      window.clearTimeout(
        saveTimerRef.current
      );
    };
  }, [form, step]);

  /*
   * ---------------------------------------------------------
   * CLEANUP
   * ---------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      window.clearTimeout(
        slugTimerRef.current
      );

      window.clearTimeout(
        saveTimerRef.current
      );
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * BASIC FIELD UPDATE
   * ---------------------------------------------------------
   */

  const updateField = useCallback(
    (field, value) => {
      setForm((current) => ({
        ...current,
        [field]: value,
      }));

      setErrors((current) => ({
        ...current,
        [field]: undefined,
        form: undefined,
      }));
    },
    []
  );

  /*
   * ---------------------------------------------------------
   * NAME → SMART USERNAME
   * ---------------------------------------------------------
   */

  function handleNameChange(value) {
    const generatedSlug =
      !slugEdited
        ? createSuggestedSlug(value)
        : form.slug;

    setForm((current) => ({
      ...current,
      name: value,
      slug: generatedSlug,
    }));

    setErrors((current) => ({
      ...current,
      name: undefined,
      slug: undefined,
      form: undefined,
    }));

    if (!slugEdited && generatedSlug) {
      checkSlugAvailability(
        generatedSlug
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * USERNAME CHECK
   * ---------------------------------------------------------
   */

  const checkSlugAvailability =
    useCallback(
      async (rawSlug) => {
        const slug =
          cleanSlug(rawSlug);

        if (!slug) {
          setSlugState('idle');
          setSlugMessage('');
          setSuggestions([]);
          return;
        }

        /*
         * Local validation first.
         * Prevents unnecessary API calls.
         */

        if (
          slug.length < 3 ||
          slug.length > 30
        ) {
          setSlugState('invalid');

          setSlugMessage(
            'Use 3–30 characters.'
          );

          setSuggestions([]);

          return;
        }

        if (
          slug.startsWith('-') ||
          slug.endsWith('-') ||
          slug.includes('--')
        ) {
          setSlugState('invalid');

          setSlugMessage(
            'Use letters, numbers and single hyphens.'
          );

          setSuggestions([]);

          return;
        }

        const requestId =
          slugRequestRef.current + 1;

        slugRequestRef.current =
          requestId;

        setSlugState('checking');
        setSlugMessage('');
        setSuggestions([]);

        try {
          const response =
            await fetch(
              `/api/profile/slug?slug=${encodeURIComponent(
                slug
              )}`,
              {
                method: 'GET',
                credentials:
                  'same-origin',
                cache: 'no-store',
              }
            );

          const result =
            await response.json();

          /*
           * Ignore an old request if the user
           * typed something newer.
           */

          if (
            requestId !==
            slugRequestRef.current
          ) {
            return;
          }

          if (!response.ok) {
            setSlugState('error');

            setSlugMessage(
              result?.error ||
                'Could not check this username.'
            );

            return;
          }

          if (result.available) {
            setSlugState('available');

            setSlugMessage(
              'This web address is available.'
            );

            setSuggestions([]);
          } else {
            setSlugState('taken');

            setSlugMessage(
              'This web address is already taken.'
            );

            setSuggestions(
              await buildAvailableSuggestions(
                slug
              )
            );
          }
        } catch {
          if (
            requestId !==
            slugRequestRef.current
          ) {
            return;
          }

          setSlugState('error');

          setSlugMessage(
            'Could not check right now. You can try again.'
          );
        }
      },
      []
    );

  /*
   * ---------------------------------------------------------
   * USERNAME INPUT
   * ---------------------------------------------------------
   */

  function handleSlugChange(value) {
    const slug =
      cleanSlug(value);

    setSlugEdited(true);

    setForm((current) => ({
      ...current,
      slug,
    }));

    setErrors((current) => ({
      ...current,
      slug: undefined,
      form: undefined,
    }));

    window.clearTimeout(
      slugTimerRef.current
    );

    setSlugState(
      slug ? 'checking' : 'idle'
    );

    setSlugMessage('');

    if (!slug) {
      setSuggestions([]);
      return;
    }

    slugTimerRef.current =
      window.setTimeout(() => {
        checkSlugAvailability(slug);
      }, 420);
  }

  /*
   * ---------------------------------------------------------
   * AVAILABLE SUGGESTIONS
   * ---------------------------------------------------------
   */

  async function buildAvailableSuggestions(
    baseSlug
  ) {
    const candidates = [
      `${baseSlug}7`,
      `${baseSlug}07`,
      `the${baseSlug}`,
      `${baseSlug}official`,
      `${baseSlug}creator`,
    ];

    const unique = [
      ...new Set(
        candidates
          .map(cleanSlug)
          .filter(
            (candidate) =>
              candidate &&
              candidate !== baseSlug &&
              candidate.length >= 3 &&
              candidate.length <= 30
          )
      ),
    ].slice(0, 5);

    const results = [];

    for (const candidate of unique) {
      try {
        const response =
          await fetch(
            `/api/profile/slug?slug=${encodeURIComponent(
              candidate
            )}`,
            {
              method: 'GET',
              credentials:
                'same-origin',
              cache: 'no-store',
            }
          );

        if (!response.ok) {
          continue;
        }

        const result =
          await response.json();

        if (result.available) {
          results.push(candidate);
        }
      } catch {
        /*
         * A suggestion failure should never
         * break the main form.
         */
      }

      if (results.length >= 4) {
        break;
      }
    }

    return results;
  }

  /*
   * ---------------------------------------------------------
   * SELECT SUGGESTION
   * ---------------------------------------------------------
   */

  function selectSuggestion(slug) {
    setForm((current) => ({
      ...current,
      slug,
    }));

    setSlugEdited(true);

    setSlugState('available');

    setSlugMessage(
      'This web address is available.'
    );

    setSuggestions([]);

    setErrors((current) => ({
      ...current,
      slug: undefined,
      form: undefined,
    }));
  }

  /*
   * ---------------------------------------------------------
   * VALIDATE CURRENT STEP
   * ---------------------------------------------------------
   */

  function validateStep(targetStep) {
    const nextErrors = {};

    if (targetStep === 1) {
      const validation =
        validateCreateProfileInput({
          ...form,
          headline: '',
          bio: '',
          location: '',
          category: '',
          about: '',
        });

      if (!validation.valid) {
        if (validation.errors.name) {
          nextErrors.name =
            validation.errors.name;
        }

        if (validation.errors.profession) {
          nextErrors.profession =
            validation.errors.profession;
        }

        if (validation.errors.slug) {
          nextErrors.slug =
            validation.errors.slug;
        }
      }

      if (
        slugState === 'taken'
      ) {
        nextErrors.slug =
          'This web address is already taken.';
      }

      if (
        slugState === 'checking'
      ) {
        nextErrors.slug =
          'Please wait while we check your web address.';
      }

      if (
        slugState === 'error'
      ) {
        nextErrors.slug =
          'Please check your web address again.';
      }
    }

    if (targetStep === 2) {
      const fields = [
        ['headline', 'Headline', 120],
        ['bio', 'Bio', 250],
        ['location', 'Location', 120],
        ['category', 'Category', 80],
      ];

      for (
        const [
          field,
          label,
          max,
        ] of fields
      ) {
        if (
          String(form[field] || '')
            .trim().length > max
        ) {
          nextErrors[field] =
            `${label} cannot exceed ${max} characters.`;
        }
      }
    }

    if (targetStep === 3) {
      if (
        String(form.about || '')
          .trim().length > 3000
      ) {
        nextErrors.about =
          'About cannot exceed 3000 characters.';
      }
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  }

  /*
   * ---------------------------------------------------------
   * STEP NAVIGATION
   * ---------------------------------------------------------
   */

  function goNext() {
    if (!validateStep(step)) {
      return;
    }

    setStep((current) =>
      Math.min(3, current + 1)
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function goBack() {
    setErrors({});

    setStep((current) =>
      Math.max(1, current - 1)
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function skipStep() {
    setErrors({});

    setStep((current) =>
      Math.min(3, current + 1)
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */

  async function handleSubmit(event) {
    event.preventDefault();

    setErrors({});

    if (!validateStep(1)) {
      setStep(1);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    if (!validateStep(2)) {
      setStep(2);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    if (!validateStep(3)) {
      setStep(3);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    setSubmitting(true);

    try {
      const response =
        await fetch(
          '/api/profile/create',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            credentials:
              'same-origin',
            body: JSON.stringify(form),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setErrors(
          result?.errors || {
            form:
              result?.error ||
              'Unable to create your DIPO.',
          }
        );

        /*
         * If the server identifies the
         * username conflict, take user
         * back to the exact field.
         */

        if (
          result?.errors?.slug
        ) {
          setStep(1);
          setSlugState('taken');
          setSlugMessage(
            'This web address is already taken.'
          );
        }

        return;
      }

      /*
       * Clear only the local creation draft.
       */

      try {
        window.localStorage.removeItem(
          'worldwide-dipo-create-draft'
        );

        window.localStorage.removeItem(
          'worldwide-dipo-create-step'
        );
      } catch {
        // Ignore local storage failures.
      }

      router.replace(
        '/dashboard/profile'
      );

      router.refresh();
    } catch {
      setErrors({
        form:
          'Network error. Your information is safe. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * PREVIEW URL
   * ---------------------------------------------------------
   */

  const previewUrl = useMemo(() => {
    const slug =
      form.slug.trim().toLowerCase();

    return slug
      ? `worldwidedipo.com/p/${slug}`
      : 'worldwidedipo.com/p/yourname';
  }, [form.slug]);

  /*
   * ---------------------------------------------------------
   * PROGRESS
   * ---------------------------------------------------------
   */

  const progress =
    step === 1
      ? 33
      : step === 2
        ? 66
        : 100;

  const isLastStep =
    step === 3;

  return (
    <div className="wd-create">
      {/* ===================================================
          TOP JOURNEY
         =================================================== */}

      <div className="wd-create-progress">
        <div className="wd-progress-meta">
          <span>
            Step {step} of 3
          </span>

          <span>
            {savedState === 'saving'
              ? 'Saving…'
              : savedState === 'saved'
                ? '✓ Saved'
                : 'Draft saved locally'}
          </span>
        </div>

        <div
          className="wd-progress-track"
          aria-hidden="true"
        >
          <span
            className="wd-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="wd-step-labels">
          {STEPS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                item.id === step
                  ? 'is-current'
                  : item.id < step
                    ? 'is-done'
                    : ''
              }
              onClick={() => {
                if (item.id < step) {
                  setErrors({});
                  setStep(item.id);
                }
              }}
              disabled={
                item.id > step
              }
            >
              <span>
                {item.id < step
                  ? '✓'
                  : item.id}
              </span>

              <small>
                {item.label}
              </small>
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================
          STEP 1
         =================================================== */}

      {step === 1 && (
        <section
          className="wd-create-step"
          aria-labelledby="step-one-title"
        >
          <div className="wd-step-intro">
            <span className="wd-step-badge">
              01 · REQUIRED
            </span>

            <h2 id="step-one-title">
              Let’s give your identity
              <span> a home.</span>
            </h2>

            <p>
              Bas 3 cheezein. Baaki sab baad mein.
            </p>
          </div>

          <div className="wd-fields">
            {/* NAME */}

            <div
              className={`wd-field ${
                errors.name
                  ? 'has-error'
                  : ''
              }`}
            >
              <label htmlFor="dipo-name">
                Your name
                <span>Required</span>
              </label>

              <div className="wd-input-wrap">
                <span
                  className="wd-input-icon"
                  aria-hidden="true"
                >
                  ◯
                </span>

                <input
                  id="dipo-name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    handleNameChange(
                      event.target.value
                    )
                  }
                  maxLength={60}
                  autoComplete="name"
                  autoFocus
                  placeholder="Your real or public name"
                  required
                />
              </div>

              {errors.name && (
                <p className="wd-error">
                  {errors.name}
                </p>
              )}
            </div>

            {/* PROFESSION */}

            <div
              className={`wd-field ${
                errors.profession
                  ? 'has-error'
                  : ''
              }`}
            >
              <label htmlFor="dipo-profession">
                What do you do?
                <span>Required</span>
              </label>

              <div className="wd-input-wrap">
                <span
                  className="wd-input-icon"
                  aria-hidden="true"
                >
                  ✦
                </span>

                <input
                  id="dipo-profession"
                  type="text"
                  value={form.profession}
                  onChange={(event) =>
                    updateField(
                      'profession',
                      event.target.value
                    )
                  }
                  maxLength={60}
                  autoComplete="organization-title"
                  placeholder="Creator, Business Owner, Designer..."
                  required
                />
              </div>

              {errors.profession && (
                <p className="wd-error">
                  {errors.profession}
                </p>
              )}
            </div>

            {/* USERNAME */}

            <div
              className={`wd-field ${
                errors.slug
                  ? 'has-error'
                  : ''
              }`}
            >
              <div className="wd-label-row">
                <label htmlFor="dipo-slug">
                  Choose your web address
                  <span>Required</span>
                </label>

                {slugState ===
                  'available' && (
                  <span className="wd-available-mini">
                    ✓ Available
                  </span>
                )}
              </div>

              <div
                className={`wd-url-input ${
                  slugState ===
                  'available'
                    ? 'is-available'
                    : slugState ===
                        'taken' ||
                      slugState ===
                        'invalid'
                      ? 'is-error'
                      : ''
                }`}
              >
                <span>
                  worldwidedipo.com/p/
                </span>

                <input
                  id="dipo-slug"
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    handleSlugChange(
                      event.target.value
                    )
                  }
                  maxLength={30}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="text"
                  placeholder="yourname"
                  required
                  aria-describedby="slug-help"
                />

                <span
                  className="wd-slug-status"
                  aria-live="polite"
                >
                  {slugState ===
                    'checking' && (
                    <span
                      className="wd-spinner"
                      aria-hidden="true"
                    />
                  )}

                  {slugState ===
                    'available' && '✓'}

                  {(slugState ===
                    'taken' ||
                    slugState ===
                      'invalid') &&
                    '×'}
                </span>
              </div>

              <div
                id="slug-help"
                className="wd-url-preview"
              >
                <span>
                  {previewUrl}
                </span>

                {slugState ===
                  'checking' && (
                  <small>
                    Checking…
                  </small>
                )}

                {slugState ===
                  'available' && (
                  <small className="is-good">
                    Your web address is ready.
                  </small>
                )}

                {slugState ===
                  'taken' && (
                  <small className="is-bad">
                    {slugMessage}
                  </small>
                )}
              </div>

              {slugState ===
                'taken' &&
                suggestions.length >
                  0 && (
                  <div className="wd-suggestions">
                    <div className="wd-suggestions-head">
                      <span>
                        Try one of these
                      </span>

                      <small>
                        Available now
                      </small>
                    </div>

                    <div className="wd-suggestion-list">
                      {suggestions.map(
                        (suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() =>
                              selectSuggestion(
                                suggestion
                              )
                            }
                          >
                            <span>
                              worldwidedipo.com/p/
                              <strong>
                                {suggestion}
                              </strong>
                            </span>

                            <span>
                              →
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

              {errors.slug && (
                <p className="wd-error">
                  {errors.slug}
                </p>
              )}

              {slugState ===
                'error' && (
                <p className="wd-soft-error">
                  {slugMessage}
                </p>
              )}

              <p className="wd-field-help">
                Lowercase letters, numbers and
                single hyphens work best.
              </p>
            </div>
          </div>

          <div className="wd-motivation">
            <span>✦</span>

            <p>
              Your name deserves a place
              on the web.
            </p>
          </div>

          <div className="wd-actions">
            <div>
              <span className="wd-no-pressure">
                No pressure.
              </span>

              <small>
                You can edit your DIPO later.
              </small>
            </div>

            <button
              type="button"
              className="wd-primary"
              onClick={goNext}
            >
              Continue
              <span>→</span>
            </button>
          </div>
        </section>
      )}

      {/* ===================================================
          STEP 2
         =================================================== */}

      {step === 2 && (
        <section
          className="wd-create-step"
          aria-labelledby="step-two-title"
        >
          <div className="wd-step-intro">
            <span className="wd-step-badge optional">
              02 · OPTIONAL
            </span>

            <h2 id="step-two-title">
              Make it
              <span> yours.</span>
            </h2>

            <p>
              Jo available hai add karo.
              Jo nahi hai, skip kar do.
            </p>
          </div>

          <div className="wd-optional-note">
            <span>💡</span>

            <div>
              <strong>
                Aaj time kam hai?
              </strong>

              <p>
                Koi problem nahi. Ye details
                baad mein dashboard se add kar
                sakte ho.
              </p>
            </div>
          </div>

          <div className="wd-fields">
            {/* HEADLINE */}

            <div
              className={`wd-field ${
                errors.headline
                  ? 'has-error'
                  : ''
              }`}
            >
              <div className="wd-label-row">
                <label htmlFor="dipo-headline">
                  Your headline
                  <span>Optional</span>
                </label>

                <small>
                  {form.headline.length}/120
                </small>
              </div>

              <input
                id="dipo-headline"
                type="text"
                value={form.headline}
                onChange={(event) =>
                  updateField(
                    'headline',
                    event.target.value
                  )
                }
                maxLength={120}
                placeholder="What should people know about you?"
              />

              {errors.headline && (
                <p className="wd-error">
                  {errors.headline}
                </p>
              )}
            </div>

            {/* BIO */}

            <div
              className={`wd-field ${
                errors.bio
                  ? 'has-error'
                  : ''
              }`}
            >
              <div className="wd-label-row">
                <label htmlFor="dipo-bio">
                  Short bio
                  <span>Optional</span>
                </label>

                <small>
                  {form.bio.length}/250
                </small>
              </div>

              <textarea
                id="dipo-bio"
                value={form.bio}
                onChange={(event) =>
                  updateField(
                    'bio',
                    event.target.value
                  )
                }
                maxLength={250}
                rows={4}
                placeholder="A few words about you..."
              />

              {errors.bio && (
                <p className="wd-error">
                  {errors.bio}
                </p>
              )}
            </div>

            {/* LOCATION */}

            <div
              className={`wd-field ${
                errors.location
                  ? 'has-error'
                  : ''
              }`}
            >
              <label htmlFor="dipo-location">
                Where are you based?
                <span>Optional</span>
              </label>

              <div className="wd-input-wrap">
                <span
                  className="wd-input-icon"
                  aria-hidden="true"
                >
                  📍
                </span>

                <input
                  id="dipo-location"
                  type="text"
                  value={form.location}
                  onChange={(event) =>
                    updateField(
                      'location',
                      event.target.value
                    )
                  }
                  maxLength={120}
                  autoComplete="address-level2"
                  placeholder="City, State"
                />
              </div>

              {errors.location && (
                <p className="wd-error">
                  {errors.location}
                </p>
              )}
            </div>

            {/* CATEGORY */}

            <div
              className={`wd-field ${
                errors.category
                  ? 'has-error'
                  : ''
              }`}
            >
              <label htmlFor="dipo-category">
                Category
                <span>Optional</span>
              </label>

              <div className="wd-category-wrap">
                {CATEGORIES.map(
                  (category) => (
                    <button
                      key={category}
                      type="button"
                      className={
                        form.category ===
                        category
                          ? 'is-selected'
                          : ''
                      }
                      onClick={() =>
                        updateField(
                          'category',
                          category
                        )
                      }
                    >
                      {category}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="wd-motivation">
            <span>✦</span>

            <p>
              Perfect nahi chahiye.
              <strong> Start karna zaroori hai.</strong>
            </p>
          </div>

          <div className="wd-actions">
            <button
              type="button"
              className="wd-secondary"
              onClick={goBack}
            >
              ← Back
            </button>

            <div className="wd-action-right">
              <button
                type="button"
                className="wd-ghost"
                onClick={skipStep}
              >
                Skip for now
              </button>

              <button
                type="button"
                className="wd-primary"
                onClick={goNext}
              >
                Continue
                <span>→</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================
          STEP 3
         =================================================== */}

      {step === 3 && (
        <section
          className="wd-create-step"
          aria-labelledby="step-three-title"
        >
          <div className="wd-step-intro">
            <span className="wd-step-badge optional">
              03 · OPTIONAL
            </span>

            <h2 id="step-three-title">
              Add your
              <span> world.</span>
            </h2>

            <p>
              Ek short story likho. Baaki details
              baad mein bhi add ho sakti hain.
            </p>
          </div>

          <div className="wd-optional-note">
            <span>✨</span>

            <div>
              <strong>
                Keep it simple.
              </strong>

              <p>
                Public information hi add karein.
                Password, OTP, UPI PIN ya bank
                details kabhi mat add karein.
              </p>
            </div>
          </div>

          <div className="wd-fields">
            <div
              className={`wd-field ${
                errors.about
                  ? 'has-error'
                  : ''
              }`}
            >
              <div className="wd-label-row">
                <label htmlFor="dipo-about">
                  About you
                  <span>Optional</span>
                </label>

                <small>
                  {form.about.length}/3000
                </small>
              </div>

              <textarea
                id="dipo-about"
                value={form.about}
                onChange={(event) =>
                  updateField(
                    'about',
                    event.target.value
                  )
                }
                maxLength={3000}
                rows={8}
                placeholder="Tell people your story, what you do, what you care about..."
              />

              {errors.about && (
                <p className="wd-error">
                  {errors.about}
                </p>
              )}
            </div>
          </div>

          {/* PREVIEW */}

          <div className="wd-live-preview">
            <div className="wd-live-preview-head">
              <div>
                <span>
                  LIVE PREVIEW
                </span>

                <strong>
                  Your page is taking shape.
                </strong>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPreview(
                    (current) =>
                      !current
                  )
                }
              >
                {showPreview
                  ? 'Hide preview'
                  : 'View preview'}
              </button>
            </div>

            {showPreview && (
              <ProfileCreatePreview
                form={form}
              />
            )}
          </div>

          <div className="wd-motivation">
            <span>✦</span>

            <p>
              One page.
              <strong>
                {' '}
                Your identity.
                {' '}
              </strong>
              Your web address.
            </p>
          </div>

          {errors.form && (
            <div
              className="wd-form-error"
              role="alert"
            >
              <span>!</span>

              <p>
                {errors.form}
              </p>
            </div>
          )}

          <div className="wd-actions">
            <button
              type="button"
              className="wd-secondary"
              onClick={goBack}
              disabled={submitting}
            >
              ← Back
            </button>

            <div className="wd-action-right">
              <button
                type="button"
                className="wd-ghost"
                onClick={skipStep}
                disabled={submitting}
              >
                Skip for now
              </button>

              <button
                type="submit"
                className="wd-primary wd-launch"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="wd-button-spinner" />
                    Creating…
                  </>
                ) : (
                  <>
                    Create My DIPO
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================
          RESPONSIVE / LOCAL CSS
         =================================================== */}

      <style jsx>{`
        .wd-create {
          --wd-ink: #101828;
          --wd-text: #344054;
          --wd-muted: #667085;
          --wd-soft: #98a2b3;
          --wd-border: #eaecf0;
          --wd-border-strong: #d0d5dd;
          --wd-bg: #ffffff;
          --wd-soft-bg: #f9fafb;
          --wd-green: #12b76a;
          --wd-red: #d92d20;

          display: grid;
          gap: 18px;
        }

        /* ===============================================
           PROGRESS
           =============================================== */

        .wd-create-progress {
          padding: 15px 17px;
          border: 1px solid var(--wd-border);
          border-radius: 18px;
          background: rgba(
            255,
            255,
            255,
            0.92
          );
          box-shadow:
            0 6px 20px
              rgba(16, 24, 40, 0.035);
        }

        .wd-progress-meta {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 9px;
          color: var(--wd-soft);
          font-size: 10px;
          font-weight: 750;
        }

        .wd-progress-track {
          height: 4px;
          overflow: hidden;
          border-radius: 999px;
          background: #f2f4f7;
        }

        .wd-progress-fill {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: var(--wd-ink);
          transition:
            width 350ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
        }

        .wd-step-labels {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 8px;
          margin-top: 11px;
        }

        .wd-step-labels button {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--wd-soft);
          font: inherit;
          text-align: left;
        }

        .wd-step-labels button:not(
          :disabled
        ) {
          cursor: pointer;
        }

        .wd-step-labels button > span {
          display: grid;
          width: 23px;
          height: 23px;
          flex: 0 0 23px;
          place-items: center;
          border: 1px solid
            var(--wd-border);
          border-radius: 7px;
          background: #ffffff;
          font-size: 8px;
          font-weight: 850;
        }

        .wd-step-labels button small {
          font-size: 9px;
          font-weight: 750;
        }

        .wd-step-labels button.is-current {
          color: var(--wd-ink);
        }

        .wd-step-labels button.is-current
          > span {
          border-color: var(--wd-ink);
          background: var(--wd-ink);
          color: #ffffff;
        }

        .wd-step-labels button.is-done {
          color: #475467;
        }

        .wd-step-labels button.is-done
          > span {
          border-color: #d0d5dd;
          color: var(--wd-green);
        }

        /* ===============================================
           STEP
           =============================================== */

        .wd-create-step {
          overflow: hidden;
          border: 1px solid var(--wd-border);
          border-radius: 24px;
          background: #ffffff;
          box-shadow:
            0 18px 50px
              rgba(16, 24, 40, 0.055);
          animation:
            wdStepIn 380ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            );
        }

        .wd-step-intro {
          padding: 30px 30px 21px;
        }

        .wd-step-badge {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 999px;
          background: var(--wd-ink);
          color: #ffffff;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.09em;
        }

        .wd-step-badge.optional {
          background: #f2f4f7;
          color: #667085;
        }

        .wd-step-intro h2 {
          margin: 14px 0 0;
          color: var(--wd-ink);
          font-size: clamp(
            28px,
            5vw,
            43px
          );
          line-height: 1.02;
          letter-spacing: -0.055em;
        }

        .wd-step-intro h2 span {
          color: #98a2b3;
        }

        .wd-step-intro p {
          margin: 10px 0 0;
          color: var(--wd-muted);
          font-size: 13px;
          line-height: 1.6;
        }

        /* ===============================================
           FIELDS
           =============================================== */

        .wd-fields {
          display: grid;
          gap: 17px;
          padding: 0 30px 24px;
        }

        .wd-field {
          display: grid;
          gap: 7px;
        }

        .wd-field > label,
        .wd-label-row label {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 0;
          color: var(--wd-text);
          font-size: 12px;
          font-weight: 800;
        }

        .wd-field > label > span,
        .wd-label-row label > span {
          padding: 3px 6px;
          border-radius: 999px;
          background: #f2f4f7;
          color: #98a2b3;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .wd-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .wd-label-row > small {
          color: var(--wd-soft);
          font-size: 9px;
        }

        .wd-input-wrap {
          position: relative;
        }

        .wd-input-icon {
          position: absolute;
          top: 50%;
          left: 13px;
          z-index: 1;
          display: grid;
          width: 22px;
          height: 22px;
          place-items: center;
          border-radius: 7px;
          background: #f2f4f7;
          color: #667085;
          font-size: 9px;
          font-weight: 850;
          transform: translateY(-50%);
        }

        .wd-input-wrap input {
          padding-left: 45px;
        }

        .wd-field input,
        .wd-field textarea {
          width: 100%;
          min-height: 47px;
          border: 1px solid var(--wd-border);
          border-radius: 13px;
          background: #ffffff;
          color: var(--wd-ink);
          padding: 12px 13px;
          outline: none;
          font: inherit;
          font-size: 13px;
          transition:
            border-color 170ms ease,
            box-shadow 170ms ease,
            transform 170ms ease;
        }

        .wd-field textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.6;
        }

        .wd-field input::placeholder,
        .wd-field textarea::placeholder {
          color: #b0b7c3;
        }

        .wd-field input:hover,
        .wd-field textarea:hover {
          border-color: #d0d5dd;
        }

        .wd-field input:focus,
        .wd-field textarea:focus {
          border-color: #98a2b3;
          box-shadow:
            0 0 0 4px
              rgba(
                16,
                24,
                40,
                0.045
              );
        }

        .wd-field.has-error input,
        .wd-field.has-error textarea {
          border-color: #fda29b;
          box-shadow:
            0 0 0 3px
              rgba(
                217,
                45,
                32,
                0.06
              );
        }

        /* ===============================================
           URL
           =============================================== */

        .wd-url-input {
          display: flex;
          align-items: stretch;
          min-height: 49px;
          overflow: hidden;
          border: 1px solid var(--wd-border);
          border-radius: 13px;
          background: #ffffff;
          transition:
            border-color 170ms ease,
            box-shadow 170ms ease;
        }

        .wd-url-input:focus-within {
          border-color: #98a2b3;
          box-shadow:
            0 0 0 4px
              rgba(
                16,
                24,
                40,
                0.045
              );
        }

        .wd-url-input.is-available {
          border-color: #75e0a7;
        }

        .wd-url-input.is-error {
          border-color: #fda29b;
        }

        .wd-url-input > span:first-child {
          display: flex;
          align-items: center;
          padding-left: 13px;
          background: #f9fafb;
          color: #98a2b3;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            monospace;
          font-size: 10px;
          white-space: nowrap;
        }

        .wd-url-input input {
          min-width: 0;
          flex: 1;
          min-height: 47px;
          border: 0;
          border-radius: 0;
          box-shadow: none;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            monospace;
        }

        .wd-url-input input:focus {
          box-shadow: none;
        }

        .wd-slug-status {
          display: grid !important;
          width: 40px;
          flex: 0 0 40px;
          place-items: center;
          padding: 0 !important;
          background: #ffffff !important;
          color: var(--wd-green) !important;
          font-family: inherit !important;
          font-size: 14px !important;
          font-weight: 900;
        }

        .wd-url-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-width: 0;
          color: #98a2b3;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            monospace;
          font-size: 9px;
        }

        .wd-url-preview > span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wd-url-preview small {
          flex: 0 0 auto;
          color: #98a2b3;
          font-family: inherit;
          font-size: 8px;
        }

        .wd-url-preview small.is-good {
          color: var(--wd-green);
        }

        .wd-url-preview small.is-bad {
          color: var(--wd-red);
        }

        .wd-field-help {
          margin: 0;
          color: #98a2b3;
          font-size: 9px;
          line-height: 1.5;
        }

        /* ===============================================
           SUGGESTIONS
           =============================================== */

        .wd-suggestions {
          overflow: hidden;
          border: 1px solid #eaecf0;
          border-radius: 14px;
          background: #fafafa;
          animation:
            wdSoftIn 220ms ease;
        }

        .wd-suggestions-head {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 11px 12px;
          border-bottom: 1px solid #eaecf0;
        }

        .wd-suggestions-head span {
          color: #475467;
          font-size: 10px;
          font-weight: 800;
        }

        .wd-suggestions-head small {
          color: #98a2b3;
          font-size: 8px;
        }

        .wd-suggestion-list {
          display: grid;
        }

        .wd-suggestion-list button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          padding: 11px 12px;
          border: 0;
          border-bottom: 1px solid #f0f2f5;
          background: #ffffff;
          color: #667085;
          font: inherit;
          font-size: 9px;
          text-align: left;
          cursor: pointer;
          transition:
            background 150ms ease;
        }

        .wd-suggestion-list
          button:last-child {
          border-bottom: 0;
        }

        .wd-suggestion-list
          button:hover {
          background: #f9fafb;
        }

        .wd-suggestion-list
          button strong {
          color: #344054;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            monospace;
          font-weight: 800;
        }

        .wd-suggestion-list
          button > span:last-child {
          color: #101828;
          font-size: 14px;
        }

        /* ===============================================
           CATEGORY
           =============================================== */

        .wd-category-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .wd-category-wrap button {
          min-height: 36px;
          padding: 0 11px;
          border: 1px solid var(--wd-border);
          border-radius: 10px;
          background: #ffffff;
          color: #667085;
          font: inherit;
          font-size: 10px;
          font-weight: 750;
          cursor: pointer;
          transition:
            background 150ms ease,
            color 150ms ease,
            border-color 150ms ease,
            transform 150ms ease;
        }

        .wd-category-wrap
          button:hover {
          border-color: #d0d5dd;
          color: #344054;
          transform: translateY(-1px);
        }

        .wd-category-wrap
          button.is-selected {
          border-color: var(--wd-ink);
          background: var(--wd-ink);
          color: #ffffff;
        }

        /* ===============================================
           OPTIONAL NOTE
           =============================================== */

        .wd-optional-note {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin: 0 30px 22px;
          padding: 13px;
          border: 1px solid #eaecf0;
          border-radius: 14px;
          background: #fafafa;
        }

        .wd-optional-note > span {
          display: grid;
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          place-items: center;
          border-radius: 9px;
          background: #ffffff;
          font-size: 12px;
        }

        .wd-optional-note strong {
          display: block;
          color: #344054;
          font-size: 10px;
          font-weight: 850;
        }

        .wd-optional-note p {
          margin: 3px 0 0;
          color: #667085;
          font-size: 9px;
          line-height: 1.5;
        }

        /* ===============================================
           MOTIVATION
           =============================================== */

        .wd-motivation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 4px 30px 24px;
          color: #667085;
        }

        .wd-motivation > span {
          color: #101828;
          font-size: 12px;
        }

        .wd-motivation p {
          margin: 0;
          font-size: 10px;
          line-height: 1.5;
          text-align: center;
        }

        .wd-motivation strong {
          color: #344054;
          font-weight: 800;
        }

        /* ===============================================
           LIVE PREVIEW
           =============================================== */

        .wd-live-preview {
          margin: 0 30px 22px;
          overflow: hidden;
          border: 1px solid #eaecf0;
          border-radius: 18px;
          background: #fafafa;
        }

        .wd-live-preview-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 14px;
        }

        .wd-live-preview-head > div {
          min-width: 0;
        }

        .wd-live-preview-head span {
          display: block;
          color: #98a2b3;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.1em;
        }

        .wd-live-preview-head strong {
          display: block;
          margin-top: 3px;
          color: #344054;
          font-size: 10px;
          font-weight: 800;
        }

        .wd-live-preview-head button {
          flex: 0 0 auto;
          padding: 7px 9px;
          border: 1px solid #eaecf0;
          border-radius: 8px;
          background: #ffffff;
          color: #667085;
          font: inherit;
          font-size: 8px;
          font-weight: 750;
          cursor: pointer;
        }

        .wd-live-preview
          :global(.profile-create-preview) {
          margin: 0 !important;
          border: 0 !important;
          border-top: 1px solid #eaecf0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }

        /* ===============================================
           ERRORS
           =============================================== */

        .wd-error {
          margin: 0;
          color: var(--wd-red);
          font-size: 10px;
          line-height: 1.4;
        }

        .wd-soft-error {
          margin: 0;
          color: #b54708;
          font-size: 9px;
        }

        .wd-form-error {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin: 0 30px 20px;
          padding: 12px;
          border: 1px solid #fecdca;
          border-radius: 13px;
          background: #fffbfa;
          color: #b42318;
        }

        .wd-form-error > span {
          display: grid;
          width: 21px;
          height: 21px;
          flex: 0 0 21px;
          place-items: center;
          border-radius: 7px;
          background: #fee4e2;
          font-size: 9px;
          font-weight: 900;
        }

        .wd-form-error p {
          margin: 2px 0 0;
          font-size: 10px;
          line-height: 1.5;
        }

        /* ===============================================
           ACTIONS
           =============================================== */

        .wd-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 17px 30px;
          border-top: 1px solid #f2f4f7;
          background: #fcfcfd;
        }

        .wd-actions > div:first-child {
          display: grid;
          gap: 2px;
        }

        .wd-no-pressure {
          color: #475467;
          font-size: 9px;
          font-weight: 800;
        }

        .wd-actions
          > div:first-child
          small {
          color: #98a2b3;
          font-size: 8px;
        }

        .wd-action-right {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .wd-primary,
        .wd-secondary,
        .wd-ghost {
          min-height: 43px;
          border-radius: 11px;
          padding: 0 14px;
          font: inherit;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition:
            transform 160ms ease,
            background 160ms ease,
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        .wd-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid var(--wd-ink);
          background: var(--wd-ink);
          color: #ffffff;
          box-shadow:
            0 7px 18px
              rgba(
                16,
                24,
                40,
                0.13
              );
        }

        .wd-primary:hover:not(
          :disabled
        ) {
          background: #1d2939;
          transform: translateY(-1px);
          box-shadow:
            0 10px 23px
              rgba(
                16,
                24,
                40,
                0.17
              );
        }

        .wd-primary > span {
          font-size: 14px;
          transition:
            transform 160ms ease;
        }

        .wd-primary:hover
          > span {
          transform: translateX(2px);
        }

        .wd-secondary {
          border: 1px solid var(--wd-border);
          background: #ffffff;
          color: #475467;
        }

        .wd-secondary:hover:not(
          :disabled
        ) {
          border-color: #d0d5dd;
          background: #f9fafb;
        }

        .wd-ghost {
          border: 1px solid transparent;
          background: transparent;
          color: #667085;
        }

        .wd-ghost:hover:not(
          :disabled
        ) {
          background: #f2f4f7;
          color: #344054;
        }

        .wd-primary:disabled,
        .wd-secondary:disabled,
        .wd-ghost:disabled {
          cursor: not-allowed;
          opacity: 0.58;
          transform: none;
        }

        .wd-launch {
          min-width: 145px;
        }

        /* ===============================================
           SPINNER
           =============================================== */

        .wd-spinner,
        .wd-button-spinner {
          display: inline-block;
          border: 2px solid
            rgba(
              16,
              24,
              40,
              0.12
            );
          border-top-color: currentColor;
          border-radius: 50%;
          animation:
            wdSpin 650ms linear
            infinite;
        }

        .wd-spinner {
          width: 13px;
          height: 13px;
          color: #667085;
        }

        .wd-button-spinner {
          width: 13px;
          height: 13px;
          color: #ffffff;
        }

        /* ===============================================
           ANIMATION
           =============================================== */

        @keyframes wdStepIn {
          from {
            opacity: 0;
            transform:
              translateY(8px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes wdSoftIn {
          from {
            opacity: 0;
            transform:
              translateY(-3px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes wdSpin {
          to {
            transform:
              rotate(360deg);
          }
        }

        /* ===============================================
           MOBILE
           =============================================== */

        @media (max-width: 640px) {
          .wd-create {
            gap: 12px;
          }

          .wd-create-progress {
            padding: 12px;
            border-radius: 15px;
          }

          .wd-step-labels {
            gap: 4px;
          }

          .wd-step-labels
            button
            small {
            display: none;
          }

          .wd-step-labels
            button {
            justify-content: center;
          }

          .wd-create-step {
            border-radius: 20px;
          }

          .wd-step-intro {
            padding: 24px 18px 18px;
          }

          .wd-step-intro h2 {
            font-size: 34px;
          }

          .wd-fields {
            gap: 15px;
            padding: 0 18px 21px;
          }

          .wd-field input,
          .wd-field textarea {
            min-height: 48px;
          }

          .wd-url-input {
            display: grid;
            grid-template-columns:
              auto 1fr 40px;
          }

          .wd-url-input
            > span:first-child {
            overflow: hidden;
            padding-left: 10px;
            font-size: 8px;
            text-overflow: clip;
          }

          .wd-url-input input {
            width: 100%;
          }

          .wd-url-preview {
            display: block;
          }

          .wd-url-preview
            small {
            display: block;
            margin-top: 4px;
          }

          .wd-optional-note {
            margin: 0 18px 18px;
          }

          .wd-live-preview {
            margin: 0 18px 18px;
          }

          .wd-motivation {
            padding-inline: 18px;
          }

          .wd-actions {
            align-items: stretch;
            flex-direction: column;
            padding: 14px 18px;
          }

          .wd-actions
            > div:first-child {
            display: none;
          }

          .wd-actions
            > .wd-secondary {
            width: 100%;
          }

          .wd-action-right {
            display: grid;
            grid-template-columns:
              1fr 1fr;
            width: 100%;
          }

          .wd-action-right
            .wd-primary,
          .wd-action-right
            .wd-ghost {
            width: 100%;
          }

          .wd-launch {
            min-width: 0;
          }
        }

        @media (max-width: 390px) {
          .wd-step-intro h2 {
            font-size: 30px;
          }

          .wd-url-input
            > span:first-child {
            font-size: 7px;
          }

          .wd-url-input input {
            font-size: 12px;
          }

          .wd-action-right {
            grid-template-columns:
              0.85fr 1.15fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wd-create-step,
          .wd-suggestions {
            animation: none;
          }

          .wd-progress-fill,
          .wd-primary,
          .wd-secondary,
          .wd-ghost,
          .wd-category-wrap button,
          .wd-suggestion-list button {
            transition: none;
          }

          .wd-spinner,
          .wd-button-spinner {
            animation-duration: 1.2s;
          }
        }
      `}</style>
    </div>
  );
}