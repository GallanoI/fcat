import React from 'react';
import UnQuien from '../components/unQuien';
import './quienes.css';

// Pilar themes
const PILARES = {
  creacion:      { color: 'rgba(255, 255, 0, 0.58)',  border: '#a46e1b',  text: 'white' },
  difusion:      { color: 'rgba(0, 176, 240, 0.5)',   border: '#212121',  text: '#f1c232' },
  educacion:     { color: 'rgba(240, 0, 154, 0.5)',   border: 'magenta',  text: '#93c47d' },
  investigacion: { color: 'rgba(173, 173, 173, 0.4)', border: '#212121',  text: 'white' },
};

const quienesData = [
  {
    name: 'Carlos',
    role: 'Director',
    info: 'Fundador de FCAT. Gestor cultural y artista visual con trayectoria en el territorio costero.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/carlos.jpg',
    pilar: 'creacion',
  },
  {
    name: 'Cristal',
    role: 'Coordinación Artística',
    info: 'Artista interdisciplinar enfocada en residencias y gestión de proyectos culturales.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/cristal.jpg',
    pilar: 'difusion',
  },
  {
    name: 'Ingrid',
    role: 'Educación',
    info: 'Educadora artística a cargo de la Escuela Artística para Niños y programas pedagógicos.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/ingrid.jpg',
    pilar: 'educacion',
  },
  {
    name: 'Javier',
    role: 'Investigación',
    info: 'Investigador cultural y documentalista del patrimonio artístico del territorio de Tunquén.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/javier.jpg',
    pilar: 'investigacion',
  },
  {
    name: 'Luz',
    role: 'Comunicaciones',
    info: 'Encargada de comunicaciones, redes y difusión de las actividades de FCAT.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/luz.jpg',
    pilar: 'creacion',
  },
  {
    name: 'Marcos',
    role: 'Producción',
    info: 'Productor ejecutivo de eventos y actividades culturales de la fundación.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/Marcos.jpg',
    pilar: 'difusion',
  },
  {
    name: 'Roberto',
    role: 'Tecnología',
    info: 'Responsable de plataformas digitales e infraestructura tecnológica de FCAT.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/roberto.jpg',
    pilar: 'educacion',
  },
  {
    name: 'Susan',
    role: 'Administración',
    info: 'Encargada de administración y finanzas de la Fundación Cultural Artística de Tunquén.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/susan.jpg',
    pilar: 'investigacion',
  },
];

const zigzagPositionsDesktop = [
  { top: '6%', left: '6%' },
  { top: '20%', left: '55%' },
  { top: '34%', left: '6%' },
  { top: '48%', left: '55%' },
  { top: '62%', left: '6%' },
  { top: '76%', left: '55%' },
  { top: '90%', left: '6%' },
  { top: '104%', left: '55%' },
];

const zigzagPositionsMobile = [
  { top: '6%', left: '6%' },
  { top: '18%', left: '55%' },
  { top: '30%', left: '6%' },
  { top: '42%', left: '55%' },
  { top: '54%', left: '6%' },
  { top: '66%', left: '55%' },
  { top: '78%', left: '6%' },
  { top: '90%', left: '55%' },
];

const Quienes = () => {
  const isMobile = window.innerWidth <= 480;
  const positions = isMobile ? zigzagPositionsMobile : zigzagPositionsDesktop;

  return (
    <div className="quienes-page">
      <div className="quienes-header">
        <h1 className="quienes-title">QUIENES SOMOS</h1>
      </div>

      <div className="quienes-scroll-panel">
        <div className="quienes-canvas">
          {quienesData.map((m, i) => {
            const pilar = PILARES[m.pilar];
            const pos = positions[i];
            const side = i % 2 === 0 ? 'left' : 'right';

            return (
              <UnQuien
                key={m.name}
                name={m.name}
                role={m.role}
                info={m.info}
                photoSrc={m.photo}
                pilarColor={pilar.color}
                borderColor={pilar.border}
                textColor={pilar.text}
                side={side}
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: 'clamp(170px, 16vw, 220px)',
                  height: 'clamp(170px, 16vw, 220px)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Quienes;