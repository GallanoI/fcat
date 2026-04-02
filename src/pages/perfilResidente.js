import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from '../components/carousel';
import Zoom from '../components/zoom';
import { residentesData } from '../data';
import { ZOOM_OVERLAY_COLORS } from '../config/zoomThemes';
import './perfilResidente.css';

const PerfilResidente = () => {
  const { id } = useParams();
  const data = residentesData[id];
  const [zoomIndex, setZoomIndex] = useState(null);

  const carouselImages = useMemo(() => {
    if (!data) return [];
    return data.carousel || [];
  }, [data]);

  const sections = useMemo(() => {
    if (!data) return [];
    return data.sections || [];
  }, [data]);

  if (!data) {
    return <div className="resident-error">Residente no encontrado</div>;
  }

  return (
    <div className="resident-profile">
      <div className="resident-left">
        <div className="resident-header">
          <div className="resident-name">
            <h1 className="resident-name-text"> {data.nombre} </h1>
          </div>
        </div>
        <div className="resident-info">
          {sections.map((item, index) => {
            if (item.type === 'text') {
              return (
                <p key={index} className="resident-text">
                  {item.content}
                </p>
              );
            }
            if (item.type === 'image') {
              return (
                <img
                  key={index}
                  className="resident-info-img"
                  src={item.src}
                  alt={item.alt || data.nombre}
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="resident-right">
        <div className="resident-carousel">
          <Carousel
            items={carouselImages}
            visibleItems={1}
            showText={false}
            onImageClick={(item, index) => setZoomIndex(index)}
          />
        </div>
      </div>

      {zoomIndex !== null && (
        <Zoom
          item={carouselImages[zoomIndex]}
          onClose={() => setZoomIndex(null)}
          overlayColor={ZOOM_OVERLAY_COLORS.residentes}
        />
      )}
    </div>
  );
};

export default PerfilResidente;
