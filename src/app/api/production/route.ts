import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Production from "@/models/Production"

// =========================
// MATERIAL YIELD LOGIC
// =========================
const materialYield:any = {
PET: 5.8,
HDPE: 4.5,
PVC: 3.2,
NYLON: 6.1
}

function calculateExpected(material:string, kg:number){
const rate = materialYield[material] || 1
return kg * rate
}

// =========================
// FRAUD DETECTION
// =========================
function detectFraud(expected:number, actual:number){
const margin = actual - expected

if(margin < -5){
return {
alert:true,
reason:"Material loss beyond tolerance"
}
}

return { alert:false }
}


// =========================
// CREATE SESSION
// =========================
export async function POST(req: Request){

await connectDB()

const body = await req.json()

const { machineId, operator, material, kg } = body

if(!machineId || !operator || !material || !kg){
return NextResponse.json({ message:"Missing fields" },{ status:400 })
}

// Prevent duplicate running session on same machine
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

const expectedOutput = calculateExpected(material, kg)

const session = await Production.create({
machineId,
operator,
material,
kg,
expectedOutput,
status:"running",
startTime: new Date()
})

return NextResponse.json(session)
}


// =========================
// COMPLETE SESSION
// =========================
export async function PUT(req: Request){

await connectDB()

const body = await req.json()

const { sessionId, actualOutput, waste, remarks } = body

const session = await Production.findById(sessionId)

if(!session){
return NextResponse.json({ message:"Session not found" },{ status:404 })
}

if(session.status === "completed"){
return NextResponse.json({ message:"Already completed" },{ status:400 })
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
}


// =========================
// GET ALL SESSIONS
// =========================
export async function GET(){

await connectDB()

const sessions = await Production.find().sort({ createdAt: -1 })

return NextResponse.json(sessions)
}