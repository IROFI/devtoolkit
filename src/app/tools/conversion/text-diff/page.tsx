"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

// Simple diff ligne à ligne (retourne un tableau d'objets {type: 'added'|'removed'|'unchanged', value: string})
function diffLines(a: string, b: string) {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const result: { type: "added" | "removed" | "unchanged"; value: string }[] =
    [];
  let i = 0,
    j = 0;
  while (i < aLines.length || j < bLines.length) {
    if (i < aLines.length && j < bLines.length && aLines[i] === bLines[j]) {
      result.push({ type: "unchanged", value: aLines[i] });
      i++;
      j++;
    } else if (
      j < bLines.length &&
      (i >= aLines.length || !aLines.slice(i).includes(bLines[j]))
    ) {
      result.push({ type: "added", value: bLines[j] });
      j++;
    } else if (
      i < aLines.length &&
      (j >= bLines.length || !bLines.slice(j).includes(aLines[i]))
    ) {
      result.push({ type: "removed", value: aLines[i] });
      i++;
    } else {
      result.push({ type: "removed", value: aLines[i] });
      result.push({ type: "added", value: bLines[j] });
      i++;
      j++;
    }
  }
  return result;
}

const EXAMPLE_A = `Bonjour,
Voici un exemple de texte.
Il contient plusieurs lignes.
Certaines lignes seront modifiées.`;

const EXAMPLE_B = `Bonjour,
Voici un exemple de texte modifié.
Il contient plusieurs lignes.
Certaines lignes ont été modifiées.
Et une ligne ajoutée !`;

export default function TextDiffPage() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<ReturnType<typeof diffLines> | null>(null);

  const handleCompare = () => {
    setDiff(diffLines(textA, textB));
  };

  const handleExample = () => {
    setTextA(EXAMPLE_A);
    setTextB(EXAMPLE_B);
    setDiff(diffLines(EXAMPLE_A, EXAMPLE_B));
  };

  return (
    <ToolLayout
      title="Comparateur de texte (Diff)"
      description="Comparez deux textes et visualisez les différences ligne par ligne, à la manière de GitHub."
    >
      <div className="grid gap-6 mt-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="text-a">Texte A</Label>
            <Textarea
              id="text-a"
              placeholder="Collez ou saisissez le premier texte..."
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              rows={8}
              className="font-mono text-sm resize-none"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text-b">Texte B</Label>
            <Textarea
              id="text-b"
              placeholder="Collez ou saisissez le second texte..."
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              rows={8}
              className="font-mono text-sm resize-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCompare}>Comparer</Button>
          <Button variant="secondary" onClick={handleExample}>
            Exemple
          </Button>
        </div>
        {diff && (
          <div className="mt-4 border rounded-md bg-muted/50 overflow-auto">
            <pre className="text-sm font-mono p-4 whitespace-pre-wrap">
              {diff.map((line, idx) => {
                if (line.type === "added") {
                  return (
                    <div
                      key={idx}
                      className="bg-green-100 text-green-800 px-2 rounded"
                    >
                      <span className="select-none">+ </span>
                      {line.value}
                    </div>
                  );
                }
                if (line.type === "removed") {
                  return (
                    <div
                      key={idx}
                      className="bg-red-100 text-red-800 px-2 rounded"
                    >
                      <span className="select-none">- </span>
                      {line.value}
                    </div>
                  );
                }
                return (
                  <div key={idx} className="px-2">
                    <span className="select-none">&nbsp; </span>
                    {line.value}
                  </div>
                );
              })}
            </pre>
          </div>
        )}
        <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
          <p>
            <strong>Comparateur de texte</strong> : visualisez les différences
            entre deux textes. Les lignes supprimées sont en{" "}
            <span className="text-red-700">rouge</span>, les lignes ajoutées en{" "}
            <span className="text-green-700">vert</span>.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
