"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import yaml from "js-yaml";
import { ClipboardCopy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function JsonYamlConverterPage() {
  return (
    <ToolLayout
      title="JSON ↔ YAML Converter"
      description="Convert between JSON and YAML formats instantly."
    >
      <Tabs defaultValue="json-to-yaml">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-yaml">JSON to YAML</TabsTrigger>
          <TabsTrigger value="yaml-to-json">YAML to JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="json-to-yaml">
          <JsonToYaml />
        </TabsContent>
        <TabsContent value="yaml-to-json">
          <YamlToJson />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}

function JsonToYaml() {
  const [json, setJson] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");
  const [error, setError] = useState("");
  const [isPretty, setIsPretty] = useState(true);

  const convertJsonToYaml = useCallback(() => {
    setError("");
    setYamlOutput("");

    if (!json.trim()) {
      return;
    }

    try {
      const jsonObj = JSON.parse(json);

      const yamlResult = yaml.dump(jsonObj, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: isPretty,
      });

      setYamlOutput(yamlResult);
    } catch (err) {
      console.error("JSON to YAML conversion error:", err);
      setError(err instanceof Error ? err.message : "Invalid JSON format");
    }
  }, [json, isPretty]);

  useEffect(() => {
    if (json) {
      convertJsonToYaml();
    }
  }, [json, convertJsonToYaml]);

  const copyToClipboard = () => {
    if (!yamlOutput) return;

    navigator.clipboard
      .writeText(yamlOutput)
      .then(() => {
        toast.success("YAML copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const loadSampleJson = () => {
    const sampleJson = JSON.stringify(
      {
        name: "DevToolkit",
        version: "1.0.0",
        description: "A collection of useful developer tools",
        features: [
          "JSON ↔ YAML Converter",
          "Base64 Encoder/Decoder",
          "URL Encoder/Decoder",
          "Hash Generator",
        ],
        settings: {
          theme: "dark",
          language: "en",
          notification: true,
        },
        isOpenSource: true,
      },
      null,
      2
    );

    setJson(sampleJson);
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="json-input">JSON Input</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSampleJson}
            className="h-8 px-2"
          >
            Load Sample
          </Button>
        </div>
        <Textarea
          id="json-input"
          placeholder="Paste JSON here..."
          value={json}
          onChange={(e) => setJson(e.target.value)}
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
          <Label htmlFor="yaml-output">YAML Output</Label>
          {yamlOutput && (
            <div className="flex space-x-2">
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
          id="yaml-output"
          readOnly
          value={yamlOutput}
          rows={10}
          className="font-mono text-sm resize-none"
          placeholder="YAML output will appear here..."
        />
      </div>
    </div>
  );
}

function YamlToJson() {
  const [yamlInput, setYamlInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState("");
  const [isPretty, setIsPretty] = useState(true);

  const convertYamlToJson = useCallback(() => {
    setError("");
    setJsonOutput("");

    if (!yamlInput.trim()) {
      return;
    }

    try {
      const yamlObj = yaml.load(yamlInput);

      const jsonResult = JSON.stringify(yamlObj, null, isPretty ? 2 : 0);

      setJsonOutput(jsonResult);
    } catch (err) {
      console.error("YAML to JSON conversion error:", err);
      setError(err instanceof Error ? err.message : "Invalid YAML format");
    }
  }, [yamlInput, isPretty]);

  useEffect(() => {
    if (yamlInput) {
      convertYamlToJson();
    }
  }, [yamlInput, convertYamlToJson]);

  const copyToClipboard = () => {
    if (!jsonOutput) return;

    navigator.clipboard
      .writeText(jsonOutput)
      .then(() => {
        toast.success("JSON copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const loadSampleYaml = () => {
    const sampleYaml = `name: DevToolkit
version: 1.0.0
description: A collection of useful developer tools
features:
  - JSON ↔ YAML Converter
  - Base64 Encoder/Decoder
  - URL Encoder/Decoder
  - Hash Generator
settings:
  theme: dark
  language: en
  notification: true
isOpenSource: true`;

    setYamlInput(sampleYaml);
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="yaml-input">YAML Input</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSampleYaml}
            className="h-8 px-2"
          >
            Load Sample
          </Button>
        </div>
        <Textarea
          id="yaml-input"
          placeholder="Paste YAML here..."
          value={yamlInput}
          onChange={(e) => setYamlInput(e.target.value)}
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
          <Label htmlFor="json-output">JSON Output</Label>
          {jsonOutput && (
            <div className="flex space-x-2">
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
          id="json-output"
          readOnly
          value={jsonOutput}
          rows={10}
          className="font-mono text-sm resize-none"
          placeholder="JSON output will appear here..."
        />
      </div>
    </div>
  );
}
