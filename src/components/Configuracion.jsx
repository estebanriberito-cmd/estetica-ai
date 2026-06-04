import { useState, useEffect } from "react"
import { supabase } from "../supabase"

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "lumina_estetica"

function BuildingIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function ScissorsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  )
}
function SignalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
function MessageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function CheckSmallIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

const SECCIONES = [
  { id: "salon",     label: "Mi salón",  Icon: BuildingIcon },
  { id: "horarios",  label: "Horarios",  Icon: ClockIcon    },
  { id: "servicios", label: "Servicios", Icon: ScissorsIcon },
  { id: "canales",   label: "Canales",   Icon: SignalIcon   },
]

function StyledInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <input value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        flex: 1, fontSize: 12, color: "#ccc", background: "var(--bg)",
        border: `1px solid ${focused ? "rgba(123,47,255,0.45)" : "var(--border-2)"}`,
        borderRadius: "var(--radius-sm)", padding: "8px 12px", outline: "none",
        transition: "border-color 0.15s", fontFamily: "inherit",
      }}
    />
  )
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: 34, height: 19, borderRadius: 10, flexShrink: 0,
      background: checked ? "rgba(123,47,255,0.35)" : "rgba(255,255,255,0.05)",
      border: `1px solid ${checked ? "rgba(123,47,255,0.5)" : "var(--border-2)"}`,
      position: "relative", cursor: "pointer", transition: "all 0.2s",
    }}>
      <div style={{
        position: "absolute", width: 13, height: 13,
        background: checked ? "#c9a0ff" : "#3a3a3a", borderRadius: "50%",
        top: 2, left: checked ? 17 : 2, transition: "left 0.2s, background 0.2s",
        boxShadow: checked ? "0 0 6px rgba(123,47,255,0.5)" : "none",
      }} />
    </div>
  )
}

function SaveButton({ onClick, saving }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 11, fontWeight: 500, padding: "7px 16px",
      background: "var(--primary)", border: "none",
      borderRadius: "var(--radius-sm)", color: "#fff", cursor: "pointer",
      boxShadow: "0 2px 8px rgba(123,47,255,0.32)", transition: "all 0.15s", fontFamily: "inherit",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "#9044ff"; e.currentTarget.style.boxShadow = "0 2px 14px rgba(123,47,255,0.5)" }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(123,47,255,0.32)" }}
    >
      {saving ? "Guardando..." : "Guardar"}
    </button>
  )
}

function SectionHeader({ title, onSave, saving }) {
  return (
    <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>{title}</span>
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  )
}

