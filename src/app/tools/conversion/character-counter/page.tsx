"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopy } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function CharacterCounterPage() {
  return (
    <ToolLayout
      title="Compteur de texte"
      description="Comptez facilement le nombre de caractères, mots, phrases et paragraphes dans votre texte."
    >
      <CharacterCounter />
    </ToolLayout>
  );
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(text: string) {
  // Compte les phrases basées sur . ! ? suivis d'un espace ou fin de chaîne
  return (text.match(/[\w\)][.?!](\s|$)/g) || []).length;
}

function countParagraphs(text: string) {
  // Un paragraphe est séparé par deux retours à la ligne ou plus
  return text
    .trim()
    .split(/\n{2,}/)
    .filter((p) => p.trim().length > 0).length;
}

function CharacterCounter() {
  const [input, setInput] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [counts, setCounts] = useState({
    characters: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  });

  const exampleText = `Ceci est un exemple de texte.
Il contient plusieurs phrases. En voici une autre !
Et même un paragraphe supplémentaire.

Voici un nouveau paragraphe pour tester le compteur.`;

  const calculateCounts = (value: string) => {
    setCounts({
      characters: value.length,
      words: countWords(value),
      sentences: countSentences(value),
      paragraphs: countParagraphs(value),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (autoUpdate) {
      calculateCounts(value);
    }
  };

  const handleCount = () => {
    calculateCounts(input);
  };

  const handleCopy = (type: keyof typeof counts) => {
    navigator.clipboard
      .writeText(String(counts[type]))
      .then(() => toast.success("Copié dans le presse-papiers"))
      .catch(() => toast.error("Échec de la copie"));
  };

  const handleExample = () => {
    setInput(exampleText);
    calculateCounts(exampleText);
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-update"
            checked={autoUpdate}
            onCheckedChange={setAutoUpdate}
          />
          <Label htmlFor="auto-update">Mise à jour automatique</Label>
        </div>
        <div className="flex items-center space-x-2">
          {!autoUpdate && (
            <Button onClick={handleCount} size="sm">
              Compter
            </Button>
          )}
          <Button onClick={handleExample} size="sm" variant="outline">
            Exemple
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="text-input">Votre texte</Label>
        <Textarea
          id="text-input"
          placeholder="Saisissez ou collez votre texte ici..."
          value={input}
          onChange={handleInputChange}
          rows={8}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Caractères"
          value={counts.characters}
          onCopy={() => handleCopy("characters")}
        />
        <StatCard
          label="Mots"
          value={counts.words}
          onCopy={() => handleCopy("words")}
        />
        <StatCard
          label="Phrases"
          value={counts.sentences}
          onCopy={() => handleCopy("sentences")}
        />
        <StatCard
          label="Paragraphes"
          value={counts.paragraphs}
          onCopy={() => handleCopy("paragraphs")}
        />
      </div>

      <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
        <p>
          Ce compteur analyse votre texte et affiche le nombre de caractères,
          mots, phrases et paragraphes. Pratique pour la rédaction, le SEO ou la
          limitation de champs de saisie.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: number;
  onCopy: () => void;
}) {
  return (
    <div className="flex flex-col items-center bg-card rounded-md p-4 shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold">{value}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          className="h-6 w-6 p-0"
          aria-label={`Copier le nombre de ${label.toLowerCase()}`}
        >
          <ClipboardCopy className="h-4 w-4" />
        </Button>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}
