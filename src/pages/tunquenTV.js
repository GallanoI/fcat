import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import './tunquenTV.css';

const TunquenTV = () => {
  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com',
      icon: <FaFacebook />,
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com',
      icon: <FaInstagram />,
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com',
      icon: <FaYoutube />,
    },
  ];

  const tableItems = [
    'Eco y algo más',
    'Entrevista a artistas',
    'Rescate de técnicas milenarias',
    'Plataforma educativa',
    'Antropología historia',
    'De niños para niños',
    'Video arte',
    'Entre flores',
  ];

  return (
    <div
      className="tunquen-tv-page"
      style={{ backgroundImage: `url(${require('../assets/fotos/fondos/audiovisual.jpg')})` }}
    >
      <header className="ttv-panel ttv-panel-top">
        <h1>TUNQUÉN TV</h1>
      </header>

      <main className="ttv-content-area">
        <aside className="ttv-links-table" aria-label="Contenidos de Tunquén TV">
          {tableItems.map((item, index) => (
            <a
              key={item}
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              className={`ttv-table-row ${index % 2 === 0 ? 'alt-a' : 'alt-b'}`}
            >
              {item}
            </a>
          ))}
        </aside>
      </main>

      <footer className="ttv-panel ttv-panel-bottom">
        <p>
          Canal digital alojado en&nbsp;
          {socialLinks.map((social, index) => (
            <React.Fragment key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer" className="ttv-social-link">
                {social.label} {social.icon}
              </a>
              {index < socialLinks.length - 1 ? ', ' : ''}
            </React.Fragment>
          ))}
          , con más de 1200 seguidores orgánicos, EN ESTE MOMENTO está en etapa de Upgrade.
        </p>
      </footer>
    </div>
  );
};

export default TunquenTV;
