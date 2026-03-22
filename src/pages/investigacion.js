import React from 'react';
import CircleItemMenu from '../components/circleItemMenu';
import './investigacion.css';

const Investigacion = () => {
  return (
    <div className="investigacion-page full-bg">
      <CircleItemMenu
        title="Materiales"
        className="c-investigacion"
        isSubcategory={true}
        style={{ position: 'absolute', top: '20%', left: '45%', width: '210px', height: '210px' }}
      />
      <CircleItemMenu
        title="Datos Plataforma"
        className="c-investigacion"
        isSubcategory={true}
        style={{ position: 'absolute', top: '55%', left: '55%', width: '190px', height: '190px' }}
      />
    </div>
  );
};

export default Investigacion;
