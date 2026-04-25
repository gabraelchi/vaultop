import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Company from "@/models/Company"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: Request){

  try{

    const { companyId, username, password } = await req.json()

    // ✅ CONTROL ADMIN LOGIN
 if(companyId === "controladmin"){

  const ADMIN_USERNAME = "leonixstdltd"
  const ADMIN_PASSWORD = process.env.CONTROL_ADMIN_PASS

  console.log("CONTROL ADMIN ENV:", ADMIN_PASSWORD) // ✅ ADD THIS

      if(!ADMIN_PASSWORD){
        return NextResponse.json(
          { message:"Server config error" },
          { status:500 }
        )
      }

      if(username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD){
        return NextResponse.json(
          { message:"Invalid credentials" },
          { status:401 }
        )
      }

      const token = jwt.sign(
        { role:"superadmin" },
        process.env.JWT_SECRET!,
        { expiresIn:"7d" }
      )

      const res = NextResponse.json({
        companyId,
        username,
        role:"superadmin"
      })

      res.cookies.set("token", token)

      return res
    }

    // ================= NORMAL USERS =================

    await connectDB()

    const company = await Company.findOne({ companyId })

    if(!company){
      return NextResponse.json(
        { message:"Company not found" },
        { status:404 }
      )
    }

    const user = company.users.find((u:any)=>u.username === username)

    if(!user){
      return NextResponse.json(
        { message:"User not found" },
        { status:404 }
      )
    }

    const valid = await bcrypt.compare(password, user.password)

    if(!valid){
      return NextResponse.json(
        { message:"Invalid credentials" },
        { status:401 }
      )
    }

    const token = jwt.sign(
      {
        companyId,
        username,
        role:user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn:"7d" }
    )

    const res = NextResponse.json({
      companyId,
      username,
      role:user.role
    })

    res.cookies.set("token", token)

    return res

  }catch(err){
    console.error(err)
    return NextResponse.json(
      { message:"Server error" },
      { status:500 }
    )
  }
}