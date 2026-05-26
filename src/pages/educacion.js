import React from 'react';
import CircleItemMenu from '../components/circleItemMenu';
import './educacion.css';

const Educacion = () => {
  return (
    <div className="educacion-page full-bg">
      <CircleItemMenu
        title="Escuela para Niños"
        className="c-educacion edu-ninos"
        isSubcategory={true}
        to="/educacion/escuelaninos"
        style={{ position: 'absolute', top: '10%', left: '17%', width: '230px', height: '230px' }}
      />
      <CircleItemMenu
        title="Escuela de Cine"
        className="c-educacion edu-cine"
        isSubcategory={true}
        to="/educacion/escuelacine"
        style={{ position: 'absolute', top: '50%', left: '30%', width: '230px', height: '230px' }}
      />
      <CircleItemMenu
        title="Arte After Office"
        className="c-educacion edu-new-item edu-after"
        isSubcategory={true}
        style={{ position: 'absolute', top: '25%', left: '70%', width: '200px', height: '200px', fontSize: '1.5rem' }}
        hoverTitle={
          <span>
            Proyecto en
            <br />
            Desarrollo
          </span>
        }
      />
      <CircleItemMenu
        title="Escuela de Artes y Oficios"
        className="c-educacion edu-new-item edu-oficios"
        isSubcategory={true}
        style={{ position: 'absolute', top: '60%', left: '80%', width: '200px', height: '200px', fontSize: '1.4rem' }}
        hoverTitle={
          <span>
            Proyecto en
            <br />
            Desarrollo
          </span>
        }
      />
    </div>
  );
};

export default Educacion;