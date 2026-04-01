"use client"

import {useEffect,useRef,useState} from "react"
import Sidebar from "@/components/sidebar"
import Topbar from "@/components/topbar"

export default function AdminDashboard(){

const socketRef = useRef(null)

const [activeSession,setActiveSession] = useState(null)
const [completed,setCompleted] = useState([])

useEffect(()=>{

socketRef.current = new WebSocket("ws://localhost:4000")

socketRef.current.onopen = ()=>{
console.log("Admin connected to engine")
}

socketRef.current.onmessage = (event)=>{

const data = JSON.parse(event.data)

if(data.type === "SESSION_STARTED"){
setActiveSession(data.session)
}

if(data.type === "SESSION_COMPLETED"){

setCompleted(prev=>[data,...prev])

setActiveSession(null)

}

}

return ()=>{
socketRef.current.close()
}

},[])

function fraudClass(alert){

return alert ? "fraudRed" : "fraudGreen"

}

return(

<div className="dashboard">

<Sidebar/>

<div className="main">

<Topbar/>

<div className="content">

<h1>Admin Control Room</h1>

<div className="grid">

{/* LIVE SESSION */}

<div className="card">

<h2>Active Session</h2>

{activeSession ? (

<div>

<p><b>Operator:</b> {activeSession.operator}</p>
<p><b>Material:</b> {activeSession.material}</p>
<p><b>KG Used:</b> {activeSession.kg}</p>
<p><b>Expected Output:</b> {activeSession.expectedOutput}</p>

</div>

):( <p>No active session</p> )}

</div>


{/* SESSION STATUS PANEL */}

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


{/* COMPLETED SESSIONS */}

<div className="card" style={{marginTop:"30px"}}>

<h2>Completed Sessions</h2>

<table className="sessionTable">

<thead>

<tr>
<th>Operator</th>
<th>Material</th>
<th>Output</th>
<th>Margin</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{completed.map((s,i)=>(

<tr key={i}>

<td>{s.session.operator}</td>
<td>{s.session.material}</td>
<td>{s.session.actualOutput}</td>
<td>{s.session.margin}</td>

<td className={fraudClass(s.fraud.alert)}>

{s.fraud.alert ? "⚠ Theft Flag" : "✔ Normal"}

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