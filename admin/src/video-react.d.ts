declare module 'video-react' {
  import * as React from 'react';

  interface PlayerProps {
    src: string;
    poster?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    playsInline?: boolean;
    startTime?: number;
    aspectRatio?: string;
    fluid?: boolean;
    width?: number | string;
    height?: number | string;
    videoId?: string;
    className?: string;
    style?: React.CSSProperties;
    preload?: 'auto' | 'metadata' | 'none';
    crossOrigin?: string;
    onLoadStart?: () => void;
    onWaiting?: () => void;
    onCanPlay?: () => void;
    onCanPlayThrough?: () => void;
    onPlaying?: () => void;
    onEnded?: () => void;
    onSeeking?: () => void;
    onSeeked?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onProgress?: (state: any) => void;
    onDurationChange?: () => void;
    onError?: () => void;
    onSuspend?: () => void;
    onAbort?: () => void;
    onEmptied?: () => void;
    onStalled?: () => void;
    onLoadedMetadata?: () => void;
    onLoadedData?: () => void;
    onResize?: () => void;
    onVolumeChange?: () => void;
    onFullScreenChange?: () => void;
    onEnterFullScreen?: () => void;
    onExitFullScreen?: () => void;
    children?: React.ReactNode; // added children prop
  }

  interface BigPlayButtonProps {
    position?: string; // added style prop
  }

  export class Player extends React.Component<PlayerProps> {}

  export const BigPlayButton: React.FC<BigPlayButtonProps>;
  export const ControlBar: React.FC;
  // ... additional exports
}
