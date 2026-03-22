import React from 'react';
import './zoom.css';

const Zoom = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="zoom-overlay" onClick={onClose}>
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
