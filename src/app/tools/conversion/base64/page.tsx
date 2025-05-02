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

export default function Base64ConverterPage() {
  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 or decode Base64 to text securely in your browser."
    >
      <Tabs defaultValue="encode">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode to Base64</TabsTrigger>
          <TabsTrigger value="decode">Decode from Base64</TabsTrigger>
        </TabsList>
        <TabsContent value="encode">
          <Base64Encoder />
        </TabsContent>
        <TabsContent value="decode">
          <Base64Decoder />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}

function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);

  const encode = useCallback(() => {
    setError("");
    if (!input) {
      setOutput("");
      return;
    }

    try {
      setOutput(btoa(input));
    } catch (err) {
      console.error("Base64 encoding error:", err);
      setError(
        "Encoding failed. Make sure your input contains only ASCII characters."
      );
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
        setOutput(btoa(value));
      } catch (err) {
        console.error("Base64 encoding error:", err);
        setError(
          "Encoding failed. Make sure your input contains only ASCII characters."
        );
      }
    }
  };

  const copyToClipboard = () => {
    if (!output) return;

    navigator.clipboard
      .writeText(output)
      .then(() => {
        toast.success("Base64 copied to clipboard");
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
            id="auto-update"
            checked={autoUpdate}
            onCheckedChange={setAutoUpdate}
          />
          <Label htmlFor="auto-update">Auto-update</Label>
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
          placeholder="Enter text to encode to Base64..."
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
          <Label htmlFor="base64-output">Base64 Output</Label>
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
          id="base64-output"
          readOnly
          value={output}
          rows={6}
          className="font-mono text-sm resize-none"
          placeholder="Base64 output will appear here..."
        />
      </div>

      <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
        <p>
          <strong>Base64 Encoding</strong> converts text or binary data to an
          ASCII string format, typically used for transmitting or storing binary
          data in text-based formats.
        </p>
      </div>
    </div>
  );
}

function Base64Decoder() {
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
      setOutput(atob(input));
    } catch (err) {
      console.error("Base64 decoding error:", err);
      setError("Invalid Base64 format. Please check your input.");
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
        setOutput(atob(value));
      } catch (err) {
        console.error("Base64 decoding error:", err);
        setError("Invalid Base64 format. Please check your input.");
      }
    }
  };

  const copyToClipboard = () => {
    if (!output) return;

    navigator.clipboard
      .writeText(output)
      .then(() => {
        toast.success("Text copied to clipboard");
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
        <Label htmlFor="base64-input">Base64 to Decode</Label>
        <Textarea
          id="base64-input"
          placeholder="Enter Base64 to decode..."
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
          placeholder="Decoded output will appear here..."
        />
      </div>

      <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
        <p>
          <strong>Base64 Decoding</strong> converts Base64 encoded data back to
          its original format. Note that only valid Base64 strings can be
          decoded correctly.
        </p>
      </div>
    </div>
  );
}
