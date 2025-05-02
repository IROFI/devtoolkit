"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ClipboardCopy, Image as ImageIcon } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

export default function ImageToBase64Page() {
  const [image, setImage] = useState<File | null>(null);
  const [base64, setBase64] = useState<string>("");
  const [preview, setPreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setBase64(reader.result as string);
      setPreview(reader.result as string);
    };
    reader.onerror = () => {
      toast.error("Error while reading the file");
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${label} copied to clipboard`);
      })
      .catch(() => {
        toast.error("Copy error");
      });
  };

  return (
    <ToolLayout
      title="Image to Base64"
      description="Easily convert an image to a Base64 string."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-sm">Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              Choose an image
            </Button>
          </div>
          {preview && (
            <div className="mb-4">
              <Label className="text-xs mb-1 block">Preview</Label>
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded border"
              />
            </div>
          )}
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-sm">Base64</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(base64, "Base64")}
                  disabled={!base64}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
              <textarea
                className="w-full min-h-[200px] font-mono text-xs border rounded p-2"
                value={base64}
                readOnly
                placeholder="The Base64 code will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
