const kpis = [
  { label: "Turnos agendados", value: "24", trend: "+18% vs semana anterior", color: "#4dcca0", up: true },
  { label: "Ingresos estimados", value: "$33.6K", trend: "+14% vs semana anterior", color: "#EF9F27", up: true },
  { label: "Conversión chat → turno", value: "68%", trend: "+5% vs semana anterior", color: "#d4a8ff", up: true },
  { label: "Tiempo promedio cierre", value: "4.2m", trend: "-1.1m más rápido", color: "#6ab4f5", up: false },
]

const dias = [
  { dia: "Lun", val: 3, h: 38 },
  { dia: "Mar", val: 5, h: 62 },
  { dia: "Mié", val: 4, h: 50 },
  { dia: "Jue", val: 6, h: 75, highlight: true },
  { dia: "Vie", val: 4, h: 50 },
  { dia: "Sáb", val: 2, h: 25 },
]

const servicios = [
  { nombre: "Limpieza facial", count: 9, pct: 90, ingreso: "$12.6K", color: "#7B2FFF" },
  { nombre: "Extensiones", count: 6, pct: 60, ingreso: "$15K", color: "#D926FF" },
  { nombre: "Lifting pestañas", count: 4, pct: 40, ingreso: "$7.2K", color: "#378ADD" },
  { nombre: "Diseño cejas", count: 3, pct: 30, ingreso: "$1.35K", color: "#EF9F27" },
  { nombre: "Depilación", count: 2, pct: 20, ingreso: "$1.7K", color: "#1D9E75" },
]

export default function Metricas() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#141414", overflowY: "auto" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>Métricas</div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>Rendimiento del negocio</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["Hoy", "Esta semana", "Este mes"].map((p, i) => (
            <div key={p} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 7, border: "1px solid", borderColor: i === 1 ? "#7B2FFF44" : "#262626", background: i === 1 ? "#1a1030" : "#1e1e1e", color: i === 1 ? "#d4a8ff" : "#555", cursor: "pointer" }}>{p}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
          {kpis.map(k => (
            <div key={k.label} style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#444", marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: k.color, marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: k.up ? "#4dcca0" : "#4dcca0" }}>{k.up ? "↑" : "↓"} {k.trend}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#1a1030", border: "1px solid #7B2FFF22", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#7B2FFF22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", marginBottom: 2 }}>El bot cerró 21 de 24 turnos esta semana sin intervención humana</div>
            <div style={{ fontSize: 11, color: "#444" }}>87.5% de automatización — solo 3 conversaciones requirieron atención manual</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 500, color: "#4dcca0" }}>87.5%</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 2 }}>Turnos por día</div>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 14 }}>Esta semana · total 24</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
              {dias.map(d => (
                <div key={d.dia} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 9, color: "#555" }}>{d.val}</span>
                  <div style={{ width: "100%", borderRadius: "3px 3px 0 0", height: d.h, background: d.highlight ? "#7B2FFF" : "#7B2FFF44" }}></div>
                  <span style={{ fontSize: 9, color: "#3a3a3a" }}>{d.dia}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 2 }}>Canal de origen</div>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 14 }}>Distribución de turnos agendados</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width="76" height="76" viewBox="0 0 76 76">
                <circle cx="38" cy="38" r="28" fill="none" stroke="#1e1e1e" strokeWidth="13"/>
                <circle cx="38" cy="38" r="28" fill="none" stroke="#7B2FFF" strokeWidth="13" strokeDasharray="106 70" strokeDashoffset="0" transform="rotate(-90 38 38)"/>
                <circle cx="38" cy="38" r="28" fill="none" stroke="#1D9E75" strokeWidth="13" strokeDasharray="70 106" strokeDashoffset="-106" transform="rotate(-90 38 38)"/>
                <text x="38" y="41" textAnchor="middle" fontSize="10" fontWeight="500" fill="#ccc">24</text>
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[["#7B2FFF", "Instagram", 14, "60%"], ["#1D9E75", "WhatsApp", 10, "40%"]].map(([color, label, val, pct]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }}></div>
                    <span style={{ fontSize: 11, color: "#777", flex: 1 }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#ccc" }}>{val}</span>
                    <span style={{ fontSize: 10, color: "#444" }}>{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 2 }}>Servicios más pedidos</div>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 14 }}>Por cantidad · ingresos estimados</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {servicios.map((s, i) => (
                <div key={s.nombre} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, color: "#333", width: 14, textAlign: "center" }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: "#aaa", width: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.nombre}</span>
                  <div style={{ flex: 1, height: 5, background: "#1e1e1e", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontSize: 11, color: "#555", width: 22, textAlign: "right" }}>{s.count}</span>
                  <span style={{ fontSize: 10, color: "#3a3a3a", width: 44, textAlign: "right" }}>{s.ingreso}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 12 }}>Rendimiento del bot</div>
            {[
              ["🤖", "Turnos cerrados por bot", "21 (87%)", "#4dcca0"],
              ["✋", "Intervención humana", "3 veces", "#d4a8ff"],
              ["⏱", "Hora pico", "11:00 — 13:00", "#aaa"],
              ["📅", "Tasa de cancelación", "11%", "#EF9F27"],
              ["💬", "Chats totales", "35", "#aaa"],
              ["🔁", "Clientes recurrentes", "8", "#4dcca0"],
            ].map(([ico, label, val, color]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e1e1e" }}>
                <span style={{ fontSize: 11, color: "#555" }}>{ico} {label}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}