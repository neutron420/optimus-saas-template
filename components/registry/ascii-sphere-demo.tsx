"use client";

import React, { useState } from "react";
import { AsciiSphere } from "./ascii-sphere";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Render area */}
        <Card className="lg:col-span-2 overflow-hidden border border-foreground/10 bg-background/50 backdrop-blur-md flex flex-col justify-center items-center relative aspect-square md:aspect-video lg:aspect-auto min-h-[400px]">
          <div className="absolute inset-0 z-0">
            {/* Dynamic Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
          </div>
          
          <div className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] lg:w-[450px] lg:h-[450px] z-10">
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
        </Card>

        {/* Control panel */}
        <Card className="border border-foreground/10 bg-background/40 backdrop-blur-md">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-display tracking-tight text-foreground font-semibold">ASCII Sphere Settings</h3>
              <p className="text-xs text-muted-foreground">Adjust the 3D projection parameters in real-time.</p>
            </div>

            <hr className="border-foreground/10" />

            {/* Character Set Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Character Set</Label>
              <Select value={charset} onValueChange={setCharset}>
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
              <Select value={color} onValueChange={setColor}>
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
                className="py-2"
              />
              <p className="text-[10px] text-muted-foreground">Lower value generates more points (dense 3D mesh).</p>
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
                className="py-2"
              />
            </div>

            {/* Speed X Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <Label className="font-mono text-muted-foreground uppercase tracking-wider">Pitch Speed (X-Axis)</Label>
                <span className="font-mono text-foreground font-semibold">{speedX.toFixed(2)} rad/s</span>
              </div>
              <Slider
                min={-1}
                max={1}
                step={0.05}
                value={[speedX]}
                onValueChange={(val) => setSpeedX(val[0])}
                className="py-2"
              />
            </div>

            {/* Speed Y Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <Label className="font-mono text-muted-foreground uppercase tracking-wider">Yaw Speed (Y-Axis)</Label>
                <span className="font-mono text-foreground font-semibold">{speedY.toFixed(2)} rad/s</span>
              </div>
              <Slider
                min={-1}
                max={1}
                step={0.05}
                value={[speedY]}
                onValueChange={(val) => setSpeedY(val[0])}
                className="py-2"
              />
            </div>
            
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
