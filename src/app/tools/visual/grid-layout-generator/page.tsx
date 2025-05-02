"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardCopy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function GridLayoutGeneratorPage() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(16);
  const [columnTemplate, setColumnTemplate] = useState("1fr 1fr 1fr");
  const [rowTemplate, setRowTemplate] = useState("auto auto");

  // Génère le CSS grid
  const gridCss = `
display: grid;
grid-template-columns: ${columnTemplate};
grid-template-rows: ${rowTemplate};
gap: ${gap}px;`.trim();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${label} copié dans le presse-papier`);
      })
      .catch(() => {
        toast.error("Erreur lors de la copie");
      });
  };

  // Met à jour automatiquement les templates si le nombre de colonnes/lignes change
  const handleColumnsChange = (value: number) => {
    setColumns(value);
    setColumnTemplate(Array(value).fill("1fr").join(" "));
  };
  const handleRowsChange = (value: number) => {
    setRows(value);
    setRowTemplate(Array(value).fill("auto").join(" "));
  };

  return (
    <ToolLayout
      title="Générateur de grid layout"
      description="Générez facilement la propriété CSS grid. Ajustez les paramètres et copiez le CSS."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Label className="mb-1 w-32">Colonnes</Label>
              <Input
                type="number"
                min={1}
                value={columns}
                onChange={(e) => handleColumnsChange(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Label className="mb-1 w-32">Lignes</Label>
              <Input
                type="number"
                min={1}
                value={rows}
                onChange={(e) => handleRowsChange(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Label className="mb-1 w-32">Gap (px)</Label>
              <Input
                type="number"
                min={0}
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Label className="mb-1 w-32">Template colonnes</Label>
              <Input
                value={columnTemplate}
                onChange={(e) => setColumnTemplate(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Label className="mb-1 w-32">Template lignes</Label>
              <Input
                value={rowTemplate}
                onChange={(e) => setRowTemplate(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm mb-2 block">CSS du grid</Label>
            <div className="flex items-center gap-2">
              <Input value={gridCss} readOnly className="font-mono text-xs" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(gridCss, "CSS")}
              >
                <ClipboardCopy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Label className="text-sm mb-2 block">Aperçu du grid</Label>
              <div
                className="w-full h-64 rounded border flex items-center justify-center overflow-auto"
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  display: "grid",
                  gridTemplateColumns: columnTemplate,
                  gridTemplateRows: rowTemplate,
                  gap: `${gap}px`,
                  minHeight: "200px",
                }}
              >
                {Array.from({ length: columns * rows }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#f3f4f6",
                      border: "1px solid #d1d5db",
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: "#6b7280",
                      height: "100%",
                      minHeight: 40,
                    }}
                  >
                    Cellule {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
