import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebounce', () => {
  it('giữ giá trị cũ trước khi hết thời gian chờ', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'mưa' } },
    );

    rerender({ value: 'nắng' });
    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('mưa');
  });

  it('trả về giá trị mới sau đúng 300ms', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'mưa' } },
    );

    rerender({ value: 'nắng' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('nắng');
  });
});
