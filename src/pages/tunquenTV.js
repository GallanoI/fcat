import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import './tunquenTV.css';

const TunquenTV = () => {
  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/TUNQUENTV/',
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
    { label: 'Eco y algo más', href: 'https://facebook.com/' },
    { label: 'Entrevista a artistas', href: 'https://www.facebook.com/reel/844984376033419/?s=single_unit&locale=es_LA' },
    { label: 'Rescate de técnicas milenarias', href: 'https://www.facebook.com/reel/594218162049518?locale=es_LA' },
    { label: 'Plataforma educativa', href: 'https://facebook.com/reel/959252644608536/?s=single_unit&locale=es_LA' },
    { label: 'Antropología historia', href: 'https://www.facebook.com/reel/618794682335640?locale=es_LA' },
    { label: 'De niños para niños', href: 'https://facebook.com/' },
    { label: 'Video arte', href: 'https://www.facebook.com/reel/1092334144496048?locale=es_LA' },
    { label: 'Entre flores', href: 'https://www.facebook.com/reel/1161508887637139?locale=es_LA' },
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
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={`ttv-table-row ${index % 2 === 0 ? 'alt-a' : 'alt-b'}`}
            >
              {item.label}
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
