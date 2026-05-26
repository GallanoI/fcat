import React from 'react';
import './terminosModal.css';

const TerminosModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="tmod-overlay" onClick={onClose}>
      <div className="tmod-box" onClick={(e) => e.stopPropagation()}>

        <div className="tmod-header">
          <h2 className="tmod-title">Términos y Condiciones</h2>
          <p className="tmod-subtitle">Escuela Artística para Niños · FCAT</p>
        </div>

        <div className="tmod-body">
          <h3>1. Aceptación</h3>
          <p>
            Al completar y enviar la Ficha de Inscripción, el apoderado declara haber leído,
            comprendido y aceptado en su totalidad los presentes Términos y Condiciones de
            participación en la Escuela Artística para Niños organizada por FCAT
            (Fundación Cultural Arte Tunquén).
          </p>

          <h3>2. Inscripción y cupos</h3>
          <p>
            La inscripción queda confirmada únicamente una vez completado y enviado el formulario.
            Los cupos son limitados a 20 participantes por taller. En caso de llenarse el cupo,
            el sistema no permitirá nuevas inscripciones.
          </p>

          <h3>3. Datos personales</h3>
          <p>
            Los datos proporcionados en la ficha serán utilizados exclusivamente para la organización
            y gestión de los talleres. FCAT se compromete a no compartir esta información con terceros
            sin el consentimiento explícito del apoderado.
          </p>

          <h3>4. Asistencia</h3>
          <p>
            El apoderado se compromete a respetar los días de asistencia seleccionados al momento de
            la inscripción. En caso de inasistencia, se solicita notificar con anticipación a los
            organizadores para facilitar la planificación del taller.
          </p>

          <h3>5. Responsabilidad</h3>
          <p>
            Los niños participantes deben estar bajo la supervisión de un adulto responsable durante
            el traslado hacia y desde las instalaciones de FCAT. La organización no se responsabiliza
            por accidentes o incidentes ocurridos fuera del espacio de los talleres.
          </p>

          <h3>6. Materiales</h3>
          <p>
            Todos los materiales necesarios para el desarrollo de los talleres serán provistos por
            FCAT sin costo adicional para los participantes inscritos.
          </p>

          <h3>7. Modificaciones y cancelaciones</h3>
          <p>
            FCAT se reserva el derecho de modificar o cancelar talleres por causas de fuerza mayor,
            notificando oportunamente a los inscritos a través de los datos de contacto proporcionados
            en la ficha de inscripción.
          </p>

          <h3>8. Material audiovisual</h3>
          <p>
            Al inscribirse, el apoderado autoriza a FCAT a fotografiar o filmar a los participantes
            durante el desarrollo de los talleres con fines exclusivamente documentales,
            comunicacionales o educativos.
          </p>
        </div>

        <div className="tmod-footer">
          <button type="button" className="tmod-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default TerminosModal;
