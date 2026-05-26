import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './circleItemMenu.css';

const renderCircleText = (content) => {
  if (
    content &&
    typeof content === 'object' &&
    !Array.isArray(content) &&
    Object.prototype.hasOwnProperty.call(content, 'line1') &&
    Object.prototype.hasOwnProperty.call(content, 'line2')
  ) {
    return (
      <span className="circle-hover-text">
        <span>{content.line1}</span>
        <span>{content.line2}</span>
      </span>
    );
  }

  return content;
};

const CircleItemMenu = ({
  title,
  color,
  to,
  isSubcategory = false,
  canShowVolver = false,
  className,
  style = {},
  onMouseEnter,
  onMouseLeave,
  onClick,
  hoverTitle,
  hoverScale = 1.2,
  textColor,
  hoverTextColor,
  hoverFontSize,
  hoverStyle = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClass = isSubcategory
    ? 'circle-common subcategory-circle'
    : 'circle-common pilar-main';

  const displayedContent = isHovered
    ? (hoverTitle || (canShowVolver ? 'Volver al Inicio' : title))
    : title;

  const content = (
    <motion.div
      whileHover={{ scale: hoverScale }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (onMouseEnter) onMouseEnter();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (onMouseLeave) onMouseLeave();
      }}
      onClick={onClick}
      className={`${baseClass} ${className}`}
      style={{
        backgroundColor: color,
        opacity: isHovered ? 1 : 0.85,
        color: isHovered && hoverTextColor ? hoverTextColor : textColor,
        ...style,
        ...(isHovered && hoverFontSize ? { fontSize: hoverFontSize } : {}),
        ...(isHovered ? hoverStyle : {}),
      }}
    >
      {renderCircleText(displayedContent)}
    </motion.div>
  );

  if (to) {
    return <Link to={to} className="circle-item-link">{content}</Link>;
  }

  return content;
};

export default CircleItemMenu;
