"use client";

import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  tabs?: { id: string; label: string; content: React.ReactNode }[];
}

export function ToolLayout({ title, description, children, tabs }: ToolLayoutProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {tabs ? (
            <Tabs defaultValue={tabs[0].id}>
              <TabsList className="mb-4">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </div>
  );
}
