"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const UNITS = ["px", "rem", "em", "%", "vw", "vh"] as const;
type Unit = (typeof UNITS)[number];

const TAILWIND_MAP: Record<Unit, (value: number) => string | null> = {
  px: (v) => {
    const allowed = [
      0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20,
      24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
    ];
    if (allowed.includes(v)) return `.${v === 0 ? "0" : v + "px"}`;
    return null;
  },
  rem: (v) => {
    // 1rem = 16px
    const px = v * 16;
    return TAILWIND_MAP.px(px);
  },
  em: (v) => {
    // 1em = 16px (default)
    const px = v * 16;
    return TAILWIND_MAP.px(px);
  },
  "%": (_) => null,
  vw: (v) => {
    if (v === 100) return ".w-screen";
    if (v === 50) return ".w-1/2";
    if (v === 33.333) return ".w-1/3";
    if (v === 25) return ".w-1/4";
    return null;
  },
  vh: (v) => {
    if (v === 100) return ".h-screen";
    if (v === 50) return ".h-1/2";
    return null;
  },
};

function convertAllUnits(value: number, from: Unit) {
  // Basic conversion: px <-> rem/em (1rem = 16px), %/vw/vh arbitrary (100% = 100vw = 100vh = 16px for example)
  // For %/vw/vh, we assume 100% = 100vw = 100vh = 16px (for demonstration, adapt for real context)
  let px: number;
  switch (from) {
    case "px":
      px = value;
      break;
    case "rem":
    case "em":
      px = value * 16;
      break;
    case "%":
    case "vw":
    case "vh":
      px = (value / 100) * 16;
      break;
    default:
      px = value;
  }
  const rem = px / 16;
  const em = px / 16;
  const percent = (px / 16) * 100;
  const vw = (px / 16) * 100;
  const vh = (px / 16) * 100;

  return {
    px,
    rem,
    em,
    "%": percent,
    vw,
    vh,
  };
}

export default function CssUnitConverterPage() {
  const [number, setNumber] = useState<number | "">("");
  const [unit, setUnit] = useState<Unit>("px");
  const [converted, setConverted] = useState<Record<Unit, number>>({} as any);

  const handleConvert = () => {
    if (number === "" || isNaN(Number(number))) {
      toast.warning("Please enter a valid number.");
      setConverted({} as any);
      return;
    }
    const result = convertAllUnits(Number(number), unit);
    setConverted(result as Record<Unit, number>);
    toast.success("Conversion done!");
  };

  const fillExample = () => {
    setNumber(16);
    setUnit("px");
    setConverted({});
    toast.info("Example loaded!");
  };

  return (
    <ToolLayout
      title="CSS & Tailwind Unit Converter"
      description="Enter a value and a unit, get the conversion in all common CSS units and their Tailwind equivalent."
    >
      <div className="grid gap-8">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  CSS & Tailwind Unit Converter
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fillExample}
                  className="h-8 px-2"
                  title="Load example"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Example
                </Button>
              </div>
              <div className="flex flex-col md:flex-row gap-2 items-end">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="number-input">Value</Label>
                  <input
                    id="number-input"
                    type="number"
                    value={number}
                    onChange={(e) =>
                      setNumber(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="font-mono p-2 border rounded"
                    placeholder="16"
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="unit-select">Unit</Label>
                  <select
                    id="unit-select"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as Unit)}
                    className="font-mono p-2 border rounded"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleConvert} disabled={number === ""}>
                  Convert
                </Button>
              </div>
              {converted && Object.keys(converted).length > 0 && (
                <div className="mt-4">
                  <Label>Conversions</Label>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {UNITS.map((u) => (
                      <div key={u} className="flex items-center gap-2">
                        <span className="w-16 font-mono">{u}</span>
                        <span className="font-mono">
                          {converted[u] !== undefined
                            ? Number.isInteger(converted[u])
                              ? converted[u]
                              : converted[u].toFixed(4)
                            : "-"}
                          {u}
                        </span>
                        <span className="text-gray-400">|</span>
                        <span className="font-mono text-green-700">
                          {TAILWIND_MAP[u](converted[u]) || (
                            <span className="text-gray-400">-</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    <span>
                      * %/vw/vh conversions are based on 16px = 100%/100vw/100vh
                      (example, adapt for real context).
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
