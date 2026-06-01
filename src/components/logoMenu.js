import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './logoMenu.css';

const LogoMenu = ({ residentView = false, onRequestInicioSplash, themeOverride = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // touch-mode open state
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect touch-capable device (including hybrids): use touch behavior only
  const isTouchDevice = useRef(
    typeof window !== 'undefined' && window.matchMedia('(any-pointer: coarse)').matches
  ).current;

  const options = ["Inicio", "Quienes Somos", "Misión y Visión", "Administración"];

  // Configuración de colores de los pilares
  const pillarConfigs = {
    creacion: {
      name: "Creación",
      path: "/creacion",
      bg: "rgba(255, 255, 0, 0.58)",
      border: "#a46e1b",
      color: "white"
    },
    difusion: {
      name: "Difusión",
      path: "/difusion",
      bg: "rgba(0, 176, 240, 0.5)",
      border: "#212121",
      color: "#f1c232"
    },
    educacion: {
      name: "Educación",
      path: "/educacion",
      bg: "rgba(240, 0, 154, 0.5)",
      border: "magenta",
      color: "#93c47d"
    },
    investigacion: {
      name: "Investigación",
      path: "/investigacion",
      bg: "rgba(173, 173, 173, 0.4)",
      border: "#212121",
      color: "white"
    }
  };

  // 1. Determinar si estamos en una subcategoría
  const getContext = () => {
    if (themeOverride && pillarConfigs[themeOverride]) {
      return pillarConfigs[themeOverride];
    }

    const path = location.pathname;
    const mainPaths = ["/"];
    if (mainPaths.includes(path)) return null;

    if (path.includes("creacion") || path.includes("residencia")) return pillarConfigs.creacion;
    if (path.includes("difusion")) return pillarConfigs.difusion;
    if (path.includes("educacion")) return pillarConfigs.educacion;
    if (path.includes("investigacion")) return pillarConfigs.investigacion;
    
    return null;
  };

  const context = getContext();
  const publicUrl = process.env.PUBLIC_URL || '';

  const getBackTarget = (pathname) => {
    const cleanPath = pathname.replace(/\/+$/, '') || '/';
    const segments = cleanPath.split('/').filter(Boolean);

    if (segments.length === 0) return null;

    const isResidentProfilePath =
      segments[0] === 'creacion' &&
      segments[1] === 'residencia' &&
      segments.length === 3;

    if (isResidentProfilePath) {
      return {
        path: '/creacion/residencia',
        options: { state: { scrollTo: 'residentes' }, replace: true }
      };
    }

    if (segments.length === 1) {
      return { path: '/', options: { replace: true } };
    }

    segments.pop();
    return {
      path: '/' + segments.join('/'),
      options: { replace: true }
    };
  };

  const handleLogoClick = () => {
    const target = getBackTarget(location.pathname);
    if (!target) return;
    navigate(target.path, target.options);
  };

  const handleNavigation = (opt) => {
    if (opt === "Inicio") {
      if (onRequestInicioSplash) onRequestInicioSplash();
      navigate("/");
    } else if (opt === "Quienes Somos") {
      navigate("/quienes");
    } else if (opt === "Misión y Visión") {
      navigate("/vmv");
    } else if (opt === "Administración") {
      navigate("/admin");
    } else {
      navigate(`/${opt.toLowerCase().replace(/ /g, "-")}`);
    }
    if (isTouchDevice) setIsMenuOpen(false);
    else setIsHovered(false);
  };

  // Touch: close on outside tap or scroll
  useEffect(() => {
    if (!isTouchDevice) return undefined;

    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => setIsMenuOpen(false);

    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });

    return () => {
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [isTouchDevice]);

  // Close touch menu on route change
  useEffect(() => {
    if (isTouchDevice) setIsMenuOpen(false);
  }, [location.pathname, isTouchDevice]);

  // Definición de estilos dinámicos
  const isOpen = isTouchDevice ? isMenuOpen : isHovered;

  const getLogoStyles = () => {
    if (context) {
      return {
        backgroundColor: context.bg,
        border: `4px solid ${context.border}`,
      };
    } else {
      return {
        border: `3px solid ${isOpen ? 'white' : 'black'}`,
        backgroundColor: 'transparent'
      };
    }
  };

  const isResidentView = residentView || location.pathname.startsWith('/creacion/residencia/');
  const isVMVPage = location.pathname === '/vmv';

  // Touch: handle logo-wrapper tap
  const handleLogoWrapperTouch = (e) => {
    e.preventDefault(); // prevent ghost click
    if (isMenuOpen && context) {
      // Second tap on logo: navigate back
      setIsMenuOpen(false);
      handleLogoClick();
    } else if (isMenuOpen) {
      // No context (home/pillar root): close menu
      setIsMenuOpen(false);
    } else {
      // First tap: open menu
      setIsMenuOpen(true);
    }
  };

  // Touch: handle container tap to open (when tapping outside logo-wrapper)
  const handleContainerTouch = (e) => {
    if (!isMenuOpen) {
      e.preventDefault();
      setIsMenuOpen(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`logo-container ${isVMVPage ? 'logo-vmv' : ''}`}
      onMouseEnter={isTouchDevice ? undefined : () => setIsHovered(true)}
      onMouseLeave={isTouchDevice ? undefined : () => setIsHovered(false)}
      onTouchEnd={isTouchDevice ? handleContainerTouch : undefined}
      style={isResidentView ? { left: '40px' } : undefined}
    >
      
      <div 
        className="logo-wrapper"
        style={getLogoStyles()}
        onClick={isTouchDevice ? undefined : handleLogoClick}
        onTouchEnd={isTouchDevice ? handleLogoWrapperTouch : undefined}
      >
        {/* Si estamos en subcategoría y hay apertura, mostramos el texto y tapamos el logo */}
        {context && isOpen ? (
          <div
            className="logo-back-text"
            style={{
              color: isResidentView ? '#000' : context.color,
              ...(context === pillarConfigs.creacion
                ? { WebkitTextStroke: '1px black' }
                : undefined),
            }}
          >
            <span>Volver a la </span>
            <span>Página Anterior</span>
          </div>
        ) : (
          <img 
            src={
              isResidentView
                ? (isOpen ? `${publicUrl}/logoFCAT.png` : `${publicUrl}/logoFCAT-N.png`)
                : (isOpen ? `${publicUrl}/logoFCAT-N.png` : `${publicUrl}/logoFCAT.png`)
            } 
            alt="Logo" 
            className="logo-img"
          />
        )}
      </div>
      
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((opt) => (
            <li 
              key={opt} 
              className="dropdown-item"
              onClick={() => handleNavigation(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default LogoMenu;
