import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './logoMenu.css';

const LogoMenu = ({ residentView = false, onRequestInicioSplash, themeOverride = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const options = ["Inicio", "Quienes Somos", "Misión y Visión", "Opcion 3"];

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
    // Excluimos Home y raíces de pilares
    const mainPaths = ["/"];
    if (mainPaths.includes(path)) return null;

    // Detectar a qué pilar pertenece la subcategoría
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

    // Ya estamos en raíz: no hacer nada
    if (segments.length === 0) {
      return null;
    }

    // Caso especial: perfil residente -> residencia + scroll a residentes
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

    // Regla general: subir un nivel de ruta
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
      if (onRequestInicioSplash) {
        onRequestInicioSplash();
      }
      navigate("/");
    } else if (opt === "Quienes Somos") {
      navigate("/quienes");
    } else if (opt === "Misión y Visión") {
      navigate("/vmv");
    } else {
      navigate(`/${opt.toLowerCase().replace(/ /g, "-")}`);
    }
    setIsHovered(false);
  };

  // Definición de estilos dinámicos
  const getLogoStyles = () => {
    if (context) {
      // Estilo en Subcategoría
      return {
        backgroundColor: context.bg,
        border: `4px solid ${context.border}`,
      };
    } else {
      // Estilo por defecto (Home / Pilar)
      return {
        border: `3px solid ${isHovered ? 'white' : 'black'}`,
        backgroundColor: 'transparent'
      };
    }
  };

  const isResidentView = residentView || location.pathname.startsWith('/creacion/residencia/');

  return (
    <div 
      className="logo-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isResidentView ? { left: '40px' } : undefined}
    >
      
      <div 
        className="logo-wrapper"
        style={getLogoStyles()}
        onClick={handleLogoClick}
      >
        {/* Si estamos en subcategoría y hay hover, mostramos el texto y tapamos el logo */}
        {context && isHovered ? (
          <div className="logo-back-text" style={{ color: isResidentView ? '#000' : context.color }}>
            <span>Volver a la </span>
            <span>Página Anterior</span>
          </div>
        ) : (
          <img 
            src={
              isResidentView
                ? (isHovered ? `${publicUrl}/logoFCAT.png` : `${publicUrl}/logoFCAT-N.png`)
                : (isHovered ? `${publicUrl}/logoFCAT-N.png` : `${publicUrl}/logoFCAT.png`)
            } 
            alt="Logo" 
            className="logo-img"
          />
        )}
      </div>
      
      {isHovered && (
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