import { useEffect, useState } from "react"
import { supabase } from "../supabase"

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "lumina_estetica"

const ESTADO = {
  confirmado: { color: "#1D9E75", bg: "rgba(29,158,117,0.10)",  border: "rgba(29,158,117,0.22)",  label: "Confirmado" },
  reagendado: { color: "#c9a0ff", bg: "rgba(123,47,255,0.12)",  border: "rgba(123,47,255,0.28)",  label: "Reagendado" },
  cancelado:  { color: "#f07070", bg: "rgba(240,112,112,0.10)", border: "rgba(240,112,112,0.22)", label: "Cancelado"  },
}

const CANAL = {
  WhatsApp:  { color: "#1D9E75", bg: "rgba(29,158,117,0.10)",  border: "rgba(29,158,117,0.22)"  },
  Instagram: { color: "#D926FF", bg: "rgba(217,38,255,0.10)", border: "rgba(217,38,255,0.22)"  },
}

const FILTROS = ["Todos", "Confirmado", "Reagendado", "Cancelado"]

const STATS = (confirmados, reagendados, cancelados, total) => [
  { label: "Confirmados", val: confirmados, color: "#1D9E75", bg: "rgba(29,158,117,0.07)",  border: "rgba(29,158,117,0.15)"  },
  { label: "Reagendados", val: reagendados, color: "#c9a0ff", bg: "rgba(123,47,255,0.07)",  border: "rgba(123,47,255,0.15)"  },
  { label: "Cancelados",  val: cancelados,  color: "#f07070", bg: "rgba(240,112,112,0.07)", border: "rgba(240,112,112,0.15)" },
  { label: "Total",       val: total,       color: "#EF9F27", bg: "rgba(239,159,39,0.07)",  border: "rgba(239,159,39,0.15)"  },
]

function RefreshIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.9 1.18 2 2 0 012.94.9h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.75a16 16 0 006.29 6.29l1.14-1.14a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}
function ClockSmallIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function RescheduleIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  )
}

function Badge({ label, color, bg, border, Icon }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 20,
      background: bg, color, border: `1px solid ${border}`,
    }}>
      {Icon && <Icon />}{label}
    </span>
  )
}

export default function Turnos() {
  const [turnos,  setTurnos]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro,  setFiltro]  = useState("Todos")

  useEffect(() => { fetchTurnos() }, [])

  async function fetchTurnos() {
    setLoading(true)
    const { data, error } = await supabase
      .from("turnos")
      .select("*")
      .eq("client_id", CLIENT_ID)
      .order("fecha_hora", { ascending: true })
    if (!error) setTurnos(data || [])
    setLoading(false)
  }

  const confirmados = turnos.filter(t => t.estado === "confirmado").length
  const reagendados = turnos.filter(t => t.estado === "reagendado").length
  const cancelados  = turnos.filter(t => t.estado === "cancelado").length
  const filtrados   = turnos.filter(t => filtro === "Todos" || t.estado === filtro.toLowerCase())

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg)" }}>
      <div style={{
        flexShrink: 0, padding: "16px 22px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--surface-1)",
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.3px" }}>Turnos</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{turnos.length} turnos en total</div>
        </div>
        <button onClick={fetchTurnos} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "7px 13px",
          background: "var(--surface-3)", border: "1px solid var(--border-2)",
          borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 500, color: "var(--text-2)", transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderColor = "#333" }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.borderColor = "var(--border-2)" }}
        >
          <RefreshIcon /> Actualizar
        </button>
      </div>

      <div style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, padding: "14px 22px", borderBottom: "1px solid var(--border)" }}>
        {STATS(confirmados, reagendados, cancelados, turnos.length).map(({ label, val, color, bg, border }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "var(--radius)", padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 6, fontWeight: 500 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color, letterSpacing: "-0.5px" }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ flexShrink: 0, display: "flex", gap: 5, alignItems: "center", padding: "10px 22px", borderBottom: "1px solid var(--border)" }}>
        {FILTROS.map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            fontSize: 11, fontWeight: filtro === f ? 500 : 400, padding: "4px 12px", borderRadius: 20,
            background: filtro === f ? "var(--primary-10)" : "rgba(255,255,255,0.02)",
            border: filtro === f ? "1px solid var(--primary-25)" : "1px solid #1e1e1e",
            color: filtro === f ? "#c9a0ff" : "var(--text-3)", transition: "all 0.15s",
          }}>{f}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-4)" }}>
          {filtrados.length} resultado{filtrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", fontSize: 12, color: "var(--text-4)" }}>Cargando turnos...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", fontSize: 12, color: "var(--text-4)" }}>No hay turnos</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Cliente", "Servicio", "Fecha y hora", "Canal", "Estado"].map(h => (
                  <th key={h} style={{
                    fontSize: 10, fontWeight: 500, color: "var(--text-4)", textAlign: "left",
                    padding: "10px 18px 9px", textTransform: "uppercase", letterSpacing: "0.6px",
                    borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--bg)",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(t => {
                const e = ESTADO[t.estado] || ESTADO.confirmado
                const c = CANAL[t.canal] || CANAL.Instagram
                const fecha = t.fecha_hora ? new Date(t.fecha_hora).toLocaleDateString("es-UY", { weekday: "short", day: "numeric", month: "short" }) : "—"
                const hora  = t.fecha_hora ? new Date(t.fecha_hora).toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" }) : "—"
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #161616", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.018)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 18px" }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#ddd" }}>{t.nombre}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, color: "var(--text-4)" }}>
                        <PhoneIcon /><span style={{ fontSize: 10 }}>{t.telefono || "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 18px" }}><div style={{ fontSize: 11, color: "#999" }}>{t.servicio || "—"}</div></td>
                    <td style={{ padding: "12px 18px" }}>
                      <div style={{ fontSize: 12, color: "#bbb" }}>{fecha}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, color: "var(--text-4)" }}>
                        <ClockSmallIcon /><span style={{ fontSize: 10 }}>{hora}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 18px" }}><Badge label={t.canal || "Instagram"} {...c} /></td>
                    <td style={{ padding: "12px 18px" }}>
                      <Badge label={e.label} color={e.color} bg={e.bg} border={e.border}
                        Icon={t.estado === "confirmado" ? CheckIcon : t.estado === "cancelado" ? CloseIcon : RescheduleIcon}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}