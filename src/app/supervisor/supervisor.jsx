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

const expectedOutput = Math.floor(kg * 0.85)


// =========================
// TIMER
// =========================
useEffect(()=>{

let interval

if(running){

interval = setInterval(()=>{
setTimer(t=>t+1)
},1000)

}

return ()=>clearInterval(interval)

},[running])


// =========================
// START SESSION (API)
// =========================
async function startSession(){

if(!material || !operator){
alert("Fill all fields")
return
}

const res = await fetch("/api/production",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({
machineId:"Machine-1", // can make dynamic later
operator,
material,
kg
})
})

const data = await res.json()

setSessionId(data._id)
setRunning(true)
setTimer(0)
setMessage("")

}


// =========================
// STOP SESSION
// =========================
function stopSession(){

setRunning(false)
setShowModal(true)

}


// =========================
// SUBMIT OUTPUT (API)
// =========================
async function submitOutput(){

await fetch("/api/production",{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({
sessionId,
actualOutput: output,
waste,
remarks
})
})

setShowModal(false)
setOutput("")
setWaste("")
setRemarks("")
setMessage("✔ Session Logged Successfully")

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

{/* SESSION SETUP */}
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
>
Start Session
</button>

<button
onClick={stopSession}
className="stopBtn"
>
Stop Session
</button>

</div>

</div>


{/* TIMER */}
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


{/* OUTPUT MODAL */}
{showModal && (

<div className="modalOverlay">

<div className="modal">

<h3>Enter Output Produced</h3>

<input
type="number"
placeholder="Output"
value={output}
onChange={(e)=>setOutput(Number(e.target.value))}
/>

<input
type="number"
placeholder="Waste"
value={waste}
onChange={(e)=>setWaste(Number(e.target.value))}
/>

<textarea
placeholder="Remarks"
value={remarks}
onChange={(e)=>setRemarks(e.target.value)}
/>

<button onClick={submitOutput}>
Submit Output
</button>

</div>

</div>

)}

</div>

</div>

</div>

)

}