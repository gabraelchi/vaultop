"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Topbar from "@/components/topbar"

export default function AdminDashboard(){

const [sessions,setSessions] = useState([])
const [activeSessions,setActiveSessions] = useState([])
const [loading,setLoading] = useState(true)


// =========================
// SAFE FETCH
// =========================
async function fetchSessions(){

try{

const res = await fetch("/api/production")

let data = []

try{
data = await res.json()
}catch{
console.warn("No JSON returned (likely server error)")
return
}

if(!res.ok){
console.error("API ERROR:", data)
return
}

setSessions(data)

setActiveSessions(
data.filter(s=>s.status === "running")
)

}catch(err){
console.error("FETCH FAILED:", err)
}

setLoading(false)

}


// =========================
// AUTO REFRESH
// =========================
useEffect(()=>{

fetchSessions()

const interval = setInterval(fetchSessions,3000)

return ()=>clearInterval(interval)

},[])


// =========================
// FRAUD STYLE SAFE
// =========================
function fraudClass(session){

if(!session) return ""

return session.margin < -5
? "fraudRed"
: "fraudGreen"

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

<h1>Admin Control Room</h1>

<div className="grid">

<div className="card">

<h2>Live Sessions</h2>

{loading && <p>Loading...</p>}

{!loading && activeSessions.length === 0 && (
<p>No active sessions</p>
)}

{activeSessions.map((s,i)=>(

<div key={i} style={{marginBottom:"10px"}}>

<p><b>Machine:</b> {s?.machineId || "-"}</p>
<p><b>Operator:</b> {s?.operator || "-"}</p>
<p><b>Material:</b> {s?.material || "-"}</p>
<p><b>KG:</b> {s?.kg || "-"}</p>

<p style={{color:"green"}}>🟢 Running</p>

<hr/>

</div>

))}

</div>


<div className="card">

<h2>Session Monitor</h2>

<p>Live monitoring of production sessions.</p>

<p>
Green = Normal production  
<br/>
Red = Possible theft detected
</p>

</div>

</div>


<div className="card" style={{marginTop:"30px"}}>

<h2>Completed Sessions</h2>

<table className="sessionTable">

<thead>
<tr>
<th>Machine</th>
<th>Operator</th>
<th>Material</th>
<th>Output</th>
<th>Efficiency</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{sessions
.filter(s=>s.status === "completed")
.map((s,i)=>(

<tr key={i}>

<td>{s?.machineId || "-"}</td>
<td>{s?.operator || "-"}</td>
<td>{s?.material || "-"}</td>
<td>{s?.actualOutput || "-"}</td>

<td>
{s?.efficiency ? `${s.efficiency.toFixed(1)}%` : "-"}
</td>

<td className={fraudClass(s)}>
{s?.margin < -5 ? "⚠ Theft Flag" : "✔ Normal"}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

</div>

)
}