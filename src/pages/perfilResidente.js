import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from '../components/carousel';
import ZoomInfo from '../components/zoomInfo';
import { residentesData } from '../data';
import { ZOOM_OVERLAY_COLORS } from '../config/zoomThemes';
import { buildCarouselItemsFromApi } from '../config/carouselMediaUtils';
import { getCarouselItems } from '../services/db';
import './perfilResidente.css';

const PerfilResidente = () => {
  const { id } = useParams();
  const data = residentesData[id];
  const [zoomIndex, setZoomIndex] = useState(null);

  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    getCarouselItems(id).then((data) => {
      setCarouselImages(buildCarouselItemsFromApi(data));
    });
  }, [id]);

  const sections = useMemo(() => {
    if (!data) return [];
    return data.sections || [];
  }, [data]);

  const zoomMetadata = useMemo(() => {
    if (!data || zoomIndex === null) return null;
    return data.zoomInfo?.[zoomIndex] || null;
  }, [data, zoomIndex]);

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
        <ZoomInfo
          item={carouselImages[zoomIndex]}
          info={zoomMetadata}
          residentName={data.nombre}
          onClose={() => setZoomIndex(null)}
          overlayColor={ZOOM_OVERLAY_COLORS.residentes}
          onNavigate={(dir) => {
            const total = carouselImages.length;
            if (total < 2) return;
            setZoomIndex((prev) =>
              dir === 'next' ? (prev + 1) % total : (prev - 1 + total) % total
            );
          }}
          totalItems={carouselImages.length}
        />
      )}
    </div>
  );
};

export default PerfilResidente;
