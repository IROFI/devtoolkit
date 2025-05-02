"use client";

import React, { useState, useCallback } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

// Type for JSON value
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export default function JsonFormatterPage() {
  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, beautify, and minify JSON data with syntax highlighting and validation."
    >
      <Tabs defaultValue="beautify">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="beautify">Beautify</TabsTrigger>
          <TabsTrigger value="minify">Minify</TabsTrigger>
        </TabsList>
        <TabsContent value="beautify">
          <JsonBeautifier />
        </TabsContent>
        <TabsContent value="minify">
          <JsonMinifier />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}

function JsonBeautifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indentation, setIndentation] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);

  const formatJson = useCallback(() => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      // Parse the JSON to validate it
      const jsonObject = JSON.parse(input);

      // Format with the specified indentation
      let formattedJson = "";
      if (sortKeys) {
        // Custom sorting of keys
        const sortObject = (obj: JsonValue): JsonValue => {
          if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
            return Object.keys(obj)
              .sort()
              .reduce((result: Record<string, JsonValue>, key) => {
                const value = obj[key];
                result[key] = sortObject(value);
                return result;
              }, {});
          }

          if (Array.isArray(obj)) {
            return obj.map(item => sortObject(item));
          }

          return obj;
        };

        const sortedObj = sortObject(jsonObject);
        formattedJson = JSON.stringify(sortedObj, null, indentation);
      } else {
        // Regular formatting without sorting
        formattedJson = JSON.stringify(jsonObject, null, indentation);
      }

      setOutput(formattedJson);
    } catch (err) {
      console.error("JSON parsing error:", err);
      setError(err instanceof Error ? err.message : "Invalid JSON. Please check your input.");
    }
  }, [input, indentation, sortKeys]);

  const copyToClipboard = () => {
    if (!output) return;

    navigator.clipboard.writeText(output)
      .then(() => {
        toast.success("Formatted JSON copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const loadSampleJson = () => {
    const sampleJson = JSON.stringify({
      name: "DevToolkit",
      version: "1.0.0",
      description: "A collection of useful developer tools",
      features: [
        "JSON Formatter",
        "Base64 Encoder/Decoder",
        "URL Encoder/Decoder",
        "Hash Generator"
      ],
      settings: {
        theme: "dark",
        language: "en",
        notification: true
      },
      isOpenSource: true
    });

    setInput(sampleJson);
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-4">
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex items-center space-x-2">
            <Label htmlFor="indentation">Indentation: {indentation} spaces</Label>
            <Slider
              id="indentation"
              value={[indentation]}
              min={1}
              max={8}
              step={1}
              onValueChange={(value) => setIndentation(value[0])}
              className="w-32"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="sort-keys"
              checked={sortKeys}
              onCheckedChange={setSortKeys}
            />
            <Label htmlFor="sort-keys">Sort Keys Alphabetically</Label>
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="json-input">JSON Input</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSampleJson}
                className="h-8 px-2"
              >
                Load Sample
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={formatJson}
                className="h-8 px-2"
              >
                Format
              </Button>
            </div>
          </div>
          <Textarea
            id="json-input"
            placeholder="Paste JSON here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="font-mono text-sm resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="formatted-output">Formatted JSON</Label>
          {output && (
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 px-2"
            >
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          )}
        </div>
        <Textarea
          id="formatted-output"
          readOnly
          value={output}
          rows={10}
          className="font-mono text-sm resize-none"
          placeholder="Formatted JSON will appear here..."
        />
      </div>

      <Card className="p-4">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Adjust the indentation level for readability.</li>
            <li>Sort keys alphabetically for consistent ordering.</li>
            <li>Use the copy button to quickly copy the formatted output.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

function JsonMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const minifyJson = useCallback(() => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      // Parse the JSON to validate it
      const jsonObject = JSON.parse(input);

      // Minify by using null for replacer and 0 for spaces
      const minifiedJson = JSON.stringify(jsonObject);

      setOutput(minifiedJson);
    } catch (err) {
      console.error("JSON parsing error:", err);
      setError(err instanceof Error ? err.message : "Invalid JSON. Please check your input.");
    }
  }, [input]);

  const copyToClipboard = () => {
    if (!output) return;

    navigator.clipboard.writeText(output)
      .then(() => {
        toast.success("Minified JSON copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const loadSampleJson = () => {
    const sampleJson = JSON.stringify({
      name: "DevToolkit",
      version: "1.0.0",
      description: "A collection of useful developer tools",
      features: [
        "JSON Formatter",
        "Base64 Encoder/Decoder",
        "URL Encoder/Decoder",
        "Hash Generator"
      ],
      settings: {
        theme: "dark",
        language: "en",
        notification: true
      },
      isOpenSource: true
    }, null, 2);

    setInput(sampleJson);
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="json-input">JSON Input</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSampleJson}
              className="h-8 px-2"
            >
              Load Sample
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={minifyJson}
              className="h-8 px-2"
            >
              Minify
            </Button>
          </div>
        </div>
        <Textarea
          id="json-input"
          placeholder="Paste JSON here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          className="font-mono text-sm resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="minified-output">Minified JSON</Label>
          {output && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {output.length.toLocaleString()} characters
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 px-2"
              >
                <ClipboardCopy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          )}
        </div>
        <Textarea
          id="minified-output"
          readOnly
          value={output}
          rows={10}
          className="font-mono text-sm resize-none"
          placeholder="Minified JSON will appear here..."
        />
      </div>

      <Card className="p-4">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Benefits of Minified JSON:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Reduced file size for faster transmission over networks</li>
            <li>Lower storage requirements</li>
            <li>Optimal for production environments and APIs</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
