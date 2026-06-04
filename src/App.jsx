import { useState } from "react"
import Bandeja from "./components/Bandeja"
import Turnos from "./components/Turnos"
import Metricas from "./components/Metricas"
import Configuracion from "./components/Configuracion"

/* ── Icons ──────────────────────────────────────────────────────────────── */
const InboxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
)

/* ── Nav config ─────────────────────────────────────────────────────────── */
const NAV = [
  { id: "bandeja",       label: "Bandeja",      Icon: InboxIcon    },
  { id: "turnos",        label: "Turnos",        Icon: CalendarIcon },
  { id: "metricas",      label: "Métricas",      Icon: ChartIcon    },
  { id: "configuracion", label: "Configuración", Icon: GearIcon     },
]

/* ── Component ──────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("bandeja")

  const renderPage = () => {
    if (page === "bandeja")       return <Bandeja />
    if (page === "turnos")        return <Turnos />
    if (page === "metricas")      return <Metricas />
    if (page === "configuracion") return <Configuracion />
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", color: "var(--text-1)" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: "var(--surface-1)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Brand */}
        <div style={{ padding: "20px 14px 18px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              overflow: "hidden",
              flexShrink: 0,
              border: "1px solid rgba(123,47,255,0.35)",
              boxShadow: "0 0 0 3px rgba(123,47,255,0.09), 0 0 16px rgba(123,47,255,0.2)",
            }}>
              <img src="/logo.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.3px" }}>
                Estética AI
              </div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 1 }}>
                Panel de control
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.map(({ id, label, Icon }) => {
            const active = page === id
            return (
              <div
                key={id}
                onClick={() => setPage(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "9px 11px",
                  marginBottom: 2,
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  color: active ? "#d4b0ff" : "#4a4a4a",
                  background: active ? "var(--primary-10)" : "transparent",
                  outline: active ? "1px solid rgba(123,47,255,0.22)" : "1px solid transparent",
                  transition: "color 0.15s, background 0.15s",
                  userSelect: "none",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                    e.currentTarget.style.color = "#888"
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = "#4a4a4a"
                  }
                }}
              >
                <Icon />
                <span style={{ fontSize: 12, fontWeight: active ? 500 : 400 }}>{label}</span>
                {active && (
                  <span style={{
                    marginLeft: "auto",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#7B2FFF",
                    boxShadow: "0 0 7px #7B2FFF",
                    flexShrink: 0,
                  }} />
                )}
              </div>
            )
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px solid var(--border-2)",
              flexShrink: 0,
            }}>
              <img src="/logo.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Lumina Estética
              </div>
              <div style={{ fontSize: 9, color: "var(--text-4)", marginTop: 1 }}>Plan Pro</div>
            </div>
            <div style={{
              fontSize: 9,
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: 20,
              background: "rgba(29,158,117,0.1)",
              color: "var(--green)",
              border: "1px solid rgba(29,158,117,0.22)",
              flexShrink: 0,
              letterSpacing: "0.3px",
            }}>PRO</div>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflow: "hidden" }}>
        {renderPage()}
      </main>
    </div>
  )
}