"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef();

  const handleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setloading(false)
      router.push("/");
      toast.success("Account created")
    } else {
      const data = await res.json();
      toast.error(data.message);
      setloading(false)
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Canva Logo */}
      <div className="absolute top-6 left-6 z-10">
        <Image 
          src="/logo.png" 
          alt="Canva Logo" 
          width={120} 
          height={40}
          className="object-contain hidden md:block"
        />
      </div>

      {/* Register Card */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <Card className="w-[400px] bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={ref} onSubmit={(e) => { handleSubmit(e); ref.current.reset() }} className="flex flex-col gap-4">
              <div>
                <Label className="mb-2">Name</Label>
                <Input 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  name="name" 
                  placeholder="Enter your Name" 
                  required
                />
              </div>
              <div>
                <Label className="mb-2">Email</Label>
                <Input 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  name="email" 
                  placeholder="Enter your Email" 
                  type="email"
                  required
                />
              </div>
              <div className="relative">
                <Label className="mb-2">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength="8"
                    pattern="[A-Za-z0-9]{8,}"
                    placeholder="Enter password (min 8 characters)"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-gray-500"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button 
                disabled={loading} 
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white" 
                type="submit"
              >
                Register
                {loading && <Loader2 className="animate-spin h-4 w-4 ml-2" />}
              </Button>
            </form>
            <p className="mt-4 text-sm">
              Already have an account? <Link href="/" className="underline">Login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}