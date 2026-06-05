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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  return isMobile
}

function Badge({ label, color, bg, border }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 20, background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  )
}

function RefreshIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
}

export default function Turnos() {
  const [turnos,  setTurnos]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro,  setFiltro]  = useState("Todos")
  const isMobile = useIsMobile()

  useEffect(() => { fetchTurnos() }, [])

  async function fetchTurnos() {
    setLoading(true)
    const { data, error } = await supabase
      .from("turnos").select("*").eq("client_id", CLIENT_ID)
      .order("fecha_hora", { ascending: true })
    if (!error) setTurnos(data || [])
    setLoading(false)
  }

  const confirmados = turnos.filter(t => t.estado === "confirmado").length
  const reagendados = turnos.filter(t => t.estado === "reagendado").length
  const cancelados  = turnos.filter(t => t.estado === "cancelado").length
  const filtrados   = turnos.filter(t => t.estado !== "archivado" && (filtro === "Todos" || t.estado === filtro.toLowerCase()))

  const STATS = [
    { label: "Confirmados", val: confirmados, color: "#1D9E75", bg: "rgba(29,158,117,0.07)",  border: "rgba(29,158,117,0.15)"  },
    { label: "Reagendados", val: reagendados, color: "#c9a0ff", bg: "rgba(123,47,255,0.07)",  border: "rgba(123,47,255,0.15)"  },
    { label: "Cancelados",  val: cancelados,  color: "#f07070", bg: "rgba(240,112,112,0.07)", border: "rgba(240,112,112,0.15)" },
    { label: "Total",       val: turnos.length, color: "#EF9F27", bg: "rgba(239,159,39,0.07)", border: "rgba(239,159,39,0.15)" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)", overflowY: "auto" }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: isMobile ? "12px 14px" : "14px 22px", borderBottom: "1px solid var(--border)" }}>
        {STATS.map(({ label, val, color, bg, border }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "var(--radius)", padding: isMobile ? "10px 10px" : "12px 14px" }}>
            <div style={{ fontSize: isMobile ? 9 : 10, color: "var(--text-3)", marginBottom: 5, fontWeight: 500 }}>{label}</div>
            <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 600, color, letterSpacing: "-0.5px" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ flexShrink: 0, display: "flex", gap: 5, alignItems: "center", padding: isMobile ? "10px 14px" : "10px 22px", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
        {FILTROS.map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            fontSize: 11, fontWeight: filtro === f ? 500 : 400, padding: "4px 12px", borderRadius: 20, flexShrink: 0,
            background: filtro === f ? "var(--primary-10)" : "rgba(255,255,255,0.02)",
            border: filtro === f ? "1px solid var(--primary-25)" : "1px solid #1e1e1e",
            color: filtro === f ? "#c9a0ff" : "var(--text-3)", transition: "all 0.15s",
          }}>{f}</button>
        ))}
        <button onClick={fetchTurnos} style={{ marginLeft: "auto", flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "var(--surface-3)", border: "1px solid var(--border-2)", borderRadius: 20, fontSize: 11, color: "var(--text-3)", cursor: "pointer" }}>
          <RefreshIcon /> {!isMobile && "Actualizar"}
        </button>
      </div>

      {/* Lista */}
      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", fontSize: 12, color: "var(--text-4)" }}>Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", fontSize: 12, color: "var(--text-4)" }}>No hay turnos</div>
        ) : filtrados.map(t => {
          const e = ESTADO[t.estado] || ESTADO.confirmado
          const c = CANAL[t.canal] || CANAL.Instagram
          const fecha = t.fecha_hora ? new Date(t.fecha_hora).toLocaleDateString("es-UY", { weekday: "short", day: "numeric", month: "short" }) : "—"
          const hora  = t.fecha_hora ? new Date(t.fecha_hora).toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" }) : "—"

          return (
            <div key={t.id} style={{ padding: isMobile ? "13px 14px" : "13px 22px", borderBottom: "1px solid #161616", display: "flex", gap: 12, alignItems: "flex-start" }}>
              {/* Avatar */}
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #7B2FFF, #D926FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#fff", flexShrink: 0 }}>
                {(t.nombre || "?").slice(0, 2).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>{t.nombre || "Sin nombre"}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{t.servicio || "—"}</div>
                  </div>
                  <Badge label={e.label} color={e.color} bg={e.bg} border={e.border} />
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "#bbb", fontWeight: 500 }}>{fecha}</span>
                  <span style={{ fontSize: 11, color: "var(--text-4)" }}>·</span>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>{hora}</span>
                  <Badge label={t.canal || "Instagram"} color={c.color} bg={c.bg} border={c.border} />
                  {t.telefono && <span style={{ fontSize: 10, color: "var(--text-4)" }}>{t.telefono}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}