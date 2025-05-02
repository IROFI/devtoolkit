"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LoremIpsumGeneratorPage() {
  return (
    <ToolLayout
      title="Générateur de Lorem Ipsum"
      description="Générez facilement du texte factice pour vos maquettes et prototypes."
    >
      <LoremIpsumGenerator />
    </ToolLayout>
  );
}

const BASE_PARAGRAPH = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.`;

function splitIntoSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g) || [];
}

function splitIntoWords(text: string): string[] {
  return text
    .replace(/[.,!?;]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function generateLoremIpsum(
  mode: "paragraphs" | "words" | "sentences",
  count: number
): string {
  if (mode === "paragraphs") {
    return Array.from({ length: count }, () => BASE_PARAGRAPH).join("\n\n");
  }
  if (mode === "sentences") {
    const sentences = splitIntoSentences(BASE_PARAGRAPH);
    let result: string[] = [];
    while (result.length < count) {
      result = result.concat(sentences);
    }
    return result.slice(0, count).join(" ");
  }
  // mode === "words"
  const words = splitIntoWords(BASE_PARAGRAPH);
  let result: string[] = [];
  while (result.length < count) {
    result = result.concat(words);
  }
  return result.slice(0, count).join(" ") + ".";
}

function LoremIpsumGenerator() {
  const [mode, setMode] = useState<"paragraphs" | "words" | "sentences">(
    "paragraphs"
  );
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState(generateLoremIpsum("paragraphs", 3));
  const [autoUpdate, setAutoUpdate] = useState(true);

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as "paragraphs" | "words" | "sentences";
    setMode(newMode);
    if (autoUpdate) {
      setOutput(generateLoremIpsum(newMode, count));
    }
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(100, Number(e.target.value) || 1));
    setCount(value);
    if (autoUpdate) {
      setOutput(generateLoremIpsum(mode, value));
    }
  };

  const handleGenerate = () => {
    setOutput(generateLoremIpsum(mode, count));
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(output)
      .then(() => toast.success("Texte copié dans le presse-papiers"))
      .catch(() => toast.error("Échec de la copie"));
  };

  const handleExample = () => {
    setMode("paragraphs");
    setCount(3);
    setOutput(generateLoremIpsum("paragraphs", 3));
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
            <Button onClick={handleGenerate} size="sm">
              Générer
            </Button>
          )}
          <Button onClick={handleExample} size="sm" variant="outline">
            Exemple
          </Button>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="mode-select">Mode</Label>
          <select
            id="mode-select"
            value={mode}
            onChange={handleModeChange}
            className="border rounded px-2 py-1"
          >
            <option value="paragraphs">Paragraphes</option>
            <option value="words">Mots</option>
            <option value="sentences">Phrases</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="count-input">
            {mode === "paragraphs"
              ? "Nombre de paragraphes"
              : mode === "words"
              ? "Nombre de mots"
              : "Nombre de phrases"}
          </Label>
          <input
            id="count-input"
            type="number"
            min={1}
            max={mode === "paragraphs" ? 20 : 100}
            value={count}
            onChange={handleCountChange}
            className="w-32 border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="output-textarea">Texte généré</Label>
        <Textarea
          id="output-textarea"
          value={output}
          readOnly
          rows={8}
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
            aria-label="Copier le texte généré"
          >
            <ClipboardCopy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
        <p>
          Utilisez ce générateur pour obtenir rapidement du texte factice (Lorem
          Ipsum) à insérer dans vos maquettes, prototypes ou tests de mise en
          page. Choisissez le nombre de paragraphes, de mots ou de phrases à
          générer.
        </p>
      </div>
    </div>
  );
}
