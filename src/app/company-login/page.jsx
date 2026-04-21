"use client"

import { useState } from "react"

export default function CompanyLogin(){

  const [company,setCompany] = useState("")
  const [error,setError] = useState("")

  const handleCompanyLogin = ()=>{

    if(!company){
      setError("Enter company name")
      return
    }

    // 👉 Save company context
    localStorage.setItem("companyId", company.toLowerCase())

    // 👉 Go to role login
    window.location.href = "/login"
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

        <h2>Company Access</h2>

        <input
          placeholder="Enter Company Name"
          value={company}
          onChange={(e)=>setCompany(e.target.value)}
          style={{width:"100%",padding:"10px",marginBottom:"10px"}}
        />

        <button
          onClick={handleCompanyLogin}
          style={{
            width:"100%",
            padding:"10px",
            background:"#2563eb",
            border:"none",
            color:"white",
            cursor:"pointer"
          }}
        >
          Continue
        </button>

        {error && <p style={{color:"red"}}>{error}</p>}

      </div>

    </div>

  )
}