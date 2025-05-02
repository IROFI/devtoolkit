"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ClipboardCopy, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import zxcvbn from "zxcvbn";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    generatePassword();
  }, []);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setPasswordStrength(result.score);
    }
  }, [password]);

  const generatePassword = () => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      toast.error("Please select at least one character type");
      return;
    }

    let charset = "";
    if (includeUppercase) charset += uppercaseChars;
    if (includeLowercase) charset += lowercaseChars;
    if (includeNumbers) charset += numberChars;
    if (includeSymbols) charset += symbolChars;

    let newPassword = "";
    let hasAllRequiredTypes = false;

    while (!hasAllRequiredTypes) {
      newPassword = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        newPassword += charset[randomIndex];
      }

      const hasUppercase = !includeUppercase || /[A-Z]/.test(newPassword);
      const hasLowercase = !includeLowercase || /[a-z]/.test(newPassword);
      const hasNumber = !includeNumbers || /[0-9]/.test(newPassword);
      const hasSymbol = !includeSymbols || /[^A-Za-z0-9]/.test(newPassword);

      hasAllRequiredTypes =
        hasUppercase && hasLowercase && hasNumber && hasSymbol;
    }

    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    if (!password) return;

    navigator.clipboard
      .writeText(password)
      .then(() => {
        toast.success("Password copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const getStrengthText = (score: number) => {
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

  const getStrengthColor = (score: number) => {
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
      title="Secure Password Generator"
      description="Generate strong, secure passwords with customizable options."
    >
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Generated Password</Label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generatePassword}
                className="h-8 px-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 px-2"
              >
                <ClipboardCopy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
          <div className="relative">
            <Input
              id="password"
              value={password}
              readOnly
              className="font-mono text-lg pr-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Password Strength</Label>
            <span className="text-sm font-medium">
              {getStrengthText(passwordStrength)} ({passwordStrength}/4)
            </span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-2 ${getStrengthColor(
                passwordStrength
              )} transition-all`}
              style={{ width: `${(passwordStrength / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="length">Password Length: {length}</Label>
            </div>
            <Slider
              id="length"
              defaultValue={[length]}
              min={8}
              max={64}
              step={1}
              onValueChange={(values: number[]) => setLength(values[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>8</span>
              <span>36</span>
              <span>64</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Character Types</Label>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="uppercase-letters" className="font-normal">
                    Uppercase Letters (A-Z)
                  </Label>
                </div>
                <Switch
                  id="uppercase-letters"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="lowercase-letters" className="font-normal">
                    Lowercase Letters (a-z)
                  </Label>
                </div>
                <Switch
                  id="lowercase-letters"
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="numbers" className="font-normal">
                    Numbers (0-9)
                  </Label>
                </div>
                <Switch
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="symbols" className="font-normal">
                    Special Characters (!@#$%^&*...)
                  </Label>
                </div>
                <Switch
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
          <p className="font-medium mb-1">Privacy Notice:</p>
          <p>
            All password generation is performed locally in your browser. Your
            passwords are never sent to a server or stored anywhere.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
