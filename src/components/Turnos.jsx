const turnos = [
  { id: 1, nombre: "María Apellido", telefono: "098 123 456", servicio: "Limpieza facial", precio: "$1.400", fecha: "Vie 6 jun", hora: "11:00 — 12:00", canal: "WhatsApp", estado: "confirmado", hoy: true },
  { id: 2, nombre: "Laura González", telefono: "091 456 789", servicio: "Extensiones de pestañas", precio: "$2.500", fecha: "Vie 6 jun", hora: "14:00 — 16:00", canal: "Instagram", estado: "confirmado", hoy: false },
  { id: 3, nombre: "Sofía Rodríguez", telefono: "099 321 654", servicio: "Diseño de cejas", precio: "$450", fecha: "Lun 9 jun", hora: "09:00 — 10:00", canal: "WhatsApp", estado: "reagendado", hoy: false },
  { id: 4, nombre: "Camila Pereira", telefono: "098 654 321", servicio: "Lifting de pestañas", precio: "$1.800", fecha: "Mar 10 jun", hora: "11:00 — 12:00", canal: "Instagram", estado: "confirmado", hoy: false },
  { id: 5, nombre: "Valentina Suárez", telefono: "092 789 123", servicio: "Depilación brasileña", precio: "$850", fecha: "Mié 11 jun", hora: "15:00 — 16:00", canal: "WhatsApp", estado: "cancelado", hoy: false },
]

const estadoStyle = {
  confirmado: { bg: "#1D9E7518", color: "#4dcca0", border: "#1D9E7530", label: "✓ Confirmado" },
  reagendado: { bg: "#7B2FFF18", color: "#d4a8ff", border: "#7B2FFF30", label: "↻ Reagendado" },
  cancelado: { bg: "#E24B4A18", color: "#f07070", border: "#E24B4A30", label: "✕ Cancelado" },
}

export default function Turnos() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#141414" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>Turnos</div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>Miércoles 4 de junio · 8 turnos esta semana</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 7, fontSize: 11, color: "#666", cursor: "pointer" }}>📅 Esta semana</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#7B2FFF", borderRadius: 7, fontSize: 11, color: "#fff", cursor: "pointer" }}>+ Nuevo turno</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, padding: "14px 20px", borderBottom: "1px solid #1e1e1e" }}>
        {[["✓ Confirmados", "24", "#4dcca0"], ["↻ Reagendados", "6", "#d4a8ff"], ["✕ Cancelados", "3", "#f07070"], ["$ Ingresos est.", "$33.6K", "#EF9F27"]].map(([label, val, color]) => (
          <div key={label} style={{ flex: 1, background: "#1a1a1a", border: "1px solid #222", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "8px 20px", borderBottom: "1px solid #1e1e1e", background: "#0d1520", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, color: "#378ADD", fontWeight: 500 }}>⏱ Hoy</span>
        {[["09:00 · Limpieza", true], ["11:00 · Extensiones", true], ["13:00 · Libre", false], ["14:00 · Cejas", "next"], ["17:00 · Lifting", true]].map(([slot, tipo]) => (
          <span key={slot} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: tipo === true ? "#1D9E7518" : tipo === "next" ? "#7B2FFF22" : "#1e1e1e", color: tipo === true ? "#4dcca0" : tipo === "next" ? "#d4a8ff" : "#444", border: `1px solid ${tipo === true ? "#1D9E7530" : tipo === "next" ? "#7B2FFF44" : "#262626"}` }}>{slot}</span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, padding: "10px 20px", borderBottom: "1px solid #1e1e1e", alignItems: "center" }}>
        {["Todos", "Hoy", "Confirmados", "Reagendados", "Cancelados"].map(f => (
          <div key={f} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, cursor: "pointer", background: f === "Todos" ? "#1a1030" : "transparent", color: f === "Todos" ? "#d4a8ff" : "#444", border: f === "Todos" ? "1px solid #7B2FFF33" : "1px solid transparent" }}>{f}</div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7, background: "#1e1e1e", border: "1px solid #262626", borderRadius: 7, padding: "5px 10px" }}>
          <span style={{ fontSize: 12, color: "#3a3a3a" }}>🔍</span>
          <span style={{ fontSize: 11, color: "#3a3a3a" }}>Buscar cliente...</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Cliente", "Servicio", "Fecha y hora", "Canal", "Estado", ""].map(h => (
                <th key={h} style={{ fontSize: 10, color: "#3a3a3a", textAlign: "left", padding: "10px 16px 8px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1e1e1e", fontWeight: 500, position: "sticky", top: 0, background: "#141414" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {turnos.map(t => {
              const e = estadoStyle[t.estado]
              return (
                <tr key={t.id} style={{ borderBottom: "1px solid #181818" }}>
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#ddd" }}>{t.nombre} {t.hoy && <span style={{ fontSize: 9, background: "#378ADD18", color: "#6ab4f5", border: "1px solid #378ADD30", padding: "1px 5px", borderRadius: 4, marginLeft: 4 }}>hoy</span>}</div>
                    <div style={{ fontSize: 10, color: "#3a3a3a", marginTop: 2 }}>📞 {t.telefono}</div>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{t.servicio}</div>
                    <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{t.precio}</div>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ fontSize: 12, color: "#bbb" }}>{t.fecha}</div>
                    <div style={{ fontSize: 10, color: "#3a3a3a", marginTop: 2 }}>⏱ {t.hora}</div>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, fontWeight: 500, background: t.canal === "WhatsApp" ? "#1D9E7518" : "#D926FF18", color: t.canal === "WhatsApp" ? "#4dcca0" : "#e070ff", border: `1px solid ${t.canal === "WhatsApp" ? "#1D9E7530" : "#D926FF30"}` }}>{t.canal}</span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 10, fontWeight: 500, background: e.bg, color: e.color, border: `1px solid ${e.border}` }}>{e.label}</span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {["📅", "✕", "💬"].map(ico => (
                        <div key={ico} style={{ width: 26, height: 26, borderRadius: 6, background: "#1e1e1e", border: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer" }}>{ico}</div>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}