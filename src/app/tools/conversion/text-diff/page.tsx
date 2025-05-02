"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

function diffLines(a: string, b: string) {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const result: { type: "added" | "removed" | "unchanged"; value: string }[] =
    [];
  let i = 0,
    j = 0;
  while (i < aLines.length || j < bLines.length) {
    if (i < aLines.length && j < bLines.length && aLines[i] === bLines[j]) {
      result.push({ type: "unchanged", value: aLines[i] });
      i++;
      j++;
    } else if (
      j < bLines.length &&
      (i >= aLines.length || !aLines.slice(i).includes(bLines[j]))
    ) {
      result.push({ type: "added", value: bLines[j] });
      j++;
    } else if (
      i < aLines.length &&
      (j >= bLines.length || !bLines.slice(j).includes(aLines[i]))
    ) {
      result.push({ type: "removed", value: aLines[i] });
      i++;
    } else {
      result.push({ type: "removed", value: aLines[i] });
      result.push({ type: "added", value: bLines[j] });
      i++;
      j++;
    }
  }
  return result;
}

const EXAMPLE_A = `Hello,
Here is a sample text.
It contains several lines.
Some lines will be changed.`;

const EXAMPLE_B = `Hello,
Here is a modified sample text.
It contains several lines.
Some lines have been changed.
And a line was added!`;

export default function TextDiffPage() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<ReturnType<typeof diffLines> | null>(null);

  const handleCompare = () => {
    setDiff(diffLines(textA, textB));
  };

  const handleExample = () => {
    setTextA(EXAMPLE_A);
    setTextB(EXAMPLE_B);
    setDiff(diffLines(EXAMPLE_A, EXAMPLE_B));
  };

  return (
    <ToolLayout
      title="Text Diff Tool"
      description="Compare two texts and view line-by-line differences, GitHub style."
    >
      <div className="grid gap-6 mt-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="text-a">Text A</Label>
            <Textarea
              id="text-a"
              placeholder="Paste or type the first text here..."
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              rows={8}
              className="font-mono text-sm resize-none"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text-b">Text B</Label>
            <Textarea
              id="text-b"
              placeholder="Paste or type the second text here..."
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              rows={8}
              className="font-mono text-sm resize-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCompare}>Compare</Button>
          <Button variant="secondary" onClick={handleExample}>
            Example
          </Button>
        </div>
        {diff && (
          <div className="mt-4 border rounded-md bg-muted/50 overflow-auto">
            <pre className="text-sm font-mono p-4 whitespace-pre-wrap">
              {diff.map((line, idx) => {
                if (line.type === "added") {
                  return (
                    <div
                      key={idx}
                      className="bg-green-100 text-green-800 px-2 rounded"
                    >
                      <span className="select-none">+ </span>
                      {line.value}
                    </div>
                  );
                }
                if (line.type === "removed") {
                  return (
                    <div
                      key={idx}
                      className="bg-red-100 text-red-800 px-2 rounded"
                    >
                      <span className="select-none">- </span>
                      {line.value}
                    </div>
                  );
                }
                return (
                  <div key={idx} className="px-2">
                    <span className="select-none">&nbsp; </span>
                    {line.value}
                  </div>
                );
              })}
            </pre>
          </div>
        )}
        <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
          <p>
            <strong>Text Diff Tool</strong>: visualize the differences between
            two texts. Removed lines are shown in{" "}
            <span className="text-red-700">red</span>, added lines in{" "}
            <span className="text-green-700">green</span>.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
