import { MainNav } from "@/components/main-nav";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        {children}
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DevToolkit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
