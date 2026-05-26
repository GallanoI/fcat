const VIDEO_PATTERN = /\.(mp4|webm|ogg|mov|m4v)$/i;

export const getMediaTypeFromPath = (filePath = '') =>
  VIDEO_PATTERN.test(String(filePath || '')) ? 'video' : 'image';

export const extractMediaSequenceNumber = (value = '') => {
  const normalizedValue = String(value || '').replace(/\\/g, '/');
  const parenthesizedMatch = normalizedValue.match(/\((\d+)\)(?=\.[^.]+$)/);

  if (parenthesizedMatch) {
    return Number.parseInt(parenthesizedMatch[1], 10);
  }

  const trailingDigitsMatch = normalizedValue.match(/(\d+)(?=\.[^.]+$)/);
  if (trailingDigitsMatch) {
    return Number.parseInt(trailingDigitsMatch[1], 10);
  }

  return null;
};

export const orderCarouselItems = (items = []) => {
  const safeItems = Array.isArray(items) ? items : [];

  return safeItems
    .map((item, originalIndex) => {
      const derivedSequence = Number.isFinite(item?.mediaIndex)
        ? item.mediaIndex
        : extractMediaSequenceNumber(
            item?.sourceKey || item?.originalName || item?.name || item?.src || ''
          );

      return {
        item: {
          ...item,
          mediaIndex: Number.isFinite(derivedSequence)
            ? derivedSequence
            : item?.mediaIndex ?? null,
        },
        originalIndex,
        sortSequence: Number.isFinite(derivedSequence)
          ? derivedSequence
          : Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((a, b) => a.sortSequence - b.sortSequence || a.originalIndex - b.originalIndex)
    .map(({ item }) => item);
};

export const buildOrderedCarouselItems = (context, mapItem = () => ({})) => {
  if (!context || typeof context.keys !== 'function') {
    return [];
  }

  const items = context.keys().map((key, originalIndex) => {
    const src = context(key);
    const mediaIndex = extractMediaSequenceNumber(key);

    return {
      src,
      type: getMediaTypeFromPath(key),
      sourceKey: key,
      originalName: key.replace('./', ''),
      mediaIndex,
      ...mapItem({ key, src, mediaIndex, originalIndex }),
    };
  });

  return orderCarouselItems(items);
};

export const buildStaticCarouselItems = (paths, mapItem = () => ({})) => {
  if (!Array.isArray(paths) || paths.length === 0) {
    return [];
  }

  const items = paths.map((src, originalIndex) => {
    const mediaIndex = extractMediaSequenceNumber(src);

    return {
      src,
      type: getMediaTypeFromPath(src),
      sourceKey: src,
      originalName: src.split('/').pop(),
      mediaIndex,
      ...mapItem({ key: src, src, mediaIndex, originalIndex }),
    };
  });

  return orderCarouselItems(items);
};

/**
 * Construye items de carrusel a partir de datos devueltos por la API (array de CarouselItem).
 * Respeta el order_index del servidor sin re-ordenar por número de archivo.
 * @param {Array} dbItems - Filas de CarouselItem del servidor
 * @param {Function} mapItem - Función opcional para transformar cada item
 */
export const buildCarouselItemsFromApi = (dbItems, mapItem = () => ({})) => {
  if (!Array.isArray(dbItems) || dbItems.length === 0) return [];
  const publicUrl = process.env.PUBLIC_URL || '';
  return dbItems.map((dbItem, idx) => {
    const src = publicUrl + dbItem.file_path;
    return {
      src,
      type: getMediaTypeFromPath(dbItem.file_path),
      sourceKey: dbItem.file_path,
      originalName: dbItem.file_path.split('/').pop(),
      mediaIndex: idx,
      dbId: dbItem.id,
      ...mapItem(dbItem, idx),
    };
  });
};
