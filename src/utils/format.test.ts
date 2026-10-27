import { describe, expect, it } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it('hiển thị 0 giây thành 0:00', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('thêm số 0 ở đầu khi số giây lẻ dưới 10', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('đổi 300 giây thành 5:00', () => {
    expect(formatDuration(300)).toBe('5:00');
  });
});
