"use client"

import { useEffect } from "react"
import AdminDashboard from "./admin"

export default function Page(){

  useEffect(()=>{
    const role = localStorage.getItem("role")

    if(role !== "admin"){
      window.location.href = "/login"
    }
  },[])

  return <AdminDashboard/>
}