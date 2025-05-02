"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toISOString();
};

// Helper to get timezone name
const getTimezoneName = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    return "UTC";
  }
};

export default function TimestampConverterPage() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ToolLayout
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates. Convert between timezones and formats."
    >
      <div className="grid gap-8">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Current Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Local Time</Label>
                  <p className="font-mono text-sm">{currentTime.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Unix Timestamp</Label>
                  <p className="font-mono text-sm">{Math.floor(currentTime.getTime() / 1000)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Timezone</Label>
                  <p className="font-mono text-sm">{getTimezoneName()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="unix-to-date">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unix-to-date">Unix to Date</TabsTrigger>
            <TabsTrigger value="date-to-unix">Date to Unix</TabsTrigger>
          </TabsList>
          <TabsContent value="unix-to-date">
            <UnixToDate />
          </TabsContent>
          <TabsContent value="date-to-unix">
            <DateToUnix />
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}

function UnixToDate() {
  const [unixTime, setUnixTime] = useState("");
  const [inMilliseconds, setInMilliseconds] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const convert = useCallback(() => {
    if (!unixTime.trim()) {
      setDate(null);
      setError("");
      return;
    }

    try {
      const timestamp = Number.parseInt(unixTime.trim(), 10);
      if (Number.isNaN(timestamp)) {
        throw new Error("Not a valid number");
      }

      // Determine if we should treat this as seconds or milliseconds
      let finalTimestamp = timestamp;
      if (!inMilliseconds) {
        finalTimestamp = timestamp * 1000; // Convert to milliseconds
      }

      const convertedDate = new Date(finalTimestamp);

      // Basic validation - ensure date is reasonable
      if (convertedDate.getFullYear() < 1970 || convertedDate.getFullYear() > 2100) {
        throw new Error("Date out of reasonable range (1970-2100)");
      }

      setDate(convertedDate);
      setError("");
    } catch (err) {
      console.error("Conversion error:", err);
      setDate(null);
      setError("Invalid timestamp. Please check your input.");
    }
  }, [unixTime, inMilliseconds]);

  // Convert when input changes
  useEffect(() => {
    convert();
  }, [convert]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers in the input
    const value = e.target.value.replace(/[^0-9]/g, "");
    setUnixTime(value);
  };

  const setCurrentTime = () => {
    const now = new Date();
    setUnixTime(
      inMilliseconds
        ? now.getTime().toString()
        : Math.floor(now.getTime() / 1000).toString()
    );
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;

    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="unix-input">Unix Timestamp</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={setCurrentTime}
            className="h-8 px-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Current Time
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="unix-input"
              type="text"
              placeholder="Enter Unix timestamp..."
              value={unixTime}
              onChange={handleInputChange}
              className="font-mono"
            />
          </div>
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <input
              id="seconds"
              type="radio"
              checked={!inMilliseconds}
              onChange={() => setInMilliseconds(false)}
              className="h-4 w-4"
            />
            <Label htmlFor="seconds" className="text-sm">Seconds</Label>

            <input
              id="milliseconds"
              type="radio"
              checked={inMilliseconds}
              onChange={() => setInMilliseconds(true)}
              className="h-4 w-4 ml-3"
            />
            <Label htmlFor="milliseconds" className="text-sm">Milliseconds</Label>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {date && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Converted Date</h3>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Local Date & Time</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(date.toLocaleString())}
                  className="h-6 px-2 text-xs"
                >
                  <ClipboardCopy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-2 bg-muted rounded font-mono text-sm">
                {date.toLocaleString()}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>ISO Format (UTC)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(date.toISOString())}
                  className="h-6 px-2 text-xs"
                >
                  <ClipboardCopy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-2 bg-muted rounded font-mono text-sm">
                {date.toISOString()}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>UTC Date & Time</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(date.toUTCString())}
                  className="h-6 px-2 text-xs"
                >
                  <ClipboardCopy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-2 bg-muted rounded font-mono text-sm">
                {date.toUTCString()}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Relative Time</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(getRelativeTimeString(date))}
                  className="h-6 px-2 text-xs"
                >
                  <ClipboardCopy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-2 bg-muted rounded font-mono text-sm">
                {getRelativeTimeString(date)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DateToUnix() {
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [unixTimestamp, setUnixTimestamp] = useState<{seconds: string; milliseconds: string}>({
    seconds: "",
    milliseconds: ""
  });
  const [error, setError] = useState("");

  const convert = useCallback(() => {
    if (!dateTimeInput) {
      setUnixTimestamp({ seconds: "", milliseconds: "" });
      setError("");
      return;
    }

    try {
      const date = new Date(dateTimeInput);
      if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      setUnixTimestamp({
        seconds: Math.floor(date.getTime() / 1000).toString(),
        milliseconds: date.getTime().toString()
      });
      setError("");
    } catch (err) {
      console.error("Conversion error:", err);
      setUnixTimestamp({ seconds: "", milliseconds: "" });
      setError("Invalid date. Please check your input.");
    }
  }, [dateTimeInput]);

  // Convert when input changes
  useEffect(() => {
    convert();
  }, [convert]);

  const setCurrentTime = () => {
    setDateTimeInput(new Date().toISOString().slice(0, 16));
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;

    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="date-input">Date & Time</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={setCurrentTime}
            className="h-8 px-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Current Time
          </Button>
        </div>
        <Input
          id="date-input"
          type="datetime-local"
          value={dateTimeInput}
          onChange={(e) => setDateTimeInput(e.target.value)}
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {(unixTimestamp.seconds || unixTimestamp.milliseconds) && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Converted Timestamp</h3>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Unix Timestamp (seconds)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(unixTimestamp.seconds)}
                  className="h-6 px-2 text-xs"
                >
                  <ClipboardCopy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-2 bg-muted rounded font-mono text-sm">
                {unixTimestamp.seconds}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Unix Timestamp (milliseconds)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(unixTimestamp.milliseconds)}
                  className="h-6 px-2 text-xs"
                >
                  <ClipboardCopy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-2 bg-muted rounded font-mono text-sm">
                {unixTimestamp.milliseconds}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get relative time string
function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  const absDiffSecs = Math.abs(diffSecs);
  const absDiffMins = Math.abs(diffMins);
  const absDiffHours = Math.abs(diffHours);
  const absDiffDays = Math.abs(diffDays);

  const isFuture = diffMs > 0;
  const prefix = isFuture ? "In " : "";
  const suffix = isFuture ? "" : " ago";

  if (absDiffSecs < 60) {
    return `${prefix}${absDiffSecs} second${absDiffSecs !== 1 ? "s" : ""}${suffix}`;
  }

  if (absDiffMins < 60) {
    return `${prefix}${absDiffMins} minute${absDiffMins !== 1 ? "s" : ""}${suffix}`;
  }

  if (absDiffHours < 24) {
    return `${prefix}${absDiffHours} hour${absDiffHours !== 1 ? "s" : ""}${suffix}`;
  }

  return `${prefix}${absDiffDays} day${absDiffDays !== 1 ? "s" : ""}${suffix}`;
}
