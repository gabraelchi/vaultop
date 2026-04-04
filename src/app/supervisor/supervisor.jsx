"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Topbar from "@/components/topbar"

export default function SupervisorDashboard(){

const [material,setMaterial] = useState("")
const [operator,setOperator] = useState("")
const [kg,setKg] = useState(10)

const [running,setRunning] = useState(false)
const [timer,setTimer] = useState(0)

const [showModal,setShowModal] = useState(false)
const [output,setOutput] = useState("")
const [waste,setWaste] = useState("")
const [remarks,setRemarks] = useState("")

const [message,setMessage] = useState("")
const [sessionId,setSessionId] = useState(null)

const [loading,setLoading] = useState(false)


// =========================
// MATERIALS (MATCH BACKEND)
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

const expectedOutput = Math.floor(
kg * (materialRates[material] || 1)
)


// =========================
// TIMER
// =========================
useEffect(()=>{

if(!running) return

const interval = setInterval(()=>{
setTimer(t=>t+1)
},1000)

return ()=> clearInterval(interval)

},[running])


// =========================
// START SESSION
// =========================
async function startSession(){

console.log("START CLICKED") // DEBUG

if(running){
alert("Session already running")
return
}

if(!material || !operator){
alert("Fill all fields")
return
}

setLoading(true)

try{

const res = await fetch("/api/production",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({
machineId:"Machine-1",
operator,
material,
kg
})
})

const data = await res.json()

console.log("API RESPONSE:", data) // DEBUG

if(!res.ok){
throw new Error(data.message || "Failed to start session")
}

setSessionId(data._id)
setTimer(0)
setRunning(true)
setMessage("")

}catch(err){
console.error(err)
alert(err.message)
}

setLoading(false)

}


// =========================
// STOP SESSION
// =========================
function stopSession(){

if(!running || !sessionId){
alert("No active session")
return
}

setRunning(false)
setShowModal(true)

}


// =========================
// SUBMIT OUTPUT
// =========================
async function submitOutput(){

setLoading(true)

try{

const res = await fetch("/api/production",{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({
sessionId,
actualOutput: Number(output),
waste: Number(waste),
remarks
})
})

const data = await res.json()

if(!res.ok){
throw new Error(data.message)
}

setShowModal(false)
setOutput("")
setWaste("")
setRemarks("")
setMessage("✔ Session Logged Successfully")

}catch(err){
alert(err.message)
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

<div className="grid">

<div className="card">

<h2>Session Setup</h2>

<label>Operator</label>
<input
className="bg-black text-white px-3 py-2 rounded border border-gray-600 w-full"
value={operator}
onChange={(e)=>setOperator(e.target.value)}
/>

<label>Material</label>
<select
className="bg-black text-white px-3 py-2 rounded border border-gray-600 w-full"
value={material}
onChange={(e)=>setMaterial(e.target.value)}
>

<option value="" style={{color:"black"}}>Select Material</option>

{materials.map((m,i)=>(
<option key={i} value={m} style={{color:"black"}}>
{m}
</option>
))}

</select>

<label>KG Used</label>
<input
type="number"
className="bg-black text-white px-3 py-2 rounded border border-gray-600 w-full"
value={kg}
onChange={(e)=>setKg(Number(e.target.value))}
/>

<p style={{marginTop:"10px"}}>
Expected Output: <b>{expectedOutput}</b>
</p>

<div className="buttons">

<button onClick={startSession} disabled={loading}>
{loading ? "Starting..." : "Start Session"}
</button>

<button onClick={stopSession}>
Stop Session
</button>

</div>

</div>


<div className="card">

<h2>Session Timer</h2>

<p>
{running ? `${timer} seconds running` : "No active session"}
</p>

</div>

</div>

{message && (
<div>
<p>{message}</p>
</div>
)}

{showModal && (
<div>

<h3>Enter Output Produced</h3>

<input
type="number"
placeholder="Output"
className="bg-black text-white"
value={output}
onChange={(e)=>setOutput(e.target.value)}
/>

<input
type="number"
placeholder="Waste"
className="bg-black text-white"
value={waste}
onChange={(e)=>setWaste(e.target.value)}
/>

<textarea
placeholder="Remarks"
className="bg-black text-white"
value={remarks}
onChange={(e)=>setRemarks(e.target.value)}
/>

<button onClick={submitOutput}>
Submit Output
</button>

</div>
)}

</div>
</div>
</div>

)
}