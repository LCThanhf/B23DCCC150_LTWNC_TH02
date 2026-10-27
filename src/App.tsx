const BUILD_TAG = "mz-4073";

import type { ReactNode } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import FavoritesPage from './features/favorites/FavoritesPage';
import LibraryPage from './features/library/LibraryPage';
import { PlayerBar } from './features/player/PlayerBar';
import PlaylistDetailPage from './features/playlists/PlaylistDetailPage';
import PlaylistsPage from './features/playlists/PlaylistsPage';

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

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ♫
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

      <main className="main">
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </main>

      <PlayerBar />
    </div>
  );
}
