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
  if (companyId === "controladmin") {

  const ADMIN_USERNAME = "leonixstdltd"
  const ADMIN_PASSWORD = process.env.CONTROL_ADMIN_PASS

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  const token = signToken({
    role: "superadmin",
    username: ADMIN_USERNAME,
    companyId: "CONTROL"
  })

  const response = NextResponse.json({
    success: true,
    role: "superadmin",
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
    // 1. VALIDATE INPUT
    // =========================
    if(!companyId || !username || !password){
      return NextResponse.json(
        { message:"All fields are required" },
        { status:400 }
      )
    }

    // =========================
    // 2. FIND USER (COMPANY-SCOPED)
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
    // 3. VERIFY PASSWORD
    // =========================
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return NextResponse.json(
        { message:"Invalid credentials" },
        { status:401 }
      )
    }

    // =========================
    // 4. CREATE JWT
    // =========================
    const token = signToken({
      userId: user._id,
      role: user.role,
      companyId: user.companyId,
      username: user.username
    })

    // =========================
    // 5. RESPONSE + COOKIE
    // =========================
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