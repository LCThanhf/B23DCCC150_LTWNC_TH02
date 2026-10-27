import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { playlistReducer } from './playlistReducer';
import type { Playlist, PlaylistAction } from './playlistReducer';
import { withLogger } from './withLogger';

export const PLAYLISTS_STORAGE_KEY = 'music-playlists';

export const PlaylistStateContext = createContext<Playlist[] | null>(null);
export const PlaylistDispatchContext = createContext<Dispatch<PlaylistAction> | null>(
  null,
);

const isPlaylist = (value: unknown): value is Playlist => {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    Array.isArray(candidate.songIds) &&
    candidate.songIds.every((songId) => typeof songId === 'string')
  );
};

const loadPlaylists = (): Playlist[] => {
  try {
    const raw = window.localStorage.getItem(PLAYLISTS_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isPlaylist) : [];
  } catch {
    return [];
  }
};

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, dispatch] = useReducer(
    withLogger(playlistReducer),
    undefined,
    loadPlaylists,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
    } catch {
      // Trình duyệt có thể chặn localStorage (chế độ riêng tư) — bỏ qua.
    }
  }, [playlists]);

  return (
    <PlaylistStateContext.Provider value={playlists}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
}

export const usePlaylists = (): Playlist[] => {
  const context = useContext(PlaylistStateContext);

  if (context === null) {
    throw new Error('usePlaylists phải được dùng bên trong <PlaylistProvider>');
  }

  return context;
};

export const usePlaylistDispatch = (): Dispatch<PlaylistAction> => {
  const context = useContext(PlaylistDispatchContext);

  if (context === null) {
    throw new Error(
      'usePlaylistDispatch phải được dùng bên trong <PlaylistProvider>',
    );
  }

  return context;
};
