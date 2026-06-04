import { useState } from "react"
import Bandeja from "./components/Bandeja"
import Turnos from "./components/Turnos"
import Metricas from "./components/Metricas"
import Configuracion from "./components/Configuracion"

const NAV = [
  { id: "bandeja", label: "Bandeja", icon: "📥" },
  { id: "turnos", label: "Turnos", icon: "📅" },
  { id: "metricas", label: "Métricas", icon: "📊" },
  { id: "configuracion", label: "Configuración", icon: "⚙️" },
]

export default function App() {
  const [page, setPage] = useState("bandeja")

  const renderPage = () => {
    if (page === "bandeja") return <Bandeja />
    if (page === "turnos") return <Turnos />
    if (page === "metricas") return <Metricas />
    if (page === "configuracion") return <Configuracion />
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#121212", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: 200, background: "#161616", borderRight: "1px solid #1e1e1e", display: "flex", flexDirection: "column", padding: "16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px 20px", borderBottom: "1px solid #1e1e1e", marginBottom: 12 }}>
          <img src="/logo.jpg" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Estética AI</div>
            <div style={{ fontSize: 10, color: "#444" }}>Panel de control</div>
          </div>
        </div>
        {NAV.map(n => (
          <div
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 16px", fontSize: 12, cursor: "pointer",
              borderLeft: page === n.id ? "2px solid #7B2FFF" : "2px solid transparent",
              background: page === n.id ? "#1a1030" : "transparent",
              color: page === n.id ? "#d4a8ff" : "#555",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (page !== n.id) e.currentTarget.style.color = "#aaa" }}
            onMouseLeave={e => { if (page !== n.id) e.currentTarget.style.color = "#555" }}
          >
            <span>{n.icon}</span>
            {n.label}
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "12px 16px", borderTop: "1px solid #1e1e1e", display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/logo.jpg" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <div style={{ fontSize: 11, color: "#bbb" }}>Lumina Estética</div>
            <div style={{ fontSize: 10, color: "#444" }}>Plan Pro</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {renderPage()}
      </div>
    </div>
  )
}