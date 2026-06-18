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
    name: 'Cristal Jacob',
    role: 'Directora y Fundadora',
    info: 'Licenciada en Artes por la Pontificia Universidad Católica de Valparaíso (PUCV) y Diplomada en Gestión Cultural. Lidera la visión estratégica y el desarrollo institucional de la fundación.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/cristal.jpg',
    pilar: 'creacion',
  },
  {
    name: 'Sofía Oportot',
    role: 'Secretaria',
    info: 'Actriz de formación y artista multidisciplinaria. Su sólida trayectoria destaca por la convergencia de la música, la actuación y las artes visuales, aportando una mirada integral al quehacer de la fundación.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/sofia.jpeg',
    pilar: 'difusion',
  },
  {
    name: 'Roberto Orellana',
    role: 'Socio Fundador y Tesorero',
    info: 'Ingeniero Eléctrico e intérprete de flauta traversa. Su perfil equilibra la precisión técnica y la sensibilidad musical, encargándose de la solidez operativa y financiera del proyecto.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/roberto.jpeg',
    pilar: 'educacion',
  },
  {
    name: 'Loedein Beltrán',
    role: 'Encargada de Relaciones Exteriores',
    info: 'Gestora cultural y marionetista. Combina su conocimiento en artes de la animación con la gestión estratégica para tender puentes y tejer redes de colaboración nacionales e internacionales.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/ingrid.jpg',
    pilar: 'investigacion',
  },
  {
    name: 'Marco Llerena',
    role: 'Curador y Relaciones Públicas',
    info: 'Historiador del arte y gestor cultural. Especialista en la mediación de contenidos artísticos y la gestión de audiencias, encargado de la curatoría de los proyectos y del vínculo con la comunidad.',
    photo: process.env.PUBLIC_URL + '/assets/fotos/quienes/Marcos.jpg',
    pilar: 'creacion',
  },
];

const Quienes = () => {
  return (
    <div className="quienes-page">
      <div className="quienes-header">
        <h1 className="quienes-title">QUIENES SOMOS</h1>
      </div>

      <div className="quienes-scroll-panel">
        <div className="quienes-canvas">
          {quienesData.map((m, i) => {
            const pilar = PILARES[m.pilar];
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
                className={side === 'left' ? 'quienes-entry-left' : 'quienes-entry-right'}
                style={{
                  width: 'clamp(170px, 16vw, 220px)',
                  height: 'clamp(170px, 16vw, 220px)',
                }}
              />
            );
          })}
        </div>
        <div className="quienes-footer-text">
          <p>Somos un equipo multidisciplinario de profesionales del arte, la cultura y la gestión, unidos por el propósito de transformar el entorno social a través de la creatividad, la educación y el patrimonio. En la Fundación ACT (FCAT) combinamos experiencia técnica, rigor metodológico y sensibilidad artística para liderar proyectos con impacto real.</p>
        </div>
      </div>
    </div>
  );
};

export default Quienes;