import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import axios from "axios";
import getSession from "@/actions/getSession";
import { PAYPAL_API, getPaypalAccessToken } from "@/lib/paypal";

// Capture an approved PayPal order and mark the user as premium.
export async function POST(request) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId is required" },
        { status: 400 }
      );
    }

    // The order must be the one created for this user.
    const subscription = await db.subscription.findUnique({ where: { userId } });
    if (!subscription || subscription.paymentId !== orderId) {
      return NextResponse.json(
        { success: false, message: "Order not found for this account" },
        { status: 404 }
      );
    }

    if (subscription.isPremium) {
      return NextResponse.json({ success: true, data: { isPremium: true } });
    }

    const accessToken = await getPaypalAccessToken();
    const response = await axios({
      method: "post",
      url: `${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data?.status !== "COMPLETED") {
      return NextResponse.json(
        { success: false, message: "Payment was not completed" },
        { status: 402 }
      );
    }

    const updated = await db.subscription.update({
      where: { userId },
      data: { isPremium: true, premiumSince: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: { isPremium: updated.isPremium, premiumSince: updated.premiumSince },
    });
  } catch (error) {
    console.error("Error capturing PayPal order:", error?.response?.data || error);
    return NextResponse.json(
      { success: false, message: "Error while capturing payment" },
      { status: 500 }
    );
  }
}
