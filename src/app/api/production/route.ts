import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Production from "@/models/Production"
import { verifyToken } from "@/lib/jwt"
import { getToken } from "@/lib/getToken" // ✅ SINGLE SOURCE

// =========================
// MATERIAL YIELD
// =========================
const materialYield: any = {
  MATERIAL1: 0.85,
  MATERIAL2: 0.8,
  MATERIAL3: 0.75,
  MATERIAL4: 0.9
}

function calculateExpected(material: string, kg: number, rate?: number){
  const finalRate = rate || materialYield[material] || 1
  return kg * finalRate
}

// =========================
// FRAUD DETECTION
// =========================
function detectFraud(expected: number, actual: number){
  const margin = actual - expected

  if(margin < -5){
    return {
      alert: true,
      reason: "Material loss beyond tolerance"
    }
  }

  return {
    alert: false,
    reason: "Normal production"
  }
}

// =========================
// AUTH HELPER
// =========================
function getUser(req: Request){

  const token = getToken(req)

  if(!token) return null

  const decoded: any = verifyToken(token)

  return decoded || null
}

// =========================
// CREATE SESSION
// =========================
export async function POST(req: Request){

  await connectDB()

  try{

    const user = getUser(req)

    if(!user){
      return NextResponse.json({ message:"Unauthorized" }, { status:401 })
    }

    const body = await req.json()
    const { machineId, operator, material, kg, rate } = body

    if(!machineId || !operator || !material || !kg){
      return NextResponse.json({ message:"Missing fields" }, { status:400 })
    }

    const existing = await Production.findOne({
      machineId,
      companyId: user.companyId,
      status:"running"
    })

    if(existing){
      return NextResponse.json(
        { message:"Machine already running" },
        { status:400 }
      )
    }

    const expectedOutput = calculateExpected(material, kg, rate)

    const session = await Production.create({
      companyId: user.companyId,
      machineId,
      operator,
      material,
      kg,
      rate: rate || null,
      expectedOutput,
      status:"running",
      startTime: new Date()
    })

    return NextResponse.json(session)

  }catch(err:any){

    console.error("POST ERROR:", err)

    return NextResponse.json(
      { message:"Server error" },
      { status:500 }
    )
  }
}

// =========================
// COMPLETE SESSION
// =========================
export async function PUT(req: Request){

  await connectDB()

  try{

    const user = getUser(req)

    if(!user){
      return NextResponse.json({ message:"Unauthorized" }, { status:401 })
    }

    const body = await req.json()
    const { sessionId, actualOutput, waste, remarks } = body

    if(!sessionId){
      return NextResponse.json(
        { message:"Session ID required" },
        { status:400 }
      )
    }

    const session = await Production.findOne({
      _id: sessionId,
      companyId: user.companyId
    })

    if(!session){
      return NextResponse.json(
        { message:"Session not found" },
        { status:404 }
      )
    }

    if(session.status === "completed"){
      return NextResponse.json(
        { message:"Already completed" },
        { status:400 }
      )
    }

    const margin = actualOutput - session.expectedOutput

    const efficiency =
      session.expectedOutput > 0
      ? (actualOutput / session.expectedOutput) * 100
      : 0

    const fraud = detectFraud(session.expectedOutput, actualOutput)

    session.actualOutput = actualOutput
    session.waste = waste || 0
    session.remarks = remarks || ""
    session.margin = margin
    session.efficiency = efficiency
    session.fraud = fraud
    session.status = "completed"
    session.endTime = new Date()

    await session.save()

    return NextResponse.json(session)

  }catch(err:any){

    console.error("PUT ERROR:", err)

    return NextResponse.json(
      { message:"Server error" },
      { status:500 }
    )
  }
}

// =========================
// GET SESSIONS
// =========================
export async function GET(req: Request){

  await connectDB()

  try{

    const user = getUser(req)

    if(!user){
      return NextResponse.json({ message:"Unauthorized" }, { status:401 })
    }

    const sessions = await Production
      .find({ companyId: user.companyId })
      .sort({ createdAt: -1 })

    return NextResponse.json(sessions)

  }catch(err:any){

    console.error("GET ERROR:", err)

    return NextResponse.json(
      { message:"Server error" },
      { status:500 }
    )
  }
}