import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/Users"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/jwt"

export async function POST(req: Request){

  await connectDB()

  try{

    const { companyId, username, password } = await req.json()

    // =========================
    // CONTROL ADMIN ACCESS
    // =========================
  // =========================
// CONTROL ADMIN ACCESS
// =========================
    if (companyId === "controladmin") {

  const ADMIN_USERNAME = "leonixstdltd"
  const ADMIN_PASSWORD = process.env.CONTROL_ADMIN_PASS

  // 🔴 ENV CHECK
  if (!ADMIN_PASSWORD) {
    console.error("Missing CONTROL_ADMIN_PASS in env")
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    )
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  // ✅ FIXED ROLE HERE
  const token = signToken({
    role: "controladmin",
    username: ADMIN_USERNAME,
    companyId: "CONTROL"
  })

  const response = NextResponse.json({
    success: true,
    role: "controladmin",
    companyId: "CONTROL",
    username: ADMIN_USERNAME
  })

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  })

  return response
    }

    // =========================
    // VALIDATE INPUT
    // =========================
    if(!companyId || !username || !password){
      return NextResponse.json(
        { message:"All fields are required" },
        { status:400 }
      )
    }

    // =========================
    // FIND USER
    // =========================
    const user = await User.findOne({
      username,
      companyId
    })

    if(!user){
      return NextResponse.json(
        { message:"Invalid credentials" },
        { status:401 }
      )
    }

    // =========================
    // VERIFY PASSWORD
    // =========================
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return NextResponse.json(
        { message:"Invalid credentials" },
        { status:401 }
      )
    }

    // =========================
    // CREATE TOKEN
    // =========================
    const token = signToken({
      userId: user._id,
      role: user.role,
      companyId: user.companyId,
      username: user.username
    })

    const response = NextResponse.json({
      success:true,
      role:user.role,
      companyId:user.companyId,
      username:user.username
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    })

    return response

  }catch(err:any){

    console.error("LOGIN ERROR:", err)

    return NextResponse.json(
      { message:"Server error" },
      { status:500 }
    )
  }
}