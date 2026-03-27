import React, { useState } from 'react';
import CircleItemMenu from '../components/circleItemMenu';
import Zoom from '../components/zoom';
import './audiovisual.css';

const Audiovisual = () => {
  const [zoomItem, setZoomItem] = useState(null);

  const handleOpenMetamorfosis = () => {
    setZoomItem({
      type: 'video',
      src: require('../assets/videos/METAMORFOSIS.mp4'),
      name: 'Metamorfosis',
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
            top: '5%', 
            left: '38%',
            width: '290px',
            height: '290px',
            fontSize: '2.1rem',
            lineHeight: 1.2,
            }} />
      <CircleItemMenu 
        title="Grandes Maestras Chile" 
        className="c-creacion" 
        isSubcategory={true} 
        textColor="black"
        style={{ 
            position: 'absolute',
            top: '60%', 
            left: '6%',
            fontSize: '1.8rem',
            }} />
      <CircleItemMenu 
        title="Si algún día desaparezco" 
        className="c-creacion" 
        isSubcategory={true} 
        textColor="black"
        style={{ 
            position: 'absolute',
            top: '60%', 
            left: '25%',
            fontSize: '1.6rem',
            }} />
      <CircleItemMenu 
        title="Guardianes de la oscuridad" 
        className="c-creacion" 
        isSubcategory={true} 
        textColor="black"
        style={{ 
            position: 'absolute',
            top: '60%', 
            left: '44%',
            fontSize: '1.6rem',
            }} />
      <CircleItemMenu 
        title="Isla Mocha" 
        className="c-creacion" 
        isSubcategory={true} 
        textColor="black"
        style={{ 
            position: 'absolute',
            top: '60%', 
            left: '63%',
            fontSize: '1.8rem',
            }} />
      <CircleItemMenu 
        title="La Yegua" 
        className="c-creacion" 
        isSubcategory={true} 
        textColor="black"
        style={{ 
            position: 'absolute',
            top: '60%', 
            left: '82%',
            fontSize: '1.8rem',
            }} />

      <Zoom item={zoomItem} onClose={() => setZoomItem(null)} />
    </div>
  );
};

export default Audiovisual;
