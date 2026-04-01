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

 return (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111",
    color: "white",
    fontFamily: "Arial"
  }}>
    <div style={{
      background: "#1e1e1e",
      padding: "40px",
      borderRadius: "10px",
      width: "320px"
    }}>
      <h1 style={{ marginBottom: "20px" }}>Machine Login</h1>

      <input
        placeholder="Machine Code"
        value={machineCode}
        onChange={(e) => setMachineCode(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "5px",
          border: "none"
        }}
      />

      <input
        type="password"
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "none"
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "10px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Login
      </button>
    </div>
  </div>
)