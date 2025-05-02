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

function generateLoremIpsum(paragraphs: number): string {
  const base = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.`;
  return Array.from({ length: paragraphs }, () => base).join("\n\n");
}

function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState(generateLoremIpsum(3));
  const [autoUpdate, setAutoUpdate] = useState(true);

  const handleParagraphsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(20, Number(e.target.value) || 1));
    setParagraphs(value);
    if (autoUpdate) {
      setOutput(generateLoremIpsum(value));
    }
  };

  const handleGenerate = () => {
    setOutput(generateLoremIpsum(paragraphs));
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(output)
      .then(() => toast.success("Texte copié dans le presse-papiers"))
      .catch(() => toast.error("Échec de la copie"));
  };

  const handleExample = () => {
    setParagraphs(3);
    setOutput(generateLoremIpsum(3));
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

      <div className="grid gap-2">
        <Label htmlFor="paragraphs-input">Nombre de paragraphes</Label>
        <input
          id="paragraphs-input"
          type="number"
          min={1}
          max={20}
          value={paragraphs}
          onChange={handleParagraphsChange}
          className="w-24 border rounded px-2 py-1"
        />
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
          page.
        </p>
      </div>
    </div>
  );
}
