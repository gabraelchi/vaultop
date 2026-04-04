import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Production from "@/models/Production"

// =========================
// MATERIAL YIELD (DYNAMIC READY)
// =========================
// TEMP fallback — later this comes from DB per company
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
// CREATE SESSION
// =========================
export async function POST(req: Request){

await connectDB()

try{

const body = await req.json()

const { machineId, operator, material, kg, rate } = body

if(!machineId || !operator || !material || !kg){
return NextResponse.json(
{ message:"Missing fields" },
{ status:400 }
)
}

// Prevent duplicate running session per machine
const existing = await Production.findOne({
machineId,
status:"running"
})

if(existing){
return NextResponse.json(
{ message:"Machine already running a session" },
{ status:400 }
)
}

// Dynamic expected output
const expectedOutput = calculateExpected(material, kg, rate)

const session = await Production.create({
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

return NextResponse.json(
{ message: err.message || "Server error" },
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

const body = await req.json()

const { sessionId, actualOutput, waste, remarks } = body

if(!sessionId){
return NextResponse.json(
{ message:"Session ID required" },
{ status:400 }
)
}

const session = await Production.findById(sessionId)

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

return NextResponse.json(
{ message: err.message || "Server error" },
{ status:500 }
)

}

}


// =========================
// GET ALL SESSIONS
// =========================
export async function GET(){

await connectDB()

try{

const sessions = await Production
.find()
.sort({ createdAt: -1 })

return NextResponse.json(sessions)

}catch(err:any){

return NextResponse.json(
{ message: err.message || "Server error" },
{ status:500 }
)

}

}