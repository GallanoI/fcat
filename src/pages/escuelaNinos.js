import React from 'react';
import './escuelaNinos.css';

const EscuelaNinos = () => {
  return (
    <div className="center-logo-page">
      <img
        src={`${process.env.PUBLIC_URL || ''}/logoFCAT.png`}
        alt="Logo CAT"
        className="center-logo-image"
      />
    </div>
  );
};

export default EscuelaNinos;
