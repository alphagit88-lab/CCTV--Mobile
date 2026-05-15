declare module 'react-native-vlc-rtsp' {
  import { ViewProps } from 'react-native';
  import React from 'react';

  export interface VlcSimplePlayerProps extends ViewProps {
    url?: string;
    autoplay?: boolean;
    autoAspectRatio?: boolean;
    showTop?: boolean;
    showBack?: boolean;
    title?: string;
    onStartFullScreen?: () => void;
    onCloseFullScreen?: () => void;
    onEnd?: (event: any) => void;
    onIsPlaying?: (event: any) => void;
    videoAspectRatio?: string;
  }

  export class VlcSimplePlayer extends React.Component<VlcSimplePlayerProps> {}
}
