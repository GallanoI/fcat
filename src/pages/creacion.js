import React from 'react';
import CircleItemMenu from '../components/circleItemMenu';
import './creacion.css';

const Creacion = () => {
  return (
    <div className="creacion-page full-bg">
      <CircleItemMenu
        title="Residencias"
        className="c-creacion"
        isSubcategory={true}
        to="/creacion/residencia"
        style={{
          position: 'absolute',
          top: '40%',
          left: '25%',
          width: '260px',
          height: '260px',
          fontSize: '3.2rem',
        }}
      />
      <CircleItemMenu
        title="Audiovisual"
        className="c-creacion"
        isSubcategory={true}
        to="/creacion/audiovisual"
        style={{
          position: 'absolute',
          top: '40%',
          left: '60%',
          width: '260px',
          height: '260px',
          fontSize: '3.2rem',
        }}
      />
    </div>
  );
};

export default Creacion;
