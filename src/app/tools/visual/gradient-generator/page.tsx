"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardCopy, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

export default function GradientGeneratorPage() {
  const [colors, setColors] = useState<string[]>(["#3b82f6", "#f472b6"]);
  const [angle, setAngle] = useState(90);

  const gradientCss = `linear-gradient(${angle}deg, ${colors.join(", ")})`;

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

  const handleColorChange = (idx: number, value: string) => {
    setColors((prev) => prev.map((c, i) => (i === idx ? value : c)));
  };

  const addColor = () => {
    setColors((prev) => [...prev, "#ffffff"]);
  };

  const removeColor = (idx: number) => {
    if (colors.length <= 2) return;
    setColors((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <ToolLayout
      title="Générateur de dégradé"
      description="Générez un dégradé linéaire entre autant de couleurs que vous souhaitez. Copiez le CSS du gradient."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-8">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-center gap-4"
              >
                <Label className="mb-1">{`Couleur ${idx + 1}`}</Label>
                <HexColorPicker
                  color={color}
                  onChange={(val) => handleColorChange(idx, val)}
                  style={{ width: "100%", maxWidth: "200px" }}
                />
                <Input
                  value={color}
                  onChange={(e) => handleColorChange(idx, e.target.value)}
                  className="font-mono text-center mt-2"
                />
                {colors.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColor(idx)}
                    title="Supprimer cette couleur"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-fit self-center"
              onClick={addColor}
              title="Ajouter une couleur"
            >
              <Plus className="h-4 w-4 mr-1" /> Ajouter une couleur
            </Button>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Label>Angle du dégradé (degrés)</Label>
            <Input
              type="number"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-32"
            />
          </div>
          <div>
            <Label className="text-sm mb-2 block">CSS du dégradé</Label>
            <div className="flex items-center gap-2">
              <Input
                value={`background: ${gradientCss};`}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  copyToClipboard(`background: ${gradientCss};`, "CSS")
                }
              >
                <ClipboardCopy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Label className="text-sm mb-2 block">Aperçu du dégradé</Label>
              <div
                className="w-full h-32 rounded shadow"
                style={{
                  background: gradientCss,
                  border: "1px solid #e5e7eb",
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
