import React, { useMemo, useRef, useState } from 'react';
import Carousel from '../components/carousel';
import Zoom from '../components/zoom';
import { ZOOM_OVERLAY_COLORS } from '../config/zoomThemes';
import './escuelaNinos.css';

const EscuelaNinos = () => {
  const clickedIndexRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [videoSoundIndex, setVideoSoundIndex] = useState(null);
  const [zoomItem, setZoomItem] = useState(null);

  const escuelaMediaContext = require.context(
    '../assets/fotos/escuelaNinos',
    false,
    /\.(png|jpe?g|webp|mp4|webm|mov)$/i
  );

  const escuelaItems = useMemo(
    () => escuelaMediaContext
      .keys()
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map((key, index) => {
        const ext = key.split('.').pop()?.toLowerCase();
        const type = ['mp4', 'webm', 'mov'].includes(ext) ? 'video' : 'image';
        return {
          src: escuelaMediaContext(key),
          type,
          name: `escuela-${index + 1}`,
        };
      }),
    [escuelaMediaContext]
  );

  const safeIndex = Math.max(0, Math.min(selectedIndex, escuelaItems.length - 1));
  const activeItem = escuelaItems[safeIndex] || null;

  const handleCarouselIndexChange = (index) => {
    setSelectedIndex(index);
    if (clickedIndexRef.current === index) {
      clickedIndexRef.current = null;
      return;
    }
    setVideoSoundIndex(null);
  };

  const handleCarouselClick = (item, index) => {
    clickedIndexRef.current = index;
    setSelectedIndex(index);
    if (item?.type === 'video') {
      setVideoSoundIndex(index);
      return;
    }
    setVideoSoundIndex(null);
  };

  const shouldPlayVideoWithSound = activeItem?.type === 'video' && videoSoundIndex === safeIndex;

  return (
    <div className="escuela-ninos-page">
      {/* COLUMNA IZQUIERDA: texto scrollable */}
      <div className="escuela-left">
        <div className="escuela-title-area">
          <h1 className="escuela-title-top">
            <span className="escuela-word-min">escuela</span>
            <span className="escuela-word-max">ARTÍSTICA</span>
            <span className="escuela-word-min">para</span>
            <span className="escuela-word-max">NIÑOS</span>
          </h1>
        </div>

        <div className="escuela-info-text">
          <p className="escuela-text">
            Cada VACACIÓN, surge la misma pregunta:
            <br />
            ¿y si Hacemos escuela?
            <br />
            Una invitación a la libertad creativa el arte y el conocimiento.
            <br /><br />
            Entendemos y aspiramos a que las vacaciones no sean como una pausa del pensamiento, sino
            como el momento ideal para que el aprendizaje se vuelva juego y la creatividad se transforme
            en nuestra una tradición artística para las nuevas generaciones.
            <br /><br />
            Aquí, niñas, niños y ALGUNOS adultos se encuentran en un laboratorio abierto donde a través
            de artistas profesionales podemos aprender técnicas nuevas de diversas disciplinas e intereses.
            <br /><br />
            Así seguir creando en nuestros hogares hasta la siguiente salida del sol.
          </p>
        </div>

        <div className="escuela-inscripciones-section">
          <h2 className="escuela-section-title">INSCRIPCIONES JUNIO</h2>
          <div className="escuela-inscripciones-grid">
            <div className="ins-col">
              <h3>TALLERISTA</h3>
            </div>
            <div className="ins-col">
              <h3>ALUMNO</h3>
            </div>
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: media fija + carrusel */}
      <div className="escuela-right">
        <div className="escuela-active-panel">
          {activeItem?.type === 'video' ? (
            <video
              key={`${safeIndex}-${shouldPlayVideoWithSound ? 'sound' : 'mute'}`}
              className="escuela-active-media"
              src={activeItem.src}
              autoPlay
              loop
              controls
              playsInline
              muted={!shouldPlayVideoWithSound}
              onClick={() => setZoomItem(activeItem)}
            />
          ) : (
            <img
              className="escuela-active-media"
              src={activeItem?.src}
              alt="Escuela Niños actual"
              onClick={() => activeItem && setZoomItem(activeItem)}
            />
          )}
        </div>

        <div className="escuela-carousel-wrap">
          <Carousel
            items={escuelaItems}
            variant="gallery"
            visibleItems={4}
            showText={false}
            autoPlayInterval={7000}
            className="escuela-ninos-carousel"
            backgroundColor="rgba(255, 0, 0, 0.9)"
            onIndexChange={handleCarouselIndexChange}
            onImageClick={handleCarouselClick}
          />
        </div>
      </div>

      <Zoom
        item={zoomItem}
        onClose={() => setZoomItem(null)}
        overlayColor={ZOOM_OVERLAY_COLORS.educacion}
      />
    </div>
  );
};

export default EscuelaNinos;
