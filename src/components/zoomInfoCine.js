import React, { useEffect } from 'react';
import './zoomInfoCine.css';
import { useZoomPause } from '../config/zoomPauseContext';

const getSafeText = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const defaultProfesores = ['TANIA PAZ', 'FRANCISCO HEBIA', 'BARBARA CASTILLO'];

const ZoomInfoCine = ({ item, info, onClose, overlayColor }) => {
  const { registerZoomOpen, registerZoomClose } = useZoomPause();

  useEffect(() => {
    if (!item) return undefined;

    registerZoomOpen();
    return () => {
      registerZoomClose();
    };
  }, [item, registerZoomOpen, registerZoomClose]);

  if (!item) return null;

  const title = getSafeText(info?.title) || 'ESCUELA DE CINE J.D.L.';
  const direccion = getSafeText(info?.direccion) || 'CRISTAL JACOB';
  const coordinacion = getSafeText(info?.coordinacion) || 'TANIA PAZ';
  const profesores = Array.isArray(info?.profesores) && info.profesores.length
    ? info.profesores
    : defaultProfesores;

  return (
    <div
      className="cine-zoom-overlay"
      onClick={onClose}
      style={overlayColor ? { '--cine-zoom-overlay-color': overlayColor } : undefined}
    >
      <div className="cine-zoom-shell">
        <div className="cine-zoom-panel">
          <div className="cine-zoom-info-col">
            <div className="cine-zoom-info-block">
              <div className="cine-zoom-info-section">
                <p className="cine-zoom-info-label">Dirección</p>
                <p className="cine-zoom-info-line">{direccion}</p>
              </div>

              <div className="cine-zoom-info-section">
                <p className="cine-zoom-info-label">Coordinación de proyecto</p>
                <p className="cine-zoom-info-line">{coordinacion}</p>
              </div>

              <div className="cine-zoom-info-section">
                <p className="cine-zoom-info-label">Profesores</p>
                {profesores.map((nombre) => (
                  <p key={nombre} className="cine-zoom-info-line">
                    {nombre}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="cine-zoom-media-col">
            <div className="cine-zoom-title-wrap">
              <p className="cine-zoom-title">{title}</p>
            </div>

            <div className="cine-zoom-media-stage">
              {item.type === 'video' ? (
                <video
                  className="cine-zoom-media"
                  src={item.src}
                  controls
                  autoPlay
                  playsInline
                  onClick={(event) => event.stopPropagation()}
                />
              ) : (
                <img
                  className="cine-zoom-media"
                  src={item.src}
                  alt={title || 'Imagen ampliada'}
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

export default ZoomInfoCine;
