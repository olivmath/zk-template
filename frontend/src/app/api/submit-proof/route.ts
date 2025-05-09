import { NextResponse, NextRequest } from "next/server";
import { submitProofToZkVerify } from "@/components/services/noir/zkVerifySSR";

export async function POST(req: NextRequest) {
  try {
    console.log("Received request to submit proof");
    // Log raw body for debugging
    const rawBody = await req.text();
    // Parse JSON
    const body = JSON.parse(rawBody);
    // console.log(body);
    const { proofHex, publicInputs, vkHex } = body;

    if (!proofHex || !publicInputs || !vkHex) {
      return NextResponse.json(
        {
          error: "Missing required fields: proofHex, publicInputs, vkHex",
        },
        { status: 400 }
      );
    }

    
    const logs: string[] = [];
    await submitProofToZkVerify(proofHex, publicInputs, vkHex, (msg) => {
      logs.push(msg);
      console.log(msg);
    });

    return NextResponse.json(
      { message: "Proof submitted successfully", logs },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error submitting proof:", err);
    return NextResponse.json(
      { error: "Failed to submit proof", details: err.message },
      { status: 500 }
    );
  }
}
