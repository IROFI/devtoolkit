"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { jwtDecode } from "jwt-decode";
import { ClipboardCopy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function JWTToolPage() {
  return (
    <ToolLayout
      title="JWT Encoder/Decoder"
      description="Encode and decode JSON Web Tokens (JWT) securely in your browser."
    >
      <Tabs defaultValue="decode">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="decode">Decode JWT</TabsTrigger>
          <TabsTrigger value="encode">Encode JWT</TabsTrigger>
        </TabsList>
        <TabsContent value="decode">
          <JWTDecoder />
        </TabsContent>
        <TabsContent value="encode">
          <JWTEncoder />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}

function JWTDecoder() {
  const [jwt, setJwt] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  const decodeJWT = useCallback(() => {
    setError("");
    if (!jwt) {
      setHeader("");
      setPayload("");
      setSignature("");
      return;
    }

    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        throw new Error("JWT must have 3 parts (header, payload, signature)");
      }

      const decodedHeader = jwtDecode(jwt, { header: true });
      setHeader(JSON.stringify(decodedHeader, null, 2));

      const decodedPayload = jwtDecode(jwt);
      setPayload(JSON.stringify(decodedPayload, null, 2));

      setSignature(parts[2]);
    } catch (err) {
      console.error("JWT decode error:", err);
      setError(err instanceof Error ? err.message : "Invalid JWT");
      setHeader("");
      setPayload("");
      setSignature("");
    }
  }, [jwt]);

  useEffect(() => {
    decodeJWT();
  }, [decodeJWT]);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${label} copied to clipboard`);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-2">
        <Label htmlFor="jwt-input">Enter JWT Token</Label>
        <Textarea
          id="jwt-input"
          placeholder="Paste JWT token here..."
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          rows={3}
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {!error && jwt && (
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="header">Header</Label>
              {header && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(header, "Header")}
                  className="h-8 px-2"
                >
                  <ClipboardCopy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
            <Textarea
              id="header"
              readOnly
              value={header}
              rows={5}
              className="font-mono text-sm resize-none"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="payload">Payload</Label>
              {payload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(payload, "Payload")}
                  className="h-8 px-2"
                >
                  <ClipboardCopy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
            <Textarea
              id="payload"
              readOnly
              value={payload}
              rows={8}
              className="font-mono text-sm resize-none"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="signature">Signature</Label>
              {signature && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(signature, "Signature")}
                  className="h-8 px-2"
                >
                  <ClipboardCopy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
            <Input
              id="signature"
              readOnly
              value={signature}
              className="font-mono text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function JWTEncoder() {
  const [header, setHeader] = useState(
    JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2)
  );
  const [payload, setPayload] = useState(
    JSON.stringify(
      {
        sub: "1234567890",
        name: "John Doe",
        iat: Math.floor(Date.now() / 1000),
      },
      null,
      2
    )
  );
  const [secret, setSecret] = useState("");
  const [encodedJWT, setEncodedJWT] = useState("");
  const [error, setError] = useState("");

  const encodeJWT = () => {
    setError("");
    setEncodedJWT("");

    if (!header || !payload) {
      setError("Header and payload are required");
      return;
    }

    try {
      const headerObj = JSON.parse(header);
      const payloadObj = JSON.parse(payload);

      const encodedHeader = btoa(JSON.stringify(headerObj));
      const encodedPayload = btoa(JSON.stringify(payloadObj));

      const placeholderSignature = "SIGNATURE_WOULD_BE_GENERATED_ON_SERVER";
      const token = `${encodedHeader}.${encodedPayload}.${btoa(
        placeholderSignature
      )}`;

      setEncodedJWT(token);
      toast.info(
        "Note: JWT is not cryptographically signed in the browser. For actual JWT signing, use a server-side implementation."
      );
    } catch (err) {
      console.error("JWT encode error:", err);
      setError(
        err instanceof Error ? err.message : "Invalid JSON in header or payload"
      );
    }
  };

  const copyToClipboard = () => {
    if (!encodedJWT) return;

    navigator.clipboard
      .writeText(encodedJWT)
      .then(() => {
        toast.success("JWT copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const validateJSON = (text: string): boolean => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-2">
        <Label htmlFor="header-input">Header</Label>
        <Textarea
          id="header-input"
          placeholder="Enter JWT header..."
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          rows={5}
          className={`font-mono text-sm resize-none ${
            !validateJSON(header) && header ? "border-destructive" : ""
          }`}
        />
        {!validateJSON(header) && header && (
          <p className="text-destructive text-sm">Invalid JSON format</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="payload-input">Payload</Label>
        <Textarea
          id="payload-input"
          placeholder="Enter JWT payload..."
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          rows={8}
          className={`font-mono text-sm resize-none ${
            !validateJSON(payload) && payload ? "border-destructive" : ""
          }`}
        />
        {!validateJSON(payload) && payload && (
          <p className="text-destructive text-sm">Invalid JSON format</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="secret-input">
          Secret Key (for demonstration only)
        </Label>
        <Input
          id="secret-input"
          placeholder="Enter secret key..."
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          type="password"
        />
        <p className="text-muted-foreground text-sm">
          Note: In browser environments, JWT signing is typically handled
          server-side for security.
        </p>
      </div>

      <Button
        onClick={encodeJWT}
        disabled={!validateJSON(header) || !validateJSON(payload)}
      >
        Generate JWT
      </Button>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {encodedJWT && (
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="jwt-output">Encoded JWT</Label>
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
          <Textarea
            id="jwt-output"
            readOnly
            value={encodedJWT}
            rows={3}
            className="font-mono text-sm resize-none"
          />
          <p className="text-muted-foreground text-xs">
            This is a mock JWT for educational purposes. For actual JWT signing
            with proper cryptography, use a server-side implementation.
          </p>
        </div>
      )}
    </div>
  );
}
