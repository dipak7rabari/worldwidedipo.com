const MAX_SUBJECT_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 5000;

const CATEGORIES = new Set([
  'general',
  'profile',
  'payment',
  'renewal',
  'technical',
  'verification',
  'other',
]);

function cleanText(value) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/\u0000/g, '')
    .trim();
}

export function validateSupportRequest(input) {
  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      error: 'Invalid request.',
    };
  }

  const subject = cleanText(input.subject);
  const message = cleanText(input.message);
  const category = cleanText(input.category || 'general');

  if (!subject) {
    return {
      valid: false,
      error: 'Subject is required.',
    };
  }

  if (subject.length > MAX_SUBJECT_LENGTH) {
    return {
      valid: false,
      error: 'Subject is too long.',
    };
  }

  if (!message) {
    return {
      valid: false,
      error: 'Message is required.',
    };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: 'Message is too long.',
    };
  }

  if (!CATEGORIES.has(category)) {
    return {
      valid: false,
      error: 'Invalid support category.',
    };
  }

  return {
    valid: true,
    data: {
      subject,
      message,
      category,
    },
  };
}

export const SUPPORT_CATEGORIES = [
  {
    value: 'general',
    label: 'General',
  },
  {
    value: 'profile',
    label: 'Profile',
  },
  {
    value: 'payment',
    label: 'Payment',
  },
  {
    value: 'renewal',
    label: 'Renewal',
  },
  {
    value: 'technical',
    label: 'Technical',
  },
  {
    value: 'verification',
    label: 'Verification',
  },
  {
    value: 'other',
    label: 'Other',
  },
];