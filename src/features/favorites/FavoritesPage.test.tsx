import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePlayerStore } from '../player/usePlayerStore';
import FavoritesPage from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';

beforeEach(() => {
  window.localStorage.clear();
  useFavoritesStore.setState({ ids: [] });
  usePlayerStore.setState({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    position: 0,
  });
});

describe('FavoritesPage', () => {
  it('hiển thị thông báo khi chưa có bài yêu thích', () => {
    render(<FavoritesPage />);

    expect(screen.getByText('Bạn chưa có bài hát yêu thích')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Phát tất cả' })).toBeDisabled();
  });

  it('liệt kê các bài đã thích và phát tất cả', () => {
    useFavoritesStore.setState({ ids: ['s1', 's3'] });

    render(<FavoritesPage />);

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Gió tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('6:14')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Phát tất cả' }));

    expect(usePlayerStore.getState().queue).toHaveLength(2);
    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });

  it('gỡ bài khỏi yêu thích ngay trên danh sách', () => {
    useFavoritesStore.setState({ ids: ['s1', 's3'] });

    render(<FavoritesPage />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Bỏ yêu thích' })[0]);

    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
    expect(useFavoritesStore.getState().ids).toEqual(['s3']);
  });
});
