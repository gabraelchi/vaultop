"use client"

import { useEffect, useState } from "react"

export default function ControlAdmin(){

  const [companyId,setCompanyId] = useState("")
  const [companyName,setCompanyName] = useState("")
  const [users,setUsers] = useState([
    { username:"", password:"", role:"admin" }
  ])
  const [companies,setCompanies] = useState([])

  // ================= LOAD COMPANIES =================
  async function loadCompanies(){
    const res = await fetch("/api/controladmin/companies")
    const data = await res.json()
    setCompanies(data)
  }

  useEffect(()=>{
    loadCompanies()
  },[])

  // ================= ADD USER =================
  function addUser(){
    setUsers(prev => [
      ...prev,
      { username:"", password:"", role:"supervisor" }
    ])
  }

  function updateUser(i, field, value){
    setUsers(prev =>
      prev.map((u,index)=>
        index === i ? { ...u, [field]: value } : u
      )
    )
  }

  // ================= CREATE COMPANY =================
  async function createCompany(){

    const res = await fetch("/api/controladmin/create-company",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        companyId,
        companyName,
        users
      })
    })

    const data = await res.json()

    if(!res.ok){
      alert(data.message)
      return
    }

    alert("Company created")

    setCompanyId("")
    setCompanyName("")
    setUsers([{ username:"", password:"", role:"admin" }])

    loadCompanies()
  }

  // ================= UI =================
  return(

    <div style={{padding:"40px", color:"white"}}>

      <h1>Control Admin Panel</h1>

      {/* CREATE COMPANY */}
      <div style={{marginBottom:"40px"}}>

        <input
          placeholder="Company ID"
          value={companyId}
          onChange={(e)=>setCompanyId(e.target.value)}
        />

        <input
          placeholder="Company Name"
          value={companyName}
          onChange={(e)=>setCompanyName(e.target.value)}
        />

        <h3>Users</h3>

        {users.map((u,i)=>(

          <div key={i}>

            <input
              placeholder="Username"
              value={u.username}
              onChange={(e)=>updateUser(i,"username",e.target.value)}
            />

            <input
              placeholder="Password"
              value={u.password}
              onChange={(e)=>updateUser(i,"password",e.target.value)}
            />

            <select
              value={u.role}
              onChange={(e)=>updateUser(i,"role",e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="md">MD</option>
              <option value="supervisor">Supervisor</option>
            </select>

          </div>

        ))}

        <button onClick={addUser}>+ Add User</button>

        <br/><br/>

        <button onClick={createCompany}>
          Create Company
        </button>

      </div>


      {/* COMPANY CARDS */}
      <h2>Companies</h2>

      <div style={{display:"grid", gap:"20px"}}>

        {companies.map((c,i)=>(

          <div key={i} style={{
            padding:"20px",
            border:"1px solid #333",
            borderRadius:"10px"
          }}>

            <h3>{c.companyName}</h3>
            <p>{c.companyId}</p>

            <button>
              Open (next step)
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}