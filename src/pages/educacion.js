import React from 'react';
import CircleItemMenu from '../components/circleItemMenu';
import './educacion.css';

const Educacion = () => {
  return (
    <div className="educacion-page full-bg">
      <CircleItemMenu
        title="Escuela Niños"
        className="c-educacion"
        isSubcategory={true}
        to="/educacion/escuelaninos"
        style={{ position: 'absolute', top: '20%', left: '30%', width: '230px', height: '230px' }}
      />
      <CircleItemMenu
        title="Escuela Cine"
        className="c-educacion"
        isSubcategory={true}
        to="/educacion/escuelacine"
        style={{ position: 'absolute', top: '55%', left: '56%', width: '230px', height: '230px' }}
      />
      <CircleItemMenu
        title="ARTE AFTER OFFICE"
        className="c-educacion edu-new-item"
        isSubcategory={true}
        style={{ position: 'absolute', top: '15%', left: '70%', width: '210px', height: '210px', fontSize: '1.5rem' }}
      />
      <CircleItemMenu
        title="ESCUELA DE ARTES Y OFICIOS"
        className="c-educacion edu-new-item"
        isSubcategory={true}
        style={{ position: 'absolute', top: '55%', left: '82%', width: '210px', height: '210px', fontSize: '1.4rem' }}
      />
    </div>
  );
};

export default Educacion;
