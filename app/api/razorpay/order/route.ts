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

    const isPlaceholderKey = !keyId || !keySecret || 
      keyId.includes("WanderAI") || 
      keySecret.includes("WanderAI") ||
      keyId === "rzp_test_demo_key";

    // If real Razorpay merchant keys are configured, call the Razorpay API
    if (!isPlaceholderKey && keyId && keySecret) {
      try {
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

        if (response.ok) {
          const orderData = await response.json();
          return NextResponse.json({
            id: orderData.id,
            amount: orderData.amount,
            currency: orderData.currency,
            keyId: keyId,
            isDemo: false,
          });
        }

        const errorData = await response.json();
        console.warn("Razorpay API returned error, falling back to simulated checkout:", errorData);
      } catch (fetchErr) {
        console.warn("Razorpay network error, falling back to simulated checkout:", fetchErr);
      }
    }

    // Seamless Demo/Test mode fallback (allows testing UPI/Card flow without invalid key errors)
    const mockOrderId = `order_demo_${Date.now()}`;
    return NextResponse.json({
      id: mockOrderId,
      amount: amountInPaise,
      currency: currency,
      keyId: "rzp_test_demo_key",
      isDemo: true,
      message: "Running in sandbox test mode. Add live Razorpay keys to .env.local to charge real UPI/cards.",
    });
  } catch (error: any) {
    console.error("Razorpay order error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
