import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Company from "@/models/Company"
import User from "@/models/Users"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/jwt"

export async function POST(req: Request){

  await connectDB()

  try{

    const { companyName, username, password } = await req.json()

    if(!companyName || !username || !password){
      return NextResponse.json(
        { message:"All fields required" },
        { status:400 }
      )
    }

    // check user exists
    const existingUser = await User.findOne({ username })

    if(existingUser){
      return NextResponse.json(
        { message:"Username already exists" },
        { status:400 }
      )
    }

    // create company
    const company = await Company.create({ name: companyName })

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create admin user
    const user = await User.create({
      username,
      password: hashedPassword,
      role: "admin",
      companyId: company._id
    })

    // create token
    const token = signToken({
      userId: user._id,
      role: user.role,
      companyId: company._id
    })

    const res = NextResponse.json({
      success:true,
      role:user.role,
      companyId: company._id,
      companyName: company.name
    })

    res.cookies.set("token", token, {
      httpOnly:true,
      path:"/",
      maxAge:60*60*24*7
    })

    return res

  }catch(err:any){
    return NextResponse.json(
      { message: err.message },
      { status:500 }
    )
  }
}