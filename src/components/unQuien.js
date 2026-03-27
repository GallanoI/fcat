import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './unQuien.css';

/**
 * UnQuien — círculo de miembro del equipo.
 * Props:
 *   name        — nombre completo
 *   role        — cargo / descripción breve
 *   info        — texto largo (aparece en hover)
 *   photoSrc    — src de la foto
 *   pilarColor  — color de fondo del círculo (rgba)
 *   borderColor — color del borde (string)
 *   textColor   — color del texto (string)
 *   style       — estilos inline adicionales (posición zigzag)
 *   className   — clase extra
 */
const UnQuien = ({
  name = '',
  role = '',
  info = '',
  photoSrc,
  pilarColor = 'rgba(173,173,173,0.4)',
  borderColor = '#212121',
  textColor = 'white',
  style = {},
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`unquien-circle ${className}`}
      style={{
        backgroundColor: pilarColor,
        border: `4px solid ${borderColor}`,
        color: textColor,
        ...style,
      }}
      whileHover={{ scale: 1.12 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <div className="unquien-info-panel">
          <p className="unquien-info-name">{name}</p>
          {role && <p className="unquien-info-role">{role}</p>}
          {info && <p className="unquien-info-text">{info}</p>}
        </div>
      ) : (
        <div className="unquien-default-panel">
          {photoSrc && (
            <img
              src={photoSrc}
              alt={name}
              className="unquien-photo"
            />
          )}
          <p className="unquien-name">{name}</p>
        </div>
      )}
    </motion.div>
  );
};

export default UnQuien;
