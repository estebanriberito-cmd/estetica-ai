import { useEffect, useState } from "react"
import { supabase } from "../supabase"

const msgs_demo = [
  { id: 1, tipo: "user", texto: "hola quiero turno para limpieza facial el viernes", hora: "19:20" },
  { id: 2, tipo: "bot", texto: "hola! tenemos lugar el viernes a las 9:00 o a las 11:00", hora: "19:20" },
  { id: 3, tipo: "bot", texto: "cual te queda mejor?", hora: "19:20" },
  { id: 4, tipo: "user", texto: "a las 11, me llamo María, cel 098123456", hora: "19:23" },
  { id: 5, tipo: "bot", texto: "listo María, te agendé para el viernes a las 11:00", hora: "19:23", turno: true },
]

export default function Bandeja() {
  const [turnos, setTurnos] = useState([])
  const [activo, setActivo] = useState(null)
  const [mensajes, setMensajes] = useState([])
  const [filtro, setFiltro] = useState("Todos")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTurnos() }, [])
  useEffect(() => { if (activo) fetchMensajes(activo.contact_id) }, [activo])

  async function fetchTurnos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('turnos')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setTurnos(data)
      if (data.length > 0) setActivo(data[0])
    }
    setLoading(false)
  }

  async function fetchMensajes(contact_id) {
    const { data, error } = await supabase
      .from('n8n_chat_histories')
      .select('*')
      .eq('session_id', String(contact_id))
      .order('id', { ascending: true })
      .limit(100)
    if (!error && data) {
      const parsed = data.map(m => {
        try {
          const msg = JSON.parse(m.message)
          if (msg.name) return null
          let texto = ''
          if (msg.type === 'human') {
            const parts = msg.content.split('---')
            const ultima = parts[parts.length - 1].trim()
            texto = ultima.length > 0 ? ultima : msg.content.slice(0, 100)
          } else if (msg.type === 'ai') {
            try {
              const json = JSON.parse(msg.content)
              texto = [json.mensaje_1, json.mensaje_2].filter(Boolean).join(' / ')
            } catch {
              texto = msg.content.replace(/\{[\s\S]*\}/g, '').trim().slice(0, 200)
            }
          }
          if (!texto) return null
          return {
            id: m.id,
            tipo: msg.type === 'human' ? 'user' : 'bot',
            texto,
            hora: new Date(m.id * 1000 || Date.now()).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })
          }
        } catch { return null }
      }).filter(Boolean)
      setMensajes(parsed.length > 0 ? parsed : msgs_demo)
    } else {
      setMensajes(msgs_demo)
    }
  }

  const filtrados = turnos.filter(t => filtro === "Todos" || t.canal === filtro)
  const estadoColor = { confirmado: "#4dcca0", reagendado: "#d4a8ff", cancelado: "#f07070" }
  const estadoBg = { confirmado: "#1D9E7518", reagendado: "#7B2FFF18", cancelado: "#E24B4A18" }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#121212" }}>
      <div style={{ width: 250, background: "#141414", borderRight: "1px solid #1e1e1e", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid #1e1e1e" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#e0e0e0", marginBottom: 10 }}>Conversaciones</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1e1e1e", borderRadius: 8, padding: "7px 10px", border: "1px solid #262626" }}>
            <span style={{ color: "#444", fontSize: 13 }}>🔍</span>
            <span style={{ fontSize: 11, color: "#3a3a3a" }}>Buscar contacto...</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, padding: "8px 14px", borderBottom: "1px solid #1e1e1e" }}>
          {["Todos", "WhatsApp", "Instagram"].map(f => (
            <div key={f} onClick={() => setFiltro(f)} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, cursor: "pointer", border: filtro === f ? "1px solid #7B2FFF44" : "1px solid transparent", background: filtro === f ? "#1a1030" : "transparent", color: filtro === f ? "#d4a8ff" : "#444" }}>{f}</div>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: "center", color: "#444", fontSize: 12 }}>Cargando...</div>
          ) : filtrados.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "#444", fontSize: 12 }}>No hay conversaciones</div>
          ) : filtrados.map(t => (
            <div key={t.id} onClick={() => setActivo(t)} style={{ display: "flex", gap: 9, padding: "11px 14px", borderBottom: "1px solid #1a1a1a", cursor: "pointer", background: activo?.id === t.id ? "#1a1030" : "transparent" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#7B2FFF22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "#d4a8ff", flexShrink: 0 }}>{(t.nombre || "?").slice(0, 2).toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#ddd" }}>{t.nombre || "Sin nombre"}</span>
                  <span style={{ fontSize: 10, color: "#333" }}>{t.hora_turno || ""}</span>
                </div>
                <div style={{ fontSize: 11, color: "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>{t.servicio || "Sin servicio"}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: t.canal === "WhatsApp" ? "#1D9E7518" : "#D926FF18", color: t.canal === "WhatsApp" ? "#4dcca0" : "#e070ff", border: `1px solid ${t.canal === "WhatsApp" ? "#1D9E7530" : "#D926FF30"}` }}>{t.canal || "Instagram"}</span>
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: estadoBg[t.estado] || "#1e1e1e", color: estadoColor[t.estado] || "#555", border: `1px solid ${estadoColor[t.estado] || "#333"}30` }}>{t.estado || "confirmado"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activo ? (
          <>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#7B2FFF22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#d4a8ff", fontWeight: 500 }}>{(activo.nombre || "?").slice(0, 2).toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{activo.nombre || "Sin nombre"}</div>
                <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{activo.canal || "Instagram"} · {activo.servicio}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "#1a1030", border: "1px solid #7B2FFF44", borderRadius: 7, fontSize: 11, color: "#d4a8ff", cursor: "pointer" }}>
                ✋ Tomar conversación
              </div>
            </div>

            <div style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 7, overflowY: "auto" }}>
              {mensajes.length === 0 ? (
                <div style={{ textAlign: "center", color: "#444", fontSize: 12, marginTop: 40 }}>Sin mensajes</div>
              ) : mensajes.map(m => (
                <div key={m.id} style={{ maxWidth: "70%", alignSelf: m.tipo === "user" ? "flex-end" : "flex-start" }}>
                  {m.tipo === "bot" && <div style={{ fontSize: 10, color: "#444", marginBottom: 3 }}>🤖 Bot</div>}
                  <div style={{ padding: "8px 12px", borderRadius: m.tipo === "user" ? "11px 4px 11px 11px" : "4px 11px 11px 11px", background: m.tipo === "user" ? "#1a1030" : "#1e1e1e", color: m.tipo === "user" ? "#d4a8ff" : "#bbb", border: `1px solid ${m.tipo === "user" ? "#7B2FFF33" : "#262626"}`, fontSize: 12, lineHeight: 1.5 }}>
                    {m.texto}
                  </div>
                  <div style={{ fontSize: 10, color: "#2e2e2e", marginTop: 2, textAlign: m.tipo === "user" ? "right" : "left" }}>{m.hora}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderTop: "1px solid #1e1e1e" }}>
              {[["✅", "Confirmar"], ["📅", "Reagendar"], ["❌", "Cancelar"], ["👻", "Perdido"]].map(([ico, lbl]) => (
                <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, fontSize: 11, cursor: "pointer", background: "#1e1e1e", border: "1px solid #262626", color: "#666" }}>{ico} {lbl}</div>
              ))}
            </div>

            <div style={{ padding: "10px 16px", borderTop: "1px solid #1e1e1e", display: "flex", gap: 7 }}>
              <div style={{ flex: 1, background: "#1e1e1e", border: "1px solid #262626", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#444" }}>Escribir mensaje...</div>
              <div style={{ width: 32, height: 32, borderRadius: 7, background: "#7B2FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>➤</div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 13 }}>Seleccioná una conversación</div>
        )}
      </div>
    </div>
  )
}