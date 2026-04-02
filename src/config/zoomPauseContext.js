import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ZoomPauseContext = createContext({
  isZoomActive: false,
  registerZoomOpen: () => {},
  registerZoomClose: () => {},
});

export const ZoomPauseProvider = ({ children }) => {
  const [activeZoomCount, setActiveZoomCount] = useState(0);

  const registerZoomOpen = useCallback(() => {
    setActiveZoomCount((prev) => prev + 1);
  }, []);

  const registerZoomClose = useCallback(() => {
    setActiveZoomCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value = useMemo(
    () => ({
      isZoomActive: activeZoomCount > 0,
      registerZoomOpen,
      registerZoomClose,
    }),
    [activeZoomCount, registerZoomOpen, registerZoomClose]
  );

  return <ZoomPauseContext.Provider value={value}>{children}</ZoomPauseContext.Provider>;
};

export const useZoomPause = () => useContext(ZoomPauseContext);
