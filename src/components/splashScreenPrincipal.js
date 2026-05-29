import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './splashScreenPrincipal.css';
const windAudio = process.env.PUBLIC_URL + '/assets/audios/wind.mp3';

const SplashScreenPrincipal = ({ onFinish, trigger }) => {
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [animationReady, setAnimationReady] = useState(false);
  const [showTapPrompt, setShowTapPrompt] = useState(false);

  useEffect(() => {
    const FADE_DURATION = 1.5;

    const audio = new Audio(windAudio);
    audioRef.current = audio;

    let audioCtx = null;
    let gainNode = null;
    let finishTimeout = null;
    let hasFinished = false;

    const finishSplash = () => {
      if (hasFinished) return;
      hasFinished = true;
      clearTimeout(finishTimeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
      }
      onFinish();
    };

    const startVisualTimer = setTimeout(() => {
      setAnimationReady(true);
    }, 220);

    const setupAndPlay = () => {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaElementSource(audio);
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.9, audioCtx.currentTime);
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        const fadeStart = audioCtx.currentTime + Math.max(0, audio.duration - FADE_DURATION);
        const fadeEnd = audioCtx.currentTime + audio.duration;
        gainNode.gain.setValueAtTime(0.9, fadeStart);
        gainNode.gain.linearRampToValueAtTime(0, fadeEnd);
        finishTimeout = setTimeout(finishSplash, (audio.duration * 1000) + 300);
      } else {
        finishTimeout = setTimeout(finishSplash, 6000);
      }

      audio.play().catch(() => {
        clearTimeout(finishTimeout);
        finishTimeout = setTimeout(finishSplash, 6000);
        setShowTapPrompt(true);
      });
    };

    audio.onended = finishSplash;

    if (audio.readyState >= 1) {
      setupAndPlay();
    } else {
      audio.addEventListener('loadedmetadata', setupAndPlay, { once: true });
      audio.load();
    }

    return () => {
      clearTimeout(startVisualTimer);
      clearTimeout(finishTimeout);
      audio.removeEventListener('loadedmetadata', setupAndPlay);
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
        audioCtxRef.current = null;
      }
    };
  }, [onFinish, trigger]);

  const handleSplashClick = () => {
    if (!showTapPrompt) return;
    setShowTapPrompt(false);
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        audioRef.current && audioRef.current.play().catch(() => {});
      });
    } else if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

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
    visible: { x: 0, opacity: 1, transition: { duration: 4 } },
  };
  const slideRight = {
    hidden: { x: 200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 4 } },
  };

  const pillarCreacion = {
    hidden: { y: -320, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 2, delay: 3, ease: 'easeOut' } },
  };
  const pillarDifusion = {
    hidden: { x: 320, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 2, delay: 3, ease: 'easeOut' } },
  };
  const pillarEducacion = {
    hidden: { x: -320, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 2, delay: 3, ease: 'easeOut' } },
  };
  const pillarInvestigacion = {
    hidden: { y: 320, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 2, delay: 3, ease: 'easeOut' } },
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

  const LEFT_MAIN_DURATION = 3;
  const LEFT_FADE_GAP = 1.5;
  const LEFT_FADE_DURATION = 1;

  const leftFadeOutVariant = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 0,
      transition: {
        delay: LEFT_MAIN_DURATION + LEFT_FADE_GAP,
        duration: LEFT_FADE_DURATION,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="slide-canvas bg-home"
      variants={bgVariant}
      initial="hidden"
      animate={animationReady ? 'visible' : 'hidden'}
      exit={{ opacity: 0 }}
      onClick={handleSplashClick}
      style={{ cursor: showTapPrompt ? 'pointer' : 'default' }}
    >
      {showTapPrompt && (
        <div className="splash-tap-prompt">
          Toca para activar el sonido
        </div>
      )}
      <div className="splash-grid">
        <motion.div 
          className="splash-left"
          variants={leftFadeOutVariant}
          initial="hidden"
          animate={animationReady ? 'visible' : 'hidden'}
        >
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
        </motion.div>
        <div className="splash-right">
          <motion.div
            className="splash-pillar splash-pilar-creacion"
            variants={pillarCreacion}
            initial="hidden"
            animate={animationReady ? 'visible' : 'hidden'}
          >
            <div className="movPilarText-creacion">Creación</div>
          </motion.div>
          <motion.div
            className="splash-pillar splash-pilar-difusion"
            variants={pillarDifusion}
            initial="hidden"
            animate={animationReady ? 'visible' : 'hidden'}
          >
            <div className="movPilarText-difusion">
              <div className="dif-lines">Eventos<br />Difusión</div>
              <div className="dif-amp">&amp;</div>
            </div>

          </motion.div>
          <motion.div
            className="splash-pillar splash-pilar-educacion"
            variants={pillarEducacion}
            initial="hidden"
            animate={animationReady ? 'visible' : 'hidden'}
          >
            <div className="movPilarText-educacion">Educación</div>
          </motion.div>
          <motion.div
            className="splash-pillar splash-pilar-investigacion"
            variants={pillarInvestigacion}
            initial="hidden"
            animate={animationReady ? 'visible' : 'hidden'}
          >
            <div className="movPilarText-investigacion">Investigación</div>
          </motion.div>
        </div>
      </div>
      <motion.div 
          className="splash-left"
          variants={leftFadeOutVariant}
          initial="hidden"
          animate={animationReady ? 'visible' : 'hidden'}
        >
        <motion.div
          className="splash-panel"
          variants={panelVariant}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span key={index} variants={wordVariant}>
              {word}{index < words.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreenPrincipal;
