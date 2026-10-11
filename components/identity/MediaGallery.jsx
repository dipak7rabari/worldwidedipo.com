'use client';

import { useRef, useState } from 'react';
import styles from './Identity.module.css';

export function imageUrl(item) {
  const value =
    typeof item === 'string'
      ? item
      : item?.url;

  try {
    const url = new URL(value);

    return ['https:', 'http:'].includes(url.protocol)
      ? url.href
      : '';
  } catch {
    return '';
  }
}

export default function MediaGallery({
  gallery = [],
  name = 'Profile',
}) {
  const dialog = useRef(null);
  const [selected, setSelected] = useState(null);

  const images = Array.isArray(gallery)
    ? gallery
        .map((item, index) => ({
          url: imageUrl(item),
          alt:
            item?.alt ||
            `${name} image ${index + 1}`,
        }))
        .filter((item) => item.url)
    : [];

  function openPhoto(item) {
    setSelected(item);
    dialog.current?.showModal();
  }

  function closePhoto() {
    dialog.current?.close();
  }

  return (
    <>
      <div className={styles.gallery}>
        {images.map((item, index) => (
          <button
            type="button"
            key={`${item.url}-${index}`}
            className={styles.thumbnail}
            onClick={() => openPhoto(item)}
            aria-label={`Enlarge ${item.alt}`}
          >
            <img
              src={item.url}
              alt={item.alt}
              loading="lazy"
            />

            <span>{index + 1}</span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        className={styles.lightbox}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closePhoto();
          }
        }}
      >
        <button
          type="button"
          autoFocus
          className={styles.close}
          onClick={closePhoto}
          aria-label="Close photo"
        >
          ✕
        </button>

        {selected && (
          <img
            src={selected.url}
            alt={selected.alt}
          />
        )}
      </dialog>
    </>
  );
}