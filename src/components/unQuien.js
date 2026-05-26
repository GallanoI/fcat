import React from 'react';
import './unQuien.css';

const UnQuien = ({
  name = '',
  role = '',
  info = '',
  photoSrc,
  pilarColor = 'rgba(173,173,173,0.4)',
  borderColor = '#212121',
  textColor = 'white',
  side = 'left',
  style = {},
  className = '',
}) => {
  const {
    top,
    left,
    width = 'clamp(170px, 16vw, 220px)',
    height = 'clamp(170px, 16vw, 220px)',
    ...restStyle
  } = style;

  const isRight = side === 'right';
  const displayName = role ? `${name} - ${role}` : name;

  return (
    <div
      className={`unquien-entry ${isRight ? 'is-right' : 'is-left'} ${className}`.trim()}
      style={{
        top,
        left,
        color: textColor,
        '--unquien-circle-width': width,
        '--unquien-circle-height': height,
        '--unquien-panel-width': '280px',
        ...restStyle,
      }}
    >
      <div
        className="unquien-circle"
        style={{
          backgroundColor: pilarColor,
          borderColor,
        }}
      >
        {photoSrc && <img src={photoSrc} alt={name} className="unquien-photo" />}
      </div>

      <div className="unquien-text-shell">
        <p className="unquien-name">{displayName}</p>
        <div
          className="unquien-info-panel"
          style={{
            backgroundColor: pilarColor,
            borderColor,
          }}
        >
          {info && <p className="unquien-info-text">{info}</p>}
        </div>
      </div>
    </div>
  );
};

export default UnQuien;
