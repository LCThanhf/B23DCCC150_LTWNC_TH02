import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import type { Song } from '../../types';
import { SongRow } from './SongRow';

interface RowData {
  songs: Song[];
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

const Row = ({ index, style, data }: ListChildComponentProps<RowData>) => {
  const song = data.songs[index];

  return (
    <SongRow
      song={song}
      index={index}
      style={style}
      onPlay={data.onPlay}
      onAddToQueue={data.onAddToQueue}
    />
  );
};

const ROW_HEIGHT = 56;
const LIST_HEIGHT = 560;
const FALLBACK_WIDTH = 960;

export interface VirtualSongListProps {
  songs: Song[];
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

export const VirtualSongList = memo(function VirtualSongList({
  songs,
  onPlay,
  onAddToQueue,
}: VirtualSongListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(FALLBACK_WIDTH);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const measure = () => {
      setWidth(node.clientWidth > 0 ? node.clientWidth : FALLBACK_WIDTH);
    };

    measure();
    window.addEventListener('resize', measure);

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(node);

    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, []);

  const itemData = useMemo<RowData>(
    () => ({ songs, onPlay, onAddToQueue }),
    [songs, onPlay, onAddToQueue],
  );

  return (
    <div className="song-list" ref={containerRef}>
      <FixedSizeList<RowData>
        height={LIST_HEIGHT}
        width={width}
        itemCount={songs.length}
        itemSize={ROW_HEIGHT}
        itemData={itemData}
        itemKey={(index, data) => data.songs[index].id}
        overscanCount={6}
        className="song-scroll"
      >
        {Row}
      </FixedSizeList>
    </div>
  );
});
