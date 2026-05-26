import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ActiveMediaPanel from '../components/activeMediaPanel';
import Carousel from '../components/carousel';
import Zoom from '../components/zoom';
import { buildCarouselItemsFromApi } from '../config/carouselMediaUtils';
import { getCarouselItems, getTalleres, getNinosByTaller } from '../services/db';
import { ZOOM_OVERLAY_COLORS } from '../config/zoomThemes';
import './escuelaNinos.css';
import CalendarioMensual from '../components/calendarioMensual';


function formatDiaLabel(datetime, diaNum) {
  const [datePart] = datetime.split(' ');
  const [year, month, day] = datePart.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  const monthName = date.toLocaleDateString('es-CL', { month: 'long' });
  return `Día ${diaNum} - ${parseInt(day, 10)} de ${monthName}`;
}

const EscuelaNinos = () => {
  const pageRef = useRef(null);
  const topLeftRef = useRef(null);
  const middleSectionRef = useRef(null);
  const lowerSectionRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomItem, setZoomItem] = useState(null);
  const [isLowerStage, setIsLowerStage] = useState(false);
  const [isResponsiveLayout, setIsResponsiveLayout] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 800 : false
  );

  const [talleres, setTalleres] = useState([]);
  const [ninosPorTaller, setNinosPorTaller] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [escuelaItems, setEscuelaItems] = useState([]);

  useEffect(() => {
    getCarouselItems('escuelaNinos').then((data) => {
      setEscuelaItems(
        buildCarouselItemsFromApi(data, (dbItem, idx) => ({
          name: `escuela-${idx + 1}`,
        }))
      );
    });
  }, []);

  const hasItems = escuelaItems.length > 0;
  const safeIndex = hasItems
    ? Math.max(0, Math.min(selectedIndex, escuelaItems.length - 1))
    : 0;
  const activeItem = hasItems ? escuelaItems[safeIndex] : null;

  const loadData = useCallback(async () => {
    const talleresData = await getTalleres();
    setTalleres(talleresData);
    if (talleresData.length > 0) {
      const ninosMap = {};
      await Promise.all(
        talleresData.map(async (t) => {
          const ninos = await getNinosByTaller(t.id);
          ninosMap[t.id] = ninos;
        })
      );
      setNinosPorTaller(ninosMap);
    }
  }, []);

  const handleCarouselIndexChange = (index) => {
    setSelectedIndex(index);
  };

  const handleCarouselClick = (_, index) => {
    setSelectedIndex(index);
  };

  const handleResponsiveCarouselClick = (item, index) => {
    setSelectedIndex(index);
    if (item) setZoomItem(item);
  };

  const handleTopLeftWheel = (e) => {
    const container = topLeftRef.current;
    if (!container) return;

    const reachedBottom = Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight;
    const isScrollingDown = e.deltaY > 0;

    if (reachedBottom && isScrollingDown) {
      e.preventDefault();
      const targetSection = isResponsiveLayout ? middleSectionRef.current : lowerSectionRef.current;
      targetSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const updateResponsiveMode = () => {
      setIsResponsiveLayout(window.innerWidth <= 800);
    };

    updateResponsiveMode();
    window.addEventListener('resize', updateResponsiveMode);
    return () => window.removeEventListener('resize', updateResponsiveMode);
  }, []);

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

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const bc = new BroadcastChannel('fcat-inscripcion');
    bc.onmessage = (e) => {
      if (e.data?.type === 'inscripcionCreada') loadData();
    };
    return () => bc.close();
  }, [loadData]);

  // Scroll al ancla #inscripciones si se accede con ese hash
  useEffect(() => {
    if (window.location.hash !== '#inscripciones') return;
    const timer = setTimeout(() => {
      const el = document.getElementById('inscripciones');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const tallerActivo = talleres.length > 0 && talleres[activeTab] ? talleres[activeTab] : null;
  const ninosTaller = tallerActivo ? (ninosPorTaller[tallerActivo.id] || []) : [];
  const ninos1 = tallerActivo
    ? ninosTaller.filter((n) => n.dias_asistencia.includes(tallerActivo.fecha1))
    : [];
  const ninos2 = tallerActivo
    ? ninosTaller.filter((n) => n.dias_asistencia.includes(tallerActivo.fecha2))
    : [];

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

      <section className="escuela-section escuela-section-middle" ref={middleSectionRef}>
        <div className="escuela-middle-content">
          {hasItems && (
            <div className="escuela-middle-carousel">
              <Carousel
                items={escuelaItems}
                variant="gallery"
                visibleItems={1}
                showText={false}
                autoPlayInterval={7000}
                className={carouselClassName}
                backgroundColor="rgba(255, 0, 0, 1)"
                onIndexChange={handleCarouselIndexChange}
                onImageClick={handleResponsiveCarouselClick}
              />
            </div>
          )}
        </div>
      </section>

      <section id="inscripciones" className="escuela-section escuela-section-bottom" ref={lowerSectionRef}>
        <div className="escuela-left escuela-left-bottom">
          <div className="escuela-inscripciones-section">
            <div className="escuela-inscripciones-title-box">
              <div className="escuela-inscripciones-text">
                <h2 className="escuela-section-title">INSCRIPCIONES JUNIO</h2>
              </div>
            </div>
            {/* Tabs de talleres */}
            <div className="ins-tabs-header">
              {talleres.map((taller, i) => (
                <button
                  key={taller.id}
                  type="button"
                  className={`ins-tab-btn${activeTab === i ? ' active' : ''}`}
                  onClick={() => {
                    setActiveTab(i);
                  }}
                >
                  {taller.nombre_taller}
                </button>
              ))}
            </div>

            {/* Contenido del tab activo */}
            {talleres.length > 0 && talleres[activeTab] && (
              <div className="ins-tab-panel">
                <div className="ins-info-taller">
                  <span className="ins-tallerista">
                    {`Taller impartido por: ${talleres[activeTab].nombre_tallerista}`}
                  </span>
                  <span className="ins-ver-calendario">Ver calendario</span>
                  <button
                    type="button"
                    className={`ins-calendar-btn${isCalendarOpen ? ' open' : ''}`}
                    onClick={() => setIsCalendarOpen((prev) => !prev)}
                  >
                    ▦
                  </button>

                </div>

                {isCalendarOpen && (
                  <CalendarioMensual
                    mode="view"
                    talleresData={[
                      {
                        datetime: talleres[activeTab].fecha1,
                        nombre: talleres[activeTab].nombre_taller,
                        tallerista: talleres[activeTab].nombre_tallerista,
                      },
                      {
                        datetime: talleres[activeTab].fecha2,
                        nombre: talleres[activeTab].nombre_taller,
                        tallerista: talleres[activeTab].nombre_tallerista,
                      },
                    ]}
                    initialMonth={new Date(2026, 5, 1)}
                    className="ins-calendario"
                  />
                )}

                <div className="ins-dias-grid">
                  {[
                    { diaNum: 1, fecha: tallerActivo.fecha1, ninosList: ninos1 },
                    { diaNum: 2, fecha: tallerActivo.fecha2, ninosList: ninos2 },
                  ].map(({ diaNum, fecha, ninosList }) => {
                    const cupos = 20 - ninosList.length;
                    return (
                      <div key={diaNum} className="ins-dia-col">
                        <div className="ins-dia-col-header">
                          <span className="ins-dia-col-date">
                            {formatDiaLabel(fecha, diaNum)}
                          </span>
                          {cupos > 0 ? (
                            <span className="ins-dia-col-spots">
                              {cupos} {cupos === 1 ? 'cupo ' : 'cupos '}
                            </span>
                          ) : (
                            <span className="ins-dia-col-spots ins-dia-col-spots--lleno">
                              SIN CUPOS
                            </span>
                          )}
                        </div>
                        <div className="ins-alumnos-table">
                          {Array(20).fill(null).map((_, idx) => {
                            const nino = ninosList[idx];
                            const isGray = diaNum === 1 ? idx % 2 === 1 : idx % 2 === 0;
                            return (
                              <div
                                key={idx}
                                className={`ins-alumno-row${nino ? ' filled' : ''}${isGray ? ' ins-row-gray' : ''}`}
                              >
                                <span className="ins-alumno-num">{idx + 1}</span>
                                <span className="ins-alumno-name">
                                  {nino ? `${nino.nombre}, ${nino.edad}` : '\u00a0'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="button"
              className="ins-inscribirse-btn"
              onClick={() => window.open('/inscripcion', '_blank')}
            >
              Inscribirse <span className="ins-aqui">AQUÍ</span>
            </button>

          </div>
        </div>
        <div className="escuela-right-spacer" />
      </section>

      {!isResponsiveLayout && (
        <motion.aside
          className={`escuela-stage ${isLowerStage ? 'stage-lower' : 'stage-upper'}`}
          animate={{
            backgroundColor: isLowerStage ? 'rgba(255, 0, 0, 0.7)' : 'rgba(217, 217, 217, 1)',
          }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          {hasItems && (
            <>
              <motion.div
                className="escuela-stage-panel"
                animate={{ top: isLowerStage ? '32%' : '4%' }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                <ActiveMediaPanel
                  item={activeItem}
                  alt="Escuela Niños actual"
                  className="escuela-active-panel"
                  onClick={() => activeItem && setZoomItem(activeItem)}
                  videoMuted={zoomItem !== null}
                />
              </motion.div>

              <motion.div
                className="escuela-stage-carousel"
                animate={{
                  top: isLowerStage ? '0%' : '75%',
                  width: isLowerStage ? '100%' : '100vw',
                  right: 0,
                  left: 'auto',
                }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                <Carousel
                  items={escuelaItems}
                  variant="gallery"
                  visibleItems={isLowerStage ? 3 : 4}
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
      )}

      <Zoom
        item={zoomItem}
        onClose={() => setZoomItem(null)}
        overlayColor={ZOOM_OVERLAY_COLORS.educacion}
      />
    </div>
  );
};

export default EscuelaNinos;
