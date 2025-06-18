import { expect, test } from 'vitest';

import { formatDate } from '../formatters';

test('formatDate', () => {
  expect(formatDate('2025-06-18T17:09:20.940Z')).toBe('2025-06-18');
});
