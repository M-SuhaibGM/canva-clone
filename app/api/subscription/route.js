import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import axios from "axios";
import getSession from "@/actions/getSession";
import { PAYPAL_API, getPaypalAccessToken } from "@/lib/paypal";

const FRONTEND_URL =
  process.env.FRONTEND_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
// Price charged for premium, in USD. Override with PREMIUM_PRICE_USD.
const PREMIUM_PRICE_USD = process.env.PREMIUM_PRICE_USD || "500";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let subscription = await db.subscription.findUnique({ where: { userId } });

    // First visit: create a default (free) record.
    if (!subscription) {
      subscription = await db.subscription.create({ data: { userId } });
    }

    return NextResponse.json({
      success: true,
      data: {
        isPremium: subscription.isPremium,
        premiumSince: subscription.premiumSince,
      },
    });
  } catch (error) {
    console.error("Error getting subscription:", error);
    return NextResponse.json(
      { success: false, message: "Some error occurred" },
      { status: 500 }
    );
  }
}

// Create a PayPal order for the signed-in user.
export async function POST() {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const accessToken = await getPaypalAccessToken();

    const response = await axios({
      method: "post",
      url: `${PAYPAL_API}/v2/checkout/orders`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: PREMIUM_PRICE_USD },
            description: "Canva Premium Membership",
          },
        ],
        application_context: {
          return_url: `${FRONTEND_URL}/subscription/success`,
          cancel_url: `${FRONTEND_URL}/subscription/cancel`,
        },
      },
    });

    const order = response.data;
    const approvalLink = order.links.find((link) => link.rel === "approve")?.href;

    // Remember the pending order so it can be verified on capture.
    await db.subscription.upsert({
      where: { userId },
      update: { paymentId: order.id },
      create: { userId, paymentId: order.id, isPremium: false },
    });

    return NextResponse.json({
      success: true,
      data: { orderId: order.id, approvalLink },
    });
  } catch (error) {
    console.error("Error while creating PayPal order:", error?.response?.data || error);
    return NextResponse.json(
      { success: false, message: "Error while creating PayPal order" },
      { status: 500 }
    );
  }
}
