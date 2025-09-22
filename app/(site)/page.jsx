"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

export default function LoginPage() {
  const ref = useRef();
  const [loading, setloading] = useState(false);
  const [gloading, setgloading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push("/home")
      console.log("User is authenticated");
    }
  }, [session?.status, router])

  const handleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      toast.error(res.error)
      setloading(false)
    } else {
      toast.success("Logged in")
      router.push("/home")
      setloading(false)
    }
  };

  const SocialAction = () => {
    setgloading(true)
    signIn("google", {
      redirect: false
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid Credentials")
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Logged in")
          router.push("/home")
        }
      })
      .finally(() => setgloading(false))
  }

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

      {/* Login Card */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <Card className="w-[400px] bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={ref} onSubmit={(e) => { handleSubmit(e); ref.current.reset() }} className="flex flex-col gap-4">
              <div>
                <Label className="mb-2">Email</Label>
                <Input type="email" name="email" placeholder="Enter you Email" required />
              </div>
              <div className="relative">
                <Label className="mb-2">Password</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter you Password"
                    type={showPassword ? "text" : "password"}
                    required
                    name="password"
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
              <Button disabled={loading} className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white" type="submit">
                Login{loading && <Loader2 className="animate-spin h-3 w-3 ml-2" />}
              </Button>
            </form>
            <Button
              variant="outline"
              disabled={gloading}
              onClick={SocialAction}
              className="mt-2 w-full bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
                {gloading && <Loader2 className="animate-spin h-4 w-4 ml-2" />}
              </div>
            </Button>

            <p className="mt-4 text-sm">
              Don't have an account? <Link href="/register" className="underline">Register</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}