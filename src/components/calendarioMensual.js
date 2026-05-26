import React, { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import './calendarioMensual.css';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const CalendarioMensual = ({
  mode = 'view',
  talleresData = [],
  selectedDates = [],
  onChange,
  initialMonth,
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    initialMonth instanceof Date ? initialMonth : new Date()
  );

  // Construye mapa: "YYYY-MM-DD" → { nombre, hora }
  const tallerMap = useMemo(() => {
    const map = {};
    talleresData.forEach((taller) => {
      const dateStr = taller.datetime.substring(0, 10); // "YYYY-MM-DD"
      const hora = taller.datetime.substring(11, 16);   // "HH:MM"
      map[dateStr] = { nombre: taller.nombre, hora };
    });
    return map;
  }, [talleresData]);

  const gridDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  const handlePrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const handleNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));

  const handleDayClick = (dateStr, isEnabled) => {
    if (mode !== 'select' || !isEnabled) return;
    const next = selectedDates.includes(dateStr)
      ? selectedDates.filter((d) => d !== dateStr)
      : [...selectedDates, dateStr];
    onChange?.(next);
  };

  const monthLabel = format(currentMonth, 'MMMM yyyy', { locale: es });

  return (
    <div className={`cal-wrapper ${className}`.trim()}>
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={handlePrevMonth} aria-label="Mes anterior">
          &#8249;
        </button>
        <span className="cal-month-label">{monthLabel}</span>
        <button className="cal-nav-btn" onClick={handleNextMonth} aria-label="Mes siguiente">
          &#8250;
        </button>
      </div>

      <div className="cal-grid cal-weekdays">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}
      </div>

      <div className="cal-grid cal-days">
        {gridDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isFiller = !isSameMonth(day, currentMonth);
          const isTodayDay = isToday(day);
          const taller = tallerMap[dateStr];
          const hasTaller = Boolean(taller);
          const isSelected = selectedDates.includes(dateStr);
          const isEnabled = mode === 'select' && hasTaller && !isFiller;
          const isDisabled = mode === 'select' && !hasTaller && !isFiller;

          const classNames = [
            'cal-day',
            isFiller ? 'cal-day--filler' : '',
            isTodayDay && !isFiller ? 'cal-day--today' : '',
          hasTaller ? 'cal-day--has-taller' : '',
            isSelected ? 'cal-day--selected' : '',
            isEnabled ? 'cal-day--enabled' : '',
            isDisabled ? 'cal-day--disabled' : '',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={dateStr}
              className={classNames}
              onClick={() => handleDayClick(dateStr, isEnabled)}
              role={isEnabled ? 'checkbox' : undefined}
              aria-checked={isEnabled ? isSelected : undefined}
              tabIndex={isEnabled ? 0 : undefined}
              onKeyDown={
                isEnabled
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleDayClick(dateStr, true);
                      }
                    }
                  : undefined
              }
            >
              <span className="cal-day-number">{format(day, 'd')}</span>

              {hasTaller && mode === 'view' && (
                <span className="cal-taller-info">
                  {taller.nombre} · {taller.hora}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarioMensual;
