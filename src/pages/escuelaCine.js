import React, { useEffect, useMemo, useState } from 'react';
import Carousel from '../components/carousel';
import Zoom from '../components/zoom';
import ZoomInfoCine from '../components/zoomInfoCine';
import { buildCarouselItemsFromApi } from '../config/carouselMediaUtils';
import { getCarouselItems } from '../services/db';
import './escuelaCine.css';


const EscuelaCine = () => {
  const [zoomItem, setZoomItem] = useState(null);
  const [zoomInfoIndex, setZoomInfoIndex] = useState(null);

  const [cineItems, setCineItems] = useState([]);

  useEffect(() => {
    getCarouselItems('escuelaCine').then((data) => {
      setCineItems(
        buildCarouselItemsFromApi(data, (dbItem, idx) => ({
          name: `cine-${idx + 1}`,
        }))
      );
    });
  }, []);

  const cineZoomDetails = useMemo(
    () =>
      cineItems.map((_, index) => ({
        title: 'ESCUELA DE CINE J.D.L.',
        direccion: 'CRISTAL JACOB',
        coordinacion: 'TANIA PAZ',
        profesores: ['TANIA PAZ', 'FRANCISCO HEBIA', 'BARBARA CASTILLO'],
        index,
      })),
    [cineItems]
  );

  const handleMetamorfosisClick = () => {
    setZoomInfoIndex(null);
    setZoomItem({
      type: 'video',
      src: process.env.PUBLIC_URL + '/assets/videos/METAMORFOSIS.mp4',
      name: 'Metamorfosis',
    });
  };

  return (
    <div className="cine-page">
      <div className="cine-left">
        <header className="cine-title-area">
          <h1 className="cine-title-text">
            {' ESCUELA DE CINE PARA '}
            <br />
            {' JOVENES DISCIDENCIAS '}
          </h1>
        </header>

        <div className="cine-left-content">
          <div className="cine-top-grid">
            <div className="cine-list-col">
              <ul className="cine-grid-left">
                <li>DESPLANTE ESCÉNICO</li>
                <li>GUIÓN</li>
                <li>HISTORIA Y TEORÍA CINEMATOGRÁFICA</li>
              </ul>
            </div>
            <div className="cine-list-col">
              <ul className="cine-grid-right">
                <li>ACTUACIÓN</li>
                <li>CÁMARA</li>
                <li>EDICIÓN</li>
              </ul>
            </div>
          </div>

          <div className="cine-bottom-row">
            <button className="metamorfosis-btn" onClick={handleMetamorfosisClick} type="button">
              <img
                src={process.env.PUBLIC_URL + '/assets/fotos/escuelaCine/metamorfosis-poster.png'}
                alt="Metamorfosis"
                className="metamorfosis-poster"
              />
              <span className="metamorfosis-play">▶</span>
              <span className="metamorfosis-hover-text">
                Reproducir
                <br />
                METAMORFOSIS
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="cine-right">
        <div className="cine-carousel-wrap">
          <Carousel
            items={cineItems}
            variant="gallery"
            visibleItems={1}
            showText={false}
            autoPlayInterval={7000}
            className="cine-carousel"
            backgroundColor="rgba(251, 125, 102, 1)"
            onImageClick={(item, index) => {
              setZoomItem(null);
              setZoomInfoIndex(index);
            }}
          />
        </div>

        <p className="cine-carousel-caption">En la escuela de jóvenes disidencias</p>
      </div>

      <ZoomInfoCine
        item={zoomInfoIndex !== null ? cineItems[zoomInfoIndex] : null}
        info={zoomInfoIndex !== null ? cineZoomDetails[zoomInfoIndex] : null}
        onClose={() => setZoomInfoIndex(null)}
        overlayColor="rgba(251, 125, 102, 1)"
      />

      <Zoom
        item={zoomItem}
        onClose={() => setZoomItem(null)}
        overlayColor="rgba(251, 125, 102, 1)"
      />
    </div>
  );
};

export default EscuelaCine;
