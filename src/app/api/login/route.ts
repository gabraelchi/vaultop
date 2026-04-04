import { NextResponse } from "next/server"

export async function POST(req: Request){

const { username, password } = await req.json()

// DEMO USERS
if(username === "admin" && password === "admin123"){
 return NextResponse.json({ success:true, role:"admin" })
}

if(username === "md" && password === "md123"){
 return NextResponse.json({ success:true, role:"md" })
}

if(username === "supervisor" && password === "sup123"){
 return NextResponse.json({ success:true, role:"supervisor" })
}

return NextResponse.json(
{ success:false, message:"Invalid credentials" },
{ status:401 }
)

}