const MAX_SLUG_LENGTH = 30;

export function slugify(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '');
}

export function createSuggestedSlug(name) {
  const slug = slugify(name);

  return slug || 'profile';
}