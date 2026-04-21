"use client"

import { useState, CSSProperties } from "react"

export default function Home(){

  const [showLogin, setShowLogin] = useState(false)
  const [companyId, setCompanyId] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(){

    setLoading(true)
    setError("")

    try{

      const res = await fetch("/api/login",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          companyId,
          username,
          password
        })
      })

      const data = await res.json()

      if(!res.ok){
        throw new Error(data.message || "Login failed")
      }

      // ✅ STORE USER DATA
      localStorage.setItem("companyId", data.companyId)
      localStorage.setItem("username", data.username)
      localStorage.setItem("role", data.role)

      // ✅ REDIRECT
      if(data.role === "admin") window.location.href = "/admin"
      if(data.role === "md") window.location.href = "/md"
      if(data.role === "supervisor") window.location.href = "/supervisor"
      if(data.role === "superadmin") window.location.href = "/control-admin"

    }catch(err: any){
      setError(err?.message || "Login failed")
    }

    setLoading(false)
  }

  return(

    <div style={pageStyle}>

      {/* HERO */}
      <section style={heroStyle}>

        <div style={logoWrapper}>
          <img src="/vaultops-logo.png" style={{width:"100%"}} />
        </div>

        <h1 style={{fontSize:"42px", marginBottom:"10px"}}>
          Real-Time Production Monitoring
        </h1>

        <p style={heroText}>
          Track factory operations, detect material losses, and gain full visibility
          across your production line in real time.
        </p>

        <button onClick={()=>setShowLogin(true)} style={btnPrimary}>
          Access Platform
        </button>

      </section>


      {/* FEATURES */}
      <section style={sectionStyle}>

        <h2 style={sectionTitle}>Core Capabilities</h2>

        <div style={gridStyle}>

          <div style={cardStyle}>
            <h3>Live Production Tracking</h3>
            <p>Monitor machines and operators in real time.</p>
          </div>

          <div style={cardStyle}>
            <h3>Loss & Fraud Detection</h3>
            <p>Automatically detect abnormal material loss.</p>
          </div>

          <div style={cardStyle}>
            <h3>Executive Insights</h3>
            <p>View KPIs and efficiency metrics.</p>
          </div>

        </div>

      </section>


      {/* TESTIMONIALS */}
      <section style={testimonialSection}>

        <h2 style={sectionTitle}>Trusted by Industrial Teams</h2>

        <div style={testimonialWrapper}>

          <div style={testimonialStyle}>
            “VaultOps helped us identify hidden production losses.”
          </div>

          <div style={testimonialStyle}>
            “We now monitor every machine in real-time.”
          </div>

          <div style={testimonialStyle}>
            “Efficiency insights alone saved us major costs.”
          </div>

        </div>

      </section>


      {/* CTA */}
      <section style={ctaSection}>

        <h2 style={{marginBottom:"20px"}}>
          Ready to take control of your production?
        </h2>

        <button onClick={()=>setShowLogin(true)} style={btnPrimary}>
          Login to Your Company
        </button>

      </section>


      {/* LEONIX BRAND */}
      <section style={footerStyle}>

        <p style={{opacity:0.5}}>Powered by</p>

        <div style={companyLogo}>
          <img src="/leonix-logo.jpeg" style={{width:"100%"}} />
        </div>

        <p style={{marginTop:"10px", opacity:0.7}}>
          Leonix Studios Ltd
        </p>

      </section>


      {/* LOGIN MODAL */}
      {showLogin && (

        <div style={modalOverlay}>

          <div style={modalBox}>

            <h2>Company Login</h2>

            <input
              placeholder="Company ID"
              value={companyId}
              onChange={(e)=>setCompanyId(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              style={inputStyle}
            />

            <button onClick={handleLogin} style={btnPrimary}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <p style={{color:"red"}}>{error}</p>}

            <button onClick={()=>setShowLogin(false)} style={closeBtn}>
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  )
}


/* ================= STYLES ================= */

const pageStyle: CSSProperties = {
  background:"#020617",
  color:"white",
  fontFamily:"Arial"
}

const heroStyle: CSSProperties = {
  minHeight:"100vh",
  display:"flex",
  flexDirection:"column",
  justifyContent:"center",
  alignItems:"center",
  textAlign:"center",
  padding:"20px"
}

const logoWrapper: CSSProperties = {
  width:"120px",
  height:"120px",
  borderRadius:"50%",
  overflow:"hidden",
  marginBottom:"20px",
  border:"2px solid #1e293b"
}

const heroText: CSSProperties = {
  opacity:0.7,
  maxWidth:"500px",
  marginBottom:"30px"
}

const sectionStyle: CSSProperties = {
  padding:"80px 20px"
}

const sectionTitle: CSSProperties = {
  textAlign:"center",
  marginBottom:"50px"
}

const gridStyle: CSSProperties = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
  gap:"30px",
  maxWidth:"1000px",
  margin:"auto"
}

const cardStyle: CSSProperties = {
  background:"#0f172a",
  padding:"20px",
  borderRadius:"10px",
  border:"1px solid #1e293b"
}

const testimonialSection: CSSProperties = {
  padding:"80px 20px",
  background:"#0f172a"
}

const testimonialWrapper: CSSProperties = {
  maxWidth:"800px",
  margin:"auto",
  display:"flex",
  flexDirection:"column",
  gap:"20px"
}

const testimonialStyle: CSSProperties = {
  background:"#020617",
  padding:"20px",
  borderRadius:"8px",
  border:"1px solid #1e293b"
}

const ctaSection: CSSProperties = {
  padding:"80px 20px",
  textAlign:"center"
}

const footerStyle: CSSProperties = {
  padding:"40px",
  textAlign:"center",
  borderTop:"1px solid #1e293b"
}

const companyLogo: CSSProperties = {
  width:"70px",
  height:"70px",
  borderRadius:"50%",
  overflow:"hidden",
  margin:"auto",
  border:"1px solid #1e293b"
}

const inputStyle: CSSProperties = {
  width:"100%",
  padding:"10px",
  marginBottom:"10px",
  background:"#020617",
  border:"1px solid #1e293b",
  color:"white"
}

const btnPrimary: CSSProperties = {
  padding:"12px 24px",
  background:"#2563eb",
  border:"none",
  borderRadius:"8px",
  color:"white",
  cursor:"pointer"
}

const modalOverlay: CSSProperties = {
  position:"fixed",
  top:0,
  left:0,
  width:"100%",
  height:"100%",
  background:"rgba(0,0,0,0.7)",
  display:"flex",
  justifyContent:"center",
  alignItems:"center"
}

const modalBox: CSSProperties = {
  background:"#0f172a",
  padding:"30px",
  borderRadius:"10px",
  width:"320px"
}

const closeBtn: CSSProperties = {
  marginTop:"10px",
  background:"none",
  color:"#94a3b8",
  cursor:"pointer"
}