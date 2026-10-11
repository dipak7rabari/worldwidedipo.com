import styles from './Identity.module.css';

export function planKey(plan) {
  const key = String(plan || '')
    .trim()
    .toLowerCase();

  return ['starter', 'pro', 'elite'].includes(key)
    ? key
    : 'starter';
}

export default function PlanBadge({ plan }) {
  const key = planKey(plan);

  const label =
    key === 'elite'
      ? '✦ Authority Elite'
      : key === 'pro'
        ? '✧ Featured · Pro'
        : 'Starter Index';

  return (
    <span
      className={`${styles.badge} ${styles[key]}`}
    >
      {label}
    </span>
  );
}