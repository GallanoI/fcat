import React, { useEffect, useRef } from 'react';
import './zoom.css';
import { useZoomPause } from '../config/zoomPauseContext';

const Zoom = ({ item, onClose, overlayColor, items, currentIndex, onNavigate }) => {
  const { registerZoomOpen, registerZoomClose } = useZoomPause();
  const touchStartX = useRef(null);

  const canNavigate = Array.isArray(items) && items.length > 1 && typeof onNavigate === 'function';

  useEffect(() => {
    if (!item) return undefined;

    registerZoomOpen();
    return () => {
      registerZoomClose();
    };
  }, [item, registerZoomOpen, registerZoomClose]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || !canNavigate) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    const total = items.length;
    if (delta < 0) {
      onNavigate((currentIndex + 1) % total);
    } else {
      onNavigate((currentIndex - 1 + total) % total);
    }
  };

  if (!item) return null;

  return (
    <div
      className="zoom-overlay"
      onClick={onClose}
      style={overlayColor ? { '--zoom-overlay-color': overlayColor } : undefined}
      onTouchStart={canNavigate ? handleTouchStart : undefined}
      onTouchEnd={canNavigate ? handleTouchEnd : undefined}
    >
      {item.type === 'video' ? (
        <video
          className="zoom-media"
          src={item.src}
          controls
          playsInline
          onClick={(event) => event.stopPropagation()}
        />
      ) : (
        <img
          className="zoom-media"
          src={item.src}
          alt="Zoom"
          onClick={(event) => event.stopPropagation()}
        />
      )}
    </div>
  );
};

export default Zoom;
