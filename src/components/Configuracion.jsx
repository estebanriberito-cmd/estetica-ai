import { useState } from "react"

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const horariosInit = [
  { dia: "Lunes", activo: true, desde: "9:00", hasta: "19:00" },
  { dia: "Martes", activo: true, desde: "9:00", hasta: "19:00" },
  { dia: "Miércoles", activo: true, desde: "9:00", hasta: "19:00" },
  { dia: "Jueves", activo: true, desde: "9:00", hasta: "19:00" },
  { dia: "Viernes", activo: true, desde: "9:00", hasta: "19:00" },
  { dia: "Sábado", activo: true, desde: "9:00", hasta: "14:00" },
  { dia: "Domingo", activo: false, desde: "", hasta: "" },
]

const serviciosInit = [
  { nombre: "Limpieza facial", precio: "$1.400" },
  { nombre: "Extensiones de pestañas", precio: "$2.500" },
  { nombre: "Lifting de pestañas", precio: "$1.800" },
  { nombre: "Diseño de cejas", precio: "$450" },
  { nombre: "Depilación brasileña", precio: "$850" },
]

export default function Configuracion() {
  const [seccion, setSeccion] = useState("salon")
  const [horarios, setHorarios] = useState(horariosInit)
  const [servicios, setServicios] = useState(serviciosInit)

  const secciones = [
    { id: "salon", label: "Mi salón", ico: "🏪" },
    { id: "horarios", label: "Horarios", ico: "⏰" },
    { id: "servicios", label: "Servicios", ico: "✨" },
    { id: "canales", label: "Canales", ico: "📡" },
  ]

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
        {seccion === "salon" && (
          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>🏪 Datos del salón</div>
              <div style={{ fontSize: 11, padding: "5px 12px", background: "#7B2FFF", borderRadius: 7, color: "#fff", cursor: "pointer" }}>Guardar</div>
            </div>
            {[["Nombre del salón", "Lumina Estética"], ["Dirección", "Av. Italia 2340, Montevideo"], ["Teléfono", "+598 91 796 168"], ["Instagram", "@luminaestetica"]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #1e1e1e", gap: 12 }}>
                <div style={{ fontSize: 11, color: "#666", width: 130, flexShrink: 0 }}>{label}</div>
                <div style={{ flex: 1, fontSize: 12, color: "#ccc", background: "#121212", border: "1px solid #262626", borderRadius: 7, padding: "7px 11px" }}>{val}</div>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "#1e1e1e", border: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>✏️</div>
              </div>
            ))}
          </div>
        )}

        {seccion === "horarios" && (
          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>⏰ Horarios de atención</div>
              <div style={{ fontSize: 11, padding: "5px 12px", background: "#7B2FFF", borderRadius: 7, color: "#fff", cursor: "pointer" }}>Guardar</div>
            </div>
            {horarios.map((h, i) => (
              <div key={h.dia} style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #1e1e1e", gap: 10 }}>
                <div style={{ fontSize: 11, color: "#666", width: 90 }}>{h.dia}</div>
                <div onClick={() => setHorarios(horarios.map((x, j) => j === i ? { ...x, activo: !x.activo } : x))} style={{ width: 30, height: 16, borderRadius: 10, background: h.activo ? "#7B2FFF44" : "#1e1e1e", border: `1px solid ${h.activo ? "#7B2FFF44" : "#262626"}`, position: "relative", cursor: "pointer" }}>
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
              <div style={{ fontSize: 11, padding: "5px 12px", background: "#7B2FFF", borderRadius: 7, color: "#fff", cursor: "pointer" }}>Guardar</div>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {servicios.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#121212", border: "1px solid #1e1e1e", borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: "#bbb", flex: 1 }}>{s.nombre}</div>
                  <div style={{ fontSize: 12, color: "#4dcca0", background: "#0d1f16", border: "1px solid #1D9E7520", borderRadius: 6, padding: "4px 8px" }}>{s.precio}</div>
                  <div onClick={() => setServicios(servicios.filter((_, j) => j !== i))} style={{ width: 24, height: 24, borderRadius: 5, background: "#1e1e1e", border: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}>🗑</div>
                </div>
              ))}
            </div>
            <div onClick={() => setServicios([...servicios, { nombre: "Nuevo servicio", precio: "$0" }])} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px 14px", fontSize: 11, color: "#d4a8ff", cursor: "pointer" }}>+ Agregar servicio</div>
          </div>
        )}

        {seccion === "canales" && (
          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #222" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>📡 Canales conectados</div>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[["🟢", "WhatsApp Business", "+598 91 796 168", true], ["📸", "Instagram", "@luminaestetica", true]].map(([ico, nombre, num, conectado]) => (
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