import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <XCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="mt-4 text-xl font-semibold">Payment cancelled</h1>
        <p className="mt-1 text-sm text-gray-500">No charge was made. You can upgrade any time.</p>
        <Button asChild className="mt-6 bg-purple-600 hover:bg-purple-700">
          <Link href="/home">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
