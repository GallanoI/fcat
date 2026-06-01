import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Carousel from '../components/carousel';
import SplashScreenResidencia from '../components/splashScreenResidencia';
import CircleItemMenu from '../components/circleItemMenu';
import Zoom from '../components/zoom';
import { buildCarouselItemsFromApi } from '../config/carouselMediaUtils';
import { getCarouselItems } from '../services/db';
import { ZOOM_OVERLAY_COLORS } from '../config/zoomThemes';
import './residencia.css';

let residenciaSplashShown = false;

const Residencia = ({ onSplashVisibilityChange, onLogoThemeChange }) => {
  const [showSplash, setShowSplash] = useState(!residenciaSplashShown);
  const [zoomIndex, setZoomIndex] = useState(null);
  const [activeLogoTheme, setActiveLogoTheme] = useState('creacion');
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const pageRef = useRef(null);
  const section1Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);

  const isMax800 = viewportWidth <= 800;
  const isMax480 = viewportWidth <= 480;
  const residentesVisibleItems = isMax480 ? 1 : isMax800 ? 2 : 3;
  const materialesVisibleItems = isMax480 ? 1 : isMax800 ? 2 : 3;
  const RESIDENTES_AUTOPLAY_MS = 5000; // <---- cambiar tiempo autoplay residentes
  const MATERIALES_AUTOPLAY_MS = 5000; // <---- cambiar tiempo autoplay materiales
  
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (onSplashVisibilityChange) {
      onSplashVisibilityChange(showSplash);
    }
  }, [showSplash, onSplashVisibilityChange]);

  useEffect(() => {
    const container = pageRef.current;
    if (!container || !section4Ref.current) {
      return;
    }

    const updateThemeByScroll = () => {
      const threshold = container.scrollTop + (container.clientHeight * 0.45);
      const section4Top = section4Ref.current.offsetTop;
      const nextTheme = threshold >= section4Top ? 'investigacion' : 'creacion';

      if (nextTheme !== activeLogoTheme) {
        setActiveLogoTheme(nextTheme);
      }
    };

    updateThemeByScroll();
    container.addEventListener('scroll', updateThemeByScroll);
    return () => container.removeEventListener('scroll', updateThemeByScroll);
  }, [activeLogoTheme]);

  useEffect(() => {
    if (onLogoThemeChange) {
      onLogoThemeChange(activeLogoTheme);
    }
  }, [activeLogoTheme, onLogoThemeChange]);

  useEffect(() => {
    return () => {
      if (onSplashVisibilityChange) {
        onSplashVisibilityChange(false);
      }
      if (onLogoThemeChange) {
        onLogoThemeChange(null);
      }
    };
  }, [onSplashVisibilityChange, onLogoThemeChange]);

  useLayoutEffect(() => {
    if (!showSplash && pageRef.current) {
      pageRef.current.scrollTop = 0;
      pageRef.current.dispatchEvent(new Event('scroll'));
    }
  }, [showSplash]);

  const [materiales, setMateriales] = useState([]);
  const [residentes, setResidentes] = useState([]);

  useEffect(() => {
    getCarouselItems('materiales').then((data) => {
      setMateriales(buildCarouselItemsFromApi(data));
    });
  }, []);

  const RESIDENTE_META = {
    'ciro.jpg':      { name: 'Ciro Beltrán',     textTop: 'Ciro',     to: '/creacion/residencia/ciro' },
    'cristal.jpg':   { name: 'Cristal Jacob',    textTop: 'Cristal',  to: '/creacion/residencia/cristal' },
    'kenji.jpeg':    { name: 'Kenji Senda',      textTop: 'Kenji',    to: '/creacion/residencia/kenji' },
    'dafna.jpeg':    { name: 'Dafna Kojchen',    textTop: 'Dafna',    to: '/creacion/residencia/dafna' },
    'fernando.jpeg': { name: 'Fernando Wanders', textTop: 'Fernando', to: '/creacion/residencia/fernando' },
  };

  useEffect(() => {
    getCarouselItems('residentes').then((data) => {
      const publicUrl = process.env.PUBLIC_URL || '';
      setResidentes(
        data.map((item) => {
          const filename = item.file_path.split('/').pop().toLowerCase();
          const meta = RESIDENTE_META[filename] || { name: filename, textTop: filename, to: '/' };
          return { ...meta, src: publicUrl + item.file_path };
        })
      );
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const texto1 = 'Ubicada en el paisaje silente de Tunquén, la Residencia CAT (Cultura y Arte de Tunquén) es un espacio de investigación y experimentación artística ubicado en un entorno que propicia  el pensamiento y la creación.';
  const texto2 = 'Más que un lugar de producción, CAT es un laboratorio de procesos. Aquí, artistas de distintas disciplinas —artes visuales, danza, teatro— trabajan desde la relación directa con la materia y el territorio. La arcilla, el carbón, las cenizas y el polvo se integran como parte activa de la obra, desplazando lo accesorio para volver a lo fundamental.';
  const texto3 = 'La residencia también busca un vínculo vivo con la comunidad y el ecosistema local, entendiendo la creación como una forma de habitar la pregunta. Venir a CAT es asumir un desafío creativo y espiritual: transformar el proceso artístico en presencia, experiencia y territorio.';

  const navigate = useNavigate();
  const location = useLocation();
  // Ref para el destino de scroll al volver desde investigacion o perfilResidente
  const scrollTargetRef = useRef(location.state?.scrollTo || null);

  // Efecto: ejecutar scroll al destino después de que termine el splash
  useEffect(() => {
    if (showSplash) return;
    const target = scrollTargetRef.current;
    if (!target || !pageRef.current) return;
    scrollTargetRef.current = null;
    const refs = { materiales: section4Ref, residentes: section3Ref };
    const targetRef = refs[target];
    if (targetRef?.current) {
      setTimeout(() => {
        pageRef.current.scrollTo({ top: targetRef.current.offsetTop, behavior: 'smooth' });
      }, 350);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreenResidencia onFinish={() => { residenciaSplashShown = true; setShowSplash(false); }} />;
  }

  return (
    <div className="residencia-page" ref={pageRef}>
      {/* SECCIÓN 1: PRESENTACIÓN */}
      <section className="section-16-9 slide-canvas res-bg-1 section-1-cut" ref={section1Ref}>
        <div className="section-1-bg-layer" aria-hidden="true" />
        <div className="pres-text-1">
          <h1>RESIDENCIA Y ARTÍSTICA DE TUNQUÉN</h1> 
        </div>
        <div className="pres-text-2">
          <h1>RCAT</h1>
        </div>
      </section>

      {/* SECCIÓN 2: INFO RESIDENCIA */}
      <section className="section-16-9 slide-canvas res-info-section">
        <div className="ascending-panel">
          <div className="left-col">
            <img
              src={`${process.env.PUBLIC_URL || ''}/logoFCAT-N.png`}
              alt="Logo CAT"
              className="panel-logo"
            />
          </div>
          <div className="right-col">
            <p><br /></p>
            <p>
              {texto1}
            </p>
            <p><br /></p>
            <p>
              {texto2}
            </p>
            <p><br /></p>
            <p>
              {texto3}
            </p>
            <p><br /></p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: RESIDENTES */}
      <section className="section-16-9 slide-canvas" ref={section3Ref} style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/fotos/residencia/res2.JPEG)` }}>
        <div className="residentes-title">
          <h2>RESIDENTES CAT</h2>
        </div>
        <div className="residentes-carousel-wrap">
          <Carousel
            items={residentes}
            type="residentes"
            variant="named"
            captionPosition="top"
            visibleItems={residentesVisibleItems}
            autoPlayInterval={RESIDENTES_AUTOPLAY_MS}
            className="residentes-carousel"
            onImageClick={(item) => navigate(item.to)}
          />
        </div>
      </section>

      {/* SECCIÓN 4: RESIDENCIA */}
      <section className="section-16-9 res-section-2">
        <div className="res-grid-container">
          <div className="column-left">
            <img src={process.env.PUBLIC_URL + '/assets/fotos/residencia/res2.JPEG'} alt="Interior Residencia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="column-right">
            <div className="quote-container">
              <p className="quote-text">" Donde la tierra se hace pensamiento..."</p>
            </div>
            <img src={process.env.PUBLIC_URL + '/assets/fotos/residencia/res3.jpg'} alt="Detalle Residencia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: MATERIALES */}
      <section className="section-16-9 slide-canvas materiales-section" ref={section4Ref}>
        <h2 className="materiales-title">MATERIALES</h2>

        <CircleItemMenu
          title="Investigación"
          hoverTitle={
            <span>
              Ir a
              <br />
              Investigacion
            </span>
          }
          hoverScale={1.1}
          className="c-investigacion materiales-circle"
          to="/investigacion"
          style={{ top: '6%', left: '6%' }}
        />

        <div className="materiales-carousel-wrap">
          <Carousel
            items={materiales}
            variant="gallery"
            visibleItems={materialesVisibleItems}
            autoPlayInterval={MATERIALES_AUTOPLAY_MS}
            showText={false}
            className="materiales-carousel"
            backgroundColor="rgba(173, 173, 173, 0.4)"
            onImageClick={(item, idx) => setZoomIndex(idx)}
          />
        </div>
      </section>

      <Zoom
        item={zoomIndex !== null ? materiales[zoomIndex] : null}
        items={materiales}
        currentIndex={zoomIndex}
        onNavigate={setZoomIndex}
        onClose={() => setZoomIndex(null)}
        overlayColor={ZOOM_OVERLAY_COLORS.materialesResidencia}
      />


    </div>
  );
};

export default Residencia;