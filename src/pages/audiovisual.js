import React, { useState } from 'react';
import CircleItemMenu from '../components/circleItemMenu';
import Bloqueo from '../components/bloqueo';
import Zoom from '../components/zoom';
import { downloadFolderContents } from '../components/downloadableItemUtils';
import './audiovisual.css';
import { ZOOM_OVERLAY_COLORS } from '../config/zoomThemes';

const Audiovisual = () => {
  const [zoomItem, setZoomItem] = useState(null);

  const handleDownloadGrandesMaestras = () => {
    downloadFolderContents('Grandes Maestras');
  };

  const handleOpenMetamorfosis = () => {
    setZoomItem({
      type: 'video',
      src: process.env.PUBLIC_URL + '/assets/videos/METAMORFOSIS.mp4',
      name: 'Metamorfosis',
    });
  };

  const handleOpenGuardianes = () => {
    setZoomItem({
      type: 'video',
      src: process.env.PUBLIC_URL + '/assets/videos/GuardianesOscuridad.mp4',
      name: 'Guardianes de la oscuridad',
    });
  };

  const handleOpenDesaparezco = () => {
    setZoomItem({
      type: 'video',
      src: process.env.PUBLIC_URL + '/assets/videos/DiaDesaparezco.mp4',
      name: 'Si algún día desaparezco',
    });
  };

  return (
    <div className="audiovisual-page">
      <CircleItemMenu 
        title={
          <span>
            Metamorfosis
            <br />
            ▶
          </span>
        }
        hoverTitle={
          <span>
            Reproducir
            <br />
            Metamorfosis
          </span>
        }
        className="c-creacion metamorfosis-item" 
        isSubcategory={true} 
        hoverScale={1.5}
        textColor="black"
        hoverTextColor="white"
        onClick={handleOpenMetamorfosis}
        style={{ 
            position: 'absolute',
            top: '1%', 
            left: '50%',
            width: '290px',
            height: '290px',
            fontSize: '2.1rem',
            lineHeight: 1.2,
            }} />
      <Bloqueo
        title="Grandes Maestras Chile"
        className="c-creacion aud-new-item grandes-maestras-item"
        textColor="black"
        hoverTextColor="white"
        hoverTitle={
          <span style={{ fontSize: '1.3rem', fontWeight: 500, color: 'white' }}>
            Descargar<br />Grandes Maestras Chile
          </span>
        }
        hoverStyle={{ WebkitTextStroke: '1px black' }}
        onUnlock={handleDownloadGrandesMaestras}
        style={{ 
            position: 'absolute',
            top: '50%', 
            left: '1%',
            fontSize: '1.8rem',
            }}
      />
      <CircleItemMenu 
        title={
          <span>
            Si algún día desaparezco
            <br />
            ▶
          </span>
        }
        className="c-creacion aud-new-item" 
        isSubcategory={true} 
        textColor="black"
        hoverTextColor="white"
        onClick={handleOpenDesaparezco}
        style={{ 
            position: 'absolute',
            top: '53%', 
            left: '16%',
            fontSize: '1.7rem',
            width: '230px',
            height: '230px'
            }}
        hoverTitle={
          <span>
            Reproducir
            <br />
            Si algún día desaparezco
          </span>
        } 
      />
      <CircleItemMenu 
        title={
          <span>
            Guardianes de la oscuridad
            <br />
            ▶
          </span>
        }
        className="c-creacion aud-new-item" 
        isSubcategory={true} 
        textColor="black"
        hoverTextColor="white"
        onClick={handleOpenGuardianes}
        style={{ 
            position: 'absolute',
            top: '53%', 
            left: '40%',
            fontSize: '1.7rem',
            width: '230px',
            height: '230px'
            }}
        hoverTitle={
          <span>
            Reproducir
            <br />
            Guardianes de la oscuridad
          </span>
        } 
      />
      <CircleItemMenu 
        title="Isla Mocha" 
        className="c-creacion pd-new-item" 
        isSubcategory={true} 
        textColor="black"
        style={{ 
            position: 'absolute',
            top: '60%', 
            left: '63%',
            fontSize: '1.8rem',
            }}
        hoverTitle={
          <span>
            Proyecto en
            <br />
            Desarrollo
          </span>
        } 
      />
      <CircleItemMenu 
        title="La Yegua" 
        className="c-creacion pd-new-item" 
        isSubcategory={true} 
        textColor="black"
        style={{ 
            position: 'absolute',
            top: '60%', 
            left: '82%',
            fontSize: '1.8rem',
            }}
        hoverTitle={
          <span>
            Proyecto en
            <br />
            Desarrollo
          </span>
        } 
      />

      <Zoom item={zoomItem} onClose={() => setZoomItem(null)} overlayColor={ZOOM_OVERLAY_COLORS.residentes} />
    </div>
  );
};

export default Audiovisual;
