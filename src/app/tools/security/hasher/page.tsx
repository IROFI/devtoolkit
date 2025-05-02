"use client";

import React, { useState, useEffect, useCallback } from "react";
import CryptoJS from "crypto-js";
import { ToolLayout } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";

const algorithms = [
  { value: "md5", label: "MD5" },
  { value: "sha1", label: "SHA-1" },
  { value: "sha256", label: "SHA-256" },
  { value: "sha512", label: "SHA-512" },
  { value: "sha3", label: "SHA-3" },
  { value: "ripemd160", label: "RIPEMD-160" },
];

export default function TextHasherPage() {
  const [text, setText] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [hash, setHash] = useState("");

  const generateHash = useCallback(() => {
    if (!text) {
      setHash("");
      return;
    }

    try {
      let result = "";
      switch (algorithm) {
        case "md5":
          result = CryptoJS.MD5(text).toString();
          break;
        case "sha1":
          result = CryptoJS.SHA1(text).toString();
          break;
        case "sha256":
          result = CryptoJS.SHA256(text).toString();
          break;
        case "sha512":
          result = CryptoJS.SHA512(text).toString();
          break;
        case "sha3":
          result = CryptoJS.SHA3(text).toString();
          break;
        case "ripemd160":
          result = CryptoJS.RIPEMD160(text).toString();
          break;
        default:
          result = CryptoJS.SHA256(text).toString();
      }
      setHash(result);
    } catch (error) {
      console.error("Hashing error:", error);
      toast.error("Error generating hash. Please try again.");
    }
  }, [text, algorithm]);

  // Generate hash whenever text or algorithm changes
  useEffect(() => {
    generateHash();
  }, [generateHash]);

  const copyToClipboard = () => {
    if (!hash) return;

    navigator.clipboard.writeText(hash)
      .then(() => {
        toast.success("Hash copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <ToolLayout
      title="Text Hasher"
      description="Generate secure cryptographic hashes from any text using various algorithms."
    >
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="algorithm">Hash Algorithm</Label>
          <Select
            value={algorithm}
            onValueChange={(value) => setAlgorithm(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              {algorithms.map((algo) => (
                <SelectItem key={algo.value} value={algo.value}>
                  {algo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="input-text">Input Text</Label>
          <Textarea
            id="input-text"
            placeholder="Enter text to hash..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="hash-output">Hash Output</Label>
            {hash && (
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
          <div className="relative">
            <Input
              id="hash-output"
              value={hash}
              readOnly
              className="font-mono text-sm pr-10"
              placeholder="Hash will appear here..."
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
