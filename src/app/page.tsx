import Link from "next/link"

export default function Home() {

  return (

    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(180deg,#0b1a2b,#02060d)",
      color: "white",
      fontFamily: "Arial"
    }}>

      {/* LOGO */}
      <img 
        src="/vaultops-logo.png" 
        alt="VaultOps Logo"
        style={{ width: "120px", marginBottom: "20px" }}
      />

      {/* TITLE */}
      <h1 style={{
        fontSize: "48px",
        letterSpacing: "3px",
        marginBottom: "10px"
      }}>
        VAULTOPS
      </h1>

      <p style={{
        opacity: 0.7,
        marginBottom: "40px"
      }}>
        Industrial Command Platform
      </p>

      {/* ROLE BUTTONS */}

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "250px"
      }}>

        <Link href="/supervisor">
          <button style={buttonStyle}>Supervisor Portal</button>
        </Link>

        <Link href="/admin">
          <button style={buttonStyle}>Admin Control</button>
        </Link>

        <Link href="/md">
          <button style={buttonStyle}>Managing Director</button>
        </Link>

      </div>

    </div>
  )
}

const buttonStyle = {
  padding: "14px",
  background: "#0f3b82",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  transition: "0.2s"
}