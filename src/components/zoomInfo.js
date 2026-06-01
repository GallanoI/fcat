import React, { useEffect, useMemo, useRef, useState } from 'react';
import './zoomInfo.css';
import { useZoomPause } from '../config/zoomPauseContext';

const getSafeText = (value) => {
  if (typeof value !== 'string') return 'Por definir';
  const trimmed = value.trim();
  return trimmed ? trimmed : 'Por definir';
};

const ZoomInfo = ({ item, info, residentName = '', onClose, overlayColor, onNavigate, totalItems }) => {
  const { registerZoomOpen, registerZoomClose } = useZoomPause();
  const [mediaOrientation, setMediaOrientation] = useState('landscape');
  const touchStartX = useRef(null);

  const canNavigate = typeof onNavigate === 'function' && typeof totalItems === 'number' && totalItems > 1;

  useEffect(() => {
    if (!item) return undefined;

    registerZoomOpen();
    return () => {
      registerZoomClose();
    };
  }, [item, registerZoomOpen, registerZoomClose]);

  useEffect(() => {
    setMediaOrientation('landscape');
  }, [item]);

  const { firstName, lastName } = useMemo(() => {
    const parts = `${residentName || ''}`.trim().split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' '),
    };
  }, [residentName]);

  if (!item) return null;

  const meta = {
    nombre: getSafeText(info?.nombre),
    materiales: getSafeText(info?.materiales),
    resena: getSafeText(info?.resena),
  };

  const handleImageLoad = (event) => {
    const { naturalWidth = 0, naturalHeight = 0 } = event.currentTarget;
    setMediaOrientation(naturalHeight > naturalWidth ? 'portrait' : 'landscape');
  };

  const handleVideoMetadata = (event) => {
    const { videoWidth = 0, videoHeight = 0 } = event.currentTarget;
    setMediaOrientation(videoHeight > videoWidth ? 'portrait' : 'landscape');
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || !canNavigate) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    onNavigate(delta < 0 ? 'next' : 'prev');
  };

  const isMetaTextVisible = false;

  return (
    <div
      className="zoom-info-overlay"
      onClick={onClose}
      style={overlayColor ? { '--zoom-overlay-color': overlayColor } : undefined}
      onTouchStart={canNavigate ? handleTouchStart : undefined}
      onTouchEnd={canNavigate ? handleTouchEnd : undefined}
    >
      <div className="zoom-info-shell">
        <div className="zoom-info-title-wrap">
          <span className="zoom-info-title-half zoom-info-title-first">{firstName}</span>
          {lastName ? (
            <span className="zoom-info-title-half zoom-info-title-last">{lastName}</span>
          ) : null}
        </div>

        <div className="zoom-info-panel">
          <div className="zoom-info-info-col">
            <div
              className="zoom-info-meta"
              aria-hidden={!isMetaTextVisible}
              style={isMetaTextVisible ? undefined : { visibility: 'hidden' }}
            >
              <p className="zoom-info-meta-row">
                <span className="zoom-info-meta-label">Nombre: </span>
                {meta.nombre}
              </p>

              <p className="zoom-info-meta-row">
                <span className="zoom-info-meta-label">Materiales: </span>
                {meta.materiales}
              </p>

              <p className="zoom-info-meta-row">
                <span className="zoom-info-meta-label">Reseña: </span>
                {meta.resena}
              </p>
            </div>
          </div>

          <div className="zoom-info-photo-col">
            <div
              className={`zoom-info-media-stage ${
                mediaOrientation === 'portrait' ? 'is-portrait' : 'is-landscape'
              }`}
            >
              {item.type === 'video' ? (
                <video
                  className="zoom-info-media"
                  src={item.src}
                  controls
                  autoPlay
                  playsInline
                  onLoadedMetadata={handleVideoMetadata}
                  onClick={(event) => event.stopPropagation()}
                />
              ) : (
                <img
                  className="zoom-info-media"
                  src={item.src}
                  alt={meta.nombre || residentName || 'Obra ampliada'}
                  onLoad={handleImageLoad}
                  onClick={(event) => event.stopPropagation()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomInfo;
