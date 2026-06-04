import { useEffect, useState } from "react"
import { supabase } from "../supabase"

export default function Metricas() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState("semana")

  useEffect(() => { fetchTurnos() }, [periodo])

  async function fetchTurnos() {
    setLoading(true)
    let desde = new Date()
    if (periodo === "hoy") desde.setHours(0, 0, 0, 0)
    else if (periodo === "semana") desde.setDate(desde.getDate() - 7)
    else if (periodo === "mes") desde.setDate(desde.getDate() - 30)

    const { data, error } = await supabase
      .from('turnos')
      .select('*')
      .gte('created_at', desde.toISOString())
    if (!error && data) setTurnos(data)
    setLoading(false)
  }

  const confirmados = turnos.filter(t => t.estado === "confirmado").length
  const reagendados = turnos.filter(t => t.estado === "reagendado").length
  const cancelados = turnos.filter(t => t.estado === "cancelado").length
  const total = turnos.length
  const conversion = total > 0 ? Math.round((confirmados / total) * 100) : 0

  const porCanal = {
    Instagram: turnos.filter(t => t.canal === "Instagram").length,
    WhatsApp: turnos.filter(t => t.canal === "WhatsApp").length,
  }

  const serviciosMap = {}
  turnos.forEach(t => {
    if (t.servicio) serviciosMap[t.servicio] = (serviciosMap[t.servicio] || 0) + 1
  })
  const servicios = Object.entries(serviciosMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxServicio = servicios[0]?.[1] || 1

  const porDia = {}
  turnos.forEach(t => {
    const dia = new Date(t.created_at).toLocaleDateString('es-UY', { weekday: 'short' })
    porDia[dia] = (porDia[dia] || 0) + 1
  })
  const diasKeys = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"]
  const maxDia = Math.max(...Object.values(porDia), 1)

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#141414", overflowY: "auto" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>Métricas</div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>Rendimiento del negocio</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["hoy", "Hoy"], ["semana", "Esta semana"], ["mes", "Este mes"]].map(([val, label]) => (
            <div key={val} onClick={() => setPeriodo(val)} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 7, border: "1px solid", borderColor: periodo === val ? "#7B2FFF44" : "#262626", background: periodo === val ? "#1a1030" : "#1e1e1e", color: periodo === val ? "#d4a8ff" : "#555", cursor: "pointer" }}>{label}</div>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#444" }}>Cargando métricas...</div>
      ) : (
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
            {[
              ["Turnos agendados", total, "#4dcca0"],
              ["Confirmados", confirmados, "#4dcca0"],
              ["Cancelados", cancelados, "#f07070"],
              ["Conversión", `${conversion}%`, "#d4a8ff"],
            ].map(([label, val, color]) => (
              <div key={label} style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 10, color: "#444", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 500, color }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#1a1030", border: "1px solid #7B2FFF22", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#7B2FFF22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", marginBottom: 2 }}>
                {confirmados} de {total} turnos cerrados automáticamente por el bot
              </div>
              <div style={{ fontSize: 11, color: "#444" }}>
                {total > 0 ? Math.round((confirmados / total) * 100) : 0}% de automatización en este período
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#4dcca0" }}>{conversion}%</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 2 }}>Turnos por día</div>
              <div style={{ fontSize: 10, color: "#444", marginBottom: 14 }}>Período seleccionado</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 80 }}>
                {diasKeys.map(dia => {
                  const val = porDia[dia] || 0
                  const h = Math.round((val / maxDia) * 75) || 4
                  return (
                    <div key={dia} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 9, color: "#555" }}>{val || ""}</span>
                      <div style={{ width: "100%", borderRadius: "3px 3px 0 0", height: h, background: val > 0 ? "#7B2FFF" : "#1e1e1e" }}></div>
                      <span style={{ fontSize: 9, color: "#3a3a3a" }}>{dia}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 2 }}>Canal de origen</div>
              <div style={{ fontSize: 10, color: "#444", marginBottom: 14 }}>Distribución de turnos</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[["Instagram", "#7B2FFF"], ["WhatsApp", "#1D9E75"]].map(([canal, color]) => {
                  const val = porCanal[canal] || 0
                  const pct = total > 0 ? Math.round((val / total) * 100) : 0
                  return (
                    <div key={canal}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: "#888" }}>{canal}</span>
                        <span style={{ fontSize: 11, color: "#ccc" }}>{val} ({pct}%)</span>
                      </div>
                      <div style={{ height: 6, background: "#1e1e1e", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3 }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 2 }}>Servicios más pedidos</div>
              <div style={{ fontSize: 10, color: "#444", marginBottom: 14 }}>Por cantidad</div>
              {servicios.length === 0 ? (
                <div style={{ fontSize: 11, color: "#444" }}>Sin datos</div>
              ) : servicios.map(([nombre, count], i) => (
                <div key={nombre} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                  <span style={{ fontSize: 10, color: "#333", width: 14 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: "#aaa", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nombre}</span>
                  <div style={{ width: 80, height: 5, background: "#1e1e1e", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.round((count / maxServicio) * 100)}%`, background: "#7B2FFF", borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontSize: 11, color: "#555", width: 20, textAlign: "right" }}>{count}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 12 }}>Resumen del período</div>
              {[
                ["📅", "Total turnos", total, "#aaa"],
                ["✓", "Confirmados", confirmados, "#4dcca0"],
                ["↻", "Reagendados", reagendados, "#d4a8ff"],
                ["✕", "Cancelados", cancelados, "#f07070"],
                ["📱", "Por Instagram", porCanal.Instagram || 0, "#d4a8ff"],
                ["💬", "Por WhatsApp", porCanal.WhatsApp || 0, "#4dcca0"],
              ].map(([ico, label, val, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1e1e1e" }}>
                  <span style={{ fontSize: 11, color: "#555" }}>{ico} {label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}