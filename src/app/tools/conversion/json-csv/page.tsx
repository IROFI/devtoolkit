"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopy } from "lucide-react";
import Papa from "papaparse";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function JsonCsvConverterPage() {
  return (
    <ToolLayout
      title="JSON ↔ CSV Converter"
      description="Instantly convert between JSON and CSV formats."
    >
      <Tabs defaultValue="json-to-csv">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-csv">JSON to CSV</TabsTrigger>
          <TabsTrigger value="csv-to-json">CSV to JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="json-to-csv">
          <JsonToCsv />
        </TabsContent>
        <TabsContent value="csv-to-json">
          <CsvToJson />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}

function JsonToCsv() {
  const [json, setJson] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [error, setError] = useState("");

  const convertJsonToCsv = useCallback(() => {
    setError("");
    setCsvOutput("");

    if (!json.trim()) {
      return;
    }

    try {
      const jsonObj = JSON.parse(json);
      // PapaParse expects an array of objects
      const data = Array.isArray(jsonObj) ? jsonObj : [jsonObj];
      const csv = Papa.unparse(data, { quotes: false });
      setCsvOutput(csv);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
    }
  }, [json]);

  useEffect(() => {
    if (json) {
      convertJsonToCsv();
    }
  }, [json, convertJsonToCsv]);

  const copyToClipboard = () => {
    if (!csvOutput) return;
    navigator.clipboard
      .writeText(csvOutput)
      .then(() => toast.success("CSV copied to clipboard"))
      .catch(() => toast.error("Copy failed"));
  };

  const loadSampleJson = () => {
    const sampleJson = JSON.stringify(
      [
        { name: "Alice", age: 30, city: "Paris" },
        { name: "Bob", age: 25, city: "Lyon" },
      ],
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
            Example
          </Button>
        </div>
        <Textarea
          id="json-input"
          placeholder="Paste a JSON array here..."
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
          <Label htmlFor="csv-output">CSV Output</Label>
          {csvOutput && (
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
          id="csv-output"
          readOnly
          value={csvOutput}
          rows={10}
          className="font-mono text-sm resize-none"
          placeholder="CSV will appear here..."
        />
      </div>
    </div>
  );
}

function CsvToJson() {
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState("");
  const [isPretty, setIsPretty] = useState(true);

  const convertCsvToJson = useCallback(() => {
    setError("");
    setJsonOutput("");

    if (!csvInput.trim()) {
      return;
    }

    try {
      const result = Papa.parse(csvInput, {
        header: true,
        skipEmptyLines: true,
      });
      if (result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }
      const json = JSON.stringify(result.data, null, isPretty ? 2 : 0);
      setJsonOutput(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid CSV format");
    }
  }, [csvInput, isPretty]);

  useEffect(() => {
    if (csvInput) {
      convertCsvToJson();
    }
  }, [csvInput, convertCsvToJson]);

  const copyToClipboard = () => {
    if (!jsonOutput) return;
    navigator.clipboard
      .writeText(jsonOutput)
      .then(() => toast.success("JSON copied to clipboard"))
      .catch(() => toast.error("Copy failed"));
  };

  const loadSampleCsv = () => {
    const sampleCsv = `name,age,city
Alice,30,Paris
Bob,25,Lyon`;
    setCsvInput(sampleCsv);
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="csv-input">CSV Input</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSampleCsv}
            className="h-8 px-2"
          >
            Example
          </Button>
        </div>
        <Textarea
          id="csv-input"
          placeholder="Paste CSV here..."
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
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
          placeholder="JSON will appear here..."
        />
      </div>
    </div>
  );
}
