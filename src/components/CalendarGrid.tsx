import React, { useCallback, useRef, useState } from "react";
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
  return d === 0 ? 6 : d - 1; // Monday-based
}

export default function CalendarGrid({
  year, month, isToday, isInRange, isRangeStart, isRangeEnd,
  getNotesForDate, onDateClick, onDragStart, onDragOver, onDragEnd, onDateFocus,
  flipDirection,
}: CalendarGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusedDay, setFocusedDay] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

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

  // Empty cells before month starts
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`empty-${i}`} className="h-10 sm:h-12" />);
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = (startDay + day - 1) % 7;
    const isWeekend = dayOfWeek >= 5;
    const holiday = getHolidayForDate(month, day);
    const today = isToday(date);
    const inRange = isInRange(date);
    const rangeStart = isRangeStart(date);
    const rangeEnd = isRangeEnd(date);
    const hasNotes = getNotesForDate(date).length > 0;
    const notePreview = getNotesForDate(date);

    cells.push(
      <div key={day} className="relative group">
        <button
          data-day={day}
          tabIndex={focusedDay === day || (!focusedDay && day === 1) ? 0 : -1}
          className={cn(
            "w-full h-10 sm:h-12 rounded-lg text-sm sm:text-base font-medium",
            "transition-all duration-200 relative select-none",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            // Base
            "hover:bg-secondary",
            // Weekend
            isWeekend && "text-calendar-weekend",
            // Today
            today && "ring-2 ring-calendar-today animate-today-pulse font-bold",
            // Range states
            rangeStart && "bg-calendar-accent text-primary-foreground rounded-r-none hover:bg-calendar-accent",
            rangeEnd && "bg-calendar-accent text-primary-foreground rounded-l-none hover:bg-calendar-accent",
            inRange && "bg-calendar-range rounded-none",
            // Holiday
            holiday && "font-semibold",
          )}
          onClick={() => onDateClick(date)}
          onMouseDown={() => onDragStart(date)}
          onMouseEnter={() => {
            onDragOver(date);
            setHoveredDay(day);
          }}
          onMouseLeave={() => setHoveredDay(null)}
          onMouseUp={onDragEnd}
          onTouchStart={() => onDragStart(date)}
          onTouchEnd={onDragEnd}
          onKeyDown={(e) => handleKeyDown(e, day)}
          onFocus={() => {
            setFocusedDay(day);
            onDateFocus?.(date);
          }}
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

        {/* Hover preview for notes */}
        {hoveredDay === day && notePreview.length > 0 && (
          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 
            bg-card border border-border rounded-lg shadow-lg p-2 min-w-[160px]
            animate-float-in pointer-events-none">
            {notePreview.slice(0, 2).map((n) => (
              <p key={n.id} className="text-xs text-foreground truncate">{n.text}</p>
            ))}
            {notePreview.length > 2 && (
              <p className="text-xs text-muted-foreground">+{notePreview.length - 2} more</p>
            )}
            {holiday && (
              <p className="text-xs text-calendar-holiday font-medium mt-1">{holiday.name}</p>
            )}
          </div>
        )}

        {/* Holiday tooltip */}
        {hoveredDay === day && holiday && notePreview.length === 0 && (
          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 
    bg-card border border-border rounded-lg shadow-lg px-3 py-1.5
    animate-float-in pointer-events-none"
            style={{ width: "max-content", maxWidth: "200px" }}>
            <p className="text-xs text-calendar-holiday font-medium break-words">{holiday.name}</p>
          </div>
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
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={cn(
              "text-center text-xs sm:text-sm font-semibold py-2 tracking-wider",
              i >= 5 ? "text-calendar-weekend" : "text-muted-foreground"
            )}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    </div>
  );
}
