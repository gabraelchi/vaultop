import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Operator from "@/models/Operator"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const hashedPin = await bcrypt.hash(body.pin, 10)

    const operator = await Operator.create({
      fullName: body.fullName,
      machineCode: body.machineCode,
      pinHash: hashedPin,
      role: "operator",
    })

    return NextResponse.json(operator, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  await connectDB()
  const operators = await Operator.find().select("-pinHash")
  return NextResponse.json(operators)
}
