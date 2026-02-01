"use client";

import * as React from "react";
import { Send, Paperclip, Smile, X, Image as ImageIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ChatInputProps {
  onSend: (content: string, file?: File | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const emojis = [
  "👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🎉",
  "🔥", "👏", "🤔", "😊", "🙌", "💯", "✅", "❌",
];

export function ChatInput({
  onSend,
  isLoading = false,
  disabled = false,
  placeholder = "Type a message...",
  className,
}: ChatInputProps) {
  const [content, setContent] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleSend = () => {
    if ((!content.trim() && !selectedFile) || isLoading || disabled) return;

    onSend(content.trim(), selectedFile);
    setContent("");
    setSelectedFile(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = selectedFile?.type.startsWith('image/');

  return (
    <div className={cn("border-t bg-card p-4", className)}>
      {/* Selected File Preview */}
      {selectedFile && (
        <div className="flex items-center gap-3 mb-3 p-3 bg-muted rounded-lg">
          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
            {isImage ? (
              <ImageIcon className="h-5 w-5 text-[#D4AF37]" />
            ) : (
              <FileText className="h-5 w-5 text-[#D4AF37]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => setSelectedFile(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* File Attachment */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || disabled || !!selectedFile}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Emoji Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 flex-shrink-0"
              disabled={isLoading || disabled}
            >
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Text Input */}
        <div className="flex-1 min-w-0">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            rows={1}
            className="min-h-[44px] max-h-[120px] resize-none py-2.5"
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={(!content.trim() && !selectedFile) || isLoading || disabled}
          className="h-10 w-10 p-0 flex-shrink-0 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
