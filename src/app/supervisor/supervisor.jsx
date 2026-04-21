"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Topbar from "@/components/topbar"

export default function SupervisorDashboard(){

// =========================
// MULTI SESSION STATE
// =========================
const [sessions, setSessions] = useState([])
const [loading,setLoading] = useState(false)


// =========================
// MATERIALS
// =========================
const materials = [
"MATERIAL1",
"MATERIAL2",
"MATERIAL3",
"MATERIAL4"
]

const materialRates = {
MATERIAL1: 5.8,
MATERIAL2: 4.5,
MATERIAL3: 3.2,
MATERIAL4: 6.1
}


// =========================
// ADD SESSION
// =========================
function addSession(){
setSessions(prev => [
...prev,
{
id: Date.now(),
material:"",
operator:"",
kg:10,
running:false,
timer:0,
sessionId:null
}
])
}


// =========================
// UPDATE SESSION
// =========================
function updateSession(id, field, value){
setSessions(prev =>
prev.map(s =>
s.id === id ? { ...s, [field]: value } : s
)
)
}


// =========================
// TIMER
// =========================
useEffect(()=>{
const interval = setInterval(()=>{
setSessions(prev =>
prev.map(s =>
s.running ? { ...s, timer: s.timer + 1 } : s
)
)
},1000)

return ()=> clearInterval(interval)
},[])


// =========================
// START SESSION
// =========================
async function startSession(session){

if(session.running){
alert("Already running")
return
}

if(!session.material || !session.operator){
alert("Fill all fields")
return
}

setLoading(true)

try{

const res = await fetch("/api/production",{
method:"POST",
headers:{ "Content-Type":"application/json" },
credentials:"include", // ✅ IMPORTANT (JWT COOKIE)
body: JSON.stringify({
machineId: `Machine-${session.id}-${Date.now()}`,
operator: session.operator,
material: session.material,
kg: session.kg
})
})

const data = await res.json()

if(!res.ok){
throw new Error(data.message || "Failed to start session")
}

updateSession(session.id, "sessionId", data._id)
updateSession(session.id, "running", true)
updateSession(session.id, "timer", 0)

}catch(err){
alert(err instanceof Error ? err.message : "Error starting session")
}

setLoading(false)
}


// =========================
// STOP SESSION
// =========================
async function stopSession(session){

if(!session.running){
alert("Not running")
return
}

const output = prompt("Enter Output")
const waste = prompt("Enter Waste")

setLoading(true)

try{

const res = await fetch("/api/production",{
method:"PUT",
headers:{ "Content-Type":"application/json" },
credentials:"include", // ✅ IMPORTANT
body: JSON.stringify({
sessionId: session.sessionId,
actualOutput: Number(output),
waste: Number(waste),
remarks:""
})
})

const data = await res.json()

if(!res.ok){
throw new Error(data.message || "Failed to stop session")
}

updateSession(session.id, "running", false)

}catch(err){
alert(err instanceof Error ? err.message : "Error stopping session")
}

setLoading(false)
}


// =========================
// UI
// =========================
return(

<div className="dashboard">

<Sidebar/>

<div className="main">

<Topbar/>

<div className="content">

<h1>Supervisor Production Console</h1>

<button onClick={addSession} style={{
marginBottom:"20px",
padding:"10px",
background:"#2563eb",
color:"white",
border:"none"
}}>
+ Add Session
</button>

{sessions.length === 0 && <p>No sessions yet</p>}

{sessions.map((s)=>(

<div key={s.id} className="card" style={{marginBottom:"20px"}}>

<h3>Session #{s.id}</h3>

<label>Operator</label>
<input
className="bg-black text-white w-full"
value={s.operator}
onChange={(e)=>updateSession(s.id,"operator",e.target.value)}
/>

<label>Material</label>
<select
className="bg-black text-white w-full"
value={s.material}
onChange={(e)=>updateSession(s.id,"material",e.target.value)}
>
<option value="">Select</option>
{materials.map((m,i)=>(
<option key={i} value={m}>{m}</option>
))}
</select>

<label>KG</label>
<input
type="number"
className="bg-black text-white w-full"
value={s.kg}
onChange={(e)=>updateSession(s.id,"kg",Number(e.target.value))}
/>

<p>
Expected: <b>
{Math.floor(s.kg * (materialRates[s.material] || 1))}
</b>
</p>

<p>
{s.running ? `⏱ ${s.timer}s` : "Stopped"}
</p>

<button onClick={()=>startSession(s)} disabled={loading}>
Start
</button>

<button onClick={()=>stopSession(s)}>
Stop
</button>

</div>

))}

</div>
</div>
</div>

)
}