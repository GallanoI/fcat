import React from 'react';
import CircleItemMenu from '../components/circleItemMenu';
import './appHome.css';

const AppHome = () => {
  return (
    <div className="slide-canvas bg-home app-home-page">
      <CircleItemMenu
        title="Creación"
        color="rgba(255,255,0,0.58)"
        to="/creacion"
        className="c-creacion"
        style={{ top: '2%', left: '29%' }}
      />
      <CircleItemMenu
        color="rgba(0,176,240,0.5)"
        to="/difusion"
        className="c-difusion"
        style={{ top: '2%', left: '47%' }}
        title={
          <div className="dif-title">
            <div className="dif-lines">Eventos<br />Difusión</div>
            <div className="dif-amp">&amp;</div>
          </div>
        }
      />
      <CircleItemMenu
        title="Educación"
        color="rgba(240,0,154,0.5)"
        to="/educacion"
        className="c-educacion"
        style={{ top: '44%', left: '29%' }}
      />
      <CircleItemMenu
        title="Investigación"
        color="rgba(173,173,173,0.4)"
        to="/investigacion"
        className="c-investigacion"
        style={{ top: '44%', left: '47%' }}
      />
    </div>
  );
};

export default AppHome;
