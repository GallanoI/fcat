import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  adminLogin,
  adminLogout,
  getAdminCarousels,
  getAdminCarouselItems,
  getAdminDbInfo,
  getAdminApoderados,
  uploadCarouselFiles,
  deleteCarouselItem,
  reorderCarouselItems,
  deleteInscripcionDia,
  deleteApoderado,
} from '../services/db';
import './admin.css';

const BG = process.env.PUBLIC_URL + '/assets/fotos/fondos/imagen-fondo-home.JPEG';

const PILLAR_SECTIONS = [
  {
    label: 'Creación',
    color: 'rgba(255,255,0,0.58)',
    border: '#a46e1b',
    carousels: ['ciro', 'cristal', 'kenji', 'dafna', 'fernando', 'residentes'],
    labels:    ['Ciro',  'Cristal', 'Kenji', 'Dafna', 'Fernando', 'Residentes'],
  },
  {
    label: 'Investigación',
    color: 'rgba(173,173,173,0.4)',
    border: '#212121',
    carousels: ['materiales'],
    labels:    ['Materiales'],
  },
  {
    label: 'Difusión',
    color: 'rgba(0,176,240,0.5)',
    border: '#212121',
    carousels: ['expExiPreciones'],
    labels:    ['Expo / Exibi / Presenta'],
  },
  {
    label: 'Educación',
    color: 'rgba(240,0,154,0.5)',
    border: 'magenta',
    carousels: ['escuelaCine', 'escuelaNinos'],
    labels:    ['Escuela de Cine', 'Escuela de Niños'],
  },
];

// ─── Sortable thumbnail item ─────────────────────────────────────────────────
function SortableThumb({ item, isSelected, mode, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled: mode !== 'reorder' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: mode === 'reorder' ? 'grab' : mode === 'delete' ? 'pointer' : 'default',
  };

  const isVideo = /\.(mp4|webm|ogg|mov|m4v)$/i.test(item.file_path);
  const src = process.env.PUBLIC_URL + item.file_path;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(mode === 'reorder' ? { ...attributes, ...listeners } : {})}
      className={`adm-thumb${isSelected ? ' adm-thumb--selected' : ''}`}
      onClick={mode === 'delete' ? () => onToggle(item.id) : undefined}
    >
      {isVideo ? (
        <video src={src} className="adm-thumb-media" muted playsInline preload="metadata" />
      ) : (
        <img src={src} alt="" className="adm-thumb-media" />
      )}
      {mode === 'delete' && (
        <div className={`adm-thumb-check${isSelected ? ' adm-thumb-check--on' : ''}`}>
          {isSelected ? '✓' : ''}
        </div>
      )}
    </div>
  );
}

