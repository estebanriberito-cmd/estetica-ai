import { useState } from "react"

const convs = [
  { id: 1, nombre: "María A.", msg: "a las 11, me llamo María...", hora: "19:23", canal: "WhatsApp", estado: "Confirmado", unread: true, color: "#7B2FFF" },
  { id: 2, nombre: "Laura G.", msg: "cuanto sale la limpieza?", hora: "18:47", canal: "Instagram", estado: "Consultando", unread: true, color: "#D926FF" },
  { id: 3, nombre: "Sofía R.", msg: "puedo cambiar para las 15hs?", hora: "17:30", canal: "WhatsApp", estado: "Nuevo", unread: false, color: "#1D9E75" },
  { id: 4, nombre: "Camila P.", msg: "ok gracias", hora: "14:10", canal: "Instagram", estado: "Frío", unread: false, color: "#378ADD" },
]

const msgs = [
  { id: 1, tipo: "user", texto: "hola quiero turno para limpieza facial el viernes", hora: "19:20" },
  { id: 2, tipo: "bot", texto: "hola! tenemos lugar el viernes a las 9:00 o a las 11:00", hora: "19:20" },
  { id: 3, tipo: "bot", texto: "cual te queda mejor?", hora: "19:20" },
  { id: 4, tipo: "user", texto: "a las 11, me llamo María, cel 098123456", hora: "19:23" },
  { id: 5, tipo: "bot", texto: "listo María, te agendé para el viernes a las 11:00", hora: "19:23", turno: true },
]

const estadoColor = { "Confirmado": "#4dcca0", "Consultando": "#EF9F27", "Nuevo": "#6ab4f5", "Frío": "#555" }
const estadoBg = { "Confirmado": "#1D9E7518", "Consultando": "#EF9F2718", "Nuevo": "#378ADD18", "Frío": "#1e1e1e" }

export default function Bandeja() {
  const [activo, setActivo] = useState(1)
  const [filtro, setFiltro] = useState("Todos")

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
        {convs.filter(c => filtro === "Todos" || c.canal === filtro).map(c => (
          <div key={c.id} onClick={() => setActivo(c.id)} style={{ display: "flex", gap: 9, padding: "11px 14px", borderBottom: "1px solid #1a1a1a", cursor: "pointer", background: activo === c.id ? "#1a1030" : "transparent" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: c.color, flexShrink: 0 }}>{c.nombre.slice(0,2)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#ddd" }}>{c.nombre}</span>
                <span style={{ fontSize: 10, color: "#333" }}>{c.hora}</span>
              </div>
              <div style={{ fontSize: 11, color: "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>{c.msg}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: c.canal === "WhatsApp" ? "#1D9E7518" : "#D926FF18", color: c.canal === "WhatsApp" ? "#4dcca0" : "#e070ff", border: `1px solid ${c.canal === "WhatsApp" ? "#1D9E7530" : "#D926FF30"}` }}>{c.canal}</span>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: estadoBg[c.estado], color: estadoColor[c.estado], border: `1px solid ${estadoColor[c.estado]}30` }}>{c.estado}</span>
                {c.unread && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7B2FFF", marginLeft: "auto" }}></div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#7B2FFF22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#d4a8ff", fontWeight: 500 }}>MA</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#1D9E75" }}></div>
              María Apellido
            </div>
            <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>WhatsApp · bot activo</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "#1a1030", border: "1px solid #7B2FFF44", borderRadius: 7, fontSize: 11, color: "#d4a8ff", cursor: "pointer" }}>
            ✋ Tomar conversación
          </div>
        </div>

        <div style={{ padding: "7px 16px", borderBottom: "1px solid #1e2a3a", background: "#0d1520", display: "flex", gap: 8 }}>
          <div style={{ fontSize: 10, color: "#6ab4f5", background: "#378ADD15", border: "1px solid #378ADD25", padding: "3px 8px", borderRadius: 10 }}>🧠 Intención: Agendar turno</div>
          <div style={{ fontSize: 10, color: "#4dcca0", background: "#1D9E7515", border: "1px solid #1D9E7525", padding: "3px 8px", borderRadius: 10 }}>🎯 Cierre: 85%</div>
        </div>

        <div style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 7, overflowY: "auto" }}>
          {msgs.map(m => (
            <div key={m.id} style={{ maxWidth: "70%", alignSelf: m.tipo === "user" ? "flex-end" : "flex-start" }}>
              {m.tipo === "bot" && <div style={{ fontSize: 10, color: "#444", marginBottom: 3 }}>🤖 Bot</div>}
              <div style={{ padding: "8px 12px", borderRadius: m.tipo === "user" ? "11px 4px 11px 11px" : "4px 11px 11px 11px", background: m.tipo === "user" ? "#1a1030" : "#1e1e1e", color: m.tipo === "user" ? "#d4a8ff" : "#bbb", border: `1px solid ${m.tipo === "user" ? "#7B2FFF33" : "#262626"}`, fontSize: 12, lineHeight: 1.5 }}>
                {m.texto}
              </div>
              {m.turno && (
                <div style={{ background: "#0d1f16", border: "1px solid #1D9E7530", borderRadius: 10, padding: "10px 12px", marginTop: 5 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#4dcca0", marginBottom: 7 }}>✅ Turno confirmado</div>
                  <div style={{ fontSize: 11, color: "#6aaa88" }}>👤 María Apellido</div>
                  <div style={{ fontSize: 11, color: "#6aaa88" }}>📅 Viernes 6 de junio · 11:00</div>
                  <div style={{ fontSize: 11, color: "#6aaa88" }}>💆 Limpieza facial</div>
                  <div style={{ fontSize: 11, color: "#6aaa88" }}>📞 098 123 456</div>
                </div>
              )}
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
      </div>
    </div>
  )
}
