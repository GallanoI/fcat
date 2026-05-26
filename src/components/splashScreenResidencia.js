import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './splashScreenResidencia.css';

const SplashScreenResidencia = ({ onFinish }) => {
  const getViewMode = () => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth <= 800) return 'responsive';
    return 'desktop';
  };

  const [viewMode, setViewMode] = useState(getViewMode);

  useEffect(() => {
    const handleResize = () => setViewMode(getViewMode());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const slides = [
    {
      src: process.env.PUBLIC_URL + '/assets/fotos/fondos/audiovisual.jpg',
      className: 'col-1',
    },
    {
      src: process.env.PUBLIC_URL + '/assets/fotos/residentes/dafnakojchen/carousel/dk (5).JPEG',
      className: 'col-2',
    },
    {
      src: process.env.PUBLIC_URL + '/assets/fotos/residentes/kenjisenda/carousel/ks (3).JPEG',
      className: 'col-3',
    },
    {
      src: process.env.PUBLIC_URL + '/assets/fotos/residentes/fernandowanders/carousel/fw (15).jpg',
      className: 'col-4',
    },
  ];

  return (
    <div className={`splash-residencia ${viewMode === 'responsive' ? 'splash-residencia-responsive' : ''}`}>
      <div className="res-splash-grid">
        {slides.map((item, index) => (
          <div key={index} className={`res-splash-col ${item.className}`}>
            <motion.img
              src={item.src}
              alt=""
              className="res-splash-photo"
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.5,
                ease: 'easeOut',
              }}
            />
          </div>
        ))}
      </div>

      <motion.img
        src={`${process.env.PUBLIC_URL || ''}/logoFCAT.png`}
        alt="Logo CAT"
        className="splash-residencia-logo"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      />
    </div>
  );
};

export default SplashScreenResidencia;
