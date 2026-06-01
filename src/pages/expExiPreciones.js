import React, { useEffect, useRef, useState } from 'react';
import ActiveMediaPanel from '../components/activeMediaPanel';
import Carousel from '../components/carousel';
import RepAudio from '../components/repAudio';
import Zoom from '../components/zoom';
import { buildCarouselItemsFromApi } from '../config/carouselMediaUtils';
import { getCarouselItems } from '../services/db';
import { ZOOM_OVERLAY_COLORS } from '../config/zoomThemes';
import './expExiPreciones.css';

const backgroundImage = process.env.PUBLIC_URL + '/assets/fotos/fondos/duexpre.JPG';
const expSidePic = process.env.PUBLIC_URL + '/assets/fotos/duexpre/sidePic/IMG_8460.PNG';
const expSidePic2 = process.env.PUBLIC_URL + '/assets/fotos/duexpre/sidePic/IMG_8461.jpg';

const AUDIO_BY_NAME = {
  'paularoberto.mp3': process.env.PUBLIC_URL + '/assets/audios/PaulaRoberto.mp3',
};


const TITLE_LEFT = (
  <span>
    EXPOSI
    <br />
    EXIBI
    <br />
    PRESENTA
  </span>
);

const TITLE_RIGHT = (
  <span>
    CIO
    <br />
    NES
  </span>
);

const ExpExiPreciones = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  const [isAudioAutoplayHold, setIsAudioAutoplayHold] = useState(false);
  const resumeTimeoutRef = useRef(null);
  const [duexpreItems, setDuexpreItems] = useState([]);

  useEffect(() => {
    getCarouselItems('expExiPreciones').then((data) => {
      setDuexpreItems(
        buildCarouselItemsFromApi(data, (dbItem, idx) => {
          const si = dbItem.side_image;
          const sideImage = si === 'sidePic1' ? expSidePic : si === 'sidePic2' ? expSidePic2 : null;
          return {
            name: `dexp-${idx + 1}`,
            leftText: sideImage ? '' : dbItem.left_text || ' ',
            sideImage,
            rightText: dbItem.right_text || '',
            audio: dbItem.audio_file ? AUDIO_BY_NAME[dbItem.audio_file.toLowerCase()] : null,
          };
        })
      );
    });
  }, []);


  const clearResumeTimeout = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  const scheduleAutoplayResume = () => {
    clearResumeTimeout();
    setIsAudioAutoplayHold(false);
  };

  const handleAudioStart = () => {
    clearResumeTimeout();
    setIsAudioAutoplayHold(true);
  };

  const handleAudioStop = () => {
    scheduleAutoplayResume();
  };

  const handleAudioComplete = () => {
    scheduleAutoplayResume();
  };

  useEffect(() => {
    return () => {
      clearResumeTimeout();
      setIsAudioAutoplayHold(false);
    };
  }, []);

  const getViewMode = () => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth <= 480) return 'phone';
    if (window.innerWidth <= 800) return 'tablet';
    return 'desktop';
  };

  const [viewMode, setViewMode] = useState(getViewMode);

  useEffect(() => {
    const handleResize = () => setViewMode(getViewMode());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const safeIndex = Math.max(0, Math.min(selectedIndex, duexpreItems.length - 1));
  const activeItem = duexpreItems[safeIndex] || null;
  const isDesktop = viewMode === 'desktop';
  const responsiveModeClass = viewMode === 'phone' ? 'exp-responsive-stage-480' : 'exp-responsive-stage-800';

  return (
    <div className="exp-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="exp-layout">
        <div className="exp-cols">
          <section className="exp-col exp-col-left">
            {isDesktop && (
              activeItem?.sideImage ? (
                <div className="exp-left-side-pic-wrap">
                  <img src={activeItem.sideImage} alt="Imagen lateral" className="exp-left-side-pic" />
                </div>
              ) : (
                <p className="exp-left-changing-text">{activeItem?.leftText}</p>
              )
            )}
          </section>

          <section className="exp-col exp-col-right" style={{ backgroundColor: 'rgba(8, 84, 184, 0.5)' }}>
            {isDesktop && (
              <div className="exp-feature-wrap">
                <p className="exp-right-overlay-text">{activeItem?.rightText}</p>
                <ActiveMediaPanel
                  item={activeItem}
                  alt="Obra actual"
                  className="exp-feature-panel"
                  onClick={() => activeItem && setZoomIndex(safeIndex)}
                />
                <RepAudio
                  className="exp-audio-btn"
                  src={activeItem?.audio}
                  hidden={!activeItem?.audio}
                  size={80}
                  onPlayStart={handleAudioStart}
                  onPlayStop={handleAudioStop}
                  onPlayComplete={handleAudioComplete}
                />
              </div>
            )}
          </section>
        </div>

        <div className="exp-title-overlay">
          <h2 className="exp-col-title exp-left-title exp-overlay-left-title" style={{ color: '#f1c232' }}>
            {TITLE_LEFT}
          </h2>
          <h2 className="exp-col-title exp-right-title exp-overlay-right-title" style={{ color: '#93c47d' }}>
            {TITLE_RIGHT}
          </h2>
        </div>

        {!isDesktop && (
          <div className={`exp-responsive-stage ${responsiveModeClass}`}>
            <div className="exp-responsive-carousel-shell">
              <div className="exp-responsive-right-text">{activeItem?.rightText}</div>
              <Carousel
                items={duexpreItems}
                variant="gallery"
                visibleItems={1}
                showText={false}
                autoPlayInterval={7000}
                className="exp-duexpre-carousel exp-duexpre-carousel-responsive"
                backgroundColor="rgba(8, 84, 184, 0.5)"
                onIndexChange={setSelectedIndex}
                onImageClick={(item, idx) => setZoomIndex(idx)}
                isPaused={isAudioAutoplayHold || zoomIndex !== null}
              />
            </div>

            <div className="exp-responsive-lower">
              {activeItem?.sideImage ? (
                <div className="exp-responsive-side-pic-wrap">
                  <img src={activeItem.sideImage} alt="Imagen lateral" className="exp-responsive-side-pic" />
                </div>
              ) : (
                <p className="exp-responsive-left-text">{activeItem?.leftText}</p>
              )}

              <RepAudio
                className="exp-responsive-audio"
                src={activeItem?.audio}
                hidden={!activeItem?.audio}
                size={80}
                onPlayStart={handleAudioStart}
                onPlayStop={handleAudioStop}
                onPlayComplete={handleAudioComplete}
              />
            </div>
          </div>
        )}
      </div>

      {isDesktop && (
        <div className="exp-carousel-wrap">
          <Carousel
            items={duexpreItems}
            variant="gallery"
            visibleItems={4}
            showText={false}
            autoPlayInterval={7000}
            className="exp-duexpre-carousel"
            backgroundColor="rgba(8, 84, 184, 0.5)"
            onIndexChange={setSelectedIndex}
            onImageClick={(item, idx) => setSelectedIndex(idx)}
            isPaused={isAudioAutoplayHold}
          />
        </div>
      )}

      <Zoom
        item={zoomIndex !== null ? duexpreItems[zoomIndex] : null}
        items={duexpreItems}
        currentIndex={zoomIndex}
        onNavigate={setZoomIndex}
        onClose={() => setZoomIndex(null)}
        overlayColor={ZOOM_OVERLAY_COLORS.expExiPreciones}
      />
    </div>
  );
};

export default ExpExiPreciones;
