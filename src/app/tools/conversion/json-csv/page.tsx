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
      description="Convertissez instantanément entre les formats JSON et CSV."
    >
      <Tabs defaultValue="json-to-csv">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-csv">JSON vers CSV</TabsTrigger>
          <TabsTrigger value="csv-to-json">CSV vers JSON</TabsTrigger>
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
      // PapaParse attend un tableau d'objets
      const data = Array.isArray(jsonObj) ? jsonObj : [jsonObj];
      const csv = Papa.unparse(data, { quotes: false });
      setCsvOutput(csv);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Format JSON invalide");
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
      .then(() => toast.success("CSV copié dans le presse-papier"))
      .catch(() => toast.error("Échec de la copie"));
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
          <Label htmlFor="json-input">Entrée JSON</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSampleJson}
            className="h-8 px-2"
          >
            Exemple
          </Button>
        </div>
        <Textarea
          id="json-input"
          placeholder="Collez ici un tableau JSON..."
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
          <Label htmlFor="csv-output">Sortie CSV</Label>
          {csvOutput && (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 px-2"
              >
                <ClipboardCopy className="h-4 w-4 mr-2" />
                Copier
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
          placeholder="Le CSV apparaîtra ici..."
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
      setError(err instanceof Error ? err.message : "Format CSV invalide");
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
      .then(() => toast.success("JSON copié dans le presse-papier"))
      .catch(() => toast.error("Échec de la copie"));
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
          <Label htmlFor="csv-input">Entrée CSV</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSampleCsv}
            className="h-8 px-2"
          >
            Exemple
          </Button>
        </div>
        <Textarea
          id="csv-input"
          placeholder="Collez ici du CSV..."
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
          <Label htmlFor="json-output">Sortie JSON</Label>
          {jsonOutput && (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 px-2"
              >
                <ClipboardCopy className="h-4 w-4 mr-2" />
                Copier
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
          placeholder="Le JSON apparaîtra ici..."
        />
      </div>
    </div>
  );
}
