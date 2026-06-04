import { useState, useEffect } from "react"
import { supabase } from "../supabase"

export default function Configuracion() {
  const [seccion, setSeccion] = useState("salon")
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState("")

  useEffect(() => { fetchConfig() }, [])

  async function fetchConfig() {
    setLoading(true)
    const { data, error } = await supabase.from('config').select('*').limit(1).single()
    if (!error && data) setConfig(data)
    setLoading(false)
  }

  async function guardar() {
    setGuardando(true)
    const { error } = await supabase.from('config').update({
      nombre: config.nombre,
      direccion: config.direccion,
      telefono: config.telefono,
      instagram: config.instagram,
      horarios: config.horarios,
      servicios: config.servicios,
    }).eq('id', config.id)
    setGuardando(false)
    setMensaje(error ? "Error al guardar" : "Guardado")
    setTimeout(() => setMensaje(""), 2000)
  }

  const secciones = [
    { id: "salon", label: "Mi salón", ico: "🏪" },
    { id: "horarios", label: "Horarios", ico: "⏰" },
    { id: "servicios", label: "Servicios", ico: "✨" },
    { id: "canales", label: "Canales", ico: "📡" },
  ]

  if (loading) return <div style={{ padding: 40, color: "#444", background: "#141414", height: "100vh" }}>Cargando...</div>
  if (!config) return <div style={{ padding: 40, color: "#444", background: "#141414", height: "100vh" }}>Sin configuración</div>

  return (
    <div style={{ display: "flex", height: "100vh", background: "#141414" }}>
      <div style={{ width: 180, borderRight: "1px solid #1e1e1e", padding: "16px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", padding: "0 16px 12px" }}>Configuración</div>
        {secciones.map(s => (
          <div key={s.id} onClick={() => setSeccion(s.id)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 16px", fontSize: 12, cursor: "pointer", borderLeft: seccion === s.id ? "2px solid #7B2FFF" : "2px solid transparent", background: seccion === s.id ? "#1a1030" : "transparent", color: seccion === s.id ? "#d4a8ff" : "#555" }}>
            <span>{s.ico}</span>{s.label}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {mensaje && <div style={{ padding: "10px 16px", background: "#0d1f16", border: "1px solid #1D9E7530", borderRadius: 8, fontSize: 12, color: "#4dcca0" }}>{mensaje}</div>}

        {seccion === "salon" && (
          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>🏪 Datos del salón</div>
              <div onClick={guardar} style={{ fontSize: 11, padding: "5px 12px", background: "#7B2FFF", borderRadius: 7, color: "#fff", cursor: "pointer" }}>{guardando ? "Guardando..." : "Guardar"}</div>
            </div>
            {[["Nombre del salón", "nombre"], ["Dirección", "direccion"], ["Teléfono", "telefono"], ["Instagram", "instagram"]].map(([label, field]) => (
              <div key={field} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #1e1e1e", gap: 12 }}>
                <div style={{ fontSize: 11, color: "#666", width: 130, flexShrink: 0 }}>{label}</div>
                <input
                  value={config[field] || ""}
                  onChange={e => setConfig({ ...config, [field]: e.target.value })}
                  style={{ flex: 1, fontSize: 12, color: "#ccc", background: "#121212", border: "1px solid #262626", borderRadius: 7, padding: "7px 11px", outline: "none" }}
                />
              </div>
            ))}
          </div>
        )}

        {seccion === "horarios" && (
          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>⏰ Horarios de atención</div>
              <div onClick={guardar} style={{ fontSize: 11, padding: "5px 12px", background: "#7B2FFF", borderRadius: 7, color: "#fff", cursor: "pointer" }}>{guardando ? "Guardando..." : "Guardar"}</div>
            </div>
            {(config.horarios || []).map((h, i) => (
              <div key={h.dia} style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #1e1e1e", gap: 10 }}>
                <div style={{ fontSize: 11, color: "#666", width: 90 }}>{h.dia}</div>
                <div onClick={() => {
                  const nuevos = [...config.horarios]
                  nuevos[i] = { ...nuevos[i], activo: !nuevos[i].activo }
                  setConfig({ ...config, horarios: nuevos })
                }} style={{ width: 30, height: 16, borderRadius: 10, background: h.activo ? "#7B2FFF44" : "#1e1e1e", border: `1px solid ${h.activo ? "#7B2FFF44" : "#262626"}`, position: "relative", cursor: "pointer", flexShrink: 0 }}>
                  <div style={{ position: "absolute", width: 12, height: 12, background: h.activo ? "#d4a8ff" : "#333", borderRadius: "50%", top: 1, [h.activo ? "right" : "left"]: 1 }}></div>
                </div>
                <div style={{ fontSize: 11, color: h.activo ? "#aaa" : "#444" }}>{h.activo ? `${h.desde} — ${h.hasta}` : "Cerrado"}</div>
              </div>
            ))}
          </div>
        )}

        {seccion === "servicios" && (
          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>✨ Servicios y precios</div>
              <div onClick={guardar} style={{ fontSize: 11, padding: "5px 12px", background: "#7B2FFF", borderRadius: 7, color: "#fff", cursor: "pointer" }}>{guardando ? "Guardando..." : "Guardar"}</div>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {(config.servicios || []).map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#121212", border: "1px solid #1e1e1e", borderRadius: 8 }}>
                  <input value={s.nombre} onChange={e => {
                    const nuevos = [...config.servicios]
                    nuevos[i] = { ...nuevos[i], nombre: e.target.value }
                    setConfig({ ...config, servicios: nuevos })
                  }} style={{ flex: 1, fontSize: 12, color: "#bbb", background: "transparent", border: "none", outline: "none" }} />
                  <input value={s.precio} onChange={e => {
                    const nuevos = [...config.servicios]
                    nuevos[i] = { ...nuevos[i], precio: e.target.value }
                    setConfig({ ...config, servicios: nuevos })
                  }} style={{ fontSize: 12, color: "#4dcca0", background: "#0d1f16", border: "1px solid #1D9E7520", borderRadius: 6, padding: "4px 8px", width: 80, outline: "none" }} />
                  <div onClick={() => setConfig({ ...config, servicios: config.servicios.filter((_, j) => j !== i) })} style={{ width: 24, height: 24, borderRadius: 5, background: "#1e1e1e", border: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}>🗑</div>
                </div>
              ))}
            </div>
            <div onClick={() => setConfig({ ...config, servicios: [...(config.servicios || []), { nombre: "Nuevo servicio", precio: "$0" }] })} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px 14px", fontSize: 11, color: "#d4a8ff", cursor: "pointer" }}>+ Agregar servicio</div>
          </div>
        )}

        {seccion === "canales" && (
          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #222" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>📡 Canales conectados</div>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[["🟢", "WhatsApp Business", config.telefono || "-", true], ["📸", "Instagram", config.instagram || "-", true]].map(([ico, nombre, num, conectado]) => (
                <div key={nombre} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#121212", border: "1px solid #1e1e1e", borderRadius: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "#1D9E7518", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{ico}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#ccc", fontWeight: 500 }}>{nombre}</div>
                    <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>{num}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, background: "#1D9E7518", color: "#4dcca0", border: "1px solid #1D9E7530" }}>Conectado</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}