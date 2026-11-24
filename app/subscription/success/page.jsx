"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { capturePaypalOrder } from "@/services/subscription-service";

function Result() {
  const params = useSearchParams();
  // PayPal sends the order id back as ?token=...
  const orderId = params.get("token");
  const [state, setState] = useState(orderId ? "loading" : "error");
  const [message, setMessage] = useState(orderId ? "" : "Missing payment reference.");
  const started = useRef(false);

  useEffect(() => {
    if (!orderId || started.current) return;
    started.current = true;

    capturePaypalOrder(orderId)
      .then((res) => {
        if (res?.success) setState("success");
        else {
          setMessage(res?.message || "We could not confirm your payment.");
          setState("error");
        }
      })
      .catch((e) => {
        setMessage(e.message || "We could not confirm your payment.");
        setState("error");
      });
  }, [orderId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-purple-600" />
            <h1 className="mt-4 text-xl font-semibold">Confirming your payment...</h1>
            <p className="mt-1 text-sm text-gray-500">Please don&apos;t close this page.</p>
          </>
        )}
        {state === "success" && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="mt-4 text-xl font-semibold">You&apos;re now a Premium member!</h1>
            <p className="mt-1 text-sm text-gray-500">Thanks for upgrading. Enjoy unlimited designs.</p>
            <Button asChild className="mt-6 bg-purple-600 hover:bg-purple-700">
              <Link href="/home">Go to dashboard</Link>
            </Button>
          </>
        )}
        {state === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-4 text-xl font-semibold">Payment not confirmed</h1>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/home">Back to dashboard</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={null}>
      <Result />
    </Suspense>
  );
}
