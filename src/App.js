import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import LogoMenu from './components/logoMenu';
import SplashScreenPrincipal from './components/splashScreenPrincipal';
import AppHome from './pages/appHome';
import Creacion from './pages/creacion';
import Residencia from './pages/residencia';
import PerfilResidente from './pages/perfilResidente';
import Audiovisual from './pages/audiovisual';
import Difusion from './pages/difusion';
import ExpExiPreciones from './pages/expExiPreciones';
import TunquenTV from './pages/tunquenTV';
import Educacion from './pages/educacion';
import EscuelaNinos from './pages/escuelaNinos';
import EscuelaCine from './pages/escuelaCine';
import Investigacion from './pages/investigacion';

function App() {
  const shouldShowInitialSplash = !sessionStorage.getItem('visited');
  const [showSplash, setShowSplash] = useState(shouldShowInitialSplash);
  const [splashTrigger, setSplashTrigger] = useState(
    shouldShowInitialSplash ? 'initial-load' : null
  );
  const [isResidenciaSplashVisible, setIsResidenciaSplashVisible] = useState(false);
  const [logoThemeOverride, setLogoThemeOverride] = useState(null);
  const location = useLocation();

  const isResidentProfile =
    location.pathname.startsWith('/creacion/residencia/') &&
    location.pathname.split('/').filter(Boolean).length === 3;

  useEffect(() => {
    document.title = 'F.C.A.T.';
  }, []);

  useEffect(() => {
    if (location.pathname === '/creacion/residencia') {
      setIsResidenciaSplashVisible(true);
    } else {
      setIsResidenciaSplashVisible(false);
      setLogoThemeOverride(null);
    }
  }, [location.pathname]);

  const handleSplashFinish = () => {
    sessionStorage.setItem('visited', 'true');
    setShowSplash(false);
    setSplashTrigger(null);
  };

  const handleRequestInicioSplash = () => {
    setSplashTrigger('menu-inicio');
    setShowSplash(true);
  };

  return (
    <div className="presentation-bg">
      <AnimatePresence>
        {showSplash ? (
          <SplashScreenPrincipal
            onFinish={handleSplashFinish}
            trigger={splashTrigger}
          />
        ) : (
          <div className="main-layout">
            {!isResidenciaSplashVisible && (
              <LogoMenu
                residentView={isResidentProfile}
                onRequestInicioSplash={handleRequestInicioSplash}
                themeOverride={logoThemeOverride}
              />
            )}
            <Routes>
              <Route path="/" element={<AppHome />} />

              <Route path="/creacion" element={<Creacion />} />
              <Route
                path="/creacion/residencia"
                element={
                  <Residencia
                    onSplashVisibilityChange={setIsResidenciaSplashVisible}
                    onLogoThemeChange={setLogoThemeOverride}
                  />
                }
              />
              <Route path="/creacion/residencia/:id" element={<PerfilResidente />} />
              <Route path="/creacion/audiovisual" element={<Audiovisual />} />

              <Route path="/difusion" element={<Difusion />} />
              <Route path="/difusion/expexipreciones" element={<ExpExiPreciones />} />
              <Route path="/difusion/tunquentv" element={<TunquenTV />} />

              <Route path="/educacion" element={<Educacion />} />
              <Route path="/educacion/escuelaninos" element={<EscuelaNinos />} />
              <Route path="/educacion/escuelacine" element={<EscuelaCine />} />

              <Route path="/investigacion" element={<Investigacion />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;