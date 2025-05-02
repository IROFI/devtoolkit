"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardCopy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EXAMPLES = [
  {
    label: "GET JSONPlaceholder",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    headers: "",
    body: "",
    description: "GET simple sur JSONPlaceholder",
  },
  {
    label: "POST JSONPlaceholder",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    headers: "Content-Type: application/json",
    body: `{
  "title": "foo",
  "body": "bar",
  "userId": 1
}`,
    description: "POST JSON sur JSONPlaceholder",
  },
  {
    label: "GET GitHub API",
    method: "GET",
    url: "https://api.github.com/repos/vercel/next.js",
    headers: "",
    body: "",
    description: "GET sur l'API GitHub",
  },
];

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export default function HttpRequestPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyExample = (ex: (typeof EXAMPLES)[0]) => {
    setMethod(ex.method);
    setUrl(ex.url);
    setHeaders(ex.headers);
    setBody(ex.body);
    setResponse(null);
    setStatus(null);
    setError(null);
    toast.info(`Exemple : ${ex.description}`);
  };

  const generateRandomExample = () => {
    const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    applyExample(ex);
  };

  function parseHeaders(headerString: string): Record<string, string> {
    const headers: Record<string, string> = {};
    headerString
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((line) => {
        const idx = line.indexOf(":");
        if (idx > -1) {
          const key = line.slice(0, idx).trim();
          const value = line.slice(idx + 1).trim();
          headers[key] = value;
        }
      });
    return headers;
  }

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    setStatus(null);
    setError(null);
    try {
      const fetchOptions: RequestInit = {
        method,
        headers: parseHeaders(headers),
      };
      if (["POST", "PUT", "PATCH"].includes(method)) {
        fetchOptions.body = body;
      }
      const res = await fetch(url, fetchOptions);
      setStatus(res.status);
      let text = await res.text();
      try {
        text = JSON.stringify(JSON.parse(text), null, 2);
      } catch {}
      setResponse(text);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Copy failed"));
  };

  return (
    <ToolLayout
      title="HTTP Request Tester"
      description="Test HTTP requests (GET, POST, etc.) in real time. Enter a URL, headers, a body, and see the response."
    >
      <div className="grid gap-8">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Mini Postman</h3>
                <div className="flex gap-2">
                  {EXAMPLES.map((ex, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => applyExample(ex)}
                      className="h-8 px-2"
                      title={ex.description}
                    >
                      {ex.label}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateRandomExample}
                    className="h-8 px-2"
                    title="Generate a random example"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Random
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 items-end">
                <div>
                  <Label htmlFor="method-select">Method</Label>
                  <select
                    id="method-select"
                    className="border rounded px-2 py-1 font-mono"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    {HTTP_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="url-input">URL</Label>
                  <Input
                    id="url-input"
                    type="text"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <Button
                  onClick={sendRequest}
                  disabled={loading || !url}
                  className="h-10"
                >
                  {loading ? "Sending..." : "Send"}
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="headers-input">
                  Headers (key: value, one per line)
                </Label>
                <textarea
                  id="headers-input"
                  rows={2}
                  placeholder="Content-Type: application/json"
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  className="font-mono border rounded px-2 py-1"
                />
              </div>
              {["POST", "PUT", "PATCH"].includes(method) && (
                <div className="grid gap-2">
                  <Label htmlFor="body-input">Body</Label>
                  <textarea
                    id="body-input"
                    rows={4}
                    placeholder='{"key": "value"}'
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="font-mono border rounded px-2 py-1"
                  />
                </div>
              )}
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(url)}
                  className="h-6 px-2 text-xs mr-2"
                >
                  <ClipboardCopy className="h-3 w-3 mr-1" />
                  Copy URL
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(headers)}
                  className="h-6 px-2 text-xs mr-2"
                >
                  <ClipboardCopy className="h-3 w-3 mr-1" />
                  Copy headers
                </Button>
                {body && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(body)}
                    className="h-6 px-2 text-xs"
                  >
                    <ClipboardCopy className="h-3 w-3 mr-1" />
                    Copy body
                  </Button>
                )}
              </div>
              <div>
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    Error: {error}
                  </div>
                )}
                {status !== null && (
                  <div className="mb-2 text-sm">
                    Status:{" "}
                    <span
                      className={
                        status >= 200 && status < 300
                          ? "text-green-600"
                          : "text-orange-600"
                      }
                    >
                      {status}
                    </span>
                  </div>
                )}
                {response && (
                  <div className="mt-2">
                    <Label>Response:</Label>
                    <pre className="p-2 bg-muted rounded font-mono text-sm overflow-x-auto max-h-96">
                      {response}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
