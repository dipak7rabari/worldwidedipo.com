'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './ExplorePage.module.css';

const OWNER_MENU_ITEMS = [
  {
    id: 'edit',
    label: 'Edit Profile',
    href: '/dashboard/profile/edit',
    icon: '✎',
  },
  {
    id: 'image',
    label: 'Change Image',
    href: '/dashboard/profile/edit',
    icon: '◉',
  },
  {
    id: 'live',
    label: 'View Live DIPO',
    href: null,
    icon: '↗',
  },
  {
    id: 'share',
    label: 'Share DIPO',
    href: '/dashboard/share',
    icon: '⌁',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: '◫',
  },
  {
    id: 'settings',
    label: 'DIPO Settings',
    href: '/dashboard/settings',
    icon: '⚙',
  },
  {
    id: 'danger',
    label: 'Danger Zone',
    href: '/dashboard/settings#danger-zone',
    icon: '!',
    danger: true,
  },
];

function getSafeSlug(slug) {
  if (!slug) return null;

  const cleanSlug = String(slug).trim();

  if (!cleanSlug) return null;

  return encodeURIComponent(cleanSlug);
}

export default function ExploreOwnerMenu({
  isOwner = false,
  slug = null,
  onNavigate,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  /*
   * IMPORTANT:
   *
   * We intentionally DO NOT return before this hook.
   *
   * This component may receive isOwner=false → true
   * or true → false during client rendering.
   *
   * Hooks must stay in the same order on every render.
   */
  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);

        window.requestAnimationFrame(() => {
          buttonRef.current?.focus();
        });
      }
    };

    document.addEventListener(
      'pointerdown',
      handlePointerDown
    );

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [open]);

  useEffect(() => {
    if (!isOwner && open) {
      setOpen(false);
    }
  }, [isOwner, open]);

  const toggleMenu = () => {
    if (!isOwner) return;

    setOpen((current) => !current);
  };

  const handleItemClick = (item) => {
    setOpen(false);

    if (typeof onNavigate === 'function') {
      onNavigate(item.id);
    }
  };

  /*
   * UI protection only.
   *
   * Real authorization MUST still be enforced by:
   * - Supabase RLS
   * - server route authorization
   * - owner_id checks
   *
   * Hiding this menu is NOT considered security.
   */
  if (!isOwner) {
    return null;
  }

  const safeSlug = getSafeSlug(slug);

  return (
    <div
      ref={menuRef}
      className={styles.ownerMenu}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.ownerMenuButton}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={
          open ? 'dipo-owner-menu' : undefined
        }
        onClick={toggleMenu}
      >
        <span
          className={styles.ownerMenuButtonIcon}
          aria-hidden="true"
        >
          ⚙
        </span>

        <span>Manage</span>

        <span
          className={[
            styles.ownerMenuChevron,
            open ? styles.ownerMenuChevronOpen : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          id="dipo-owner-menu"
          className={styles.ownerMenuDropdown}
          role="menu"
          aria-label="Manage your DIPO"
        >
          <div className={styles.ownerMenuHeader}>
            <span className={styles.ownerMenuTitle}>
              Manage Your DIPO
            </span>

            <span className={styles.ownerMenuSubtitle}>
              Owner controls
            </span>
          </div>

          <div
            className={styles.ownerMenuDivider}
            aria-hidden="true"
          />

          {OWNER_MENU_ITEMS.map((item) => {
            const href =
              item.id === 'live'
                ? safeSlug
                  ? `/p/${safeSlug}`
                  : '/explore'
                : item.href;

            return (
              <Link
                key={item.id}
                href={href || '/dashboard'}
                role="menuitem"
                className={[
                  styles.ownerMenuItem,
                  item.danger
                    ? styles.ownerMenuItemDanger
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleItemClick(item)}
              >
                <span
                  className={styles.ownerMenuItemIcon}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>

                <span className={styles.ownerMenuItemLabel}>
                  {item.label}
                </span>

                <span
                  className={styles.ownerMenuItemArrow}
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            );
          })}

          <div
            className={styles.ownerMenuDivider}
            aria-hidden="true"
          />

          <div className={styles.ownerMenuFooter}>
            <span
              className={styles.ownerMenuLiveDot}
              aria-hidden="true"
            />

            <span>Your DIPO is yours to manage.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export { OWNER_MENU_ITEMS };