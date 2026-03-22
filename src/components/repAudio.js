import React, { useEffect, useRef, useState } from 'react';
import { FaMusic } from 'react-icons/fa';
import './repAudio.css';

const RepAudio = ({
  src,
  size = 80,
  backgroundColor = 'rgba(0, 176, 240, 0.75)',
  borderColor = '#000',
  className = '',
  hidden = false,
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, [src]);

  const handleToggle = (event) => {
    event.stopPropagation();
    if (!audioRef.current || hidden || !src) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  if (hidden) {
    return <div className={`rep-audio-hidden ${className}`.trim()} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      className={`rep-audio-btn ${className} ${isPlaying ? 'is-playing' : ''}`.trim()}
      onClick={handleToggle}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        borderColor,
      }}
      aria-label="Reproducir audio"
    >
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)}
      />
      <span className="rep-audio-notes" aria-hidden="true">
        <FaMusic />
        <FaMusic />
        <FaMusic />
      </span>
    </button>
  );
};

export default RepAudio;
