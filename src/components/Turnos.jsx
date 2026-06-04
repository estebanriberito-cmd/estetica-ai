import { useEffect, useState } from "react"
import { supabase } from "../supabase"

const estadoStyle = {
  confirmado: { bg: "#1D9E7518", color: "#4dcca0", border: "#1D9E7530", label: "✓ Confirmado" },
  reagendado: { bg: "#7B2FFF18", color: "#d4a8ff", border: "#7B2FFF30", label: "↻ Reagendado" },
  cancelado: { bg: "#E24B4A18", color: "#f07070", border: "#E24B4A30", label: "✕ Cancelado" },
}

export default function Turnos() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState("Todos")

  useEffect(() => {
    fetchTurnos()
  }, [])

  async function fetchTurnos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('turnos')
      .select('*')
      .order('fecha_hora', { ascending: true })
    if (!error) setTurnos(data || [])
    setLoading(false)
  }

  const filtrados = turnos.filter(t => filtro === "Todos" || t.estado === filtro.toLowerCase())

  const confirmados = turnos.filter(t => t.estado === "confirmado").length
  const reagendados = turnos.filter(t => t.estado === "reagendado").length
  const cancelados = turnos.filter(t => t.estado === "cancelado").length

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#141414" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>Turnos</div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{turnos.length} turnos en total</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div onClick={fetchTurnos} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 7, fontSize: 11, color: "#666", cursor: "pointer" }}>🔄 Actualizar</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, padding: "14px 20px", borderBottom: "1px solid #1e1e1e" }}>
        {[["✓ Confirmados", confirmados, "#4dcca0"], ["↻ Reagendados", reagendados, "#d4a8ff"], ["✕ Cancelados", cancelados, "#f07070"], ["Total", turnos.length, "#EF9F27"]].map(([label, val, color]) => (
          <div key={label} style={{ flex: 1, background: "#1a1a1a", border: "1px solid #222", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, padding: "10px 20px", borderBottom: "1px solid #1e1e1e", alignItems: "center" }}>
        {["Todos", "Confirmado", "Reagendado", "Cancelado"].map(f => (
          <div key={f} onClick={() => setFiltro(f)} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, cursor: "pointer", background: filtro === f ? "#1a1030" : "transparent", color: filtro === f ? "#d4a8ff" : "#444", border: filtro === f ? "1px solid #7B2FFF33" : "1px solid transparent" }}>{f}</div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#444" }}>Cargando turnos...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#444" }}>No hay turnos</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Cliente", "Servicio", "Fecha y hora", "Canal", "Estado"].map(h => (
                  <th key={h} style={{ fontSize: 10, color: "#3a3a3a", textAlign: "left", padding: "10px 16px 8px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1e1e1e", fontWeight: 500, position: "sticky", top: 0, background: "#141414" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(t => {
                const e = estadoStyle[t.estado] || estadoStyle.confirmado
                const fecha = t.fecha_hora ? new Date(t.fecha_hora).toLocaleDateString('es-UY', { weekday: 'short', day: 'numeric', month: 'short' }) : '-'
                const hora = t.fecha_hora ? new Date(t.fecha_hora).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }) : '-'
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #181818" }}>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#ddd" }}>{t.nombre}</div>
                      <div style={{ fontSize: 10, color: "#3a3a3a", marginTop: 2 }}>📞 {t.telefono}</div>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{t.servicio}</div>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ fontSize: 12, color: "#bbb" }}>{fecha}</div>
                      <div style={{ fontSize: 10, color: "#3a3a3a", marginTop: 2 }}>⏱ {hora}</div>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, fontWeight: 500, background: t.canal === "WhatsApp" ? "#1D9E7518" : "#D926FF18", color: t.canal === "WhatsApp" ? "#4dcca0" : "#e070ff", border: `1px solid ${t.canal === "WhatsApp" ? "#1D9E7530" : "#D926FF30"}` }}>{t.canal || "Instagram"}</span>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 10, fontWeight: 500, background: e.bg, color: e.color, border: `1px solid ${e.border}` }}>{e.label}</span>
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