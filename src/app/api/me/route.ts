import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"

function getToken(req: Request){
  const cookie = req.headers.get("cookie")
  if(!cookie) return null

  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request){

  try{

    const token = getToken(req)

    if(!token){
      return NextResponse.json(
        { message:"Unauthorized" },
        { status:401 }
      )
    }

    const decoded: any = verifyToken(token)

    if(!decoded){
      return NextResponse.json(
        { message:"Invalid token" },
        { status:401 }
      )
    }

    return NextResponse.json({
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      companyId: decoded.companyId
    })

  }catch(err){
    return NextResponse.json(
      { message:"Server error" },
      { status:500 }
    )
  }
}