import { describe, expect, it } from 'vitest';

import {
  validateSupportRequest,
} from '@/lib/support/support-validation';

describe('support security', () => {
  it('accepts a valid support request', () => {
    const result = validateSupportRequest({
      subject: 'Profile help',
      category: 'profile',
      message: 'I need help updating my profile.',
    });

    expect(result.valid).toBe(true);
  });

  it('rejects an empty subject', () => {
    const result = validateSupportRequest({
      subject: '',
      category: 'general',
      message: 'Hello',
    });

    expect(result.valid).toBe(false);
  });

  it('rejects an invalid category', () => {
    const result = validateSupportRequest({
      subject: 'Test',
      category: 'admin-access',
      message: 'Hello',
    });

    expect(result.valid).toBe(false);
  });

  it('rejects oversized messages', () => {
    const result = validateSupportRequest({
      subject: 'Test',
      category: 'general',
      message: 'a'.repeat(5001),
    });

    expect(result.valid).toBe(false);
  });
});