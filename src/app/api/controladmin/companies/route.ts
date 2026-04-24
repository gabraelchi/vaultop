import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Company from "@/models/Company"
import { verifyToken } from "@/lib/jwt"
import { cookies } from "next/headers"


export async function GET(){

  await connectDB()

  const cookieStore = cookies() as any // ✅ FIX HERE
  const token = cookieStore.get("token")?.value

  const decoded: any = verifyToken(token || "")

  if(!decoded || decoded.role !== "superadmin"){
    return NextResponse.json(
      { message:"Unauthorized" },
      { status:403 }
    )
  }

  const companies = await Company.find().sort({ createdAt:-1 })

  return NextResponse.json(companies)
}