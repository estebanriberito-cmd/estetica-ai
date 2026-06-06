import { useState, useEffect } from "react"
import Bandeja from "./components/Bandeja"
import Turnos from "./components/Turnos"
import Metricas from "./components/Metricas"
import Configuracion from "./components/Configuracion"
import Calendario from "./components/Calendario"
import { supabase } from "./supabase"

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "lumina_estetica"

/* ── Icons ── */
const InboxIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
  </svg>
)
const NavCalIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const ChartIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)
const GearIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
)
const BellIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
)

const NAV = [
  { id: "bandeja",       label: "Bandeja",    Icon: InboxIcon   },
  { id: "calendario",    label: "Calendario", Icon: NavCalIcon  },
  { id: "metricas",      label: "Métricas",   Icon: ChartIcon   },
  { id: "configuracion", label: "Config",     Icon: GearIcon    },
]

const NOTIF_COLORS = {
  agendado:   { color: "#1D9E75", bg: "rgba(29,158,117,0.10)",  border: "rgba(29,158,117,0.22)",  emoji: "✅" },
  reagendado: { color: "#c9a0ff", bg: "rgba(123,47,255,0.10)",  border: "rgba(123,47,255,0.22)",  emoji: "🔄" },
  cancelado:  { color: "#f07070", bg: "rgba(240,112,112,0.10)", border: "rgba(240,112,112,0.22)", emoji: "❌" },
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  return isMobile
}

