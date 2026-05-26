import React from 'react';
import { useNavigate } from 'react-router-dom';
import CircleItemMenu from '../components/circleItemMenu';
import './investigacion.css';

const Investigacion = () => {
  const navigate = useNavigate();
  return (
    <div className="investigacion-page full-bg">
      <CircleItemMenu
        title="Materiales"
        className="c-investigacion inv-materiales"
        isSubcategory={true}
        onClick={() => navigate('/creacion/residencia', { state: { scrollTo: 'materiales' } })}
        style={{ position: 'absolute', top: '20%', left: '35%', width: '230px', height: '230px' }}
      />
      <CircleItemMenu
        title="Datos Plataforma"
        className="c-investigacion edu-new-item inv-datos"
        isSubcategory={true}
        style={{ position: 'absolute', top: '55%', left: '65%', width: '200px', height: '200px' }}
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

export default Investigacion;