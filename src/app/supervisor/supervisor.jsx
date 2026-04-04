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

const expectedOutput = Math.floor(kg * 0.85)


// =========================
// TIMER
// =========================
useEffect(()=>{
let interval

if(running){
interval = setInterval(()=> setTimer(t=>t+1),1000)
}

return ()=> clearInterval(interval)

},[running])


// =========================
// START SESSION
// =========================
async function startSession(){

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

if(!res.ok){
throw new Error(data.message || "Failed to start session")
}

setSessionId(data._id)
setRunning(true)
setTimer(0)
setMessage("")

}catch(err){
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

if(!sessionId){
alert("Invalid session")
return
}

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
throw new Error(data.message || "Failed to complete session")
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
// RESET
// =========================
function resetSession(){
setTimer(0)
setMessage("")
setMaterial("")
setOperator("")
setKg(10)
setSessionId(null)
setRunning(false)
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
value={operator}
onChange={(e)=>setOperator(e.target.value)}
/>

<label>Material</label>
<select
value={material}
onChange={(e)=>setMaterial(e.target.value)}
>
<option value="">Select</option>
<option value="PET">PET</option>
<option value="HDPE">HDPE</option>
<option value="PVC">PVC</option>
<option value="NYLON">NYLON</option>
</select>

<label>KG Used</label>
<input
type="number"
value={kg}
onChange={(e)=>setKg(Number(e.target.value))}
/>

<p>Expected Output: <b>{expectedOutput}</b></p>

<div className="buttons">

<button
onClick={startSession}
className="startBtn"
disabled={loading}
>
{loading ? "Starting..." : "Start Session"}
</button>

<button
onClick={stopSession}
className="stopBtn"
>
Stop Session
</button>

</div>

</div>


<div className="card">

<h2>Session Timer</h2>

<p className="timer">
{running ? `${timer} seconds running` : "No active session"}
</p>

</div>

</div>


{message && (

<div className="successBox">

<p>{message}</p>

<button onClick={resetSession}>
Start New Session
</button>

</div>

)}


{showModal && (

<div className="modalOverlay">

<div className="modal">

<h3>Enter Output Produced</h3>

<input
type="number"
placeholder="Output"
value={output}
onChange={(e)=>setOutput(e.target.value)}
/>

<input
type="number"
placeholder="Waste"
value={waste}
onChange={(e)=>setWaste(e.target.value)}
/>

<textarea
placeholder="Remarks"
value={remarks}
onChange={(e)=>setRemarks(e.target.value)}
/>

<button onClick={submitOutput} disabled={loading}>
{loading ? "Submitting..." : "Submit Output"}
</button>

</div>

</div>

)}

</div>
</div>
</div>

)
}