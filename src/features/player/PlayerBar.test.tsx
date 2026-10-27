import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateSongs } from '../../data/songs';
import { PlayerBar } from './PlayerBar';
import { usePlayerStore } from './usePlayerStore';

const [first, second] = generateSongs(2);

beforeEach(() => {
  usePlayerStore.setState({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    position: 0,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('PlayerBar', () => {
  it('hiển thị trạng thái chưa phát bài nào', () => {
    render(<PlayerBar />);

    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Phát' })).toBeDisabled();
  });

  it('cập nhật thời gian mỗi giây khi đang phát', () => {
    vi.useFakeTimers();
    usePlayerStore.getState().playQueue([first], 0);

    render(<PlayerBar />);

    expect(screen.getByTestId('progress-time')).toHaveTextContent('0:00 / 2:30');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('progress-time')).toHaveTextContent('0:05 / 2:30');
    expect(screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh')).toBeInTheDocument();
  });

  it('dừng đồng hồ khi bấm Tạm dừng và chạy tiếp khi bấm Phát', () => {
    vi.useFakeTimers();
    usePlayerStore.getState().playQueue([first], 0);

    render(<PlayerBar />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId('progress-time')).toHaveTextContent('0:02 / 2:30');

    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('progress-time')).toHaveTextContent('0:02 / 2:30');

    fireEvent.click(screen.getByRole('button', { name: 'Phát' }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('progress-time')).toHaveTextContent('0:03 / 2:30');
  });

  it('chuyển bài bằng nút Sau và quay lại bằng nút Trước', () => {
    usePlayerStore.getState().playQueue([first, second], 0);

    render(<PlayerBar />);

    expect(screen.getByText('Hàng đợi: 2 bài')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sau' }));

    expect(
      screen.getByText('Đang phát: Nắng tháng Sáu 1 – Quang Huy'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('progress-time')).toHaveTextContent('0:00 / 3:07');

    fireEvent.click(screen.getByRole('button', { name: 'Trước' }));

    expect(
      screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh'),
    ).toBeInTheDocument();
  });

  it('bấm Sau ở bài cuối thì dừng phát', () => {
    usePlayerStore.getState().playQueue([first], 0);

    render(<PlayerBar />);

    fireEvent.click(screen.getByRole('button', { name: 'Sau' }));

    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(screen.getByRole('button', { name: 'Phát' })).toBeInTheDocument();
  });
});
