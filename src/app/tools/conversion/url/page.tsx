"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopy } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function URLConverterPage() {
  return (
    <ToolLayout
      title="URL Encoder/Decoder"
      description="Encode text for use in URLs or decode URL-encoded strings securely in your browser."
    >
      <Tabs defaultValue="encode">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode for URL</TabsTrigger>
          <TabsTrigger value="decode">Decode from URL</TabsTrigger>
        </TabsList>
        <TabsContent value="encode">
          <URLEncoder />
        </TabsContent>
        <TabsContent value="decode">
          <URLDecoder />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}

function URLEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [encodeAll, setEncodeAll] = useState(false);

  const encode = useCallback(() => {
    setError("");
    if (!input) {
      setOutput("");
      return;
    }

    try {
      if (encodeAll) {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(encodeURI(input));
      }
    } catch (err) {
      console.error("URL encoding error:", err);
      setError("Error encoding URL. Please check your input.");
    }
  }, [input, encodeAll]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (autoUpdate) {
      try {
        setError("");
        if (!value) {
          setOutput("");
          return;
        }

        if (encodeAll) {
          setOutput(encodeURIComponent(value));
        } else {
          setOutput(encodeURI(value));
        }
      } catch (err) {
        console.error("URL encoding error:", err);
        setError("Error encoding URL. Please check your input.");
      }
    }
  };

  const copyToClipboard = () => {
    if (!output) return;

    navigator.clipboard
      .writeText(output)
      .then(() => {
        toast.success("Encoded URL copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-update"
            checked={autoUpdate}
            onCheckedChange={setAutoUpdate}
          />
          <Label htmlFor="auto-update">Auto-update</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="encode-all"
            checked={encodeAll}
            onCheckedChange={(checked) => {
              setEncodeAll(checked);
              if (autoUpdate && input) {
                if (checked) {
                  setOutput(encodeURIComponent(input));
                } else {
                  setOutput(encodeURI(input));
                }
              }
            }}
          />
          <Label htmlFor="encode-all">Encode all characters</Label>
        </div>

        {!autoUpdate && (
          <Button onClick={encode} size="sm">
            Encode
          </Button>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="text-input">Text to Encode</Label>
        <Textarea
          id="text-input"
          placeholder="Enter text to encode for URL..."
          value={input}
          onChange={handleInputChange}
          rows={6}
          className="resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="url-output">Encoded URL</Label>
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
          id="url-output"
          readOnly
          value={output}
          rows={6}
          className="font-mono text-sm resize-none"
          placeholder="Encoded URL will appear here..."
        />
      </div>

      <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
        <p className="mb-2">
          <strong>URL Encoding</strong> replaces unsafe ASCII characters with %
          followed by two hexadecimal digits.
        </p>
        <p className="text-xs">
          • <strong>encodeURI</strong>: Preserves URL structure characters (/,
          :, &, ?, etc.)
          <br />• <strong>encodeURIComponent</strong>: Encodes all special
          characters, use for URL parameters
        </p>
      </div>
    </div>
  );
}

function URLDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);

  const decode = useCallback(() => {
    setError("");
    if (!input) {
      setOutput("");
      return;
    }

    try {
      setOutput(decodeURIComponent(input));
    } catch (err) {
      try {
        setOutput(decodeURI(input));
      } catch (err2) {
        console.error("URL decoding error:", err2);
        setError("Invalid URL encoding. Please check your input.");
      }
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (autoUpdate) {
      try {
        setError("");
        if (!value) {
          setOutput("");
          return;
        }

        try {
          setOutput(decodeURIComponent(value));
        } catch (err) {
          setOutput(decodeURI(value));
        }
      } catch (err) {
        console.error("URL decoding error:", err);
        setError("Invalid URL encoding. Please check your input.");
      }
    }
  };

  const copyToClipboard = () => {
    if (!output) return;

    navigator.clipboard
      .writeText(output)
      .then(() => {
        toast.success("Decoded text copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-update-decode"
            checked={autoUpdate}
            onCheckedChange={setAutoUpdate}
          />
          <Label htmlFor="auto-update-decode">Auto-update</Label>
        </div>
        {!autoUpdate && (
          <Button onClick={decode} size="sm">
            Decode
          </Button>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="url-input">URL Encoded Text</Label>
        <Textarea
          id="url-input"
          placeholder="Enter URL encoded text to decode..."
          value={input}
          onChange={handleInputChange}
          rows={6}
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
          <Label htmlFor="text-output">Decoded Text</Label>
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
          id="text-output"
          readOnly
          value={output}
          rows={6}
          className="resize-none"
          placeholder="Decoded text will appear here..."
        />
      </div>

      <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
        <p>
          <strong>URL Decoding</strong> converts URL encoded strings back to
          their original format, replacing %XX sequences with their
          corresponding characters.
        </p>
      </div>
    </div>
  );
}
