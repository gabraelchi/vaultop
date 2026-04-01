import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Production from "@/models/Production"

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  const record = await Production.create(body)
  return NextResponse.json(record)
}

export async function GET() {
  await connectDB()
  const records = await Production.find().populate("operatorId")
  return NextResponse.json(records)
}