// ─── Panel de Información de Base de Datos ───────────────────────────────────
function DBInfoPanel({ token }) {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [showApoderados, setShowApoderados] = useState(false);
  const [apoderados, setApoderados] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    getAdminDbInfo(token).then((d) => {
      setData(d);
      if (d.talleres?.length > 0) setActiveTab(d.talleres[0].id);
    });
  }, [token]);

  const handleSortClick = (col) => {
    if (sortCol === col) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortCol(null); setSortDir('asc'); }
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const getSortIcon = (col) => {
    if (sortCol !== col) return '↕';
    return sortDir === 'asc' ? '↑' : '↓';
  };

  const sortRows = (rows) => {
    if (!sortCol) return rows;
    return [...rows].sort((a, b) => {
      const va = a[sortCol];
      const vb = b[sortCol];
      if (sortCol === 'edad') {
        const na = Number(va), nb = Number(vb);
        return sortDir === 'asc' ? na - nb : nb - na;
      }
      const sa = String(va ?? '').toLowerCase();
      const sb = String(vb ?? '').toLowerCase();
      if (sa < sb) return sortDir === 'asc' ? -1 : 1;
      if (sa > sb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const formatFecha = (f) => {
    const d = new Date(String(f).trim().replace(' ', 'T'));
    if (isNaN(d)) return f;
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const handleShowApoderados = () => {
    setShowApoderados(true);
    if (!apoderados) {
      getAdminApoderados(token).then((d) => setApoderados(d.apoderados || []));
    }
  };

  const handleExportCSV = () => {
    if (!apoderados) return;
    const headers = ['Nombre completo', 'RUT', 'Teléfono', 'Correo electrónico', 'Dirección', 'Cantidad de niños', 'Nombre Niño/a', 'RUT Niño/a'];
    const rows = apoderados.map((a) => [
      a.nombre, a.rut, a.telefono, a.correo, a.direccion,
      a.cantidad_ninos, a.ninos_nombres, a.ninos_ruts,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'apoderados.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteDia = (insc, fecha) => {
    if (!data) return;
    const diasList = insc.dias_asistencia.split(',').map((d) => d.trim());
    const remaining = diasList.filter((d) => d !== fecha.trim());
    const otherInsc = data.inscripciones.filter(
      (i) => i.nino_id === insc.nino_id && i.inscripcion_id !== insc.inscripcion_id
    );
    const willDeleteNino = remaining.length === 0 && otherInsc.length === 0;
    setConfirmModal({
      type: 'dia',
      inscripcionId: insc.inscripcion_id,
      fecha: fecha.trim(),
      fechaLabel: formatFecha(fecha.trim()),
      ninoNombre: insc.nino_nombre,
      tallerNombre: insc.nombre_taller,
      willDeleteNino,
    });
  };

  const handleDeleteApoderado = (apo) => {
    if (!data) return;
    const apoInsc = data.inscripciones.filter((i) => i.apoderado_id === apo.id);
    const ninoMap = new Map();
    for (const i of apoInsc) {
      if (!ninoMap.has(i.nino_id)) {
        ninoMap.set(i.nino_id, { nombre: i.nino_nombre, inscripciones: [] });
      }
      ninoMap.get(i.nino_id).inscripciones.push({
        taller: i.nombre_taller,
        dias: i.dias_asistencia.split(',').map((d) => d.trim()),
      });
    }
    const inscribedNames = new Set([...ninoMap.values()].map((n) => n.nombre));
    const allNames = apo.ninos_nombres ? apo.ninos_nombres.split(';').map((n) => n.trim()).filter(Boolean) : [];
    for (const name of allNames) {
      if (!inscribedNames.has(name)) {
        ninoMap.set(`orphan-${name}`, { nombre: name, inscripciones: [] });
      }
    }
    setConfirmModal({
      type: 'apoderado',
      apoderadoId: apo.id,
      apoderadoNombre: apo.nombre,
      apoderadoRut: apo.rut,
      ninos: Array.from(ninoMap.values()),
    });
  };

  const handleConfirmExecute = async () => {
    if (!confirmModal) return;
    try {
      if (confirmModal.type === 'dia') {
        await deleteInscripcionDia(token, confirmModal.inscripcionId, confirmModal.fecha);
      } else if (confirmModal.type === 'apoderado') {
        await deleteApoderado(token, confirmModal.apoderadoId);
      }
    } catch (e) {
      console.error('Error al eliminar:', e);
    }
    setConfirmModal(null);
    getAdminDbInfo(token).then((d) => setData(d));
    if (apoderados !== null) {
      getAdminApoderados(token).then((d) => setApoderados(d.apoderados || []));
    }
  };

  if (!data) return <div className="adm-loading">Cargando...</div>;

  const { talleres, inscripciones } = data;

  return (
    <div className="adm-dbinfo">
      <h2 className="adm-section-title">Información de Base de Datos</h2>

      {/* ── Tabs ── */}
      <div className="adm-db-tabs-row">
        <div className="adm-db-tabs">
          {talleres.map((t) => (
            <button
              key={t.id}
              className={`adm-db-tab${!showApoderados && activeTab === t.id ? ' active' : ''}`}
              onClick={() => { setActiveTab(t.id); setShowApoderados(false); }}
            >
              {t.nombre_taller}
            </button>
          ))}
        </div>
        <button
          className={`adm-db-tab adm-db-tab-apoderado${showApoderados ? ' active' : ''}`}
          onClick={handleShowApoderados}
        >
          Apoderado
        </button>
      </div>

      {/* ── Inscripciones por taller ── */}
      {!showApoderados && talleres.map((t) =>
        activeTab !== t.id ? null : (
          <div key={t.id} className="adm-db-panel">
            <p className="adm-db-tallerista">Tallerista: {t.nombre_tallerista}</p>
            <div className="adm-db-table-wrap">
              <table className="adm-db-table">
                <thead>
                  <tr>
                    <th>#</th>
                    {[
                      { col: 'nino_nombre',      label: 'Nombre niño/a' },
                      { col: 'edad',             label: 'Edad' },
                      { col: 'dias_asistencia',  label: 'Días' },
                      { col: 'apoderado_nombre', label: 'Apoderado' },
                      { col: 'telefono',         label: 'Teléfono' },
                      { col: 'correo',           label: 'Correo' },
                    ].map(({ col, label }) => (
                      <th
                        key={col}
                        className="adm-sortable-th"
                        onClick={() => handleSortClick(col)}
                      >
                        {label} <span className="adm-sort-icon">{getSortIcon(col)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortRows(inscripciones.filter((i) => i.nombre_taller === t.nombre_taller))
                    .map((i, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{i.nino_nombre}</td>
                        <td>{i.edad}</td>
                        <td className="adm-db-dias">
                          {i.dias_asistencia.split(',').map((f) => f.trim()).filter(Boolean).map((f) => (
                            <span key={f} className="adm-dia-tag">
                              {formatFecha(f)}
                              <button
                                className="adm-dia-x"
                                title="Eliminar este día"
                                onClick={() => handleDeleteDia(i, f)}
                              >×</button>
                            </span>
                          ))}
                        </td>
                        <td>{i.apoderado_nombre}</td>
                        <td>{i.telefono}</td>
                        <td>{i.correo}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* ── Apoderados ── */}
      {showApoderados && (
        <div className="adm-db-panel">
          {!apoderados ? (
            <div className="adm-loading">Cargando apoderados...</div>
          ) : (
            <>
              <div className="adm-db-table-wrap">
                <table className="adm-db-table">
                  <thead>
                    <tr>
                      <th>Nombre completo</th>
                      <th>RUT</th>
                      <th>Teléfono</th>
                      <th>Correo electrónico</th>
                      <th>Dirección</th>
                      <th>Cant. niños</th>
                      <th>Nombre Niño/a</th>
                      <th>RUT Niño/a</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {apoderados.map((a, idx) => {
                      const isOrphan = a.cantidad_ninos === 0;
                      return (
                        <tr key={idx} className={isOrphan ? 'adm-row-orphan' : ''}>
                          <td>{a.nombre}</td>
                          <td>{a.rut}</td>
                          <td>{a.telefono}</td>
                          <td>{a.correo}</td>
                          <td>{a.direccion}</td>
                          <td>
                            {isOrphan
                              ? <span className="adm-orphan-badge">⚠ 0</span>
                              : a.cantidad_ninos}
                          </td>
                          <td>{a.ninos_nombres}</td>
                          <td>{a.ninos_ruts}</td>
                          <td>
                            <button
                              className="adm-del-apo-btn"
                              title="Eliminar apoderado"
                              onClick={() => handleDeleteApoderado(a)}
                            >🗑</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button className="adm-csv-btn" onClick={handleExportCSV}>
                Exportar CSV
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Modal de confirmación ── */}
      {confirmModal && (
        <div className="adm-confirm-overlay" onClick={() => setConfirmModal(null)}>
          <div className="adm-confirm-modal" onClick={(e) => e.stopPropagation()}>
            {confirmModal.type === 'dia' && (
              <>
                <p className="adm-confirm-title">¿Eliminar inscripción?</p>
                <p className="adm-confirm-body">
                  Día <strong>{confirmModal.fechaLabel}</strong> de{' '}
                  <strong>{confirmModal.ninoNombre}</strong> en{' '}
                  <strong>{confirmModal.tallerNombre}</strong>.
                </p>
                {confirmModal.willDeleteNino && (
                  <p className="adm-confirm-warning">
                    ⚠ Este niño quedará sin inscripciones y su registro será eliminado del sistema.
                  </p>
                )}
              </>
            )}
            {confirmModal.type === 'apoderado' && (
              <>
                <p className="adm-confirm-title">¿Eliminar apoderado?</p>
                <p className="adm-confirm-body">
                  <strong>{confirmModal.apoderadoNombre}</strong> — RUT: {confirmModal.apoderadoRut}
                </p>
                <p className="adm-confirm-warning">
                  ⚠ Se eliminarán también todos sus niños e inscripciones:
                </p>
                <ul className="adm-confirm-list">
                  {confirmModal.ninos.map((n, i) => (
                    <li key={i}>
                      <strong>{n.nombre}</strong>
                      {n.inscripciones.length > 0
                        ? ': ' + n.inscripciones.map(
                            (ins) => `${ins.taller} (${ins.dias.map(formatFecha).join(', ')})`
                          ).join(' · ')
                        : ' — sin inscripciones'}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="adm-confirm-btns">
              <button className="adm-confirm-btn adm-confirm-cancel" onClick={() => setConfirmModal(null)}>
                Cancelar
              </button>
              <button className="adm-confirm-btn adm-confirm-ok" onClick={handleConfirmExecute}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Panel de Gestión de Carrusel ────────────────────────────────────────────
function CarouselManagerPanel({ token }) {
  const [carousels, setCarousels] = useState([]);
  const [selectedCarousel, setSelectedCarousel] = useState(null);
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState(null); // 'add' | 'delete' | 'reorder'
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pendingFiles, setPendingFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const fileInputRef = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const loadCarousels = useCallback(async () => {
    const data = await getAdminCarousels(token);
    setCarousels(data);
  }, [token]);

  const loadItems = useCallback(async (carouselId) => {
    const data = await getAdminCarouselItems(token, carouselId);
    setItems(data);
  }, [token]);

  useEffect(() => { loadCarousels(); }, [loadCarousels]);

  const handleSelectCarousel = async (carousel) => {
    setSelectedCarousel(carousel);
    setMode(null);
    setSelectedIds(new Set());
    setPendingFiles([]);
    setMsg('');
    await loadItems(carousel.id);
  };

  const handleModeToggle = (newMode) => {
    setMode(prev => prev === newMode ? null : newMode);
    setSelectedIds(new Set());
    setPendingFiles([]);
    setMsg('');
  };

  const handleToggleItem = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex(i => i.id === active.id);
    const newIdx = items.findIndex(i => i.id === over.id);
    setItems(prev => arrayMove(prev, oldIdx, newIdx));
  };

  const handleFileChange = (e) => {
    setPendingFiles(Array.from(e.target.files));
    setMsg('');
  };

  const handleApply = async () => {
    if (!selectedCarousel || busy) return;
    setBusy(true);
    setMsg('');

    try {
      if (mode === 'add') {
        if (pendingFiles.length === 0) { setMsg('Selecciona archivos primero.'); setBusy(false); return; }
        const result = await uploadCarouselFiles(token, selectedCarousel.id, pendingFiles);
        if (result.success) {
          await loadItems(selectedCarousel.id);
          await loadCarousels();
          setPendingFiles([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setMsg(`✓ ${result.items.length} archivo(s) agregado(s).`);
        } else {
          setMsg('Error al subir archivos.');
        }
      } else if (mode === 'delete') {
        if (selectedIds.size === 0) { setMsg('Selecciona elementos a eliminar.'); setBusy(false); return; }
        const confirmed = window.confirm(`¿Eliminar ${selectedIds.size} elemento(s)? Esta acción es irrecuperable.`);
        if (!confirmed) { setBusy(false); return; }
        for (const id of selectedIds) {
          await deleteCarouselItem(token, id);
        }
        await loadItems(selectedCarousel.id);
        await loadCarousels();
        setSelectedIds(new Set());
        setMsg(`✓ ${selectedIds.size} elemento(s) eliminado(s).`);
      } else if (mode === 'reorder') {
        const orderedIds = items.map(i => i.id);
        const result = await reorderCarouselItems(token, selectedCarousel.id, orderedIds);
        if (result.success) {
          setMsg('✓ Orden guardado.');
        } else {
          setMsg('Error al guardar orden.');
        }
      }
    } catch (err) {
      setMsg('Error: ' + err.message);
    }
    setBusy(false);
  };

  const carouselMap = {};
  carousels.forEach(c => { carouselMap[c.nombre] = c; });

  return (
    <div className="adm-carousel-manager">
      <h2 className="adm-section-title">Elementos dentro de un Carrusel</h2>

      <div className="adm-picker-section">
        <h3 className="adm-picker-title">Escoger Carrusel</h3>
        <div className="adm-pillars">
          {PILLAR_SECTIONS.map((pillar) => (
            <div
              key={pillar.label}
              className="adm-pillar-row"
              style={{ backgroundColor: pillar.color, borderColor: pillar.border }}
            >
              <span className="adm-pillar-label">{pillar.label}</span>
              <div className="adm-pillar-btns">
                {pillar.carousels.map((name, i) => {
                  const c = carouselMap[name];
                  return (
                    <button
                      key={name}
                      className={`adm-carousel-btn${selectedCarousel?.nombre === name ? ' active' : ''}`}
                      onClick={() => c && handleSelectCarousel(c)}
                      disabled={!c}
                      title={c ? `${c.item_count} items` : 'No disponible'}
                    >
                      {pillar.labels[i]}
                      {c && <span className="adm-item-count">{c.item_count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCarousel && (
        <div className="adm-modifier-section">
          <h3 className="adm-modifier-title">
            Modificar Carrusel: <span className="adm-carousel-name">{selectedCarousel.nombre}</span>
          </h3>

          {mode === 'add' && (
            <div className="adm-add-area">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="adm-file-input"
                onChange={handleFileChange}
              />
              {pendingFiles.length > 0 && (
                <p className="adm-pending-info">{pendingFiles.length} archivo(s) seleccionado(s)</p>
              )}
            </div>
          )}

          <div className="adm-thumbs-grid">
            {mode === 'reorder' ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
                  {items.map(item => (
                    <SortableThumb
                      key={item.id}
                      item={item}
                      isSelected={selectedIds.has(item.id)}
                      mode={mode}
                      onToggle={handleToggleItem}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              items.map(item => (
                <SortableThumb
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.has(item.id)}
                  mode={mode}
                  onToggle={handleToggleItem}
                />
              ))
            )}
          </div>

          {msg && <p className="adm-msg">{msg}</p>}

          <div className="adm-actions">
            <div className="adm-actions-left">
              <button
                className={`adm-action-btn${mode === 'add' ? ' adm-action-btn--active' : ''}`}
                onClick={() => handleModeToggle('add')}
              >Agregar fotos</button>
              <button
                className={`adm-action-btn${mode === 'delete' ? ' adm-action-btn--active' : ''}`}
                onClick={() => handleModeToggle('delete')}
              >Eliminar fotos</button>
              <button
                className={`adm-action-btn${mode === 'reorder' ? ' adm-action-btn--active' : ''}`}
                onClick={() => handleModeToggle('reorder')}
              >Modificar orden</button>
            </div>
            <button
              className="adm-apply-btn"
              onClick={handleApply}
              disabled={busy || !mode}
            >
              {busy ? 'Procesando...' : 'Aplicar cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function AdminDashboard({ token, onLogout }) {
  const [activePanel, setActivePanel] = useState(null);

  const handleLogout = async () => {
    await adminLogout(token).catch(() => {});
    onLogout();
  };

  return (
    <div className="adm-dashboard" style={{ backgroundImage: `url(${BG})` }}>
      <div className="adm-dashboard-overlay" />

      <button className="adm-logout-btn" onClick={handleLogout}>Cerrar sesión</button>

      <div className="adm-columns">
        <div className="adm-col" onClick={() => setActivePanel('db')}>
          <span className="adm-col-label">Información de<br />Base de Datos</span>
        </div>
        <div className="adm-col" onClick={() => setActivePanel('carousel')}>
          <span className="adm-col-label">Elementos dentro<br />de un Carrusel</span>
        </div>
      </div>

      <AnimatePresence>
        {activePanel && (
          <motion.div
            key={activePanel}
            className="adm-panel-overlay"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          >
            <button className="adm-volver-btn" onClick={() => setActivePanel(null)}>
              ← Volver
            </button>
            <div className="adm-panel-content">
              {activePanel === 'db' && <DBInfoPanel token={token} />}
              {activePanel === 'carousel' && <CarouselManagerPanel token={token} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Login ───────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const lockTimer = useRef(null);
  const navigate = useNavigate();

  const handleClose = () => {
    if (window.history.length <= 1) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async () => {
    if (locked || !username || !password) return;
    setError('');
    const result = await adminLogin(username, password);
    if (result.success) {
      onLogin(result.token);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 3) {
        setLocked(true);
        lockTimer.current = setTimeout(() => {
          setLocked(false);
          setAttempts(0);
        }, 600000);
      }
      setError(`Credenciales incorrectas (${next}/3)`);
      setPassword('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') { setUsername(''); setPassword(''); setError(''); }
  };

  useEffect(() => () => { if (lockTimer.current) clearTimeout(lockTimer.current); }, []);

  return (
    <div className="adm-login-page" style={{ backgroundImage: `url(${BG})` }}>
      <div className="adm-login-overlay" />
      <div className="adm-login-box">
        <button className="adm-login-close" onClick={handleClose} aria-label="Cerrar">
          ✕
        </button>
        <h2 className="adm-login-title">ADMINISTRACIÓN</h2>
        {locked ? (
          <p className="adm-login-locked">Acceso bloqueado por 10 minutos</p>
        ) : (
          <>
            <input
              autoFocus
              type="text"
              className="adm-login-input"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />
            <input
              type="password"
              className="adm-login-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
            {error && <p className="adm-login-error">{error}</p>}
            <button className="adm-login-btn" onClick={handleSubmit}>
              Entrar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Admin (raíz) ─────────────────────────────────────────────────────────────
const Admin = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token'));

  const handleLogin = (t) => {
    sessionStorage.setItem('admin_token', t);
    setToken(t);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard token={token} onLogout={handleLogout} />;
};

export default Admin;
