import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaLock } from 'react-icons/fa';
import './bloqueo.css';

const LOCKOUT_DURATION = 600000; // 10 minutos

const renderHoverText = (content) => {
  if (
    content &&
    typeof content === 'object' &&
    !Array.isArray(content) &&
    Object.prototype.hasOwnProperty.call(content, 'line1') &&
    Object.prototype.hasOwnProperty.call(content, 'line2')
  ) {
    return (
      <span className="bloqueo-hover-label is-custom">
        <span>{content.line1}</span>
        <span>{content.line2}</span>
      </span>
    );
  }

  return <span className="bloqueo-hover-label">{content}</span>;
};

const Bloqueo = ({
  title,
  className = '',
  style = {},
  password = '1982',
  onUnlock,
  hoverTitle,
  hoverScale = 1.2,
  textColor,
  hoverTextColor,
  hoverFontSize,
  hoverStyle = {},
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lockTimerRef = useRef(null);

  const handleCircleClick = () => {
    if (isLocked) return;
    setShowPopup(true);
    setInputValue('');
  };

  const handleSubmit = () => {
    if (!inputValue) return;
    if (inputValue === password) {
      setShowPopup(false);
      setErrorCount(0);
      if (onUnlock) onUnlock();
    } else {
      const newErrors = errorCount + 1;
      setErrorCount(newErrors);
      setInputValue('');
      if (newErrors >= 3) {
        setIsLocked(true);
        setShowPopup(false);
        lockTimerRef.current = setTimeout(() => {
          setIsLocked(false);
          setErrorCount(0);
        }, LOCKOUT_DURATION);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') setShowPopup(false);
  };

  return (
    <>
      <div
        className={`circle-common subcategory-circle bloqueo-circle ${className} ${isHovered ? 'bloqueo-hovered' : ''} ${isLocked ? 'bloqueo-locked-state' : ''}`}
        style={{
          ...style,
          opacity: isLocked ? 0.5 : isHovered ? 1 : 0.85,
          cursor: isLocked ? 'not-allowed' : 'pointer',
          color: isHovered && hoverTextColor ? hoverTextColor : textColor,
          transform: isHovered && !isLocked ? `scale(${hoverScale})` : 'scale(1)',
          ...(isHovered && hoverFontSize ? { fontSize: hoverFontSize } : {}),
          ...(isHovered ? hoverStyle : {}),
        }}
        onClick={handleCircleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && !isLocked ? (
          <div className="bloqueo-hover-content">
            {hoverTitle ? (
              renderHoverText(hoverTitle)
            ) : (
              <>
                <FaLock className="bloqueo-lock-icon-top" />
                <span className="bloqueo-hover-label">Acceso Restringido</span>
              </>
            )}
          </div>
        ) : isLocked ? (
          <div className="bloqueo-hover-content">
            <FaLock className="bloqueo-lock-icon-top" />
            <span className="bloqueo-hover-label">Bloqueado</span>
          </div>
        ) : (
          <div className="bloqueo-default-content">
            <span className="bloqueo-title-text">{title}</span>
            <FaLock className="bloqueo-lock-small" />
          </div>
        )}
      </div>

      {showPopup && ReactDOM.createPortal(
        <div className="bloqueo-backdrop" onClick={() => setShowPopup(false)}>
          <div className="bloqueo-popup" onClick={(e) => e.stopPropagation()}>
            <FaLock className="bloqueo-popup-icon" />
            <h3 className="bloqueo-popup-title">Acceso Restringido</h3>
            <input
              autoFocus
              type="password"
              className="bloqueo-popup-input"
              placeholder="Contraseña"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {errorCount > 0 && (
              <p className="bloqueo-error-msg">
                Contraseña incorrecta ({errorCount}/3)
              </p>
            )}
            <div className="bloqueo-popup-actions">
              <button className="bloqueo-btn-ok" onClick={handleSubmit}>
                Entrar
              </button>
              <button className="bloqueo-btn-cancel" onClick={() => setShowPopup(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Bloqueo;
