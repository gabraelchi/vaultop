"use client"

import { useEffect, useState } from "react"
import SupervisorDashboard from "./supervisor"

export default function Page(){

  const [authorized, setAuthorized] = useState(false)

  useEffect(()=>{
    if(typeof window !== "undefined"){
      const role = localStorage.getItem("role")

      if(role === "supervisor"){
        setAuthorized(true)
      } else {
        window.location.href = "/login"
      }
    }
  },[])

  if(!authorized){
    return null
  }

  return <SupervisorDashboard/>
}