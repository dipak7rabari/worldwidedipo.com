'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ExplorePage.module.css';

const ROTATION_INTERVAL = 5200;

const DIPO_TIPS = [
  {
    id: 'grow-worldwide',
    title: 'Grow Worldwide',
    text: 'Apni digital identity ko ek simple link ke through duniya tak le jao.',
  },
  {
    id: 'your-identity',
    title: 'Your DIPO, Your Identity',
    text: 'Aapki profile, aapki story aur aapka work — sab ek hi digital place par.',
  },
  {
    id: 'ready-to-be-found',
    title: 'Be Ready to Be Found',
    text: 'Apni online presence ko professional aur discoverable banane ke liye ready rakho.',
  },
  {
    id: 'one-link',
    title: 'One Link. Your World.',
    text: 'Bio, work, services, social links aur contact — ek simple DIPO link mein.',
  },
  {
    id: 'presence-count',
    title: 'Make Your Presence Count',
    text: 'Jo aap karte ho, use duniya ke saamne ek clean digital identity ke saath dikhao.',
  },
  {
    id: 'think-global',
    title: 'Think Global, Start Simple',
    text: 'Shuruaat simple rakho, lekin apni digital journey ko worldwide socho.',
  },
  {
    id: 'phone-presence',
    title: 'Your Phone Can Build Your Presence',
    text: 'Apne phone se hi apni professional digital presence ko ready karo.',
  },
  {
    id: 'everything-one-place',
    title: 'Everything About You, In One Place',
    text: 'Aapka intro, skills, services, work aur important links — sab ek jagah.',
  },
  {
    id: 'show-what-you-do',
    title: 'Show What You Do',
    text: 'Aap creator ho, business ho, professional ho ya shop owner — apna work show karo.',
  },
  {
    id: 'next-opportunity',
    title: 'Your Next Opportunity Could Be Online',
    text: 'Achi digital presence kisi bhi naye connection ya opportunity ka starting point ban sakti hai.',
  },
  {
    id: 'start-small',
    title: 'Start Small. Grow Worldwide.',
    text: 'Aaj ek simple DIPO se shuru karo aur dheere-dheere apni online identity grow karo.',
  },
  {
    id: 'discoverable-name',
    title: 'Make Your Name Discoverable',
    text: 'Apne naam aur work ke liye ek dedicated digital home create karo.',
  },
  {
    id: 'story-deserves-place',
    title: 'Your Story Deserves a Place Online',
    text: 'Aapki journey unique hai — use apne DIPO par apne style mein share karo.',
  },
];

function getInitialTip() {
  return 0;
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    const updatePreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);

      return () => {
        mediaQuery.removeEventListener(
          'change',
          updatePreference
        );
      };
    }

    mediaQuery.addListener(updatePreference);

    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  }, []);

  return reducedMotion;
}

export default function ExploreTips() {
  const [activeIndex, setActiveIndex] = useState(getInitialTip);
  const [isChanging, setIsChanging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const reducedMotion = useReducedMotion();

  const rotationTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (rotationTimerRef.current) {
      window.clearTimeout(rotationTimerRef.current);
      rotationTimerRef.current = null;
    }

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  const changeTip = useCallback(
    (nextIndex) => {
      const normalizedIndex =
        ((nextIndex % DIPO_TIPS.length) +
          DIPO_TIPS.length) %
        DIPO_TIPS.length;

      clearTimers();

      if (normalizedIndex === activeIndex) {
        return;
      }

      if (reducedMotion) {
        setActiveIndex(normalizedIndex);
        setIsChanging(false);
        return;
      }

      setIsChanging(true);

      transitionTimerRef.current = window.setTimeout(() => {
        setActiveIndex(normalizedIndex);
        setIsChanging(false);
      }, 170);
    },
    [
      activeIndex,
      clearTimers,
      reducedMotion,
    ]
  );

  const nextTip = useCallback(() => {
    changeTip(activeIndex + 1);
  }, [activeIndex, changeTip]);

  const goToTip = useCallback(
    (index) => {
      changeTip(index);
    },
    [changeTip]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    clearTimers();

    if (
      reducedMotion ||
      isPaused ||
      DIPO_TIPS.length <= 1
    ) {
      return undefined;
    }

    rotationTimerRef.current = window.setTimeout(() => {
      nextTip();
    }, ROTATION_INTERVAL);

    return clearTimers;
  }, [
    activeIndex,
    clearTimers,
    isPaused,
    nextTip,
    reducedMotion,
  ]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const activeTip = DIPO_TIPS[activeIndex];

  if (!activeTip) {
    return null;
  }

  return (
    <section
      className={styles.exploreTipsSection}
      aria-labelledby="dipo-tips-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        const currentTarget = event.currentTarget;

        if (
          currentTarget &&
          !currentTarget.contains(event.relatedTarget)
        ) {
          setIsPaused(false);
        }
      }}
    >
      <div
        className={[
          styles.exploreTip,
          isChanging ? styles.exploreTipChanging : '',
        ]
          .filter(Boolean)
          .join(' ')}
        key={activeTip.id}
      >
        <div
          className={styles.exploreTipIcon}
          aria-hidden="true"
        >
          ✦
        </div>

        <div className={styles.exploreTipContent}>
          <p
            className={styles.exploreTipLabel}
            id="dipo-tips-title"
          >
            Worldwide DIPO
          </p>

          <h2 className={styles.exploreTipTitle}>
            {activeTip.title}
          </h2>

          <p className={styles.exploreTipText}>
            {activeTip.text}
          </p>
        </div>
      </div>

      <div className={styles.tipControls}>
        <span
          className={styles.tipStatus}
          aria-live="polite"
        >
          {isPaused
            ? 'Paused'
            : `${activeIndex + 1} / ${DIPO_TIPS.length}`}
        </span>

        <div
          className={styles.tipDots}
          role="tablist"
          aria-label="Worldwide DIPO tips"
        >
          {DIPO_TIPS.map((tip, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={tip.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show tip ${index + 1}: ${tip.title}`}
                className={[
                  styles.tipDot,
                  isActive ? styles.tipDotActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => goToTip(index)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { DIPO_TIPS, ROTATION_INTERVAL };