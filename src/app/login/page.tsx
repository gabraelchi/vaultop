"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage(){

const router = useRouter()

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")

async function handleLogin(){

setError("")

const res = await fetch("/api/login",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ username, password })
})

const data = await res.json()

if(!res.ok){
setError(data.message || "Login failed")
return
}

// SAVE ROLE
localStorage.setItem("role", data.role)

// REDIRECT BASED ON ROLE
if(data.role === "admin"){
router.push("/admin")
}

if(data.role === "md"){
router.push("/md")
}

if(data.role === "supervisor"){
router.push("/supervisor")
}

}

return(

<div style={{
minHeight:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#020617",
color:"white"
}}>

<div style={{
background:"#0f172a",
padding:"40px",
borderRadius:"10px",
width:"320px"
}}>

<h1 style={{marginBottom:"20px"}}>VaultOps Login</h1>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
style={{
width:"100%",
padding:"10px",
marginBottom:"15px",
borderRadius:"5px",
border:"none"
}}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={{
width:"100%",
padding:"10px",
marginBottom:"20px",
borderRadius:"5px",
border:"none"
}}
/>

<button
onClick={handleLogin}
style={{
width:"100%",
padding:"10px",
background:"#2563eb",
color:"white",
border:"none",
borderRadius:"5px",
cursor:"pointer"
}}
>
Login
</button>

{error && (
<p style={{color:"red",marginTop:"10px"}}>
{error}
</p>
)}

</div>

</div>

)
}