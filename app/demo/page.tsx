"use client";

import { AsciiSphereDemo } from "@/components/registry/ascii-sphere-demo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8 noise-overlay">
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">21st.dev Component Sandbox</h1>
          <p className="text-sm text-muted-foreground mt-1">Configurable React Tailwind ASCII rendering system.</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Template
        </Link>
      </div>
      
      <AsciiSphereDemo />
    </main>
  );
}
