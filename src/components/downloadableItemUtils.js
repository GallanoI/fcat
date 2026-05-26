const MANUAL_DOWNLOAD_FILES = {
  Festivales: [
    {
      fileName: 'Presentación Proyecto FESTIVAL UN VIAJE POR LAS ARTES ÑUÑOA.pptx',
      asset: () => process.env.PUBLIC_URL + '/assets/archivosDescargables/Festivales/Presentación Proyecto FESTIVAL UN VIAJE POR LAS ARTES ÑUÑOA.pptx',
    },
  ],
  'Grandes Maestras': [
    {
      fileName: '1era temporada Cazú y Cecilia.png',
      asset: () => process.env.PUBLIC_URL + '/assets/archivosDescargables/Grandes Maestras/1era temporada Cazú y Cecilia.png',
    },
    {
      fileName: 'DOC 1 Grandes_Maestras_Capitulo_Chile_VERSIÓN GENERAL.docx',
      asset: () => process.env.PUBLIC_URL + '/assets/archivosDescargables/Grandes Maestras/DOC 1 Grandes_Maestras_Capitulo_Chile_VERSIÓN GENERAL.docx',
    },
    {
      fileName: 'TRÁILER CONCEPTUAL Grandes Maestras – Capítulo Chile (1).pdf',
      asset: () => process.env.PUBLIC_URL + '/assets/archivosDescargables/Grandes Maestras/TRÁILER CONCEPTUAL Grandes Maestras – Capítulo Chile (1).pdf',
    },
  ],
};

const resolveAssetUrl = (assetValue) => {
  if (typeof assetValue === 'string') {
    return assetValue;
  }

  if (assetValue && typeof assetValue === 'object' && typeof assetValue.default === 'string') {
    return assetValue.default;
  }

  return '';
};

const getFolderFiles = (folderName = '') => {
  const manualFiles = MANUAL_DOWNLOAD_FILES[String(folderName || '').trim()] || [];

  return manualFiles
    .map((entry) => {
      try {
        const url = resolveAssetUrl(entry.asset?.());

        if (!url) {
          return null;
        }

        return {
          folderName,
          fileName: entry.fileName,
          url,
        };
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean);
};

const triggerDownload = ({ url, fileName }) => {
  if (!url || !fileName || typeof document === 'undefined') {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 0) {
        const blob = xhr.response;
        const blobUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = fileName;
        anchor.rel = 'noopener noreferrer';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1200);
        resolve(true);
      } else {
        resolve(false);
      }
    };
    xhr.onerror = () => resolve(false);
    xhr.send();
  });
};

const downloadFilesSequentially = (files = []) => {
  files.forEach((file, index) => {
    window.setTimeout(() => {
      void triggerDownload(file);
    }, index * 220);
  });
};

export const createDownloadHoverTitle = (itemLabel = '') => ({
  line1: 'Descargar',
  line2: String(itemLabel || '').trim(),
});

export const downloadFolderContents = (folderName = '') => {
  const files = getFolderFiles(folderName);

  if (!files.length) {
    return false;
  }

  if (files.length === 1) {
    void triggerDownload(files[0]);
    return true;
  }

  downloadFilesSequentially(files);
  return true;
};
