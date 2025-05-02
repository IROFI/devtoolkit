"use client";

import React, { useState, useEffect } from "react";
import zxcvbn from "zxcvbn";
import { ToolLayout } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PasswordStrengthPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof zxcvbn> | null>(null);

  useEffect(() => {
    if (password) {
      const passwordAnalysis = zxcvbn(password);
      setResult(passwordAnalysis);
    } else {
      setResult(null);
    }
  }, [password]);

  const getScoreText = (score: number) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "Unknown";
    }
  };

  const getScoreColor = (score: number) => {
    switch (score) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-lime-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <ToolLayout
      title="Password Strength Checker"
      description="Check the strength of your password against common cracking techniques. All checks are performed locally in your browser - your passwords are never transmitted."
    >
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="password">Enter Password to Test</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password to check..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full aspect-square"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Strength Score</Label>
                <span className="text-sm font-medium">
                  {getScoreText(result.score)} ({result.score}/4)
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-2 ${getScoreColor(result.score)} transition-all`}
                  style={{ width: `${(result.score / 4) * 100}%` }}
                />
              </div>
            </div>

            {password && (
              <>
                <div className="space-y-2">
                  <Label>Estimated Crack Time</Label>
                  <Card className="p-3 text-sm">
                    <p>
                      <span className="font-medium">Online attack (throttled): </span>
                      {result.crack_times_display.online_throttling_100_per_hour}
                    </p>
                    <p>
                      <span className="font-medium">Online attack (unthrottled): </span>
                      {result.crack_times_display.online_no_throttling_10_per_second}
                    </p>
                    <p>
                      <span className="font-medium">Offline attack (slow hash): </span>
                      {result.crack_times_display.offline_slow_hashing_1e4_per_second}
                    </p>
                    <p>
                      <span className="font-medium">Offline attack (fast hash): </span>
                      {result.crack_times_display.offline_fast_hashing_1e10_per_second}
                    </p>
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label>Password Analysis</Label>
                  <Card className="p-3 text-sm">
                    {result.feedback.warning && (
                      <p className="text-destructive mb-2">{result.feedback.warning}</p>
                    )}
                    {result.feedback.suggestions.length > 0 && (
                      <div className="space-y-1">
                        <p className="font-medium">Suggestions:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {result.feedback.suggestions.map((suggestion) => (
                            <li key={`suggestion-${suggestion}`}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!result.feedback.warning && result.feedback.suggestions.length === 0 && (
                      <p className="text-green-500">This password looks good!</p>
                    )}
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label>Pattern Analysis</Label>
                  <Card className="p-3 text-sm">
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">Patterns found: </span>
                        {result.sequence.length}
                      </p>
                      {result.sequence.length > 0 && (
                        <ul className="list-disc pl-5 space-y-1">
                          {result.sequence.map((seq, index) => (
                            <li key={`${seq.pattern}-${seq.token}-${index}`}>
                              {seq.pattern}: "{seq.token}" ({seq.matched_word || "No match"})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        )}

        {!result && password && (
          <div className="p-3 bg-secondary rounded-md text-sm">
            Enter a password to see its strength analysis.
          </div>
        )}

        <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
          <p className="font-medium mb-1">Privacy Notice:</p>
          <p>
            All password analysis is performed locally in your browser. Your password is never sent to a server or stored anywhere.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
