import React from 'react';
import './vmv.css';

const VMV = () => {
  return (
    <div className="vmv-page">
      {/* TOP PANEL — 1/3 altura */}
      <div className="vmv-top-panel">
        <h1 className="vmv-top-title">VISIÓN, MISIÓN Y VALORES</h1>
        <p className="vmv-top-subtitle">Fundación Cultural Artística de Tunquén</p>
      </div>

      {/* BOTTOM CONTENT — 2/3 altura */}
      <div className="vmv-bottom">
        <div className="vmv-column">
          <h2 className="vmv-col-title vmv-col-title-vision">VISIÓN</h2>
          <div className="vmv-col-body">
            <p className="vmv-col-text">
              Ser un referente cultural y artístico del territorio costero de Tunquén,
              generando espacios de creación, investigación y difusión del arte
              que fortalezcan la identidad local y conecten a las comunidades
              con su patrimonio natural y cultural.
            </p>
          </div>
        </div>

        <div className="vmv-column vmv-column-mid">
          <h2 className="vmv-col-title vmv-col-title-mision">MISIÓN</h2>
          <div className="vmv-col-body">
            <p className="vmv-col-text">
              Investigamos, creamos, educamos y difundimos el arte de nuestro
              territorio. A través de residencias artísticas, escuelas de verano,
              exposiciones y eventos culturales, promovemos el desarrollo
              de las artes y la cultura en la zona costera, vinculando
              artistas locales e internacionales con la comunidad de Tunquén.
            </p>
          </div>
        </div>

        <div className="vmv-column">
          <h2 className="vmv-col-title vmv-col-title-valores">VALORES</h2>
          <div className="vmv-col-body">
            <ul className="vmv-valores-list">
              <li>Territorialidad</li>
              <li>Colaboración</li>
              <li>Experimentación</li>
              <li>Comunidad</li>
              <li>Sostenibilidad</li>
              <li>Diversidad</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VMV;
