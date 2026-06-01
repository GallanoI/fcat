import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './carousel.css';
import { useZoomPause } from '../config/zoomPauseContext';
import { orderCarouselItems } from '../config/carouselMediaUtils';

export const createNamedCarouselProps = (captionPosition = 'top') => ({
  variant: 'named',
  showText: true,
  captionPosition,
});

export const createGalleryCarouselProps = () => ({
  variant: 'gallery',
  showText: false,
});

const Carousel = ({
  items,
  type,
  onImageClick,
  visibleItems = 3,
  autoPlayInterval = 5000,
  showText = true,
  variant,
  captionPosition = 'top',
  backgroundColor,
  className = '',
  onIndexChange,
  isPaused = false,
}) => {
  // const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  // const [velocity, setVelocity] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const prevTotalItemsRef = useRef(-1);
  const prevCloneCountRef = useRef(-1);
  const { isZoomActive } = useZoomPause();

  const normalizedItems = useMemo(() => orderCarouselItems(items), [items]);
  const totalItems = normalizedItems.length;

  const mode = variant || (showText && type === 'residentes' ? 'named' : 'gallery');
  const isNamedMode = mode === 'named';
/////////////////////////////
  const cloneCount = useMemo(() => {
    if (totalItems <= 0) return 0;
    return Math.min(visibleItems, totalItems);
  }, [visibleItems, totalItems]);

  const extendedItems = useMemo(() => {
    if (totalItems <= 0) return [];
    const head = normalizedItems.slice(0, cloneCount).map((item, i) => ({
      ...item,
      __realIndex: i,
      __clone: 'head',
    }));
    const body = normalizedItems.map((item, i) => ({
      ...item,
      __realIndex: i,
      __clone: 'body',
    }));
    const tail = normalizedItems.slice(totalItems - cloneCount).map((item, i) => ({
      ...item,
      __realIndex: totalItems - cloneCount + i,
      __clone: 'tail',
    }));
    return [...tail, ...body, ...head];
  }, [normalizedItems, totalItems, cloneCount]);

  // Infinite scroll: displayIndex siempre está entre 0 y totalItems-1
  // const displayIndex = totalItems > 0 ? ((index % totalItems) + totalItems) % totalItems : 0;
  // Desplazamiento base sin considerar drag
  // const baseOffsetPercent = (displayIndex * 100) / visibleItems;
  // Offset total incluyendo el drag actual
  // const totalOffsetPercent = baseOffsetPercent + dragOffset;

  const displayIndex = totalItems > 0 ? ((trackIndex - cloneCount) % totalItems + totalItems) % totalItems : 0;
  const baseOffsetPercent = totalItems > 0 ? (trackIndex * 100) / visibleItems : 0;
  const totalOffsetPercent = baseOffsetPercent + dragOffset;

  useEffect(() => {
    const prevTotalItems = prevTotalItemsRef.current;
    const prevCloneCount = prevCloneCountRef.current;

    prevTotalItemsRef.current = totalItems;
    prevCloneCountRef.current = cloneCount;

    if (totalItems <= 0) {
      setTrackIndex(0);
      return;
    }

    if (prevTotalItems !== totalItems) {
      // Los ítems cambiaron — reset al inicio
      setEnableTransition(false);
      setTrackIndex(cloneCount);
    } else if (prevCloneCount !== cloneCount && prevCloneCount >= 0) {
      // Solo cambió visibleItems — mantener el displayIndex actual
      setEnableTransition(false);
      setTrackIndex((currentTrack) => {
        const oldDisplayIndex =
          ((currentTrack - prevCloneCount) % totalItems + totalItems) % totalItems;
        return cloneCount + oldDisplayIndex;
      });
    }
  }, [totalItems, cloneCount]);

  useEffect(() => {
    if (!enableTransition) {
      const id = requestAnimationFrame(() => setEnableTransition(true));
      return () => cancelAnimationFrame(id);
    }
  }, [enableTransition]);



  const handleNext = useCallback(() => {
    if (totalItems <= 1) return;
    setTrackIndex((prev) => prev + 1);
    setDragOffset(0);
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    if (totalItems <= 1) return;
    setTrackIndex((prev) => prev - 1);
    setDragOffset(0);
  }, [totalItems]);

  const clearAutoPlayTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  const scheduleAutoAdvance = useCallback(
    (delay = autoPlayInterval) => {
      clearAutoPlayTimer();

      if (isZoomActive || isPaused || totalItems <= 1) {
        return;
      }

      autoPlayTimerRef.current = setTimeout(() => {
        handleNext();
      }, delay);
    },
    [autoPlayInterval, clearAutoPlayTimer, handleNext, isPaused, isZoomActive, totalItems]
  );

  const activeItem = totalItems > 0 ? normalizedItems[displayIndex] : null;
  const activeItemIsVideo = activeItem?.type === 'video';

  useEffect(() => {
    clearAutoPlayTimer();

    if (totalItems <= 1 || isZoomActive || isPaused) {
      return undefined;
    }

    if (!activeItemIsVideo) {
      scheduleAutoAdvance(autoPlayInterval);
    }

    return () => {
      clearAutoPlayTimer();
    };
  }, [
    activeItemIsVideo,
    autoPlayInterval,
    clearAutoPlayTimer,
    displayIndex,
    isPaused,
    isZoomActive,
    scheduleAutoAdvance,
    totalItems,
  ]);

  const handleMouseDown = (e) => {
    if (!viewportRef.current || totalItems <= 1) return;
    setIsDragging(true);
    setDragStart(e.clientX);
    clearAutoPlayTimer();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !viewportRef.current) return;
    const delta = e.clientX - dragStart;
    const viewportWidth = viewportRef.current.offsetWidth || 1;
    const percentDelta = (delta / viewportWidth) * 100;
    setDragOffset(percentDelta);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const itemWidth = 100 / visibleItems;
    const normalizedOffset = dragOffset / itemWidth;
    let newTrackIndex = trackIndex;

    if (Math.abs(normalizedOffset) > 0.3) {
      newTrackIndex =
        normalizedOffset > 0
          ? trackIndex - Math.ceil(normalizedOffset)
          : trackIndex + Math.ceil(Math.abs(normalizedOffset));
    }

    setTrackIndex(newTrackIndex);
    setDragOffset(0);

    if (newTrackIndex === trackIndex && !activeItemIsVideo) {
      scheduleAutoAdvance(autoPlayInterval);
    }
  };

  // Touch swipe (additive to mouse drag; same logic)
  const touchStartXRef = useRef(null);

  const handleTouchStart = (e) => {
    if (totalItems <= 1) return;
    touchStartXRef.current = e.touches[0].clientX;
    clearAutoPlayTimer();
  };

  const handleTouchMove = (e) => {
    if (touchStartXRef.current === null || !viewportRef.current) return;
    const delta = e.touches[0].clientX - touchStartXRef.current;
    const vw = viewportRef.current.offsetWidth || 1;
    setDragOffset((delta / vw) * 100);
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;

    const itemWidth = 100 / visibleItems;
    const normalizedOffset = (dragOffset || (delta / (viewportRef.current?.offsetWidth || 1)) * 100) / itemWidth;
    let newTrackIndex = trackIndex;

    if (Math.abs(normalizedOffset) > 0.3) {
      newTrackIndex =
        normalizedOffset > 0
          ? trackIndex - Math.ceil(normalizedOffset)
          : trackIndex + Math.ceil(Math.abs(normalizedOffset));
    }

    setTrackIndex(newTrackIndex);
    setDragOffset(0);

    if (newTrackIndex === trackIndex && !activeItemIsVideo) {
      scheduleAutoAdvance(autoPlayInterval);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  // Trackpad: scroll horizontal con dos dedos
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || totalItems <= 1) return;
    let cooldown = false;
    const handleWheelEvent = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (cooldown) return;
      cooldown = true;
      setTimeout(() => { cooldown = false; }, 420);
      if (e.deltaX > 0) handleNext();
      else handlePrev();
    };
    viewport.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheelEvent);
  }, [totalItems, handleNext, handlePrev]);

  const goTo = (realIndex) => {
    if (totalItems <= 0) return;
    setTrackIndex(cloneCount + realIndex);
    setDragOffset(0);
  };

  const handleTrackTransitionEnd = () => {
    if (totalItems <= 0 || isDragging) return;
    const normalizedLogical = ((trackIndex - cloneCount) % totalItems + totalItems) % totalItems;
    const safeTrackIndex = cloneCount + normalizedLogical;

    if (safeTrackIndex !== trackIndex) {
      setEnableTransition(false);
      setTrackIndex(safeTrackIndex);
    }
  };

  useEffect(() => {
    if (onIndexChange) onIndexChange(displayIndex);
  }, [displayIndex, onIndexChange]);

  return (
    <div className={`carousel-wrapper ${className}`.trim()}>
      <div className="carousel-main" style={backgroundColor ? { backgroundColor } : undefined}>
        {/* Flecha Izquierda: Siempre visible */}
        <button 
          className="arrow-char arrow-left" 
          onClick={handlePrev}
          title="Anterior"
        >
          &lt;
        </button>
        
        <div
          ref={viewportRef}
          style={{ width: '100%', overflow: 'hidden' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={trackRef}
            className="carousel-track"
            onTransitionEnd={handleTrackTransitionEnd}
            style={{
              transform: `translateX(-${totalOffsetPercent}%)`,
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: enableTransition ? 'transform 0.5s ease-in-out' : 'none',
            }}
          >
            {extendedItems.map((item, i) => (
              <div
                key={`${item.__clone}-${item.__realIndex}-${i}`}
                className="carousel-item"
                style={{ width: `${100 / visibleItems}%` }}
                onClick={() => {
                  goTo(item.__realIndex);
                  onImageClick?.(item, item.__realIndex);
                }}
              >
                {isNamedMode && captionPosition === 'top' && (
                  <div className="tab-container top-tab">
                    <div className="tab-box">
                      <p className="carousel-text">{item.name}</p>
                    </div>
                  </div>
                )}

                <div className="img-grid-container">
                  {item.type === 'video' ? (
                    <video
                      key={`${item.src}-${item.__realIndex === displayIndex ? 'active' : 'idle'}`}
                      src={item.src}
                      className="carousel-img"
                      muted
                      playsInline
                      autoPlay={item.__realIndex === displayIndex}
                      loop={false}
                      preload="metadata"
                      onLoadedMetadata={(event) => {
                        if (item.__realIndex !== displayIndex) {
                          event.currentTarget.pause();
                          event.currentTarget.currentTime = 0;
                          return;
                        }

                        const playPromise = event.currentTarget.play();
                        if (playPromise?.catch) {
                          playPromise.catch(() => {
                            scheduleAutoAdvance(autoPlayInterval);
                          });
                        }
                      }}
                      onEnded={() => {
                        if (item.__realIndex === displayIndex) {
                          scheduleAutoAdvance(autoPlayInterval);
                        }
                      }}
                    />
                  ) : (
                    <img src={item.src} alt={item.name} className="carousel-img" />
                  )}
                </div>

                {isNamedMode && captionPosition === 'bottom' && (
                  <div className="tab-container bottom-tab">
                    <div className="tab-box">
                      <p className="carousel-text">{item.name}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Flecha Derecha: Siempre visible */}
        <button 
          className="arrow-char arrow-right" 
          onClick={handleNext}
          title="Siguiente"
        >
          &gt;
        </button>
      </div>

      {totalItems > 0 && (
        <div className="dots-container">
          {Array.from({ length: totalItems }).map((_, i) => (
            <div 
              key={i} 
              className={`dot ${displayIndex === i ? 'active' : ''}`} 
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;