import React, { useEffect, useRef } from 'react';
import './activeMediaPanel.css';

const ActiveMediaPanel = ({
  item,
  alt = 'Media actual',
  className = '',
  frameClassName = '',
  mediaClassName = '',
  onClick,
  children,
  aspectRatio = '16 / 9',
  borderRadius = '10%',
  borderColor = '#000',
  backgroundColor = 'transparent',
  videoMuted = false,
  videoLoop = false,
  videoAutoPlay = true,
}) => {
  const videoRef = useRef(null);
  const isVideo = item?.type === 'video';
  const isInteractive = typeof onClick === 'function';

  useEffect(() => {
    if (!item || !isVideo || !videoRef.current || !videoAutoPlay) {
      return undefined;
    }

    const video = videoRef.current;
    video.currentTime = 0;
    const playPromise = video.play();

    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }

    return () => {
      video.pause();
      video.currentTime = 0;
    };
  }, [isVideo, item, videoAutoPlay]);

  useEffect(() => {
    if (!videoRef.current || !isVideo) return;
    videoRef.current.muted = videoMuted;
  }, [isVideo, videoMuted]);

  const handleKeyDown = (event) => {
    if (!isInteractive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  if (!item) return null;

  return (
    <div className={`active-media-panel ${className}`.trim()}>
      <div
        className={`active-media-panel-frame ${frameClassName}`.trim()}
        style={{
          '--active-media-aspect-ratio': aspectRatio,
          '--active-media-radius': borderRadius,
          '--active-media-border': borderColor,
          '--active-media-bg': backgroundColor,
        }}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
      >
        {isVideo ? (
          <video
            key={item.src}
            ref={videoRef}
            className={`active-media-panel-media ${mediaClassName}`.trim()}
            src={item.src}
            autoPlay={videoAutoPlay}
            loop={videoLoop}
            playsInline
            muted={videoMuted}
            preload="metadata"
          />
        ) : (
          <img
            className={`active-media-panel-media ${mediaClassName}`.trim()}
            src={item.src}
            alt={alt || item.name || 'Media actual'}
          />
        )}
      </div>

      {children}
    </div>
  );
};

export default ActiveMediaPanel;
