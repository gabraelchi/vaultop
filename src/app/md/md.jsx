"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Topbar from "@/components/topbar"

import { Line } from "react-chartjs-2"
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend
} from "chart.js"

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend
)

export default function MDDashboard(){

const [sessions,setSessions] = useState([])
const [activeSessions,setActiveSessions] = useState([])
const [loading,setLoading] = useState(true)


// =========================
// FETCH FROM DB
// =========================
async function fetchSessions(){

try{

const res = await fetch("/api/production")
const data = await res.json()

if(!res.ok){
throw new Error("Failed to fetch data")
}

setSessions(data)

setActiveSessions(
data.filter(s=>s.status==="running")
)

}catch(err){
console.error(err)
}

setLoading(false)

}


// =========================
// LOAD + AUTO REFRESH
// =========================
useEffect(()=>{

fetchSessions()

const interval = setInterval(fetchSessions,3000)

return ()=>clearInterval(interval)

},[])


// =========================
// CALCULATIONS
// =========================
const completed =
sessions
.filter(s=>s.status==="completed")
.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)) // newest first

const totalSessions = completed.length

const totalProduction =
completed.reduce((sum,s)=>sum + (s.actualOutput || 0),0)

const fraudCount =
completed.filter(s=>s.margin < -5).length

const avgEfficiency =
completed.length
? completed.reduce((sum,s)=>sum + (s.efficiency || 0),0) / completed.length
: 0

const totalWaste =
completed.reduce((sum,s)=>sum + (s.waste || 0),0)


// =========================
// CHART DATA (SAFE)
// =========================
const chartData = {
labels: completed.map((_,i)=>`S${i+1}`),
datasets:[
{
label:"Production Output",
data: completed.map(s=>s.actualOutput || 0),
tension:0.3
}
]
}


// =========================
// FRAUD STYLE
// =========================
function fraudClass(session){
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

<h1>Managing Director Dashboard</h1>

{loading && <p>Loading dashboard...</p>}


{/* KPI CARDS */}
<div className="grid">

<div className="card">
<h2>Total Sessions</h2>
<p>{totalSessions}</p>
</div>

<div className="card">
<h2>Total Production</h2>
<p>{totalProduction}</p>
</div>

<div className="card">
<h2>Avg Efficiency</h2>
<p>{avgEfficiency ? avgEfficiency.toFixed(1) : 0}%</p>
</div>

<div className="card">
<h2>Fraud Alerts</h2>
<p className="fraudRed">{fraudCount}</p>
</div>

<div className="card">
<h2>Total Waste</h2>
<p>{totalWaste}</p>
</div>

</div>


{/* LIVE SESSIONS */}
<div className="card" style={{marginTop:"20px"}}>

<h2>Live Factory Status</h2>

{activeSessions.length === 0 && <p>No active sessions</p>}

{activeSessions.map((s,i)=>(

<div key={i} style={{marginBottom:"10px"}}>

<p><b>Machine:</b> {s.machineId}</p>
<p><b>Operator:</b> {s.operator}</p>
<p><b>Material:</b> {s.material}</p>

<p style={{color:"green"}}>🟢 Running</p>

<hr/>

</div>

))}

</div>


{/* CHART */}
<div className="card" style={{marginTop:"20px"}}>

<h2>Production Trend</h2>

{completed.length === 0
? <p>No data yet</p>
: <Line data={chartData} />
}

</div>


{/* INSIGHTS */}
<div className="card" style={{marginTop:"20px"}}>

<h2>Insights</h2>

{fraudCount > 0 && (
<p style={{color:"red"}}>
⚠ {fraudCount} loss alert(s) detected
</p>
)}

{avgEfficiency < 75 && completed.length > 0 && (
<p style={{color:"orange"}}>
⚠ Efficiency below optimal level
</p>
)}

{totalWaste > 0 && (
<p>
⚠ Waste recorded: {totalWaste}
</p>
)}

{fraudCount === 0 && avgEfficiency >= 75 && completed.length > 0 && (
<p style={{color:"green"}}>
✔ Production operating normally
</p>
)}

</div>


{/* SESSION TABLE */}
<div className="card" style={{marginTop:"20px"}}>

<h2>Session Analysis</h2>

<table className="sessionTable">

<thead>
<tr>
<th>Machine</th>
<th>Operator</th>
<th>Output</th>
<th>Efficiency</th>
<th>Waste</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{completed.map((s,i)=>(

<tr key={i}>

<td>{s.machineId}</td>
<td>{s.operator}</td>
<td>{s.actualOutput}</td>

<td>
{s.efficiency ? `${s.efficiency.toFixed(1)}%` : "-"}
</td>

<td>{s.waste || 0}</td>

<td className={fraudClass(s)}>
{s.margin < -5 ? "⚠ Loss" : "✔ OK"}
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