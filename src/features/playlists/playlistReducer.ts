export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export type PlaylistAction =
  | { type: 'create'; payload: { id: string; name: string } }
  | { type: 'rename'; payload: { id: string; name: string } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'addSong'; payload: { playlistId: string; songId: string } }
  | { type: 'removeSong'; payload: { playlistId: string; songId: string } };

export const playlistReducer = (
  state: Playlist[],
  action: PlaylistAction,
): Playlist[] => {
  switch (action.type) {
    case 'create':
      return [
        ...state,
        {
          id: action.payload.id,
          name: action.payload.name.trim(),
          songIds: [],
        },
      ];

    case 'rename':
      return state.map((playlist) =>
        playlist.id === action.payload.id
          ? { ...playlist, name: action.payload.name.trim() }
          : playlist,
      );

    case 'remove':
      return state.filter((playlist) => playlist.id !== action.payload.id);

    case 'addSong':
      return state.map((playlist) => {
        if (playlist.id !== action.payload.playlistId) return playlist;
        if (playlist.songIds.includes(action.payload.songId)) return playlist;

        return {
          ...playlist,
          songIds: [...playlist.songIds, action.payload.songId],
        };
      });

    case 'removeSong':
      return state.map((playlist) => {
        if (playlist.id !== action.payload.playlistId) return playlist;
        if (!playlist.songIds.includes(action.payload.songId)) return playlist;

        return {
          ...playlist,
          songIds: playlist.songIds.filter((songId) => songId !== action.payload.songId),
        };
      });

    default:
      return state;
  }
};
