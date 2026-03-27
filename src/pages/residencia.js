import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Carousel from '../components/carousel';
import SplashScreenResidencia from '../components/splashScreenResidencia';
import CircleItemMenu from '../components/circleItemMenu';
import Zoom from '../components/zoom';
import { ZOOM_OVERLAY_COLORS } from '../config/zoomThemes';
import './residencia.css';

const Residencia = ({ onSplashVisibilityChange, onLogoThemeChange }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [zoomItem, setZoomItem] = useState(null);
  const [activeLogoTheme, setActiveLogoTheme] = useState('creacion');
  const pageRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section4Ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    container: pageRef,
    target: section1Ref,
    offset: ["start start", "end end"]
  });

  const panelY = useTransform(scrollYProgress, [0, 1], ['0px', '-100vh'])
  const ascendingTop = '120%';

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

  const materialesContext = require.context(
    '../assets/fotos/residencia/materiales',
    false,
    /\.(png|jpe?g|webp)$/i
  );
  const materiales = materialesContext
    .keys()
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((key) => ({ src: materialesContext(key), type: 'image' }));

  const residentes = [
    { name: "Ciro Beltrán", src: require('../assets/fotos/residencia/residentes/Ciro.jpg'), textTop: "Ciro", to: "/creacion/residencia/ciro" },
    { name: "Cristal Jacob", src: require('../assets/fotos/residencia/residentes/Cristal.jpg'), textTop: "Cristal", to: "/creacion/residencia/cristal" },
    { name: "Kenji Senda", src: require('../assets/fotos/residencia/residentes/Kenji.JPEG'), textTop: "Kenji", to: "/creacion/residencia/kenji" },
    { name: "Dafna Kojchen", src: require('../assets/fotos/residencia/residentes/Dafna.JPEG'), textTop: "Dafna", to: "/creacion/residencia/dafna" },
    { name: "Fernando Wanders", src: require('../assets/fotos/residencia/residentes/Fernando.jpeg'), textTop: "Fernando", to: "/creacion/residencia/fernando" },
  ];

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
    const refs = { materiales: section4Ref, residentes: section2Ref };
    const targetRef = refs[target];
    if (targetRef?.current) {
      setTimeout(() => {
        pageRef.current.scrollTo({ top: targetRef.current.offsetTop, behavior: 'smooth' });
      }, 350);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreenResidencia onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="residencia-page" ref={pageRef}>
      {/* SECCIÓN 1: PRESENTACIÓN */}
      <section className="section-16-9 slide-canvas res-bg-1" ref={section1Ref}>
        <div className="pres-text-1">
            <h1 style={{ position: 'absolute', top: '21%', left: '8%' }}>RESIDENCIA Y ARTÍSTICA DE TUNQUÉN</h1> 
        </div>
        <div className="pres-text-2">
            <h1 style={{ position: 'absolute', top: '45%', left: '37%' }}>RCAT</h1>
        </div>
        
        <motion.div
          className="ascending-container"
          style={{ y: panelY, zIndex: 1000, top: ascendingTop }}
        >
          <div className="ascending-panel">
            <div className="left-col">
              <img
                src={`${process.env.PUBLIC_URL || ''}/logoFCAT-N.png`}
                alt="Logo CAT"
                className="panel-logo"
              />
            </div>
            <div className="right-col">
              <p>
                {texto1}
              </p>
              <img
                src={require('../assets/fotos/residencia/residentes/Ciro.jpg')}
                alt=""
                className="panel-img"
              />
              <p>
                {texto2}
              </p>
              <img
                src={require('../assets/fotos/residencia/residentes/Kenji.JPEG')}
                alt=""
                className="panel-img"
              />
              <p>
                {texto3}
              </p>
            </div>
          </div>


        </motion.div>
      </section>

      {/* SECCIÓN 2: RESIDENTES */}
      <section className="section-16-9 slide-canvas" ref={section2Ref} style={{ backgroundImage: `url(${require('../assets/fotos/residencia/res2.JPEG')})` }}>
        <div className="residentes-title">
          <h2>RESIDENTES CAT</h2>
        </div>
        <div style={{ position: 'absolute', bottom: '10%', width: '100%' }}>
          <Carousel
            items={residentes}
            type="residentes"
            variant="named"
            captionPosition="top"
            visibleItems={3}
            className="residentes-carousel"
            onImageClick={(item) => navigate(item.to)}
          />
        </div>
      </section>

      {/* SECCIÓN 3: RESIDENCIA */}
      <section className="section-16-9 res-section-2">
        <div className="res-grid-container">
          <div className="column-left">
            <img src={require('../assets/fotos/residencia/res2.JPEG')} alt="Interior Residencia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="column-right">
            <div className="quote-container">
              <p className="quote-text">" Donde la tierra se hace pensamiento..."</p>
            </div>
            <img src={require('../assets/fotos/residencia/res3.jpg')} alt="Detalle Residencia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: MATERIALES */}
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
            visibleItems={3}
            showText={false}
            className="materiales-carousel"
            backgroundColor="rgba(173, 173, 173, 0.4)"
            onImageClick={(item) => setZoomItem(item)}
          />
        </div>
      </section>

      <Zoom
        item={zoomItem}
        onClose={() => setZoomItem(null)}
        overlayColor={ZOOM_OVERLAY_COLORS.materialesResidencia}
      />


    </div>
  );
};

export default Residencia;