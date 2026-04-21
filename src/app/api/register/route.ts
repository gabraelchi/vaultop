import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/Users"
import bcrypt from "bcryptjs"

export async function POST(req: Request){

try{

await connectDB()

const { username, password, role, companyName } = await req.json()

// 🔒 hash password
const hashedPassword = await bcrypt.hash(password, 10)

// 🏢 generate companyId
const companyId = companyName.toLowerCase().replace(/\s/g,"-")

// ❌ prevent duplicate users
const existing = await User.findOne({ username })
if(existing){
  return NextResponse.json({ message:"User already exists" }, { status:400 })
}

// ✅ create user
const user = await User.create({
  username,
  password: hashedPassword,
  role,
  companyId,
  companyName
})

return NextResponse.json({ success:true, user })

}catch(err:any){
  return NextResponse.json({ message: err.message }, { status:500 })
}

}