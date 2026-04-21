"use client"

import { useEffect, useState } from "react"

export default function Topbar(){

  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)

  // =========================
  // LOAD USER FROM BACKEND (JWT)
  // =========================
  async function loadUser(){

    try{

      const res = await fetch("/api/me", {
        cache:"no-store"
      })

      if(!res.ok){
        window.location.href = "/company-login"
        return
      }

      const data = await res.json()
      setUser(data)

    }catch(err){
      console.error(err)
      window.location.href = "/company-login"
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    loadUser()
  },[])


  // =========================
  // LOGOUT
  // =========================
  async function handleLogout(){

    try{
      await fetch("/api/logout", { method:"POST" })
    }catch(err){
      console.error(err)
    }

    localStorage.clear() // optional now
    window.location.href = "/company-login"
  }


  // =========================
  // UI
  // =========================
  return(

    <div className="h-16 bg-[#0f172a] flex items-center justify-between px-6 border-b border-gray-800">

      {/* LEFT */}
      <input
        placeholder="Search..."
        className="bg-[#020617] px-4 py-2 rounded text-white"
      />

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* COMPANY */}
        <span className="text-gray-400 text-sm">
          {loading ? "Loading..." : user?.companyId || "—"}
        </span>

        {/* USER */}
        <div className="text-right text-sm">
          <p className="text-white">
            {loading ? "" : user?.username || "User"}
          </p>
          <p className="text-gray-400 text-xs capitalize">
            {loading ? "" : user?.role}
          </p>
        </div>

        {/* AVATAR */}
        <div className="w-8 h-8 rounded-full bg-purple-500"/>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded text-white text-sm"
        >
          Logout
        </button>

      </div>

    </div>

  )
}