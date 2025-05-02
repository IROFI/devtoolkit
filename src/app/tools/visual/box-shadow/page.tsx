"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardCopy } from "lucide-react";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

export default function BoxShadowGeneratorPage() {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(16);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#00000088");
  const [inset, setInset] = useState(false);

  const boxShadowCss = `${
    inset ? "inset " : ""
  }${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;

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
      title="Box-shadow Generator"
      description="Easily generate the CSS box-shadow property. Adjust parameters and copy the CSS."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Label className="mb-1 w-32">Offset X (px)</Label>
              <Input
                type="number"
                value={offsetX}
                onChange={(e) => setOffsetX(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Label className="mb-1 w-32">Offset Y (px)</Label>
              <Input
                type="number"
                value={offsetY}
                onChange={(e) => setOffsetY(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Label className="mb-1 w-32">Blur (px)</Label>
              <Input
                type="number"
                min={0}
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Label className="mb-1 w-32">Spread (px)</Label>
              <Input
                type="number"
                value={spread}
                onChange={(e) => setSpread(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Label className="mb-1 w-32">Color</Label>
              <HexColorPicker
                color={color}
                onChange={setColor}
                style={{ width: "100%", maxWidth: "200px" }}
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="font-mono text-center mt-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="inset"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
              />
              <Label htmlFor="inset" className="mb-0">
                Inset
              </Label>
            </div>
          </div>
          <div>
            <Label className="text-sm mb-2 block">Box-shadow CSS</Label>
            <div className="flex items-center gap-2">
              <Input
                value={`box-shadow: ${boxShadowCss};`}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  copyToClipboard(`box-shadow: ${boxShadowCss};`, "CSS")
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
              <Label className="text-sm mb-2 block">Box-shadow preview</Label>
              <div
                className="w-full h-32 rounded shadow flex items-center justify-center"
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  boxShadow: boxShadowCss,
                }}
              >
                <span className="text-xs text-gray-500">Box</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
