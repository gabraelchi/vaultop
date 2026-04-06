"use client"

import { useState } from "react"

export default function LoginPage(){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")

const handleLogin = async ()=>{

try{

const res = await fetch("/api/login",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ username, password })
})

const data = await res.json()

if(!res.ok){
throw new Error(data.message || "Login failed")
}

// ✅ SAVE ROLE
localStorage.setItem("role", data.role)

// ✅ REDIRECT
if(data.role === "admin") window.location.href = "/admin"
if(data.role === "md") window.location.href = "/md"
if(data.role === "supervisor") window.location.href = "/supervisor"

} catch(err){

if(err instanceof Error){
setError(err.message)
}else{
setError("Something went wrong")
}

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
padding:"30px",
borderRadius:"10px",
width:"300px"
}}>

<h2>Login</h2>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
style={{width:"100%",padding:"10px",marginBottom:"10px"}}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={{width:"100%",padding:"10px",marginBottom:"10px"}}
/>

<button
onClick={handleLogin}
style={{
width:"100%",
padding:"10px",
background:"#2563eb",
border:"none",
color:"white",
cursor:"pointer"
}}
>
Login
</button>

{error && <p style={{color:"red",marginTop:"10px"}}>{error}</p>}

</div>

</div>

)
}