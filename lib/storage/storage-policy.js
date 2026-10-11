import { getPlanConfig } from '@/config/plans';

export function getImageLimitForPlan(plan) {
  const normalizedPlan = String(plan || '')
    .trim()
    .toLowerCase();

  const config = getPlanConfig(normalizedPlan);
  const limit = Number(config?.imageLimit);

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('Invalid image limit.');
  }

  return limit;
}

export function canUploadMoreImages({
  plan,
  currentCount,
}) {
  const limit =
    getImageLimitForPlan(plan);

  return (
    Number(currentCount) < limit
  );
}

export function getProfileMediaPath({
  userId,
  type,
  fileName,
}) {
  if (
    !userId ||
    !/^[0-9a-f-]{36}$/i.test(
      userId,
    )
  ) {
    throw new Error(
      'Invalid user ID.',
    );
  }

  if (
    type !== 'avatar' &&
    type !== 'gallery'
  ) {
    throw new Error(
      'Invalid media type.',
    );
  }

  if (
    !fileName ||
    fileName.includes('/') ||
    fileName.includes('\\')
  ) {
    throw new Error(
      'Invalid file name.',
    );
  }

  return `${userId}/${type}/${fileName}`;
}