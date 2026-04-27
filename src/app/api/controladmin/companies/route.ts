import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Company from "@/models/Company"
import { verifyToken } from "@/lib/jwt"
import { cookies } from "next/headers"

export async function GET() {

  try {

    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { message: "No token" },
        { status: 401 }
      )
    }

    const decoded: any = verifyToken(token)

    if (!decoded || decoded.role !== "superadmin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      )
    }

    const companies = await Company.find().sort({ createdAt: -1 })

    return NextResponse.json(companies)

  } catch (err) {

    console.error("COMPANIES API ERROR:", err)

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}