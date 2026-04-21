import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Company from "@/models/Company"
import { verifyToken } from "@/lib/jwt"

function getToken(req: Request){
  const cookie = req.headers.get("cookie")
  if(!cookie) return null
  const match = cookie.match(/token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request){

  await connectDB()

  const token = getToken(req)
  const decoded: any = verifyToken(token || "")

  if(!decoded || decoded.role !== "controladmin"){
    return NextResponse.json({ message:"Unauthorized" },{ status:403 })
  }

  const companies = await Company.find().sort({ createdAt:-1 })

  return NextResponse.json(companies)
}