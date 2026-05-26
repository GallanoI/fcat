import React from 'react';
// import { useNavigate } from 'react-router-dom';
import CircleItemMenu from '../components/circleItemMenu';
import Bloqueo from '../components/bloqueo';
import { downloadFolderContents } from '../components/downloadableItemUtils';
import './difusion.css';

const Difusion = () => {
  // const navigate = useNavigate();
  const handleDownloadFestivales = () => {
    downloadFolderContents('Festivales');
  };

  return (
    <div className="difusion-page full-bg">
      <CircleItemMenu
        className="c-difusion dif-tunquen"
        isSubcategory={true}
        to="/difusion/tunquentv"
        style={{ position: 'absolute', top: '52%', left: '40%', width: '230px', height: '230px' }}
        title={
          <div className='tunquenTV'>
            <span className='Tunquen'>Tunquén</span>
            <span className='TV'>TV</span>
          </div>
        }
      />
      <CircleItemMenu
        className="c-difusion duexprecion-item dif-duexpre"
        isSubcategory={true}
        to="/difusion/expexipreciones"
        style={{ position: 'absolute', top: '5%', left: '10%', width: '350px', height: '350px' }}
        title={
          <div className='duexprecion'>
            <div className='duexpre'>EXPOSI<br />EXIBI<br />PRESENTA</div>
            <div className='ciones'>CIO<br />NES</div>
          </div>
        }
      />
      <CircleItemMenu
        title={<span className='artesIntegradas'>AI - ARTES INTEGRADAS</span>}
        className="c-difusion dif-new-item dif-artes"
        isSubcategory={true}
        style={{ position: 'absolute', top: '50%', left: '80%', width: '200px', height: '200px' }}
        hoverTitle={
          <span>
            Proyecto en
            <br />
            Desarrollo
          </span>
        }
      />
      <Bloqueo
        title={<span className='festivales'>FESTIVALES</span>}
        className="c-difusion dif-festivales"
        hoverTitle={
          <span style={{ fontSize: '2rem', fontWeight: 300 }}>
            Descargar<br />Festivales
          </span>
        }
        onUnlock={handleDownloadFestivales}
        style={{ position: 'absolute', top: '15%', left: '60%', width: '220px', height: '220px' }}
      />
    </div>
  );
};

export default Difusion;