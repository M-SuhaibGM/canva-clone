"use client";

import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

/**
 * Shared layout for the login & register pages: looping video background,
 * logo and a centred, responsive card.
 */
export default function AuthShell({ title, description, children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-purple-900/50" />
      </div>

      <div className="absolute left-6 top-6 z-10">
        <Image
          src="/logo.png"
          alt="Canva Logo"
          width={120}
          height={40}
          priority
          className="object-contain"
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <Card className="w-full max-w-[420px] border-white/20 bg-background/90 shadow-2xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
