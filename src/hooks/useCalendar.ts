import { useState, useCallback, useEffect } from "react";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface NoteEntry {
  id: string;
  dateKey: string; // YYYY-MM-DD
  text: string;
}

const STORAGE_KEYS = {
  notes: "wall-calendar-notes",
  range: "wall-calendar-range",
};

function loadNotes(): Record<string, NoteEntry[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.notes);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function loadRange(): DateRange {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.range);
    if (!raw) return { start: null, end: null };
    const parsed = JSON.parse(raw);
    return {
      start: parsed.start ? new Date(parsed.start) : null,
      end: parsed.end ? new Date(parsed.end) : null,
    };
  } catch { return { start: null, end: null }; }
}

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [range, setRange] = useState<DateRange>(loadRange);
  const [notes, setNotes] = useState<Record<string, NoteEntry[]>>(loadNotes);
  const [isDragging, setIsDragging] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);

  // Persist notes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  }, [notes]);

  // Persist range
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.range, JSON.stringify({
      start: range.start?.toISOString() ?? null,
      end: range.end?.toISOString() ?? null,
    }));
  }, [range]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const goToMonth = useCallback((dir: "next" | "prev") => {
    setFlipDirection(dir);
    setTimeout(() => {
      setCurrentDate((d) => {
        const next = new Date(d);
        next.setMonth(next.getMonth() + (dir === "next" ? 1 : -1));
        return next;
      });
      setFlipDirection(null);
    }, 400);
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      }
      if (date < prev.start) {
        return { start: date, end: prev.start };
      }
      return { ...prev, end: date };
    });
  }, []);

  const handleDragStart = useCallback((date: Date) => {
    setIsDragging(true);
    setRange({ start: date, end: null });
  }, []);

  const handleDragOver = useCallback((date: Date) => {
    if (!isDragging) return;
    setRange((prev) => {
      if (!prev.start) return prev;
      if (date < prev.start) return { start: date, end: prev.start };
      return { ...prev, end: date };
    });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const dateKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const addNote = useCallback((date: Date, text: string) => {
    const key = dateKey(date);
    setNotes((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { id: crypto.randomUUID(), dateKey: key, text }],
    }));
  }, []);

  const deleteNote = useCallback((dKey: string, noteId: string) => {
    setNotes((prev) => ({
      ...prev,
      [dKey]: (prev[dKey] || []).filter((n) => n.id !== noteId),
    }));
  }, []);

  const getNotesForDate = useCallback((date: Date) => {
    return notes[dateKey(date)] || [];
  }, [notes]);

  const isInRange = useCallback((date: Date) => {
    if (!range.start || !range.end) return false;
    return date > range.start && date < range.end;
  }, [range]);

  const isRangeStart = useCallback((date: Date) => {
    return range.start?.toDateString() === date.toDateString();
  }, [range.start]);

  const isRangeEnd = useCallback((date: Date) => {
    return range.end?.toDateString() === date.toDateString();
  }, [range.end]);

  const exportRange = useCallback(() => {
    if (!range.start || !range.end) return;
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${fmt(range.start)}`,
      `DTEND:${fmt(range.end)}`,
      `SUMMARY:Selected Range`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    navigator.clipboard.writeText(ics).then(() => {
      alert("Range copied to clipboard as ICS!");
    });
  }, [range]);

  return {
    year, month, currentDate,
    range, flipDirection,
    goToMonth, handleDateClick,
    handleDragStart, handleDragOver, handleDragEnd,
    addNote, deleteNote, getNotesForDate,
    isInRange, isRangeStart, isRangeEnd,
    exportRange, dateKey, notes,
  };
}
