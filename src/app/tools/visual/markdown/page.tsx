"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ClipboardCopy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export default function MarkdownPreviewerPage() {
  const [markdown, setMarkdown] = useState("");
  const example = `# Markdown Example

Here is some **bold text**, _italic_, and a [link](https://react.dev).

- Bullet list
- Second item

\`\`\`js
console.log("Hello Markdown!");
\`\`\`
`;

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

  const handleExample = () => {
    setMarkdown(example);
  };

  return (
    <ToolLayout
      title="Markdown Previewer"
      description="Edit markdown and instantly preview the rendered output."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-sm">Markdown</Label>
            <Button variant="outline" size="sm" onClick={handleExample}>
              Example
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(markdown, "Markdown")}
            >
              <ClipboardCopy className="h-4 w-4" />
            </Button>
          </div>
          <textarea
            className="w-full min-h-[300px] font-mono text-sm border rounded p-2"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write your markdown here..."
          />
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Label className="text-sm mb-2 block">Preview</Label>
              <div className="prose prose-neutral max-w-none overflow-auto min-h-[300px]">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
