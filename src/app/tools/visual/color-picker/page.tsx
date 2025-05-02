"use client";

import React, { useState, useEffect } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { ToolLayout } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// Function to convert hex to RGB
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

// Function to convert RGB to HSL
const rgbToHsl = (red: number, green: number, blue: number): { h: number; s: number; l: number } => {
  // Normalize RGB values to 0-1 range
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

export default function ColorPickerPage() {
  const [color, setColor] = useState("#3b82f6");
  const [rgbValues, setRgbValues] = useState({ r: 59, g: 130, b: 246 });
  const [hslValues, setHslValues] = useState({ h: 217, s: 91, l: 60 });

  // Update RGB and HSL when color changes
  useEffect(() => {
    const rgb = hexToRgb(color);
    if (rgb) {
      setRgbValues(rgb);
      setHslValues(rgbToHsl(rgb.r, rgb.g, rgb.b));
    }
  }, [color]);

  // Function to copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`${label} copied to clipboard`);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const colorFormats = [
    {
      label: "HEX",
      value: color,
      copy: () => copyToClipboard(color, "HEX color"),
    },
    {
      label: "RGB",
      value: `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`,
      copy: () => copyToClipboard(`rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`, "RGB color"),
    },
    {
      label: "HSL",
      value: `hsl(${hslValues.h}deg, ${hslValues.s}%, ${hslValues.l}%)`,
      copy: () => copyToClipboard(`hsl(${hslValues.h}deg, ${hslValues.s}%, ${hslValues.l}%)`, "HSL color"),
    },
  ];

  return (
    <ToolLayout
      title="Color Picker"
      description="Pick colors and get their HEX, RGB, and HSL values. Copy formats to clipboard."
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
              <div className="flex-1">
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="font-mono text-center"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {colorFormats.map((format) => (
              <div key={format.label} className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">{format.label}</Label>
                  <div className="flex">
                    <Input
                      value={format.value}
                      readOnly
                      className="flex-1 font-mono text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={format.copy}
                      className="h-10 w-10"
                    >
                      <ClipboardCopy className="h-4 w-4" />
                      <span className="sr-only">Copy {format.label}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="preview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                  <div
                    className="w-full h-32 rounded-lg"
                    style={{ backgroundColor: color }}
                  />

                  <div className="flex gap-2 flex-wrap">
                    <div
                      className="h-12 w-12 rounded-full shadow-md"
                      style={{ backgroundColor: color }}
                    />
                    <div
                      className="h-12 w-20 rounded-md shadow-md"
                      style={{ backgroundColor: color }}
                    />
                    <div
                      className="h-12 flex-1 rounded-md shadow-md flex items-center justify-center"
                      style={{ backgroundColor: color, color: hslValues.l > 50 ? "#000" : "#fff" }}
                    >
                      <span className="font-medium">Sample Text</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <div
                    className="w-full h-20 rounded-md"
                    style={{ backgroundColor: `rgba(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}, 0.25)` }}
                  />
                  <Label className="text-xs text-center block">25%</Label>
                </div>
                <div className="space-y-1">
                  <div
                    className="w-full h-20 rounded-md"
                    style={{ backgroundColor: `rgba(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}, 0.5)` }}
                  />
                  <Label className="text-xs text-center block">50%</Label>
                </div>
                <div className="space-y-1">
                  <div
                    className="w-full h-20 rounded-md"
                    style={{ backgroundColor: `rgba(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}, 0.75)` }}
                  />
                  <Label className="text-xs text-center block">75%</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="css" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Background Color</Label>
                      <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {`background-color: ${color};`}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Border Color</Label>
                      <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {`border-color: ${color};`}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Text Color</Label>
                      <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {`color: ${color};`}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Using RGB</Label>
                      <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {`color: rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b});`}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Using RGBA (with opacity)</Label>
                      <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {`color: rgba(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}, 0.5);`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tailwind" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Using Arbitrary Values</Label>
                      <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {`bg-[${color}]`}
                      </div>
                      <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {`text-[${color}]`}
                      </div>
                      <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {`border-[${color}]`}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">With Opacity</Label>
                      <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {`bg-[${color}]/50`}
                      </div>
                      <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {`text-[${color}]/75`}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Add these arbitrary values to your tailwind.config.js for reuse or use the closest Tailwind color.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolLayout>
  );
}
