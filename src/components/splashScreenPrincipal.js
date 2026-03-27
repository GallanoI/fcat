import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './splashScreenPrincipal.css';
import windAudio from '../assets/audios/wind.mp3';

const SplashScreenPrincipal = ({ onFinish, trigger }) => {
  const audioRef = useRef(null);
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(windAudio);
    audioRef.current = audio;
    audio.volume = 0.9;

    let finishTimeout;
    let hasFinished = false;

    const finishSplash = () => {
      if (hasFinished) {
        return;
      }
      hasFinished = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onFinish();
    };

    // Caso 1: aparece al inicio al entrar por primera vez.
    // Caso 2: aparece cuando se presiona Inicio desde LogoMenu.
    const startVisualTimer = setTimeout(() => {
      setAnimationReady(true);
    }, 220);

    audio.onended = finishSplash;
    audio.onloadedmetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        clearTimeout(finishTimeout);
        finishTimeout = setTimeout(finishSplash, (audio.duration * 1000) + 100);
      }
    };

    audio.play().catch(() => {
      clearTimeout(finishTimeout);
      finishTimeout = setTimeout(finishSplash, 50000);
    });

    return () => {
      clearTimeout(startVisualTimer);
      clearTimeout(finishTimeout);
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.onloadedmetadata = null;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [onFinish, trigger]);

  const bgVariant = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };
  const fadeVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 4.5 } },
  };
  const slideLeft = {
    hidden: { x: -200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 3 } },
  };
  const slideRight = {
    hidden: { x: 200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 3 } },
  };

  // Pilares decorativos: entran desde los bordes, inician 1s antes de que terminen los
  // slides principales (dur 3s), o sea delay = 2s. Permanecen estáticos hasta que termina splash.
  const pillarCreacion = {
    hidden: { y: -320, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 3, delay: 2, ease: 'easeOut' } },
  };
  const pillarDifusion = {
    hidden: { x: 320, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 3, delay: 2, ease: 'easeOut' } },
  };
  const pillarEducacion = {
    hidden: { x: -320, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 3, delay: 2, ease: 'easeOut' } },
  };
  const pillarInvestigacion = {
    hidden: { y: 320, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 3, delay: 2, ease: 'easeOut' } },
  };
  const panelVariant = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        when: 'beforeChildren',
        staggerChildren: 0.25,
      },
    },
  };
  const wordVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const logoSrc = `${process.env.PUBLIC_URL || ''}/logoFCAT.png`;
  const message = '“ Investigamos, Creamos, Educamos y Difundimos el Arte de Nuestro Territorio. ”';
  const words = message.split(' ');

  return (
    <motion.div
      className="slide-canvas bg-home"
      variants={bgVariant}
      initial="hidden"
      animate={animationReady ? 'visible' : 'hidden'}
      exit={{ opacity: 0 }}
    >
      <div className="splash-grid">
        <div className="splash-left">
          <motion.img
            src={logoSrc}
            alt="Logo CAT"
            className="logo-splash"
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
          />
          <motion.p
            className="splash-text-cat"
            variants={slideLeft}
            initial="hidden"
            animate="visible"
          >
            CAT
          </motion.p>
          <motion.p
            className="splash-text-mov"
            variants={slideRight}
            initial="hidden"
            animate="visible"
          >
            Arte en movimiento
          </motion.p>
        </div>
        <div className="splash-right">
          {/* Pilares decorativos: entran desde los 4 bordes */}
          <motion.div
            className="splash-pillar splash-pilar-creacion"
            variants={pillarCreacion}
            initial="hidden"
            animate={animationReady ? 'visible' : 'hidden'}
          >
            Creación
          </motion.div>
          <motion.div
            className="splash-pillar splash-pilar-difusion"
            variants={pillarDifusion}
            initial="hidden"
            animate={animationReady ? 'visible' : 'hidden'}
          >
            Difusión
          </motion.div>
          <motion.div
            className="splash-pillar splash-pilar-educacion"
            variants={pillarEducacion}
            initial="hidden"
            animate={animationReady ? 'visible' : 'hidden'}
          >
            Educación
          </motion.div>
          <motion.div
            className="splash-pillar splash-pilar-investigacion"
            variants={pillarInvestigacion}
            initial="hidden"
            animate={animationReady ? 'visible' : 'hidden'}
          >
            Investigación
          </motion.div>
        </div>
      </div>
      <motion.div
        className="splash-panel"
        variants={panelVariant}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, index) => (
          <motion.span key={index} variants={wordVariant}>
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SplashScreenPrincipal;
