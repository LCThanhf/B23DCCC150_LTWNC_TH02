import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.dataset.theme = 'dark';
});

describe('App', () => {
  it('hiển thị thanh menu và đổi giao diện sáng/tối', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Tất cả bài hát' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Yêu thích' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Giao diện sáng' }));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: 'Giao diện tối' })).toBeInTheDocument();
  });

  it('tải trang Playlist bằng lazy loading khi bấm menu', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Playlist' }));

    expect(await screen.findByText('Playlist của bạn')).toBeInTheDocument();
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
  });
});
