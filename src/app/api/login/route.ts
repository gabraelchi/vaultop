import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { machineCode, pin } = body;

  console.log("Machine Code:", machineCode);
  console.log("PIN:", pin);

  // Demo credentials
  if (machineCode === "MACHINE123" && pin === "4321") {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
}