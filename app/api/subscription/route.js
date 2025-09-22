import { db } from "@/lib/db";
import { NextResponse } from "next/server";// or your auth solution\
import axios from "axios";
import getSession from "@/actions/getSession";

export async function GET(request) {
    try {
        const session = await getSession()
        const userId = session.user?.id// adapt to your user object

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // ✅ Check subscription
        let subscription = await db.subscription.findUnique({
            where: {
                userId: userId,
            },
        });

        // If not found, create a default record
        if (!subscription) {
            subscription = await db.subscription.create({
                data: {
                    userId: userId,
                },
            });
        }

        // ✅ Respond
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



const PAYPAL_API =
    process.env.NODE_ENV === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ✅ Helper to get PayPal Access Token
async function getAccessToken() {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const response = await axios({
        method: "post",
        url: `${PAYPAL_API}/v1/oauth2/token`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${auth}`,
        },
        data: "grant_type=client_credentials",
    });

    return response.data.access_token;
}

// ✅ POST route handler
export async function POST() {
    try {
        // 1️⃣ Optional: check if user is logged in
        const session = await getSession()
        const userId = session.user?.id//

        // 2️⃣ Get PayPal access token
        const accessToken = await getAccessToken();

        // 3️⃣ Create PayPal order
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
                        amount: {
                            currency_code: "USD",
                            value: "500", // amount
                        },
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

        // 4️⃣ (Optional) store pending order in DB for logged-in user
        if (userId) {
            await db.subscription.upsert({
                where: { userId },
                update: {
                    paymentId: order.id,
                },
                create: {
                    userId,
                    paymentId: order.id,
                    isPremium: false,
                },
            });
        }

        // 5️⃣ Return PayPal order info
        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                approvalLink,
            },
        });
    } catch (error) {
        console.error("Error while creating PayPal order:", error);
        return NextResponse.json(
            { success: false, message: "Error while creating PayPal order" },
            { status: 500 }
        );
    }
}
