import React from 'react';
import './duTextColFond.css';

const DuTextColFond = ({
  leftTitle,
  rightTitle,
  leftTitleColor = '#ffffff',
  rightTitleColor = '#ffcb0a',
  rightBackground = 'rgba(8, 84, 184, 0.5)',
  leftContent,
  rightContent,
  className = '',
  leftTitleClassName = '',
  rightTitleClassName = '',
}) => {
  return (
    <div className={`du-text-col-fond ${className}`.trim()}>
      <section className="du-col du-col-left">
        <h2 className={`du-col-title left-title ${leftTitleClassName}`.trim()} style={{ color: leftTitleColor }}>
          {leftTitle}
        </h2>
        <div className="du-col-body left-body">{leftContent}</div>
      </section>

      <section className="du-col du-col-right" style={{ backgroundColor: rightBackground }}>
        <h2 className={`du-col-title right-title ${rightTitleClassName}`.trim()} style={{ color: rightTitleColor }}>
          {rightTitle}
        </h2>
        <div className="du-col-body right-body">{rightContent}</div>
      </section>
    </div>
  );
};

export default DuTextColFond;
