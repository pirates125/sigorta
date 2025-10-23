"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Lock, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    role: string;
  };
}

interface QuoteNotesProps {
  quoteId: string;
  isAdminOrBroker: boolean;
}

export function QuoteNotes({ quoteId, isAdminOrBroker }: QuoteNotesProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isInternal, setIsInternal] = useState(true);

  useEffect(() => {
    loadNotes();
  }, [quoteId]);

  const loadNotes = async () => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/notes`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Load notes error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/quotes/${quoteId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newNote,
          isInternal: isAdminOrBroker && isInternal,
        }),
      });

      if (!response.ok) throw new Error("Not eklenemedi");

      const data = await response.json();
      setNotes([data.note, ...notes]);
      setNewNote("");
      toast.success("Not eklendi! ✅");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Notlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Yükleniyor...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Notlar ({notes.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Not Ekleme Formu */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Not ekle..."
            rows={3}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            {isAdminOrBroker && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded"
                />
                <Lock className="h-3 w-3" />
                İç not (sadece admin/broker görür)
              </label>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={submitting || !newNote.trim()}
              className="ml-auto"
            >
              <Send className="h-3 w-3 mr-2" />
              {submitting ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </div>
        </form>

        {/* Notlar Listesi */}
        <div className="space-y-3 mt-4">
          {notes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Henüz not eklenmemiş
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="border rounded-lg p-3 space-y-2 bg-muted/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {note.user.name || "İsimsiz"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {note.user.role}
                    </Badge>
                    {note.isInternal && (
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="h-2 w-2 mr-1" />
                        İç Not
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.createdAt).toLocaleString("tr-TR")}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
