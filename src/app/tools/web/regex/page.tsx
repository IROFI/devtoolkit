"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardCopy, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Exemples prédéfinis
const EXAMPLES = [
  {
    regex: "\\b\\w+@\\w+\\.\\w+\\b",
    flags: "g",
    text: "Contactez-nous à test@example.com ou admin@site.org.",
    description: "Adresse email",
  },
  {
    regex: "\\d{4}-\\d{2}-\\d{2}",
    flags: "",
    text: "La date du jour est 2024-06-01.",
    description: "Date au format YYYY-MM-DD",
  },
  {
    regex: "(https?://\\S+)",
    flags: "g",
    text: "Visitez https://github.com ou http://example.com.",
    description: "URL",
  },
];

export default function RegexTesterPage() {
  const [regex, setRegex] = useState("");
  const [flags, setFlags] = useState("");
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<RegExpMatchArray | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Met à jour le résultat à chaque changement
  useEffect(() => {
    if (!regex) {
      setMatches(null);
      setError(null);
      return;
    }
    try {
      const re = new RegExp(regex, flags);
      const result = text.match(re);
      setMatches(result);
      setError(null);
    } catch (e: any) {
      setMatches(null);
      setError(e.message);
    }
  }, [regex, flags, text]);

  // Génère un exemple aléatoire
  const generateExample = () => {
    const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    setRegex(ex.regex);
    setFlags(ex.flags);
    setText(ex.text);
    toast.info(`Exemple : ${ex.description}`);
  };

  // Copier dans le presse-papier
  const copyToClipboard = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success("Copié dans le presse-papier"))
      .catch(() => toast.error("Erreur lors de la copie"));
  };

  return (
    <ToolLayout
      title="Testeur de Regex"
      description="Testez vos expressions régulières en temps réel. Saisissez une regex, un texte, et voyez les correspondances."
    >
      <div className="grid gap-8">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Testeur d'expressions régulières
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateExample}
                  className="h-8 px-2"
                  title="Générer un exemple"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Générer un exemple
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="regex-input">Expression régulière</Label>
                <div className="flex gap-2">
                  <Input
                    id="regex-input"
                    type="text"
                    placeholder="Ex: \\d{4}-\\d{2}-\\d{2}"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                    className="font-mono"
                  />
                  <Input
                    id="flags-input"
                    type="text"
                    placeholder="flags"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    className="w-20 font-mono"
                    maxLength={5}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="text-input">Texte à tester</Label>
                <Input
                  id="text-input"
                  type="text"
                  placeholder="Saisissez le texte à tester..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(regex)}
                  className="h-6 px-2 text-xs mr-2"
                >
                  <ClipboardCopy className="h-3 w-3 mr-1" />
                  Copier la regex
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(text)}
                  className="h-6 px-2 text-xs"
                >
                  <ClipboardCopy className="h-3 w-3 mr-1" />
                  Copier le texte
                </Button>
              </div>
              <div>
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    Erreur : {error}
                  </div>
                )}
                {!error && regex && (
                  <div className="mt-4">
                    <Label>Résultat :</Label>
                    {matches ? (
                      <div className="p-2 bg-muted rounded font-mono text-sm">
                        {matches.length === 0 ? (
                          "Aucune correspondance"
                        ) : (
                          <ul className="list-disc pl-5">
                            {matches.map((m, i) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <div className="p-2 text-muted-foreground text-sm">
                        Aucune correspondance
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
