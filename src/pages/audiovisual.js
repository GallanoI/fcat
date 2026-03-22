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
            left: '9%',
            fontSize: '1.8rem',
            }} />
      <CircleItemMenu 
        title="Isla Mocha" 
        className="c-creacion" 
        isSubcategory={true} 
        textColor="black"
        style={{ 
            position: 'absolute',
            top: '60%', 
            left: '42%',
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
            left: '75%',
            fontSize: '1.8rem',
            }} />

      <Zoom item={zoomItem} onClose={() => setZoomItem(null)} />
    </div>
  );
};

export default Audiovisual;
