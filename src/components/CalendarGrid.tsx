import React, { useCallback, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getHolidayForDate } from "@/data/holidays";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  year: number;
  month: number;
  isToday: (d: Date) => boolean;
  isInRange: (d: Date) => boolean;
  isRangeStart: (d: Date) => boolean;
  isRangeEnd: (d: Date) => boolean;
  getNotesForDate: (d: Date) => { id: string; text: string }[];
  onDateClick: (d: Date) => void;
  onDragStart: (d: Date) => void;
  onDragOver: (d: Date) => void;
  onDragEnd: () => void;
  onDateFocus?: (d: Date) => void;
  flipDirection: "next" | "prev" | null;
}

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDay(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

interface TooltipPortalProps {
  anchorRef: React.RefObject<HTMLButtonElement>;
  children: React.ReactNode;
}

function TooltipPortal({ anchorRef, children }: TooltipPortalProps) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const tooltipWidth = 180;

    // Horizontal: keep within viewport
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left + tooltipWidth > viewportWidth - 8) left = viewportWidth - tooltipWidth - 8;
    if (left < 8) left = 8;

    // Vertical: show below if space, else above
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow > 80
      ? rect.bottom + window.scrollY + 4
      : rect.top + window.scrollY - 4;
    const transform = spaceBelow > 80 ? "translateY(0)" : "translateY(-100%)";

    setStyle({ position: "absolute", top, left, transform, width: tooltipWidth, zIndex: 9999 });
  }, [anchorRef]);

  return createPortal(
    <div style={style} className="bg-card border border-border rounded-lg shadow-xl pointer-events-none animate-float-in">
      {children}
    </div>,
    document.body
  );
}

export default function CalendarGrid({
  year, month, isToday, isInRange, isRangeStart, isRangeEnd,
  getNotesForDate, onDateClick, onDragStart, onDragOver, onDragEnd, onDateFocus,
  flipDirection,
}: CalendarGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusedDay, setFocusedDay] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const totalDays = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, day: number) => {
    let newDay = day;
    if (e.key === "ArrowRight") newDay = Math.min(day + 1, totalDays);
    else if (e.key === "ArrowLeft") newDay = Math.max(day - 1, 1);
    else if (e.key === "ArrowDown") newDay = Math.min(day + 7, totalDays);
    else if (e.key === "ArrowUp") newDay = Math.max(day - 7, 1);
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onDateClick(new Date(year, month, day));
      return;
    } else return;
    e.preventDefault();
    setFocusedDay(newDay);
    const btn = gridRef.current?.querySelector(`[data-day="${newDay}"]`) as HTMLElement;
    btn?.focus();
  }, [totalDays, year, month, onDateClick]);

  const cells: React.ReactNode[] = [];

  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`empty-${i}`} className="h-10 sm:h-12" />);
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const cellIndex = startDay + day - 1;
    const dayOfWeek = cellIndex % 7;
    const isWeekend = dayOfWeek >= 5;
    const holiday = getHolidayForDate(month, day);
    const today = isToday(date);
    const inRange = isInRange(date);
    const rangeStart = isRangeStart(date);
    const rangeEnd = isRangeEnd(date);
    const hasNotes = getNotesForDate(date).length > 0;
    const notePreview = getNotesForDate(date);
    const btnRef = { current: buttonRefs.current.get(day) ?? null } as React.RefObject<HTMLButtonElement>;

    const showTooltip = hoveredDay === day && (holiday || notePreview.length > 0);

    cells.push(
      <div key={day} className="relative group">
        <button
          data-day={day}
          ref={(el) => { if (el) buttonRefs.current.set(day, el); }}
          tabIndex={focusedDay === day || (!focusedDay && day === 1) ? 0 : -1}
          className={cn(
            "w-full h-10 sm:h-12 rounded-lg text-sm sm:text-base font-medium",
            "transition-all duration-200 relative select-none",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            "hover:bg-secondary",
            isWeekend && "text-calendar-weekend",
            today && "ring-2 ring-calendar-today animate-today-pulse font-bold",
            rangeStart && "bg-calendar-accent text-primary-foreground rounded-r-none hover:bg-calendar-accent",
            rangeEnd && "bg-calendar-accent text-primary-foreground rounded-l-none hover:bg-calendar-accent",
            inRange && "bg-calendar-range rounded-none",
            holiday && "font-semibold",
          )}
          onClick={() => onDateClick(date)}
          onMouseDown={() => onDragStart(date)}
          onMouseEnter={() => { onDragOver(date); setHoveredDay(day); }}
          onMouseLeave={() => setHoveredDay(null)}
          onMouseUp={onDragEnd}
          onTouchStart={() => onDragStart(date)}
          onTouchEnd={onDragEnd}
          onKeyDown={(e) => handleKeyDown(e, day)}
          onFocus={() => { setFocusedDay(day); onDateFocus?.(date); }}
          aria-label={`${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${holiday ? `, ${holiday.name}` : ""}`}
        >
          {day}
          {holiday && (
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-calendar-holiday" />
          )}
          {hasNotes && !holiday && (
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-calendar-note-dot" />
          )}
        </button>

        {showTooltip && (
          <TooltipPortal anchorRef={btnRef}>
            <div className="px-3 py-2">
              {holiday && (
                <p className="text-xs text-calendar-holiday font-semibold break-words">{holiday.name}</p>
              )}
              {notePreview.slice(0, 2).map((n) => (
                <p key={n.id} className="text-xs text-foreground break-words mt-0.5">{n.text}</p>
              ))}
              {notePreview.length > 2 && (
                <p className="text-xs text-muted-foreground">+{notePreview.length - 2} more</p>
              )}
            </div>
          </TooltipPortal>
        )}
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className={cn(
        "transition-all duration-400",
        flipDirection === "next" && "animate-page-flip-out",
        flipDirection === "prev" && "animate-page-flip-out",
        !flipDirection && "animate-page-flip-in",
      )}
    >
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d, i) => (
          <div key={d} className={cn(
            "text-center text-xs sm:text-sm font-semibold py-2 tracking-wider",
            i >= 5 ? "text-calendar-weekend" : "text-muted-foreground"
          )}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    </div>
  );
}