import { useState, useEffect } from "react"
import { supabase } from "../supabase"

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "lumina_estetica"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  return isMobile
}

/* ── Icons ── */
function BuildingIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function ClockIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function ScissorsIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg> }
function SignalIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function TrashIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg> }
function PlusIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function CheckIcon()    { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function MessageIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> }
function IgIcon()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> }
function BackIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> }

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
        flex: 1, fontSize: 13, color: "#ccc", background: "var(--bg)",
        border: `1px solid ${focused ? "rgba(123,47,255,0.45)" : "var(--border-2)"}`,
        borderRadius: "var(--radius-sm)", padding: "10px 12px", outline: "none",
        transition: "border-color 0.15s", fontFamily: "inherit", width: "100%",
      }}
    />
  )
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: 36, height: 20, borderRadius: 10, flexShrink: 0,
      background: checked ? "rgba(123,47,255,0.35)" : "rgba(255,255,255,0.05)",
      border: `1px solid ${checked ? "rgba(123,47,255,0.5)" : "var(--border-2)"}`,
      position: "relative", cursor: "pointer", transition: "all 0.2s",
    }}>
      <div style={{
        position: "absolute", width: 14, height: 14,
        background: checked ? "#c9a0ff" : "#3a3a3a", borderRadius: "50%",
        top: 2, left: checked ? 18 : 2, transition: "left 0.2s, background 0.2s",
        boxShadow: checked ? "0 0 6px rgba(123,47,255,0.5)" : "none",
      }} />
    </div>
  )
}

function TimeInput({ value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type="time" value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        fontSize: 13, color: "#ccc", background: "var(--bg)",
        border: `1px solid ${focused ? "rgba(123,47,255,0.45)" : "var(--border-2)"}`,
        borderRadius: "var(--radius-sm)", padding: "6px 8px", outline: "none",
        transition: "border-color 0.15s", fontFamily: "inherit",
        colorScheme: "dark", width: 90,
      }}
    />
  )
}