function NotifPanel({ notifs, onClose, onMarcarLeidas }) {
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 320,
      background: "var(--surface-1)", borderLeft: "1px solid var(--border)",
      zIndex: 100, display: "flex", flexDirection: "column",
      boxShadow: "-4px 0 20px rgba(0,0,0,0.3)"
    }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Notificaciones</span>
        <div style={{ display: "flex", gap: 8 }}>
          {notifs.some(n => !n.leida) && (
            <button onClick={onMarcarLeidas} style={{ fontSize: 10, color: "#c9a0ff", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Marcar todas leídas
            </button>
          )}
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {notifs.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", fontSize: 12, color: "var(--text-4)" }}>Sin notificaciones</div>
        ) : notifs.map(n => {
          const c = NOTIF_COLORS[n.tipo] || NOTIF_COLORS.agendado
          const fecha = new Date(n.created_at).toLocaleString("es-UY", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
          return (
            <div key={n.id} style={{
              padding: "12px 16px", borderBottom: "1px solid #161616",
              background: n.leida ? "transparent" : "rgba(123,47,255,0.04)",
              borderLeft: n.leida ? "3px solid transparent" : "3px solid #7B2FFF",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                  {c.emoji} {n.tipo}
                </span>
                <span style={{ fontSize: 9, color: "var(--text-4)", marginLeft: "auto" }}>{fecha}</span>
              </div>
              <div style={{ fontSize: 12, color: "#ccc", fontWeight: 500 }}>{n.nombre || "Sin nombre"}</div>
              {n.servicio && <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{n.servicio}</div>}
              {n.fecha_hora && (
                <div style={{ fontSize: 10, color: "var(--text-4)", marginTop: 2 }}>
                  {new Date(n.fecha_hora).toLocaleString("es-UY", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const [page,          setPage]          = useState("bandeja")
  const [notifs,        setNotifs]        = useState([])
  const [showNotifs,    setShowNotifs]    = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    fetchNotifs()
    const ch = supabase.channel("notifs-rt")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notificaciones", filter: `client_id=eq.${CLIENT_ID}` },
        (payload) => {
          setNotifs(prev => [payload.new, ...prev])
          // Sonido de notificación
          try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.connect(g)
        g.connect(ctx.destination)
        o.frequency.value = 880
        g.gain.setValueAtTime(0.3, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
        o.start(ctx.currentTime)
        o.stop(ctx.currentTime + 0.3)
      } catch {}
        })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  async function fetchNotifs() {
    const { data } = await supabase.from("notificaciones").select("*")
      .eq("client_id", CLIENT_ID).order("created_at", { ascending: false }).limit(50)
    if (data) setNotifs(data)
  }

  async function marcarLeidas() {
    await supabase.from("notificaciones").update({ leida: true })
      .eq("client_id", CLIENT_ID).eq("leida", false)
    setNotifs(prev => prev.map(n => ({ ...n, leida: true })))
  }

  const noLeidas = notifs.filter(n => !n.leida).length

  const renderPage = () => {
    if (page === "bandeja")       return <Bandeja />
    if (page === "calendario")    return <Calendario />
    if (page === "metricas")      return <Metricas />
    if (page === "configuracion") return <Configuracion />
  }

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", height: "100dvh", background: "var(--bg)", color: "var(--text-1)", overflow: "hidden" }}>
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--surface-1)", borderBottom: "1px solid var(--border)", paddingTop: "calc(12px + env(safe-area-inset-top))" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(123,47,255,0.35)", boxShadow: "0 0 12px rgba(123,47,255,0.2)" }}>
            <img src="/logo.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.3px" }}>
              {NAV.find(n => n.id === page)?.label}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-4)" }}>Panel AI</div>
          </div>
          {/* Campana */}
          <button onClick={() => setShowNotifs(!showNotifs)} style={{ position: "relative", background: "none", border: "none", color: noLeidas > 0 ? "#c9a0ff" : "var(--text-3)", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
            <BellIcon />
            {noLeidas > 0 && (
              <div style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, borderRadius: "50%", background: "#7B2FFF", border: "2px solid var(--surface-1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff" }}>
                {noLeidas > 9 ? "9+" : noLeidas}
              </div>
            )}
          </button>
        </div>
        <main style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>{renderPage()}</main>
        <div style={{ flexShrink: 0, display: "flex", background: "var(--surface-1)", borderTop: "1px solid var(--border)" }}>
          {NAV.map(({ id, label, Icon }) => {
            const active = page === id
            return (
              <button key={id} onClick={() => setPage(id)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 4, padding: "10px 4px 0", paddingBottom: "max(12px, env(safe-area-inset-bottom))",
                background: "none", border: "none", cursor: "pointer",
                color: active ? "#c9a0ff" : "#3a3a3a", transition: "color 0.15s", position: "relative",
              }}>
                {active && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 32, height: 2, borderRadius: "0 0 4px 4px", background: "linear-gradient(90deg, #7B2FFF, #D926FF)", boxShadow: "0 0 8px rgba(123,47,255,0.6)" }} />}
                <div style={{ opacity: active ? 1 : 0.45 }}><Icon size={active ? 21 : 20} /></div>
                <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
              </button>
            )
          })}
        </div>
        {showNotifs && <NotifPanel notifs={notifs} onClose={() => setShowNotifs(false)} onMarcarLeidas={marcarLeidas} />}
      </div>
    )
  }

  /* ── Desktop ── */
  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", color: "var(--text-1)" }}>
      <aside style={{ width: 220, flexShrink: 0, background: "var(--surface-1)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 14px 18px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(123,47,255,0.35)", boxShadow: "0 0 0 3px rgba(123,47,255,0.09), 0 0 16px rgba(123,47,255,0.2)" }}>
              <img src="/logo.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.3px" }}>Estética AI</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 1 }}>Panel de control</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.map(({ id, label, Icon }) => {
            const active = page === id
            return (
              <div key={id} onClick={() => setPage(id)} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", marginBottom: 2,
                borderRadius: "var(--radius-sm)", cursor: "pointer",
                color: active ? "#d4b0ff" : "#4a4a4a",
                background: active ? "var(--primary-10)" : "transparent",
                outline: active ? "1px solid rgba(123,47,255,0.22)" : "1px solid transparent",
                transition: "color 0.15s, background 0.15s", userSelect: "none",
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#888" } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4a4a4a" } }}
              >
                <Icon size={16} />
                <span style={{ fontSize: 12, fontWeight: active ? 500 : 400 }}>{label === "Config" ? "Configuración" : label}</span>
                {active && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#7B2FFF", boxShadow: "0 0 7px #7B2FFF", flexShrink: 0 }} />}
              </div>
            )
          })}
        </nav>
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", border: "1px solid var(--border-2)", flexShrink: 0 }}>
              <img src="/logo.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Lumina Estética</div>
              <div style={{ fontSize: 9, color: "var(--text-4)", marginTop: 1 }}>Plan Pro</div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "rgba(29,158,117,0.1)", color: "var(--green)", border: "1px solid rgba(29,158,117,0.22)", flexShrink: 0, letterSpacing: "0.3px" }}>PRO</div>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar con campana */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "10px 20px", borderBottom: "1px solid var(--border)", background: "var(--surface-1)" }}>
          <button onClick={() => setShowNotifs(!showNotifs)} style={{ position: "relative", background: showNotifs ? "var(--primary-10)" : "none", border: showNotifs ? "1px solid var(--primary-25)" : "none", borderRadius: 8, color: noLeidas > 0 ? "#c9a0ff" : "var(--text-3)", cursor: "pointer", display: "flex", alignItems: "center", padding: "6px 8px", gap: 6, transition: "all 0.15s" }}>
            <BellIcon />
            {noLeidas > 0 && (
              <>
                <span style={{ fontSize: 11, color: "#c9a0ff", fontWeight: 500 }}>{noLeidas} nueva{noLeidas !== 1 ? "s" : ""}</span>
                <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#7B2FFF", boxShadow: "0 0 6px rgba(123,47,255,0.8)" }} />
              </>
            )}
          </button>
        </div>
        <main style={{ flex: 1, overflow: "hidden" }}>{renderPage()}</main>
      </div>

      {showNotifs && <NotifPanel notifs={notifs} onClose={() => setShowNotifs(false)} onMarcarLeidas={marcarLeidas} />}
    </div>
  )
}