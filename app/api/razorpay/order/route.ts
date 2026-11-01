import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planName, amount, currency = "INR" } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    // If live/test Razorpay keys are configured, call the Razorpay API
    if (keyId && keySecret) {
      const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
      
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: currency,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            userEmail: user.primaryEmailAddress?.emailAddress || "",
            planName: planName || "Monthly Pro",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Razorpay order creation failed:", errorData);
        return NextResponse.json({ error: errorData.error?.description || "Order creation failed" }, { status: 400 });
      }

      const orderData = await response.json();
      return NextResponse.json({
        id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: keyId,
        isDemo: false,
      });
    }

    // Demo/Development mode fallback when API keys are not yet added to .env.local
    const mockOrderId = `order_demo_${Date.now()}`;
    return NextResponse.json({
      id: mockOrderId,
      amount: amountInPaise,
      currency: currency,
      keyId: "rzp_test_demo_key",
      isDemo: true,
      message: "Running in instant development test mode. Real Razorpay keys can be configured in .env.local.",
    });
  } catch (error: any) {
    console.error("Razorpay order error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
