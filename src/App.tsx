const BUILD_TAG = "mz-4073";

import { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import LibraryPage from './features/library/LibraryPage';
import { PlayerBar } from './features/player/PlayerBar';
import { PlaylistProvider } from './features/playlists/PlaylistContext';

const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = lazy(
  () => import('./features/playlists/PlaylistDetailPage'),
);

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Thư viện',
    end: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M3 4.5h8M3 9h8M3 13.5h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M13.5 8.2v5.1a2 2 0 1 1-1.3-1.86V6l3.3-.9v2.2l-2 .5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/favorites',
    label: 'Yêu thích',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M9 15.2S2.8 11.4 2.8 6.9A3.4 3.4 0 0 1 9 4.7a3.4 3.4 0 0 1 6.2 2.2c0 4.5-6.2 8.3-6.2 8.3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/playlists',
    label: 'Playlist',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect
          x="2.6"
          y="3.4"
          width="12.8"
          height="11.2"
          rx="2.4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M6 7h6M6 10.5h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

function AppShell() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="4.9 2.3 17.6 17.6"
              fill="none"
              focusable="false"
              aria-hidden="true"
            >
              <path d="M8.7 4.2 20.7 2.7v2.6L8.7 6.8z" fill="currentColor" />
              <rect x="8.7" y="5.3" width="1.7" height="11.5" fill="currentColor" />
              <rect x="19" y="3.8" width="1.7" height="11.2" fill="currentColor" />
              <ellipse
                cx="9.4"
                cy="17.2"
                rx="2.7"
                ry="2.15"
                transform="rotate(-20 9.4 17.2)"
                fill="currentColor"
              />
              <ellipse
                cx="19.7"
                cy="15.6"
                rx="2.7"
                ry="2.15"
                transform="rotate(-20 19.7 15.6)"
                fill="currentColor"
              />
            </svg>
          </span>
          <div>
            <p className="brand-title">Mini Player</p>
            <p className="brand-sub">music room</p>
          </div>
        </div>

        <nav className="nav" aria-label="Điều hướng chính">
          <p className="nav-section-label">Khám phá</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="build-tag" title="Mã bản dựng">
            {BUILD_TAG}
          </span>
        </div>
      </aside>

      <div className="content">
        <div className="topbar">
          <div className="topbar-inner">
            <button
              type="button"
              className="theme-toggle"
              aria-label={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
              title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
              onClick={toggleTheme}
            >
              <span className="theme-icon" aria-hidden="true">
                {theme === 'dark' ? '☀' : '☾'}
              </span>
              <span className="theme-label">
                {theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
              </span>
            </button>
          </div>
        </div>

        <main className="main">
          <div className="main-inner">
            <Suspense fallback={<p className="loading-state">Đang tải trang...</p>}>
              <Routes>
                <Route path="/" element={<LibraryPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/playlists" element={<PlaylistsPage />} />
                <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>

      <PlayerBar />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PlaylistProvider>
        <AppShell />
      </PlaylistProvider>
    </ThemeProvider>
  );
}
