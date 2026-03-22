import React from 'react';
import CircleItemMenu from '../components/circleItemMenu';
import './difusion.css';

const Difusion = () => {
  return (
    <div className="difusion-page full-bg">
      <CircleItemMenu
        className="c-difusion"
        isSubcategory={true}
        to="/difusion/tunquentv"
        style={{ position: 'absolute', top: '52%', left: '40%', width: '220px', height: '220px' }}
        title={
          <div className='tunquenTV'>
            <div className='Tunquen'>Tunquén</div>
            <div className='TV'>TV</div>
          </div>
        }
      />
      <CircleItemMenu
        className="c-difusion duexprecion-item"
        isSubcategory={true}
        to="/difusion/expexipreciones"
        style={{ position: 'absolute', top: '8%', left: '15%', width: '350px', height: '350px' }}
        title={
          <div className='duexprecion'>
            <div className='duexpre'>EXPOSI<br />EXIBI<br />PRESENTA</div>
            <div className='ciones'>CIO<br />NES</div>
          </div>
        }
      />
      <CircleItemMenu
        className="c-difusion"
        isSubcategory={true}
        onClick={() => window.open('https://docs.google.com/presentation/d/1UiK1S0mjlGJTcB0hHFR6J-7jFjJ5P_7i/edit?slide=id.p1#slide=id.p1', '_blank', 'noreferrer' )}
        style={{ position: 'absolute', top: '15%', left: '60%', width: '220px', height: '220px' }}
        title={
          <div className='festivales'>FESTIVALES</div>
        }
      />
      <CircleItemMenu
        className="c-difusion"
        isSubcategory={true}
        to="/difusion/artesintegradas"
        style={{ position: 'absolute', top: '50%', left: '80%', width: '220px', height: '220px' }}
        title={
          <div className='artesIntegradas'>AI - ARTES INTEGRADAS</div>
        }
      />
    </div>
  );
};

export default Difusion;
