"use client";

import React, { useState, useEffect } from "react";
import { AsciiSphere } from "./ascii-sphere";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Eye, Copy, Check, Terminal, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const PRESET_CHARSETS = [
  { name: "Default Blocks", value: "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯" },
  { name: "Bubbles & Circles", value: "·∘○◯◌●◉" },
  { name: "Binary Stream", value: "01" },
  { name: "Mathematics & Glyphs", value: "+x*#%@$?!" },
  { name: "Matrix Runes", value: "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀ" },
];

const PRESET_COLORS = [
  { name: "Theme Foreground", value: "currentColor" },
  { name: "Neon Cyberpunk Green", value: "#10b981" },
  { name: "Digital Sky Blue", value: "#0ea5e9" },
  { name: "Volt Yellow", value: "#eab308" },
  { name: "Crimson Blaze Red", value: "#ef4444" },
  { name: "Deep Amethyst Purple", value: "#a855f7" },
];

export function AsciiSphereDemo() {
  const [charset, setCharset] = useState(PRESET_CHARSETS[0].value);
  const [speedX, setSpeedX] = useState(0.2);
  const [speedY, setSpeedY] = useState(0.3);
  const [density, setDensity] = useState(0.15);
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("currentColor");
  const [radiusScale, setRadiusScale] = useState(0.525);

  // Paywall & Licensing State
  const [isLicensed, setIsLicensed] = useState(false);
  const [isCheckingLicense, setIsCheckingLicense] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Checkout Modal Fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Code Copy State
  const [copiedCLI, setCopiedCLI] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<"cli" | "code">("cli");

  useEffect(() => {
    // Prevent hydration mismatch: load license from localStorage on client-mount
    const checkLicense = () => {
      if (typeof window !== "undefined") {
        const unlocked = localStorage.getItem("optimus_license_unlocked") === "true";
        setIsLicensed(unlocked);
      }
      setIsCheckingLicense(false);
    };

    checkLicense();
    window.addEventListener("storage", checkLicense);
    return () => window.removeEventListener("storage", checkLicense);
  }, []);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc || !cardName) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsLicensed(true);
      setShowCheckout(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("optimus_license_unlocked", "true");
        window.dispatchEvent(new Event("storage"));
      }
    }, 2000);
  };

  const copyToClipboard = (text: string, setCopiedState: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const resetLicense = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("optimus_license_unlocked");
      window.dispatchEvent(new Event("storage"));
    }
  };

  const codeString = `"use client";

import { useEffect, useRef } from "react";

export interface AsciiSphereProps {
  chars?: string;
  speedX?: number;
  speedY?: number;
  animationSpeed?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  radiusScale?: number;
  density?: number;
  className?: string;
}

export function AsciiSphere({
  chars = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯",
  speedX = 0.2,
  speedY = 0.3,
  animationSpeed = 0.02,
  color = "currentColor",
  fontSize = 12,
  fontFamily = "monospace",
  radiusScale = 0.525,
  density = 0.15,
  className,
}: AsciiSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const helperGetRGB = (element: HTMLElement, colorValue: string): string => {
      if (colorValue === "currentColor") {
        const style = window.getComputedStyle(element);
        const resolvedColor = style.color || "rgb(0,0,0)";
        const match = resolvedColor.match(/\\d+/g);
        return match && match.length >= 3 ? \`\${match[0]}, \${match[1]}, \${match[2]}\` : "0,0,0";
      }
      const tempElement = document.createElement("div");
      tempElement.style.color = colorValue;
      document.body.appendChild(tempElement);
      const computed = window.getComputedStyle(tempElement).color;
      document.body.removeChild(tempElement);
      const match = computed.match(/\\d+/g);
      return match && match.length >= 3 ? \`\${match[0]}, \${match[1]}, \${match[2]}\` : "0,0,0";
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * radiusScale;

      ctx.font = \`\${fontSize}px \${fontFamily}\`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points: { x: number; y: number; z: number; char: string }[] = [];
      const rgbBase = helperGetRGB(canvas, color);

      for (let phi = 0; phi < Math.PI * 2; phi += density) {
        for (let theta = 0; theta < Math.PI; theta += density) {
          const x = Math.sin(theta) * Math.cos(phi + time * 0.5);
          const y = Math.sin(theta) * Math.sin(phi + time * 0.5);
          const z = Math.cos(theta);

          const rotY = time * speedY;
          const newX = x * Math.cos(rotY) - z * Math.sin(rotY);
          const newZ = x * Math.sin(rotY) + z * Math.cos(rotY);

          const rotX = time * speedX;
          const newY = y * Math.cos(rotX) - newZ * Math.sin(rotX);
          const finalZ = y * Math.sin(rotX) + newZ * Math.cos(rotX);

          const depth = (finalZ + 1) / 2;
          const charIndex = Math.floor(depth * (chars.length - 1));

          points.push({
            x: centerX + newX * radius,
            y: centerY + newY * radius,
            z: finalZ,
            char: chars[Math.max(0, Math.min(charIndex, chars.length - 1))],
          });
        }
      }
      points.sort((a, b) => a.z - b.z);
      points.forEach((p) => {
        const alpha = 0.15 + (p.z + 1) * 0.425;
        ctx.fillStyle = \`rgba(\${rgbBase}, \${alpha})\`;
        ctx.fillText(p.char, p.x, p.y);
      });

      time += animationSpeed;
      frameRef.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [chars, speedX, speedY, color, fontSize, radiusScale, density]);

  return <canvas ref={canvasRef} className={className} />;
}`;

  if (isCheckingLicense) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* Dynamic Reset Button (For Demo testing) */}
      {isLicensed && (
        <div className="flex justify-end">
          <button 
            onClick={resetLicense}
            className="text-xs font-mono border border-foreground/10 px-3 py-1 bg-foreground/5 hover:bg-foreground/10 text-muted-foreground rounded-lg transition-colors cursor-pointer"
          >
            🔒 Lock Component (Reset demo license state)
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Render area (with payment lock overlay if unlicensed) */}
        <Card className="lg:col-span-2 overflow-hidden border border-foreground/10 bg-background/50 backdrop-blur-md flex flex-col justify-center items-center relative aspect-square md:aspect-video lg:aspect-auto min-h-[420px]">
          <div className="absolute inset-0 z-0">
            {/* Dynamic Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
          </div>
          
          <div className={`w-[300px] h-[300px] md:w-[380px] md:h-[380px] lg:w-[450px] lg:h-[450px] z-10 transition-all duration-700 ${!isLicensed ? "blur-[7px] opacity-35 select-none pointer-events-none" : ""}`}>
            <AsciiSphere
              chars={charset}
              speedX={speedX}
              speedY={speedY}
              density={density}
              fontSize={fontSize}
              color={color}
              radiusScale={radiusScale}
              className="text-foreground"
            />
          </div>

          {/* Paywall Overlay */}
          {!isLicensed && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-background/35 backdrop-blur-xs">
              <Card className="w-full max-w-sm border border-foreground/20 bg-background/80 backdrop-blur-xl shadow-2xl p-6 text-center space-y-5 animate-in fade-in-50 zoom-in-95 duration-500">
                <div className="mx-auto w-12 h-12 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-foreground">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-display tracking-tight font-bold text-foreground">Premium Component</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This interactive 3D ASCII projection canvas is a premium 21st.dev component. Pay a one-time license fee to unlock the code and settings dashboard.
                  </p>
                </div>
                
                <div className="bg-foreground/5 border border-foreground/10 rounded-xl py-3 px-4 flex justify-between items-center text-sm font-mono">
                  <span className="text-muted-foreground">Developer License</span>
                  <span className="text-foreground font-semibold">$50.00 USD</span>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-foreground text-background py-3.5 rounded-xl text-sm font-semibold hover:bg-foreground/90 transition-all shadow-md hover:scale-[1.01] active:scale-100 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Unlock Component ($50)
                </button>
                <div className="text-[10px] text-muted-foreground font-mono">
                  Unlock once, use in unlimited projects. Secure checkout.
                </div>
              </Card>
            </div>
          )}
        </Card>

        {/* Control panel (Unlocks when licensed) */}
        <Card className="border border-foreground/10 bg-background/40 backdrop-blur-md relative overflow-hidden">
          {!isLicensed && (
            <div className="absolute inset-0 bg-background/25 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="text-xs font-mono text-muted-foreground bg-background/80 border border-foreground/10 py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-sm">
                <Lock className="w-3.5 h-3.5" />
                Settings locked
              </div>
            </div>
          )}
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-display tracking-tight text-foreground font-semibold">ASCII Sphere Settings</h3>
              <p className="text-xs text-muted-foreground">Adjust the 3D projection parameters in real-time.</p>
            </div>

            <hr className="border-foreground/10" />

            {/* Character Set Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Character Set</Label>
              <Select value={charset} onValueChange={setCharset} disabled={!isLicensed}>
                <SelectTrigger className="w-full bg-background border-foreground/10 rounded-xl">
                  <SelectValue placeholder="Select character set" />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_CHARSETS.map((set) => (
                    <SelectItem key={set.name} value={set.value}>
                      {set.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Customizer */}
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Color Style</Label>
              <Select value={color} onValueChange={setColor} disabled={!isLicensed}>
                <SelectTrigger className="w-full bg-background border-foreground/10 rounded-xl">
                  <SelectValue placeholder="Select color style" />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_COLORS.map((col) => (
                    <SelectItem key={col.name} value={col.value}>
                      <span className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-foreground/20" 
                          style={{ backgroundColor: col.value === "currentColor" ? "var(--foreground)" : col.value }}
                        />
                        {col.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Density Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <Label className="font-mono text-muted-foreground uppercase tracking-wider">Point Density</Label>
                <span className="font-mono text-foreground font-semibold">{(1 / density).toFixed(1)}x</span>
              </div>
              <Slider
                min={0.06}
                max={0.24}
                step={0.01}
                value={[density]}
                onValueChange={(val) => setDensity(val[0])}
                disabled={!isLicensed}
                className="py-2"
              />
            </div>

            {/* Font Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <Label className="font-mono text-muted-foreground uppercase tracking-wider">Font Size</Label>
                <span className="font-mono text-foreground font-semibold">{fontSize}px</span>
              </div>
              <Slider
                min={8}
                max={22}
                step={1}
                value={[fontSize]}
                onValueChange={(val) => setFontSize(val[0])}
                disabled={!isLicensed}
                className="py-2"
              />
            </div>

            {/* Radius Scale Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <Label className="font-mono text-muted-foreground uppercase tracking-wider">Sphere Radius</Label>
                <span className="font-mono text-foreground font-semibold">{(radiusScale * 100).toFixed(0)}%</span>
              </div>
              <Slider
                min={0.3}
                max={0.8}
                step={0.025}
                value={[radiusScale]}
                onValueChange={(val) => setRadiusScale(val[0])}
                disabled={!isLicensed}
                className="py-2"
              />
            </div>
            
          </CardContent>
        </Card>
      </div>

      {/* Code & Installation Block (Displays when unlocked) */}
      {isLicensed && (
        <Card className="border border-foreground/10 bg-background/30 backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-200">
          <div className="border-b border-foreground/10 bg-background/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-display font-semibold text-foreground text-lg">Developer Assets</h3>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-foreground/5 border border-foreground/10 rounded-lg p-0.5 font-mono text-xs">
              <button
                onClick={() => setActiveTab("cli")}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === "cli" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              >
                CLI Installation
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === "code" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              >
                Source Code
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "cli" ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You can install this premium component directly into your Next.js project using the 21st-dev CLI or Shadcn Registry URL:
                </p>
                
                <div className="bg-neutral-900 dark:bg-black rounded-xl p-4 border border-foreground/10 flex items-center justify-between font-mono text-xs text-white">
                  <div className="flex items-center gap-2.5 truncate">
                    <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>npx shadcn@latest add http://localhost:3000/registry/ascii-sphere.json</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("npx shadcn@latest add http://localhost:3000/registry/ascii-sphere.json", setCopiedCLI)}
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedCLI ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Component file code:</p>
                  <button
                    onClick={() => copyToClipboard(codeString, setCopiedCode)}
                    className="flex items-center gap-1.5 text-xs font-mono border border-foreground/10 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                
                <div className="max-h-[350px] overflow-y-auto bg-neutral-950 rounded-xl p-4 border border-foreground/10 font-mono text-[11px] leading-relaxed text-neutral-300">
                  <pre className="whitespace-pre">{codeString}</pre>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Embedded Component Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-md border border-foreground/10 bg-background/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display tracking-tight text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              Secure Checkout
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Powered by Stripe Mock Gateway
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCheckoutSubmit} className="space-y-6">
            {/* Summary */}
            <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-4 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-semibold text-foreground">ASCII Sphere Developer License</h4>
                <p className="text-xs text-muted-foreground">One-time payment</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-display font-bold text-foreground">$50.00</span>
                <span className="text-xs text-muted-foreground"> USD</span>
              </div>
            </div>

            {/* Mock Credit Card Graphics */}
            <div className="relative h-44 w-full bg-gradient-to-br from-neutral-800 to-neutral-950 text-white rounded-xl p-5 shadow-lg flex flex-col justify-between overflow-hidden border border-white/10">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">Optimus Card</span>
                  <div className="w-10 h-7 bg-amber-400/20 rounded-md border border-amber-400/30 flex items-center justify-center">
                    <div className="w-6 h-4 bg-amber-400/40 rounded-xs" />
                  </div>
                </div>
                <CreditCard className="w-6 h-6 text-neutral-400" />
              </div>
              
              <div className="space-y-4">
                <div className="font-mono text-lg tracking-widest text-neutral-200">
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>
                <div className="flex justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  <div>
                    <div>Card Holder</div>
                    <div className="text-white truncate max-w-[180px]">{cardName || "Your Name"}</div>
                  </div>
                  <div>
                    <div>Expires</div>
                    <div className="text-white">{expiry || "MM/YY"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-background border border-foreground/10 focus:border-foreground/30 focus:outline-hidden rounded-xl px-4 py-3 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const fmt = val.match(/.{1,4}/g)?.join(" ") || "";
                    setCardNumber(fmt.substring(0, 19));
                  }}
                  className="w-full bg-background border border-foreground/10 focus:border-foreground/30 focus:outline-hidden rounded-xl px-4 py-3 text-sm text-foreground font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">Expiration</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      let fmt = val;
                      if (val.length > 2) fmt = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
                      setExpiry(fmt.substring(0, 5));
                    }}
                    className="w-full bg-background border border-foreground/10 focus:border-foreground/30 focus:outline-hidden rounded-xl px-4 py-3 text-sm text-foreground font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">CVC</label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 4))}
                    className="w-full bg-background border border-foreground/10 focus:border-foreground/30 focus:outline-hidden rounded-xl px-4 py-3 text-sm text-foreground font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-foreground text-background py-3.5 rounded-xl text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                "Pay $50.00 USD"
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              SSL Secured connection. Demo gateway.
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
