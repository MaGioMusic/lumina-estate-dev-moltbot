"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Note, NoteFormData } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NoteFormProps {
  note?: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NoteFormData) => void;
  isLoading?: boolean;
  relatedTo?: {
    type: 'contact' | 'deal' | 'property';
    name: string;
  };
  className?: string;
}

export function NoteForm({
  note,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  relatedTo,
  className,
}: NoteFormProps) {
  const isEditing = !!note;
  const [content, setContent] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (note) {
      setContent(note.content);
    } else {
      setContent("");
    }
    setError(null);
  }, [note, isOpen]);

  const validate = (): boolean => {
    if (!content.trim()) {
      setError("Note content is required");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ content: content.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[500px]", className)}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Note" : "Add Note"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your note below."
              : relatedTo
              ? `Add a note about this ${relatedTo.type}: ${relatedTo.name}`
              : "Add a new note."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Write your note here..."
              rows={5}
              disabled={isLoading}
              className={cn(
                "resize-none",
                error && "border-destructive focus-visible:ring-destructive"
              )}
              autoFocus
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Press Cmd+Enter to submit
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Send className="h-4 w-4 mr-2" />
              {isEditing ? "Update Note" : "Add Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
