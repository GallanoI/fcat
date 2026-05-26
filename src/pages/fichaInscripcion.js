import React, { useState, useEffect, useMemo } from 'react';
import { getTalleres, createInscripcion, getConteoPorDia } from '../services/db';
import TerminosModal from '../components/terminosModal';
import './fichaInscripcion.css';

const CUPOS_MAX = parseInt(process.env.REACT_APP_CUPOS_MAX || '20', 10);

// ─── RUT chileno ─────────────────────────────────────────────────────────────
function validarRut(rut) {
  const clean = rut.replace(/[.\s]/g, '').toUpperCase();
  const match = clean.match(/^(\d{1,8})-([0-9K])$/);
  if (!match) return false;
  const num = match[1];
  const dv = match[2];
  let suma = 0;
  let mult = 2;
  for (let i = num.length - 1; i >= 0; i--) {
    suma += parseInt(num[i], 10) * mult;
    mult = mult < 7 ? mult + 1 : 2;
  }
  const rem = suma % 11;
  const dvCalc = rem === 0 ? '0' : rem === 1 ? 'K' : String(11 - rem);
  return dv === dvCalc;
}

// "2026-06-22 09:00:00" → "Lun 22/06 · 09:00"
function formatFecha(datetime) {
  const [datePart, timePart] = datetime.split(' ');
  const [year, month, day] = datePart.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const weekday = date.toLocaleDateString('es-CL', { weekday: 'short' });
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${day}/${month} · ${timePart.substring(0, 5)}`;
}

const CANTIDAD_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

const ninoInicial = () => ({
  nombre: '',
  edad: '',
  rut: '',
  fechaNacimiento: '',
  tallerIds: [],
  diasPorTaller: {},
  infoExtra: '',
});

const apoderadoInicial = {
  nombre: '',
  rut: '',
  telefono: '',
  correo: '',
  direccion: '',
};

const FichaInscripcion = () => {
  const [talleres, setTalleres] = useState([]);
  const [ocupacion, setOcupacion] = useState([]);
  const [cantidadNinos, setCantidadNinos] = useState(1);
  const [apoderado, setApoderado] = useState(apoderadoInicial);
  const [ninos, setNinos] = useState([ninoInicial()]);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [showTerminos, setShowTerminos] = useState(false);
  const [modalResultados, setModalResultados] = useState(null);

  useEffect(() => {
    getTalleres().then(setTalleres);
    getConteoPorDia().then(setOcupacion);
  }, []);

  // Sincroniza el array de niños con la cantidad seleccionada
  useEffect(() => {
    setNinos((prev) => {
      if (cantidadNinos > prev.length) {
        return [
          ...prev,
          ...Array(cantidadNinos - prev.length)
            .fill(null)
            .map(ninoInicial),
        ];
      }
      return prev.slice(0, cantidadNinos);
    });
  }, [cantidadNinos]);

  const tallerById = useMemo(() => {
    const map = {};
    talleres.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [talleres]);

  const ocupacionMap = useMemo(() => {
    const map = {};
    ocupacion.forEach((row) => {
      map[row.taller_id] = { dia1: row.count_dia1, dia2: row.count_dia2 };
    });
    return map;
  }, [ocupacion]);

  // Cuenta cuántos niños en el formulario actual ya eligieron cada taller/día
  const inFormCount = useMemo(() => {
    const counts = {};
    ninos.forEach((n) => {
      n.tallerIds.forEach((tid) => {
        const taller = tallerById[tid];
        if (!taller) return;
        if (!counts[tid]) counts[tid] = { dia1: 0, dia2: 0 };
        const dias = n.diasPorTaller[tid] || [];
        if (dias.includes(taller.fecha1)) counts[tid].dia1++;
        if (dias.includes(taller.fecha2)) counts[tid].dia2++;
      });
    });
    return counts;
  }, [ninos, tallerById]);

  const updateApoderado = (field, value) => {
    setApoderado((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [`apoderado.${field}`]: undefined }));
  };

  const updateNino = (index, field, value) => {
    setNinos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setErrores((prev) => ({ ...prev, [`nino.${index}.${field}`]: undefined }));
  };

  const toggleTaller = (ninoIndex, tallerId) => {
    setNinos((prev) => {
      const next = [...prev];
      const n = next[ninoIndex];
      const isSelected = n.tallerIds.includes(tallerId);
      const newIds = isSelected
        ? n.tallerIds.filter((id) => id !== tallerId)
        : [...n.tallerIds, tallerId];
      const newDias = { ...n.diasPorTaller };
      if (isSelected) delete newDias[tallerId];
      next[ninoIndex] = { ...n, tallerIds: newIds, diasPorTaller: newDias };
      return next;
    });
    setErrores((prev) => ({ ...prev, [`nino.${ninoIndex}.tallerIds`]: undefined }));
  };

  const toggleTodos = (ninoIndex, availableTallerIds) => {
    setNinos((prev) => {
      const next = [...prev];
      const n = next[ninoIndex];
      const allSelected =
        availableTallerIds.length > 0 &&
        availableTallerIds.every((id) => n.tallerIds.includes(id));
      if (allSelected) {
        next[ninoIndex] = { ...n, tallerIds: [], diasPorTaller: {} };
      } else {
        const newIds = [...new Set([...n.tallerIds, ...availableTallerIds])];
        next[ninoIndex] = { ...n, tallerIds: newIds };
      }
      return next;
    });
    setErrores((prev) => ({ ...prev, [`nino.${ninoIndex}.tallerIds`]: undefined }));
  };

  const toggleDia = (ninoIndex, tallerId, fecha) => {
    setNinos((prev) => {
      const next = [...prev];
      const n = next[ninoIndex];
      const dias = n.diasPorTaller[tallerId] || [];
      const newDias = dias.includes(fecha)
        ? dias.filter((d) => d !== fecha)
        : [...dias, fecha];
      next[ninoIndex] = {
        ...n,
        diasPorTaller: { ...n.diasPorTaller, [tallerId]: newDias },
      };
      return next;
    });
    setErrores((prev) => ({
      ...prev,
      [`nino.${ninoIndex}.dias.${tallerId}`]: undefined,
    }));
  };

  // Validez del formulario para habilitar el botón
  const isValid = useMemo(() => {
    if (!aceptaTerminos) return false;
    const apFields = ['nombre', 'rut', 'telefono', 'correo', 'direccion'];
    if (apFields.some((f) => !apoderado[f]?.trim())) return false;
    if (!validarRut(apoderado.rut)) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(apoderado.correo)) return false;
    for (const n of ninos) {
      if (!n.nombre?.trim()) return false;
      if (!n.edad || parseInt(n.edad) < 1) return false;
      if (!n.rut?.trim() || !validarRut(n.rut)) return false;
      if (!n.fechaNacimiento) return false;
      if (!n.tallerIds.length) return false;
      if (n.tallerIds.some((tid) => !(n.diasPorTaller[tid]?.length))) return false;
    }
    return true;
  }, [apoderado, ninos, aceptaTerminos]);

  const validate = () => {
    const errs = {};
    if (!apoderado.nombre.trim()) errs['apoderado.nombre'] = 'Requerido';
    if (!apoderado.rut.trim()) errs['apoderado.rut'] = 'Requerido';
    else if (!validarRut(apoderado.rut)) errs['apoderado.rut'] = 'RUT inválido';
    if (!apoderado.telefono.trim()) errs['apoderado.telefono'] = 'Requerido';
    if (!apoderado.correo.trim()) errs['apoderado.correo'] = 'Requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(apoderado.correo))
      errs['apoderado.correo'] = 'Correo inválido';
    if (!apoderado.direccion.trim()) errs['apoderado.direccion'] = 'Requerido';
    ninos.forEach((n, i) => {
      if (!n.nombre?.trim()) errs[`nino.${i}.nombre`] = 'Requerido';
      if (!n.edad || parseInt(n.edad) < 1) errs[`nino.${i}.edad`] = 'Edad inválida';
      if (!n.rut?.trim()) errs[`nino.${i}.rut`] = 'Requerido';
      else if (!validarRut(n.rut)) errs[`nino.${i}.rut`] = 'RUT inválido';
      if (!n.fechaNacimiento) errs[`nino.${i}.fechaNacimiento`] = 'Requerido';
      if (!n.tallerIds.length) errs[`nino.${i}.tallerIds`] = 'Selecciona al menos un taller';
      n.tallerIds.forEach((tid) => {
        if (!n.diasPorTaller[tid]?.length)
          errs[`nino.${i}.dias.${tid}`] = 'Selecciona al menos un día';
      });
    });
    if (!aceptaTerminos) errs['terminos'] = 'Debes aceptar los términos';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      return;
    }
    setLoading(true);
    const result = await createInscripcion({
      apoderado,
      ninos: ninos.map((n) => ({
        nombre: n.nombre,
        edad: parseInt(n.edad, 10),
        rut: n.rut,
        fechaNacimiento: n.fechaNacimiento,
        inscripciones: n.tallerIds.map((tid) => ({
          tallerId: tid,
          diasAsistencia: n.diasPorTaller[tid] || [],
        })),
        infoExtra: n.infoExtra,
      })),
    });
    setLoading(false);
    if (result.success) {
      const bc = new BroadcastChannel('fcat-inscripcion');
      bc.postMessage({ type: 'inscripcionCreada' });
      bc.close();
      setModalResultados(result.resultados || null);
      setShowModal(true);
    } else {
      setErrores({ global: result.error || 'Error al inscribir. Intenta nuevamente.' });
    }
  };

  const handleOpenTerminos = () => setShowTerminos(true);

  return (
    <div className="ficha-bg">
      <div className="ficha-container">
        <h1 className="ficha-title">Ficha de Inscripción a Taller</h1>

        {/* ─── Datos del Apoderado ─────────────────────────────────────── */}
        <section className="ficha-section">
          <h2 className="ficha-section-title">Datos del Apoderado</h2>
          <div className="ficha-grid">
            <div className="ficha-field">
              <label className="ficha-label">Nombre completo *</label>
              <input
                type="text"
                className={`ficha-input${errores['apoderado.nombre'] ? ' ficha-input--error' : ''}`}
                value={apoderado.nombre}
                onChange={(e) => updateApoderado('nombre', e.target.value)}
                placeholder="Nombre Apellido"
              />
              {errores['apoderado.nombre'] && (
                <span className="ficha-error">{errores['apoderado.nombre']}</span>
              )}
            </div>

            <div className="ficha-field">
              <label className="ficha-label">RUT *</label>
              <input
                type="text"
                className={`ficha-input${errores['apoderado.rut'] ? ' ficha-input--error' : ''}`}
                value={apoderado.rut}
                onChange={(e) => updateApoderado('rut', e.target.value)}
                placeholder="12.345.678-9"
              />
              {errores['apoderado.rut'] && (
                <span className="ficha-error">{errores['apoderado.rut']}</span>
              )}
            </div>

            <div className="ficha-field">
              <label className="ficha-label">Teléfono *</label>
              <input
                type="tel"
                className={`ficha-input${errores['apoderado.telefono'] ? ' ficha-input--error' : ''}`}
                value={apoderado.telefono}
                onChange={(e) => updateApoderado('telefono', e.target.value)}
                placeholder="+56 9 XXXX XXXX"
              />
              {errores['apoderado.telefono'] && (
                <span className="ficha-error">{errores['apoderado.telefono']}</span>
              )}
            </div>

            <div className="ficha-field">
              <label className="ficha-label">Correo electrónico *</label>
              <input
                type="email"
                className={`ficha-input${errores['apoderado.correo'] ? ' ficha-input--error' : ''}`}
                value={apoderado.correo}
                onChange={(e) => updateApoderado('correo', e.target.value)}
                placeholder="correo@ejemplo.cl"
              />
              {errores['apoderado.correo'] && (
                <span className="ficha-error">{errores['apoderado.correo']}</span>
              )}
            </div>

            <div className="ficha-field ficha-field--full">
              <label className="ficha-label">Dirección *</label>
              <input
                type="text"
                className={`ficha-input${errores['apoderado.direccion'] ? ' ficha-input--error' : ''}`}
                value={apoderado.direccion}
                onChange={(e) => updateApoderado('direccion', e.target.value)}
                placeholder="Calle, número, ciudad"
              />
              {errores['apoderado.direccion'] && (
                <span className="ficha-error">{errores['apoderado.direccion']}</span>
              )}
            </div>
          </div>

          <div className="ficha-cantidad">
            <label className="ficha-label">Cantidad de niños *</label>
            <div className="ficha-cantidad-btns">
              {CANTIDAD_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`ficha-cantidad-btn${cantidadNinos === n ? ' active' : ''}`}
                  onClick={() => setCantidadNinos(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Sección por cada niño ───────────────────────────────────── */}
        {ninos.map((nino, i) => {
          const availableTallerIds = talleres
            .filter((t) => {
              const ocup = ocupacionMap[t.id] || { dia1: 0, dia2: 0 };
              const inForm = inFormCount[t.id] || { dia1: 0, dia2: 0 };
              const thisSelected = nino.tallerIds.includes(t.id);
              const thisDia1 = thisSelected
                ? (nino.diasPorTaller[t.id] || []).includes(t.fecha1)
                : false;
              const thisDia2 = thisSelected
                ? (nino.diasPorTaller[t.id] || []).includes(t.fecha2)
                : false;
              const efDia1 = ocup.dia1 + inForm.dia1 - (thisDia1 ? 1 : 0);
              const efDia2 = ocup.dia2 + inForm.dia2 - (thisDia2 ? 1 : 0);
              return !(efDia1 >= CUPOS_MAX && efDia2 >= CUPOS_MAX);
            })
            .map((t) => t.id);
          const todosSeleccionados =
            availableTallerIds.length > 0 &&
            availableTallerIds.every((id) => nino.tallerIds.includes(id));
          return (
            <section key={i} className="ficha-section">
              <h2 className="ficha-section-title">
                {cantidadNinos > 1 ? `Niño ${i + 1}` : 'Datos del Niño'}
              </h2>
              <div className="ficha-grid">
                <div className="ficha-field">
                  <label className="ficha-label">Nombre *</label>
                  <input
                    type="text"
                    className={`ficha-input${errores[`nino.${i}.nombre`] ? ' ficha-input--error' : ''}`}
                    value={nino.nombre}
                    onChange={(e) => updateNino(i, 'nombre', e.target.value)}
                    placeholder="Nombre Apellido"
                  />
                  {errores[`nino.${i}.nombre`] && (
                    <span className="ficha-error">{errores[`nino.${i}.nombre`]}</span>
                  )}
                </div>

                <div className="ficha-field">
                  <label className="ficha-label">Edad *</label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    className={`ficha-input${errores[`nino.${i}.edad`] ? ' ficha-input--error' : ''}`}
                    value={nino.edad}
                    onChange={(e) => updateNino(i, 'edad', e.target.value)}
                    placeholder="Ej. 8"
                  />
                  {errores[`nino.${i}.edad`] && (
                    <span className="ficha-error">{errores[`nino.${i}.edad`]}</span>
                  )}
                </div>

                <div className="ficha-field">
                  <label className="ficha-label">RUT *</label>
                  <input
                    type="text"
                    className={`ficha-input${errores[`nino.${i}.rut`] ? ' ficha-input--error' : ''}`}
                    value={nino.rut}
                    onChange={(e) => updateNino(i, 'rut', e.target.value)}
                    placeholder="12.345.678-9"
                  />
                  {errores[`nino.${i}.rut`] && (
                    <span className="ficha-error">{errores[`nino.${i}.rut`]}</span>
                  )}
                </div>

                <div className="ficha-field">
                  <label className="ficha-label">Fecha de nacimiento *</label>
                  <input
                    type="date"
                    className={`ficha-input${errores[`nino.${i}.fechaNacimiento`] ? ' ficha-input--error' : ''}`}
                    value={nino.fechaNacimiento}
                    onChange={(e) => updateNino(i, 'fechaNacimiento', e.target.value)}
                  />
                  {errores[`nino.${i}.fechaNacimiento`] && (
                    <span className="ficha-error">{errores[`nino.${i}.fechaNacimiento`]}</span>
                  )}
                </div>

                <div className="ficha-field ficha-field--full">
                  <label className="ficha-label">Talleres *</label>
                  <div className="ficha-dias">
                    <label className="ficha-dia-item ficha-todos-item">
                      <input
                        type="checkbox"
                        checked={todosSeleccionados}
                        onChange={() => toggleTodos(i, availableTallerIds)}
                        disabled={availableTallerIds.length === 0}
                      />
                      <span className="ficha-dia-label ficha-todos-label">
                        Inscribirse a todos los talleres
                      </span>
                    </label>
                    {talleres.map((t) => {
                      const ocup = ocupacionMap[t.id] || { dia1: 0, dia2: 0 };
                      const inForm = inFormCount[t.id] || { dia1: 0, dia2: 0 };
                      const thisSelected = nino.tallerIds.includes(t.id);
                      const thisDia1 = thisSelected ? (nino.diasPorTaller[t.id] || []).includes(t.fecha1) : false;
                      const thisDia2 = thisSelected ? (nino.diasPorTaller[t.id] || []).includes(t.fecha2) : false;
                      const efDia1 = ocup.dia1 + inForm.dia1 - (thisDia1 ? 1 : 0);
                      const efDia2 = ocup.dia2 + inForm.dia2 - (thisDia2 ? 1 : 0);
                      const ambosDiaLlenos = efDia1 >= CUPOS_MAX && efDia2 >= CUPOS_MAX;
                      return (
                        <label key={t.id} className="ficha-dia-item">
                          <input
                            type="checkbox"
                            checked={thisSelected}
                            onChange={() => toggleTaller(i, t.id)}
                            disabled={ambosDiaLlenos && !thisSelected}
                          />
                          <span className="ficha-dia-label">
                            {t.nombre_taller} — {t.nombre_tallerista}
                            {ambosDiaLlenos && (
                              <span className="ficha-sin-cupos"> SIN CUPOS</span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errores[`nino.${i}.tallerIds`] && (
                    <span className="ficha-error">{errores[`nino.${i}.tallerIds`]}</span>
                  )}
                </div>

                {nino.tallerIds.map((tid) => {
                  const t = tallerById[tid];
                  if (!t) return null;
                  return (
                    <div key={tid} className="ficha-field ficha-field--full">
                      <label className="ficha-label">
                        Días de asistencia — {t.nombre_taller} *{' '}
                        <span className="ficha-label-hint">(selecciona uno o ambos)</span>
                      </label>
                      <div className="ficha-dias">
                        {[t.fecha1, t.fecha2].map((fecha, fi) => {
                          const ocup = ocupacionMap[tid] || { dia1: 0, dia2: 0 };
                          const inForm = inFormCount[tid] || { dia1: 0, dia2: 0 };
                          const thisNinoHasFecha = (nino.diasPorTaller[tid] || []).includes(fecha);
                          const rawCount = fi === 0 ? ocup.dia1 + inForm.dia1 : ocup.dia2 + inForm.dia2;
                          const diaLleno = rawCount - (thisNinoHasFecha ? 1 : 0) >= CUPOS_MAX;
                          return (
                            <label key={fi} className="ficha-dia-item">
                              <input
                                type="checkbox"
                                checked={(nino.diasPorTaller[tid] || []).includes(fecha)}
                                onChange={() => toggleDia(i, tid, fecha)}
                                disabled={diaLleno}
                              />
                              <span className="ficha-dia-label">
                                <span className={diaLleno ? 'ficha-dia-fecha-tachada' : ''}>
                                  {formatFecha(fecha)}
                                </span>
                                {diaLleno && (
                                  <span className="ficha-sin-cupos"> SIN CUPOS</span>
                                )}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {errores[`nino.${i}.dias.${tid}`] && (
                        <span className="ficha-error">
                          {errores[`nino.${i}.dias.${tid}`]}
                        </span>
                      )}
                    </div>
                  );
                })}

                <div className="ficha-field ficha-field--full">
                  <label className="ficha-label">Información extra</label>
                  <textarea
                    className="ficha-input ficha-textarea"
                    value={nino.infoExtra}
                    onChange={(e) => updateNino(i, 'infoExtra', e.target.value)}
                    placeholder="Alergias, necesidades especiales, observaciones…"
                    rows={2}
                  />
                </div>
              </div>
            </section>
          );
        })}

        {/* ─── Términos y condiciones ───────────────────────────────────── */}
        <div className="ficha-terminos">
          <label className="ficha-terminos-label">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => {
                setAceptaTerminos(e.target.checked);
                setErrores((prev) => ({ ...prev, terminos: undefined }));
              }}
            />
            <span>
              He leído y acepto los{' '}
              <button type="button" className="ficha-terminos-link" onClick={handleOpenTerminos}>
                Términos y Condiciones
              </button>
            </span>
          </label>
          {errores['terminos'] && (
            <span className="ficha-error">{errores['terminos']}</span>
          )}
        </div>

        {errores['global'] && (
          <div className="ficha-error-global">{errores['global']}</div>
        )}

        <button
          className="ficha-submit"
          onClick={handleSubmit}
          disabled={!isValid || loading}
          type="button"
        >
          {loading ? 'Inscribiendo…' : 'Inscribir'}
        </button>
      </div>

      {/* ─── Modal de confirmación ────────────────────────────────────── */}
      {showModal && (
        <div className="ficha-modal-overlay">
          <div className="ficha-modal">
            {modalResultados?.some(r => r.detalle.some(d => d.diasSinCupo.length > 0)) ? (
              <>
                <h2 className="ficha-modal-title">Inscripción procesada</h2>
                <div className="ficha-modal-resultados">
                  {modalResultados.map((r, ri) => (
                    <div key={ri} className="ficha-modal-nino">
                      <strong>{r.nombre}</strong>
                      {r.detalle.map((d, di) => (
                        <div key={di} className="ficha-modal-taller-row">
                          <span className="ficha-modal-taller-name">{d.taller}:</span>
                          {d.diasInscritos.length > 0 && (
                            <span className="ficha-modal-dia-ok">
                              {' '}✓ {d.diasInscritos.map(formatFecha).join(' · ')}
                            </span>
                          )}
                          {d.diasSinCupo.length > 0 && (
                            <span className="ficha-modal-dia-sin-cupo">
                              {' '}✗ {d.diasSinCupo.map(formatFecha).join(' · ')} (sin cupos)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <p className="ficha-modal-aviso">
                  Algunos cupos se llenaron mientras completabas el formulario.
                </p>
              </>
            ) : (
              <>
                <h2 className="ficha-modal-title">¡Inscripción exitosa!</h2>
                <p className="ficha-modal-text">
                  {cantidadNinos === 1
                    ? 'El niño ha sido inscrito correctamente.'
                    : `Los ${cantidadNinos} niños han sido inscritos correctamente.`}
                </p>
              </>
            )}
            <button
              type="button"
              className="ficha-modal-btn"
              onClick={() => window.close()}
            >
              Volver a Escuela de Niños
            </button>
          </div>
        </div>
      )}

      <TerminosModal isOpen={showTerminos} onClose={() => setShowTerminos(false)} />
    </div>
  );
};

export default FichaInscripcion;
