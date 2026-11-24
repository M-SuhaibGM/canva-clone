"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput from "@/components/auth/PasswordInput";
import GoogleIcon from "@/components/auth/GoogleIcon";

// Only follow same-site relative callback URLs.
function getSafeCallback(value) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/home";
}

const ERROR_MESSAGES = {
  CredentialsSignin: "Invalid email or password",
  OAuthAccountNotLinked: "This email is already registered with a different sign-in method",
  AccessDenied: "Access denied",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallback(searchParams.get("callbackUrl"));
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const busy = loading || googleLoading;

  // Errors redirected back from the OAuth flow arrive as ?error=...
  const oauthError = searchParams.get("error");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        toast.error(ERROR_MESSAGES[res?.error] || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // A full navigation guarantees the middleware sees the fresh session
      // cookie (a client-side push can be served from the router cache and
      // bounce the user back to this page).
      window.location.replace(callbackUrl);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (busy) return;
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      toast.error("Could not start Google sign in");
      setGoogleLoading(false);
    }
  };

  return (
    <>
      {oauthError && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {ERROR_MESSAGES[oauthError] || "Sign in failed. Please try again."}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            disabled={busy}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            disabled={busy}
          />
        </div>
        <Button
          disabled={busy}
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:from-pink-600 hover:to-blue-600"
          type="submit"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-gray-500">
        <span className="h-px flex-1 bg-gray-200" />
        OR
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={handleGoogle}
        className="w-full bg-white text-gray-700 hover:bg-gray-50"
      >
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Sign in with Google
      </Button>

      <p className="mt-5 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-purple-600 underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" description="Sign in to your account">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
