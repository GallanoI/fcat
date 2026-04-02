import React, { useEffect } from 'react';
import './zoom.css';
import { useZoomPause } from '../config/zoomPauseContext';

const Zoom = ({ item, onClose, overlayColor }) => {
  const { registerZoomOpen, registerZoomClose } = useZoomPause();

  useEffect(() => {
    if (!item) return undefined;

    registerZoomOpen();
    return () => {
      registerZoomClose();
    };
  }, [item, registerZoomOpen, registerZoomClose]);

  if (!item) return null;

  return (
    <div
      className="zoom-overlay"
      onClick={onClose}
      style={overlayColor ? { '--zoom-overlay-color': overlayColor } : undefined}
    >
      {item.type === 'video' ? (
        <video
          className="zoom-media"
          src={item.src}
          controls
          autoPlay
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
