import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/Users"
import Company from "@/models/Company"
import bcrypt from "bcryptjs"
import { verifyToken } from "@/lib/jwt"

// helper
function getToken(req: Request){
  const cookie = req.headers.get("cookie")
  if(!cookie) return null
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/)
  return match ? match[1] : null
}

export async function POST(req: Request){

  await connectDB()

  try{

    // ✅ 1. VERIFY CONTROL ADMIN
    const token = getToken(req)
    const decoded: any = verifyToken(token || "")

    if(!decoded || decoded.role !== "controladmin"){
      return NextResponse.json(
        { message:"Unauthorized" },
        { status:403 }
      )
    }

    // ✅ 2. GET DATA
    const { companyId, companyName, users } = await req.json()

    if(!companyId || !companyName || !users){
      return NextResponse.json(
        { message:"Missing fields" },
        { status:400 }
      )
    }

    // ✅ 3. CREATE COMPANY
    const existingCompany = await Company.findOne({ companyId })

    if(existingCompany){
      return NextResponse.json(
        { message:"Company already exists" },
        { status:400 }
      )
    }

    await Company.create({ companyId, companyName })

    // ✅ 4. CREATE USERS
    const createdUsers = []

    for(const u of users){

      const hashed = await bcrypt.hash(u.password,10)

      const newUser = await User.create({
        username: u.username,
        password: hashed,
        role: u.role,
        companyId,
        companyName
      })

      createdUsers.push({
        username: newUser.username,
        role: newUser.role
      })
    }

    return NextResponse.json({
      success:true,
      message:"Company + users created",
      companyId,
      users: createdUsers
    })

  }catch(err:any){
    return NextResponse.json(
      { message: err.message },
      { status:500 }
    )
  }
}