export default function Configuracion() {
  const [seccion,   setSeccion]   = useState("salon")
  const [config,    setConfig]    = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje,   setMensaje]   = useState("")

  useEffect(() => { fetchConfig() }, [])

  async function fetchConfig() {
    setLoading(true)
    const { data, error } = await supabase
      .from("config")
      .select("*")
      .eq("client_id", CLIENT_ID)
      .limit(1)
      .single()
    if (!error && data) setConfig(data)
    setLoading(false)
  }

  async function guardar() {
    setGuardando(true)
    const { error } = await supabase.from("config").update({
      nombre: config.nombre, direccion: config.direccion,
      telefono: config.telefono, instagram: config.instagram,
      horarios: config.horarios, servicios: config.servicios,
    }).eq("id", config.id)
    setGuardando(false)
    setMensaje(error ? "Error al guardar" : "Guardado correctamente")
    setTimeout(() => setMensaje(""), 2500)
  }

  if (loading) return <div style={{ padding: 48, color: "var(--text-4)", background: "var(--bg)", height: "100vh", fontSize: 12 }}>Cargando...</div>
  if (!config) return <div style={{ padding: 48, color: "var(--text-4)", background: "var(--bg)", height: "100vh", fontSize: 12 }}>Sin configuración</div>

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)" }}>
      <div style={{ width: 190, flexShrink: 0, background: "var(--surface-1)", borderRight: "1px solid var(--border)", padding: "16px 8px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-4)", padding: "0 10px 10px", textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Configuración
        </div>
        {SECCIONES.map(({ id, label, Icon }) => {
          const active = seccion === id
          return (
            <div key={id} onClick={() => setSeccion(id)} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "9px 10px", marginBottom: 2, borderRadius: "var(--radius-sm)",
              cursor: "pointer", color: active ? "#d4b0ff" : "#4a4a4a",
              background: active ? "var(--primary-10)" : "transparent",
              outline: active ? "1px solid rgba(123,47,255,0.22)" : "1px solid transparent",
              fontSize: 12, fontWeight: active ? 500 : 400, transition: "all 0.15s", userSelect: "none",
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#888" } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4a4a4a" } }}
            >
              <Icon />{label}
            </div>
          )
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {mensaje && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(29,158,117,0.08)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "#1D9E75" }}>
            <CheckSmallIcon /> {mensaje}
          </div>
        )}

        {seccion === "salon" && (
          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <SectionHeader title="Datos del salón" onSave={guardar} saving={guardando} />
            {[["Nombre del salón", "nombre"], ["Dirección", "direccion"], ["Teléfono", "telefono"], ["Instagram", "instagram"]].map(([label, field]) => (
              <div key={field} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)", gap: 14 }}>
                <div style={{ fontSize: 11, color: "var(--text-3)", width: 140, flexShrink: 0 }}>{label}</div>
                <StyledInput value={config[field] || ""} onChange={e => setConfig({ ...config, [field]: e.target.value })} />
              </div>
            ))}
          </div>
        )}

        {seccion === "horarios" && (
          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <SectionHeader title="Horarios de atención" onSave={guardar} saving={guardando} />
            {(config.horarios || []).map((h, i) => (
              <div key={h.dia} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)", gap: 12 }}>
                <div style={{ fontSize: 11, color: "var(--text-2)", width: 90, flexShrink: 0 }}>{h.dia}</div>
                <Toggle checked={h.activo} onChange={() => {
                  const nuevos = [...config.horarios]
                  nuevos[i] = { ...nuevos[i], activo: !nuevos[i].activo }
                  setConfig({ ...config, horarios: nuevos })
                }} />
                <span style={{ fontSize: 11, color: h.activo ? "var(--text-2)" : "var(--text-4)" }}>
                  {h.activo ? `${h.desde} — ${h.hasta}` : "Cerrado"}
                </span>
              </div>
            ))}
          </div>
        )}

        {seccion === "servicios" && (
          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <SectionHeader title="Servicios y precios" onSave={guardar} saving={guardando} />
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 7 }}>
              {(config.servicios || []).map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                  <input value={s.nombre} onChange={e => {
                    const nuevos = [...config.servicios]; nuevos[i] = { ...nuevos[i], nombre: e.target.value }; setConfig({ ...config, servicios: nuevos })
                  }} style={{ flex: 1, fontSize: 12, color: "#bbb", background: "transparent", border: "none", outline: "none", fontFamily: "inherit" }} />
                  <input value={s.precio} onChange={e => {
                    const nuevos = [...config.servicios]; nuevos[i] = { ...nuevos[i], precio: e.target.value }; setConfig({ ...config, servicios: nuevos })
                  }} style={{ fontSize: 12, color: "#1D9E75", background: "rgba(29,158,117,0.06)", border: "1px solid rgba(29,158,117,0.18)", borderRadius: "var(--radius-sm)", padding: "4px 8px", width: 80, outline: "none", fontFamily: "inherit", textAlign: "right" }} />
                  <button onClick={() => setConfig({ ...config, servicios: config.servicios.filter((_, j) => j !== i) })} style={{
                    width: 26, height: 26, borderRadius: "var(--radius-sm)",
                    background: "rgba(240,112,112,0.08)", border: "1px solid rgba(240,112,112,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#f07070", transition: "all 0.15s", flexShrink: 0,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(240,112,112,0.16)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(240,112,112,0.08)"}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setConfig({ ...config, servicios: [...(config.servicios || []), { nombre: "Nuevo servicio", precio: "$0" }] })} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 16px",
              fontSize: 11, fontWeight: 500, color: "#c9a0ff", background: "transparent",
              border: "none", cursor: "pointer", fontFamily: "inherit",
              borderTop: "1px solid var(--border)", width: "100%", transition: "color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#d4b0ff"}
              onMouseLeave={e => e.currentTarget.style.color = "#c9a0ff"}
            >
              <PlusIcon /> Agregar servicio
            </button>
          </div>
        )}

        {seccion === "canales" && (
          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>Canales conectados</span>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { Icon: MessageIcon,   nombre: "WhatsApp Business", detalle: config.telefono || "—", color: "#1D9E75", iconBg: "rgba(29,158,117,0.10)",  iconBorder: "rgba(29,158,117,0.22)"  },
                { Icon: InstagramIcon, nombre: "Instagram",         detalle: config.instagram || "—", color: "#D926FF", iconBg: "rgba(217,38,255,0.10)", iconBorder: "rgba(217,38,255,0.22)"  },
              ].map(({ Icon, nombre, detalle, color, iconBg, iconBorder }) => (
                <div key={nombre} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: iconBg, border: `1px solid ${iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                    <Icon />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc" }}>{nombre}</div>
                    <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{detalle}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: "rgba(29,158,117,0.08)", color: "#1D9E75", border: "1px solid rgba(29,158,117,0.2)" }}>
                    Conectado
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}