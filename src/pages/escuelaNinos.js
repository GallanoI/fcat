import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Carousel from '../components/carousel';
import Zoom from '../components/zoom';
import { ZOOM_OVERLAY_COLORS } from '../config/zoomThemes';
import './escuelaNinos.css';

const EscuelaNinos = () => {
  const pageRef = useRef(null);
  const topLeftRef = useRef(null);
  const lowerSectionRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomItem, setZoomItem] = useState(null);
  const [isLowerStage, setIsLowerStage] = useState(false);

  const escuelaMediaContext = require.context(
    '../assets/fotos/escuelaNinos',
    false,
    /\.(png|jpe?g|webp|mp4|webm|mov)$/i
  );

  const escuelaItems = useMemo(() => {
    const sortedKeys = escuelaMediaContext
      .keys()
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    const imageKeys = [];
    const videoKeys = [];

    sortedKeys.forEach((key) => {
      const ext = key.split('.').pop()?.toLowerCase();
      if (['mp4', 'webm', 'mov'].includes(ext)) {
        videoKeys.push(key);
      } else {
        imageKeys.push(key);
      }
    });

    return [...imageKeys, ...videoKeys].map((key, index) => {
      const ext = key.split('.').pop()?.toLowerCase();
      const type = ['mp4', 'webm', 'mov'].includes(ext) ? 'video' : 'image';
      return {
        src: escuelaMediaContext(key),
        type,
        name: `escuela-${index + 1}`,
      };
    });
  }, [escuelaMediaContext]);

  const hasItems = escuelaItems.length > 0;
  const safeIndex = hasItems
    ? Math.max(0, Math.min(selectedIndex, escuelaItems.length - 1))
    : 0;
  const activeItem = hasItems ? escuelaItems[safeIndex] : null;

  const handleCarouselIndexChange = (index) => {
    setSelectedIndex(index);
  };

  const handleCarouselClick = (_, index) => {
    setSelectedIndex(index);
  };

  const handleTopLeftWheel = (e) => {
    const container = topLeftRef.current;
    if (!container) return;

    const reachedBottom = Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight;
    const isScrollingDown = e.deltaY > 0;

    if (reachedBottom && isScrollingDown) {
      e.preventDefault();
      lowerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const container = pageRef.current;
    const lowerSection = lowerSectionRef.current;
    if (!container || !lowerSection) return;

    const handlePageScroll = () => {
      const threshold = lowerSection.offsetTop - container.clientHeight * 0.5;
      setIsLowerStage(container.scrollTop >= threshold);
    };

    handlePageScroll();
    container.addEventListener('scroll', handlePageScroll);
    return () => container.removeEventListener('scroll', handlePageScroll);
  }, []);

  const carouselClassName = `escuela-ninos-carousel${hasItems && escuelaItems.length <= 1 ? ' is-single-item' : ''}`;

  return (
    <div className="escuela-ninos-page" ref={pageRef}>
      <div className="escuela-static-bg" />

      <section className="escuela-section escuela-section-top">
        <div
          className="escuela-left escuela-left-top"
          ref={topLeftRef}
          onWheel={handleTopLeftWheel}
        >
          <div className="escuela-title-area">
            <div className="escuela-title-sup">
              <h1 className="escuela-title-top">
                <span className="escuela-word-min">escuela</span>{'  '}
                <span className="escuela-word-max">ARTÍSTICA</span>
                <br />
                <span className="escuela-word-min">para</span>{'  '}
                <span className="escuela-word-max">NIÑOS</span>
              </h1>
            </div>
          </div>

          <div className="escuela-info-text">
            <p className="escuela-text">Cada VACACIÓN, surge la misma pregunta:</p>
            <p className="pregunta-escuela">¿y si Hacemos escuela?</p>
            <p className="escuela-text">
              Una invitación a la libertad creativa el arte y el conocimiento.
            </p>
            <p className="escuela-text">
              Entendemos y aspiramos a que las vacaciones no sean como una pausa del pensamiento, sino
              como el momento ideal para que el aprendizaje se vuelva juego y la creatividad se transforme
              en nuestra una tradición artística para las nuevas generaciones.
            </p>
            <p className="escuela-text">
              Aquí, niñas, niños y ALGUNOS adultos se encuentran en un laboratorio abierto donde a través
              de artistas profesionales podemos aprender técnicas nuevas de diversas disciplinas e intereses.
            </p>
            <p className="escuela-text">
              Así seguir creando en nuestros hogares hasta la siguiente salida del sol.
            </p>
          </div>
        </div>
        <div className="escuela-right-spacer" />
      </section>

      <section className="escuela-section escuela-section-bottom" ref={lowerSectionRef}>
        <div className="escuela-left escuela-left-bottom">
          <div className="escuela-inscripciones-section">
            <div className="escuela-inscripciones-title-box">
              <div className="escuela-inscripciones-text">
                <h2 className="escuela-section-title">INSCRIPCIONES JUNIO</h2>
              </div>
            </div>
            <div className="escuela-inscripciones-box">
              <div className="escuela-inscripciones-grid">
                <div className="ins-col">
                  <h3>TALLERISTA</h3>
                  <div className="ins-placeholder" />
                </div>
                <div className="ins-col">
                  <h3>ALUMNO</h3>
                  <div className="ins-placeholder" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="escuela-right-spacer" />
      </section>

      <motion.aside
        className={`escuela-stage ${isLowerStage ? 'stage-lower' : 'stage-upper'}`}
        animate={{ backgroundColor: isLowerStage ? 'rgba(255, 0, 0, 0.7)' : 'rgba(217, 217, 217, 1)' }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        {hasItems && (
          <>
            <motion.div
              className="escuela-stage-panel"
              animate={{ top: isLowerStage ? '40%' : '8%' }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              {activeItem?.type === 'video' ? (
                <video
                  key={`stage-${safeIndex}`}
                  className="escuela-active-media"
                  src={activeItem.src}
                  autoPlay
                  loop
                  playsInline
                  muted
                  onClick={() => setZoomItem(activeItem)}
                />
              ) : activeItem ? (
                <img
                  className="escuela-active-media"
                  src={activeItem.src}
                  alt="Escuela Niños actual"
                  onClick={() => setZoomItem(activeItem)}
                />
              ) : null}
            </motion.div>

            <motion.div
              className="escuela-stage-carousel"
              animate={{ top: isLowerStage ? '4%' : '68%' }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              <Carousel
                items={escuelaItems}
                variant="gallery"
                visibleItems={3}
                showText={false}
                autoPlayInterval={7000}
                className={carouselClassName}
                backgroundColor="rgba(255, 0, 0, 1)"
                onIndexChange={handleCarouselIndexChange}
                onImageClick={handleCarouselClick}
              />
            </motion.div>
          </>
        )}
      </motion.aside>

      <Zoom
        item={zoomItem}
        onClose={() => setZoomItem(null)}
        overlayColor={ZOOM_OVERLAY_COLORS.educacion}
      />
    </div>
  );
};

export default EscuelaNinos;
