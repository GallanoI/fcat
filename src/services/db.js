// Servicio de base de datos.
// Accede al backend Express (server.js) via fetch.

const API_URL = process.env.REACT_APP_API_URL || '';

/** @returns {Promise<Array>} Lista de todos los talleres */
export const getTalleres = () =>
  fetch(`${API_URL}/api/talleres`).then((r) => r.json());

/** @returns {Promise<Array>} Niños inscritos en un taller */
export const getNinosByTaller = (tallerId) =>
  fetch(`${API_URL}/api/ninos/${tallerId}`).then((r) => r.json());

/** @returns {Promise<Array<{taller_id: number, conteo: number}>>} Conteo de inscripciones por taller */
export const getConteoByTaller = () =>
  fetch(`${API_URL}/api/conteo`).then((r) => r.json());

/** @returns {Promise<Array<{taller_id, fecha1, fecha2, count_dia1, count_dia2}>>} Conteo por día por taller */
export const getConteoPorDia = () =>
  fetch(`${API_URL}/api/conteo-por-dia`).then((r) => r.json());

/**
 * Guarda una inscripción completa en la BD.
 * @param {{ apoderado: object, ninos: Array }} data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const createInscripcion = (data) =>
  fetch(`${API_URL}/api/inscripcion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => r.json());

// ─── Carrusel (público) ─────────────────────────────────────────────────────

/** @returns {Promise<Array>} Items de un carrusel por nombre */
export const getCarouselItems = (nombre) =>
  fetch(`${API_URL}/api/carousel-items/${encodeURIComponent(nombre)}`).then((r) => r.json());

// ─── Admin API ──────────────────────────────────────────────────────────────

/** @returns {Promise<{success: boolean, token?: string}>} */
export const adminLogin = (username, password) =>
  fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then((r) => r.json());

/** @returns {Promise<{success: boolean}>} */
export const adminLogout = (token) =>
  fetch(`${API_URL}/api/admin/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

/** @returns {Promise<Array>} */
export const getAdminCarousels = (token) =>
  fetch(`${API_URL}/api/admin/carousels`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

/** @returns {Promise<Array>} */
export const getAdminCarouselItems = (token, carouselId) =>
  fetch(`${API_URL}/api/admin/carousel/${carouselId}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

/** @returns {Promise<{talleres, inscripciones}>} */
export const getAdminDbInfo = (token) =>
  fetch(`${API_URL}/api/admin/db-info`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

/** @returns {Promise<{success: boolean, items: Array}>} */
export const uploadCarouselFiles = (token, carouselId, files) => {
  const formData = new FormData();
  for (const file of files) formData.append('files', file);
  return fetch(`${API_URL}/api/admin/carousel/${carouselId}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then((r) => r.json());
};

/** @returns {Promise<{success: boolean}>} */
export const deleteCarouselItem = (token, itemId) =>
  fetch(`${API_URL}/api/admin/carousel-item/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

/** @returns {Promise<{success: boolean}>} */
export const reorderCarouselItems = (token, carouselId, orderedIds) =>
  fetch(`${API_URL}/api/admin/carousel/${carouselId}/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ orderedIds }),
  }).then((r) => r.json());

/** @returns {Promise<{success: boolean}>} */
export const updateCarouselItemMetadata = (token, itemId, metadata) =>
  fetch(`${API_URL}/api/admin/carousel-item/${itemId}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(metadata),
  }).then((r) => r.json());

