import React, { useState } from "react";
import { X, Plus, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  dateKey: string;
  text: string;
}

interface NotesPanelProps {
  selectedDate: Date | null;
  notes: Record<string, Note[]>;
  onAddNote: (date: Date, text: string) => void;
  onDeleteNote: (dateKey: string, noteId: string) => void;
  dateKey: (d: Date) => string;
}

export default function NotesPanel({ selectedDate, notes, onAddNote, onDeleteNote, dateKey }: NotesPanelProps) {
  const [input, setInput] = useState("");

  const currentKey = selectedDate ? dateKey(selectedDate) : null;
  const currentNotes = currentKey ? notes[currentKey] || [] : [];

  const handleAdd = () => {
    if (!selectedDate || !input.trim()) return;
    onAddNote(selectedDate, input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="bg-calendar-note-bg rounded-lg p-4 note-lines min-h-[180px]">
      <div className="flex items-center gap-2 mb-3">
        <StickyNote className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          Notes
        </h3>
        {selectedDate && (
          <span className="text-xs text-muted-foreground ml-auto">
            {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>

      {!selectedDate ? (
        <p className="text-sm text-muted-foreground italic pt-2">
          Click a date to add notes...
        </p>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a note..."
              className={cn(
                "flex-1 bg-card/80 border border-border rounded-md px-3 py-1.5 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              )}
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className={cn(
                "p-1.5 rounded-md bg-primary text-primary-foreground",
                "hover:opacity-90 transition-opacity disabled:opacity-40"
              )}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {currentNotes.map((note, i) => (
              <div
                key={note.id}
                className="flex items-start gap-2 text-sm animate-float-in group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="flex-1 text-foreground leading-relaxed">{note.text}</span>
                <button
                  onClick={() => onDeleteNote(note.dateKey, note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
