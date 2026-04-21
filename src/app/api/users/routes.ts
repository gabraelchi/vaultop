import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/Users"
import bcrypt from "bcryptjs"
import { verifyToken } from "@/lib/jwt"

function getToken(req: Request){
  const cookie = req.headers.get("cookie") || ""
  return cookie.split("; ").find(c => c.startsWith("token="))?.split("=")[1]
}

export async function POST(req: Request){

  await connectDB()

  try{

    const token = getToken(req)
    const decoded: any = verifyToken(token || "")

    if(!decoded || decoded.role !== "admin"){
      return NextResponse.json(
        { message:"Unauthorized" },
        { status:401 }
      )
    }

    const { username, password, role } = await req.json()

    if(!username || !password || !role){
      return NextResponse.json(
        { message:"All fields required" },
        { status:400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      companyId: decoded.companyId
    })

    return NextResponse.json(user)

  }catch(err:any){
    return NextResponse.json(
      { message: err.message },
      { status:500 }
    )
  }
}