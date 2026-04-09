import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Copy, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/hooks/useCalendar";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";

import imgJan from "@/assets/calendar-january.jpg";
import imgFeb from "@/assets/calendar-february.jpg";
import imgMar from "@/assets/calendar-march.jpg";
import imgApr from "@/assets/calendar-april.jpg";
import imgMay from "@/assets/calendar-may.jpg";
import imgJun from "@/assets/calendar-june.jpg";
import imgJul from "@/assets/calendar-july.jpg";
import imgAug from "@/assets/calendar-august.jpg";
import imgSep from "@/assets/calendar-september.jpg";
import imgOct from "@/assets/calendar-october.jpg";
import imgNov from "@/assets/calendar-november.jpg";
import imgDec from "@/assets/calendar-december.jpg";

const MONTH_IMAGES: Record<number, string> = {
  0: imgJan, 1: imgFeb, 2: imgMar,
  3: imgApr, 4: imgMay, 5: imgJun,
  6: imgJul, 7: imgAug, 8: imgSep,
  9: imgOct, 10: imgNov, 11: imgDec,
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function WallCalendar() {
  const {
    year, month, range, flipDirection,
    goToMonth, handleDateClick, handleDragStart, handleDragOver, handleDragEnd,
    addNote, deleteNote, getNotesForDate, isInRange, isRangeStart, isRangeEnd,
    exportRange, dateKey, notes,
  } = useCalendar();

  const [dark, setDark] = useState(false);
  const [themeColor, setThemeColor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const touchStartX = useRef(0);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = MONTH_IMAGES[month];
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 50;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 50, 50);
      const data = ctx.getImageData(0, 0, 50, 50).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 16) {
        r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      setThemeColor(`rgb(${r}, ${g}, ${b})`);
    };
  }, [month]);

  const isToday = useCallback((d: Date) => {
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }, []);

  const onDateClick = useCallback((d: Date) => {
    handleDateClick(d);
    setSelectedDate(d);
  }, [handleDateClick]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 60) {
      goToMonth(diff < 0 ? "next" : "prev");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div
        ref={calendarRef}
        className="w-full max-w-[480px] lg:max-w-[960px] mx-auto"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Calendar card - horizontal on desktop, vertical on mobile */}
        <div
          className={cn(
            "bg-calendar-paper rounded-xl overflow-hidden",
            "shadow-[0_8px_40px_-12px_hsl(var(--calendar-shadow)/0.25)]",
            "border border-border/50 transition-shadow duration-500",
            "lg:flex lg:flex-row"
          )}
        >
          {/* Left side on desktop: Image + spiral */}
          <div className="lg:w-[45%] lg:flex lg:flex-col">
            {/* Spiral binding - horizontal on mobile, vertical on desktop */}
            <div className="relative h-5 lg:h-auto lg:w-full calendar-spiral bg-secondary overflow-hidden" />

            {/* Hero image */}
            <div className="relative overflow-hidden lg:flex-1">
              <img
                src={MONTH_IMAGES[month]}
                alt={`${MONTH_NAMES[month]} scenery`}
                className="w-full h-48 sm:h-64 lg:h-full lg:min-h-[500px] object-cover transition-all duration-700"
              />
              {/* Diagonal accent overlay */}
              <div
                className="absolute bottom-0 right-0 w-1/3 h-24"
                style={{
                  background: themeColor
                    ? `linear-gradient(135deg, transparent 50%, ${themeColor}90 50%)`
                    : "linear-gradient(135deg, transparent 50%, hsl(var(--calendar-accent) / 0.6) 50%)",
                }}
              />
              <div className="absolute bottom-3 right-4 text-right">
                <p className="text-xl sm:text-2xl font-bold font-display drop-shadow-md"
                  style={{ color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                  {year}
                </p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-wide uppercase drop-shadow-md"
                  style={{ color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                  {MONTH_NAMES[month]}
                </p>
              </div>
            </div>
          </div>

          {/* Right side on desktop: Controls + Grid + Notes */}
          <div className="lg:w-[55%] lg:flex lg:flex-col">
            {/* Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <button
                onClick={() => goToMonth("prev")}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDark(!dark)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {dark ? <Sun className="w-4 h-4 text-foreground" /> : <Moon className="w-4 h-4 text-foreground" />}
                </button>
                {range.start && range.end && (
                  <button
                    onClick={exportRange}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Export
                  </button>
                )}
              </div>

              <button
                onClick={() => goToMonth("next")}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Range indicator */}
            {range.start && (
              <div className="px-4 py-2 bg-calendar-range/50 text-xs text-foreground">
                <span className="font-medium">
                  {range.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                {range.end && (
                  <>
                    <span className="text-muted-foreground mx-1">→</span>
                    <span className="font-medium">
                      {range.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Calendar grid */}
            <div className="px-3 sm:px-5 py-4 lg:flex-1">
              <CalendarGrid
                year={year}
                month={month}
                isToday={isToday}
                isInRange={isInRange}
                isRangeStart={isRangeStart}
                isRangeEnd={isRangeEnd}
                getNotesForDate={getNotesForDate}
                onDateClick={onDateClick}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                flipDirection={flipDirection}
              />
            </div>

            {/* Notes section */}
            <div className="px-3 sm:px-5 pb-5">
              <NotesPanel
                selectedDate={selectedDate}
                notes={notes}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
                dateKey={dateKey}
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-calendar-today animate-today-pulse" />
            Today
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-calendar-holiday" />
            Holiday
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-calendar-accent" />
            Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm bg-calendar-range" />
            Range
          </span>
        </div>
      </div>
    </div>
  );
}
