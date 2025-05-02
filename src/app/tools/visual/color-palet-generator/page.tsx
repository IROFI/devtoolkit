"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardCopy } from "lucide-react";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
};

const rgbToHsl = (
  red: number,
  green: number,
  blue: number
): { h: number; s: number; l: number } => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
};

const generatePalette = (baseHex: string) => {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const steps = [-30, -15, 0, 15, 30];
  return steps.map((delta, idx) => {
    const l = Math.max(0, Math.min(100, hsl.l + delta));
    const hex = hslToHex(hsl.h, hsl.s, l);
    const rgbVal = hexToRgb(hex)!;
    return {
      key: idx,
      hex,
      rgb: `rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`,
      hsl: `hsl(${hsl.h}deg, ${hsl.s}%, ${l}%)`,
    };
  });
};

export default function ColorPaletteGeneratorPage() {
  const [color, setColor] = useState("#3b82f6");
  const [palette, setPalette] = useState<
    { key: number; hex: string; rgb: string; hsl: string }[]
  >([]);

  useEffect(() => {
    setPalette(generatePalette(color));
  }, [color]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${label} copied to clipboard`);
      })
      .catch(() => {
        toast.error("Copy error");
      });
  };

  return (
    <ToolLayout
      title="Palette Generator"
      description="Generate a color palette from a base color. Copy HEX, RGB, HSL formats."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <HexColorPicker
              color={color}
              onChange={setColor}
              style={{ width: "100%", maxWidth: "350px" }}
            />
            <div className="flex w-full max-w-[350px] mt-4">
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="font-mono text-center"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm mb-2 block">Generated palette</Label>
            <div className="grid grid-cols-1 gap-4">
              {palette.map((swatch) => (
                <Card key={swatch.key}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      className="w-12 h-12 rounded shadow"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">
                          HEX
                        </Label>
                        <Input
                          value={swatch.hex}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(swatch.hex, "HEX")}
                        >
                          <ClipboardCopy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">
                          RGB
                        </Label>
                        <Input
                          value={swatch.rgb}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(swatch.rgb, "RGB")}
                        >
                          <ClipboardCopy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">
                          HSL
                        </Label>
                        <Input
                          value={swatch.hsl}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(swatch.hsl, "HSL")}
                        >
                          <ClipboardCopy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Label className="text-sm mb-2 block">Palette preview</Label>
              <div className="flex gap-2">
                {palette.map((swatch) => (
                  <div
                    key={swatch.key}
                    className="flex-1 h-16 rounded"
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