export default function Configuracion() {
  const [seccion,   setSeccion]   = useState(null) // null = lista en móvil
  const [config,    setConfig]    = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje,   setMensaje]   = useState("")
  const isMobile = useIsMobile()

  // En desktop arranca en "salon" directamente
  useEffect(() => { if (!isMobile) setSeccion("salon") }, [isMobile])

  useEffect(() => { fetchConfig() }, [])

  async function fetchConfig() {
    setLoading(true)
    const { data, error } = await supabase.from("config").select("*").eq("client_id", CLIENT_ID).limit(1).single()
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
    setMensaje(error ? "Error al guardar" : "Guardado ✓")
    setTimeout(() => setMensaje(""), 2500)
  }

  if (loading) return <div style={{ padding: 48, color: "var(--text-4)", background: "var(--bg)", height: "100%", fontSize: 12 }}>Cargando...</div>
  if (!config)  return <div style={{ padding: 48, color: "var(--text-4)", background: "var(--bg)", height: "100%", fontSize: 12 }}>Sin configuración</div>

  /* ── MÓVIL: lista de secciones ── */
  if (isMobile && seccion === null) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100%", padding: "8px 0" }}>
        {SECCIONES.map(({ id, label, Icon }) => (
          <div key={id} onClick={() => setSeccion(id)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 18px", borderBottom: "1px solid #161616",
            cursor: "pointer", color: "#bbb",
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a0ff", flexShrink: 0 }}>
              <Icon />
            </div>
            <span style={{ fontSize: 14, fontWeight: 400, flex: 1 }}>{label}</span>
            <span style={{ color: "var(--text-4)", fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    )
  }

  /* ── Contenido de la sección ── */
  const contenido = (
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 14px" : "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Toast */}
      {mensaje && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(29,158,117,0.08)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "#1D9E75" }}>
          <CheckIcon /> {mensaje}
        </div>
      )}

      {/* Botón guardar flotante en móvil */}
      {isMobile && (
        <button onClick={guardar} style={{
          width: "100%", padding: "13px", fontSize: 14, fontWeight: 500,
          background: "var(--primary)", border: "none", borderRadius: "var(--radius)",
          color: "#fff", cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 2px 12px rgba(123,47,255,0.35)",
        }}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      )}

      {/* ── Salón ── */}
      {seccion === "salon" && (
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {!isMobile && (
            <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>Datos del salón</span>
              <button onClick={guardar} style={{ fontSize: 11, fontWeight: 500, padding: "7px 16px", background: "var(--primary)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16 }}>
            {[["Nombre del salón", "nombre"], ["Dirección", "direccion"], ["Teléfono", "telefono"], ["Instagram", "instagram"]].map(([label, field]) => (
              <div key={field}>
                <div style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 5 }}>{label}</div>
                <StyledInput value={config[field] || ""} onChange={e => setConfig({ ...config, [field]: e.target.value })} placeholder={label} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Horarios ── */}
      {seccion === "horarios" && (
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {!isMobile && (
            <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>Horarios de atención</span>
              <button onClick={guardar} style={{ fontSize: 11, fontWeight: 500, padding: "7px 16px", background: "var(--primary)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          )}
          {(config.horarios || []).map((h, i) => (
            <div key={h.dia} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)", gap: 12, flexWrap: "wrap" }}>
              <div style={{ fontSize: 13, color: "var(--text-2)", width: 90, flexShrink: 0 }}>{h.dia}</div>
              <Toggle checked={h.activo} onChange={() => {
                const nuevos = [...config.horarios]
                nuevos[i] = { ...nuevos[i], activo: !nuevos[i].activo }
                setConfig({ ...config, horarios: nuevos })
              }} />
              {h.activo ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TimeInput value={h.desde || "09:00"} onChange={e => {
                    const nuevos = [...config.horarios]
                    nuevos[i] = { ...nuevos[i], desde: e.target.value }
                    setConfig({ ...config, horarios: nuevos })
                  }} />
                  <span style={{ fontSize: 12, color: "var(--text-4)" }}>—</span>
                  <TimeInput value={h.hasta || "19:00"} onChange={e => {
                    const nuevos = [...config.horarios]
                    nuevos[i] = { ...nuevos[i], hasta: e.target.value }
                    setConfig({ ...config, horarios: nuevos })
                  }} />
                </div>
              ) : (
                <span style={{ fontSize: 12, color: "var(--text-4)" }}>Cerrado</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Servicios ── */}
      {seccion === "servicios" && (
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {!isMobile && (
            <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>Servicios y precios</span>
              <button onClick={guardar} style={{ fontSize: 11, fontWeight: 500, padding: "7px 16px", background: "var(--primary)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          )}
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {(config.servicios || []).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <input value={s.nombre} onChange={e => {
                  const nuevos = [...config.servicios]; nuevos[i] = { ...nuevos[i], nombre: e.target.value }; setConfig({ ...config, servicios: nuevos })
                }} style={{ flex: 1, fontSize: 13, color: "#bbb", background: "transparent", border: "none", outline: "none", fontFamily: "inherit" }} />
                <input value={s.precio} onChange={e => {
                  const nuevos = [...config.servicios]; nuevos[i] = { ...nuevos[i], precio: e.target.value }; setConfig({ ...config, servicios: nuevos })
                }} style={{ fontSize: 13, color: "#1D9E75", background: "rgba(29,158,117,0.06)", border: "1px solid rgba(29,158,117,0.18)", borderRadius: "var(--radius-sm)", padding: "5px 8px", width: 80, outline: "none", fontFamily: "inherit", textAlign: "right" }} />
                <button onClick={() => setConfig({ ...config, servicios: config.servicios.filter((_, j) => j !== i) })} style={{
                  width: 30, height: 30, borderRadius: "var(--radius-sm)", background: "rgba(240,112,112,0.08)",
                  border: "1px solid rgba(240,112,112,0.15)", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "#f07070", flexShrink: 0,
                }}>
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setConfig({ ...config, servicios: [...(config.servicios || []), { nombre: "Nuevo servicio", precio: "$0" }] })} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "12px 16px",
            fontSize: 13, fontWeight: 500, color: "#c9a0ff", background: "transparent",
            border: "none", cursor: "pointer", fontFamily: "inherit",
            borderTop: "1px solid var(--border)", width: "100%",
          }}>
            <PlusIcon /> Agregar servicio
          </button>
        </div>
      )}

      {/* ── Canales ── */}
      {seccion === "canales" && (
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {!isMobile && (
            <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>Canales conectados</span>
            </div>
          )}
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { Icon: MessageIcon, nombre: "WhatsApp Business", detalle: config.telefono || "—", color: "#1D9E75", iconBg: "rgba(29,158,117,0.10)", iconBorder: "rgba(29,158,117,0.22)" },
              { Icon: IgIcon,      nombre: "Instagram",         detalle: config.instagram || "—", color: "#D926FF", iconBg: "rgba(217,38,255,0.10)", iconBorder: "rgba(217,38,255,0.22)" },
            ].map(({ Icon, nombre, detalle, color, iconBg, iconBorder }) => (
              <div key={nombre} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: iconBg, border: `1px solid ${iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                  <Icon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#ccc" }}>{nombre}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{detalle}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: "rgba(29,158,117,0.08)", color: "#1D9E75", border: "1px solid rgba(29,158,117,0.2)", flexShrink: 0 }}>
                  Conectado
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  /* ── MÓVIL: sección abierta ── */
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>
        {/* Header con volver */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: "1px solid var(--border)", background: "var(--surface-1)" }}>
          <button onClick={() => setSeccion(null)} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px 4px 4px 0" }}>
            <BackIcon />
          </button>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>
            {SECCIONES.find(s => s.id === seccion)?.label}
          </span>
        </div>
        {contenido}
      </div>
    )
  }

  /* ── DESKTOP: dos columnas ── */
  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)" }}>
      <div style={{ width: 190, flexShrink: 0, background: "var(--surface-1)", borderRight: "1px solid var(--border)", padding: "16px 8px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-4)", padding: "0 10px 10px", textTransform: "uppercase", letterSpacing: "0.6px" }}>Configuración</div>
        {SECCIONES.map(({ id, label, Icon }) => {
          const active = seccion === id
          return (
            <div key={id} onClick={() => setSeccion(id)} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", marginBottom: 2,
              borderRadius: "var(--radius-sm)", cursor: "pointer",
              color: active ? "#d4b0ff" : "#4a4a4a",
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
      {contenido}
    </div>
  )
}