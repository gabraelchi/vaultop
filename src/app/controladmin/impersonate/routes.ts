import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/Users"
import { verifyToken, signToken } from "@/lib/jwt"

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

    // ✅ VERIFY CONTROL ADMIN
    const token = getToken(req)
    const decoded: any = verifyToken(token || "")

    if(!decoded || decoded.role !== "controladmin"){
      return NextResponse.json(
        { message:"Unauthorized" },
        { status:403 }
      )
    }

    // ✅ GET TARGET USER
    const { companyId, role } = await req.json()

    if(!companyId || !role){
      return NextResponse.json(
        { message:"Missing data" },
        { status:400 }
      )
    }

    // ✅ FIND USER IN THAT COMPANY
    const user = await User.findOne({ companyId, role })

    if(!user){
      return NextResponse.json(
        { message:"User not found" },
        { status:404 }
      )
    }

    // ✅ CREATE NEW TOKEN (IMPERSONATED)
    const newToken = signToken({
      userId: user._id,
      role: user.role,
      companyId: user.companyId
    })

    // ✅ SET COOKIE
    const res = NextResponse.json({
      success:true,
      role:user.role,
      companyId:user.companyId,
      username:user.username,
      companyName:user.companyName
    })

    res.cookies.set("token", newToken, {
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