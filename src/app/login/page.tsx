"use client"
import { useState } from "react"
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

  return NextResponse.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 }
  );
}

export default function LoginPage() {
  const [machineCode, setMachineCode] = useState("")
  const [pin, setPin] = useState("")

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machineCode, pin })
    })

    const data = await res.json()
    console.log(data)
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Login</h1>

      <input
        placeholder="Machine Code"
        value={machineCode}
        onChange={(e) => setMachineCode(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  )
}