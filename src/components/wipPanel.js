import React from 'react';
import './wipPanel.css';

const WIPPanel = ({ top, left }) => {
  return (
    <div className="wip-overlay" style={{ top: top, left: left }}>
      <div className="wip-text-panel">
        <p className="wip-text">Trabajo en Progreso</p>
      </div>
      <div className="wip-image-panel">
        <img src="/WIP.png" alt="Trabajo en progreso" />
      </div>
    </div>
  );
};

export default WIPPanel;