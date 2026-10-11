export function getImageDimensionsHint(
  type,
) {
  switch (type) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/webp':
      return {
        supported: true,
      };

    default:
      return {
        supported: false,
      };
  }
}

export function shouldProcessImage(
  file,
) {
  if (!file) {
    return false;
  }

  return (
    file.size >
    1024 * 1024
  );
}