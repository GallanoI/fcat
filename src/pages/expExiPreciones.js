import React, { useMemo, useState } from 'react';
import Carousel from '../components/carousel';
import DuTextColFond from '../components/duTextColFond';
import RepAudio from '../components/repAudio';
import Zoom from '../components/zoom';
import { ZOOM_OVERLAY_COLORS } from '../config/zoomThemes';
import './expExiPreciones.css';

const ExpExiPreciones = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomItem, setZoomItem] = useState(null);

  const duexpreContext = require.context(
    '../assets/fotos/duexpre',
    false,
    /\.JPG$/i
  );

  const audiosContext = require.context(
    '../assets/audios',
    false,
    /\.(mp3|wav|ogg)$/i
  );

  const audioByName = useMemo(() => {
    const map = {};
    audiosContext.keys().forEach((key) => {
      const fileName = key.replace('./', '').toLowerCase();
      map[fileName] = audiosContext(key);
    });
    return map;
  }, [audiosContext]);

  // Datos de cada foto: leftText, rightText, audioFile
  // idx es 0-based, pero los comentarios usan 1-based para claridad
  const photoData = useMemo(() => ({
    
    // 0: { leftText: 'AAAAAAAAAAAAAAAAAAAAAAAA', rightText: 'GUSTAVO LOPEZ', audioFile: 'audio1.mp3' },
    // 1: { leftText: 'MÚSICA FLAMENCA', rightText: 'GUSTAVO LOPEZ', audioFile: 'audio1.mp3' },
    // 2: { leftText: 'CAJON FLAMENCO', rightText: 'MARCELO SOLAR', audioFile: 'audio54.mp3' },
    // 3: { leftText: 'DANZA AFGANA', rightText: 'GRETA BELIMOVA', audioFile: null },
    // Agrega aquí los datos de las fotos 5-75 siguiendo el mismo formato
    // Ejemplo para más fotos:
    // 4: { leftText: 'TEXTO IZQUIERDO FOTO 5', rightText: 'TEXTO DERECHO FOTO 5', audioFile: 'audio66.mp3' },
    6: { leftText: ' ', rightText: 'PAULA REPETTO', audioFile: null },
    7: { leftText: ' ', rightText: 'PAULA REPETTO', audioFile: null },
    17: { leftText: ' ', rightText: 'PAULA REPETTO', audioFile: null },
    
    
    31: { leftText: 'MÚSICA FLAMENCA', rightText: 'GUSTAVO LOPEZ', audioFile: null },
    32: { leftText: 'MÚSICA FLAMENCA', rightText: 'GUSTAVO LOPEZ', audioFile: null },
    33: { leftText: 'MÚSICA FLAMENCA', rightText: 'GUSTAVO LOPEZ', audioFile: null },
    34: { leftText: 'MÚSICA FLAMENCA', rightText: 'GUSTAVO LOPEZ', audioFile: null },
    35: { leftText: 'MÚSICA FLAMENCA', rightText: 'GUSTAVO LOPEZ', audioFile: null },
    
    40: { leftText: 'CAJON FLAMENCO', rightText: 'MARCELO SOLAR', audioFile: null },

    52: { leftText: 'CONCIERTO PARA FLAUTA Y PIANO', rightText: 'ROBERTO ORELLANA', audioFile: null },
    53: { leftText: 'CONCIERTO PARA FLAUTA Y PIANO', rightText: 'ROBERTO ORELLANA', audioFile: null },
    54: { leftText: 'CONCIERTO PARA FLAUTA Y PIANO', rightText: 'ROBERTO ORELLANA', audioFile: null },
  }), []);

  const duexpreItems = useMemo(
    () => duexpreContext
      .keys()
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map((key, idx) => {
        const data = photoData[idx] || {};
        return {
          src: duexpreContext(key),
          type: 'image',
          name: `dexp-${idx + 1}`,
          leftText: data.leftText || '', //`Texto foto ${idx}`,
          rightText: data.rightText || '',
          audio: data.audioFile ? audioByName[data.audioFile.toLowerCase()] : null,
        };
      }),
    [duexpreContext, audioByName, photoData]
  );

  const safeIndex = Math.max(0, Math.min(selectedIndex, duexpreItems.length - 1));
  const activeItem = duexpreItems[safeIndex] || null;

  return (
    <div
      className="exp-page"
      style={{ backgroundImage: `url(${require('../assets/fotos/fondos/duexpre.JPG')})` }}
    >
      <DuTextColFond
        className="exp-layout"
        leftTitleClassName="exp-left-title"
        rightTitleClassName="exp-right-title"
        rightBackground="rgba(8, 84, 184, 0.5)"
        leftTitle={
          <span>
            EXPOSI
            <br />
            EXIBI
            <br />
            PRESENTA
          </span>
        }
        rightTitle={
          <span>
            CIO
            <br />
            NES
          </span>
        }
        leftTitleColor="#f1c232"
        rightTitleColor="#93c47d"
        leftContent={
          <div className="exp-left-content">
            <p className="exp-left-changing-text">{activeItem?.leftText}</p>
          </div>
        }
        rightContent={
          <div className="exp-right-content">
            {/* Ajuste manual vertical: modifica --exp-feature-y en .exp-right-content */}
            <div className="exp-feature-wrap" style={{ '--exp-feature-y': '50%' }}>
              <p className="exp-right-overlay-text">{activeItem?.rightText}</p>
              <img
                src={activeItem?.src}
                alt="Obra actual"
                className="exp-feature-img"
                onClick={() => activeItem && setZoomItem(activeItem)}
              />
              <RepAudio
                className="exp-audio-btn"
                src={activeItem?.audio}
                hidden={!activeItem?.audio}
                size={80}
              />
            </div>
          </div>
        }
      />

      <div className="exp-carousel-wrap">
        <Carousel
          items={duexpreItems}
          variant="gallery"
          visibleItems={4}
          showText={false}
          autoPlayInterval={7000}
          className="exp-duexpre-carousel"
          backgroundColor="rgba(8, 84, 184, 0.5)"
          onIndexChange={setSelectedIndex}
          onImageClick={(item, idx) => setSelectedIndex(idx)}
        />
      </div>

      <Zoom
        item={zoomItem}
        onClose={() => setZoomItem(null)}
        overlayColor={ZOOM_OVERLAY_COLORS.expExiPreciones}
      />
    </div>
  );
};

export default ExpExiPreciones;
