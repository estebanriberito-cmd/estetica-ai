import { useEffect, useState, useRef } from "react"
import { supabase } from "../supabase"

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "lumina_estetica"

const msgs_demo = [
  { id: 1, tipo: "user", texto: "hola quiero turno para limpieza facial el viernes", hora: "19:20" },
  { id: 2, tipo: "bot",  texto: "hola! tenemos lugar el viernes a las 9:00 o a las 11:00", hora: "19:20" },
  { id: 3, tipo: "bot",  texto: "cual te queda mejor?", hora: "19:20" },
  { id: 4, tipo: "user", texto: "a las 11, me llamo María, cel 098123456", hora: "19:23" },
  { id: 5, tipo: "bot",  texto: "listo María, te agendé para el viernes a las 11:00", hora: "19:23" },
]

const GRADIENTS = [
  ["#7B2FFF", "#D926FF"], ["#4F46E5", "#7B2FFF"], ["#1D9E75", "#2563EB"],
  ["#D926FF", "#9044ff"], ["#2563EB", "#4F46E5"],
]
const avatarGradient = (name = "") =>
  `linear-gradient(135deg, ${GRADIENTS[(name.charCodeAt(0) || 65) % GRADIENTS.length].join(", ")})`

const isFirst = (msgs, i) => i === 0 || msgs[i - 1].tipo !== msgs[i].tipo
const isLast  = (msgs, i) => i === msgs.length - 1 || msgs[i + 1].tipo !== msgs[i].tipo

const bubbleRadius = (tipo, first, last) => {
  if (tipo === "user") {
    if (first && last)   return "14px 4px 14px 14px"
    if (first && !last)  return "14px 4px 6px 14px"
    if (!first && !last) return "14px 4px 4px 14px"
    if (!first && last)  return "14px 14px 4px 14px"
  } else {
    if (first && last)   return "4px 14px 14px 14px"
    if (first && !last)  return "4px 14px 6px 4px"
    if (!first && !last) return "4px 14px 14px 4px"
    if (!first && last)  return "4px 14px 14px 14px"
  }
}

const ESTADO = {
  confirmado: { color: "#1D9E75", bg: "rgba(29,158,117,0.10)", border: "rgba(29,158,117,0.22)" },
  reagendado: { color: "#c9a0ff", bg: "rgba(123,47,255,0.12)", border: "rgba(123,47,255,0.28)" },
  cancelado:  { color: "#f07070", bg: "rgba(240,112,112,0.10)", border: "rgba(240,112,112,0.22)" },
}
const CANAL = {
  WhatsApp:  { color: "#1D9E75", bg: "rgba(29,158,117,0.10)", border: "rgba(29,158,117,0.22)" },
  Instagram: { color: "#D926FF", bg: "rgba(217,38,255,0.10)", border: "rgba(217,38,255,0.22)" },
}

function SearchIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function SendIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> }
function HandIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 00-2-2 2 2 0 00-2 2"/><path d="M14 10V4a2 2 0 00-2-2 2 2 0 00-2 2v2"/><path d="M10 10.5V6a2 2 0 00-2-2 2 2 0 00-2 2v8"/><path d="M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15"/></svg> }
function BotIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M9 11V7a3 3 0 016 0v4"/><circle cx="9" cy="16" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="16" r="1" fill="currentColor" stroke="none"/></svg> }
function BackIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> }

function Avatar({ name = "?", size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: avatarGradient(name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 600, color: "#fff", flexShrink: 0, letterSpacing: "0.3px" }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}
function Badge({ label, color, bg, border }) {
  return (
    <span style={{ fontSize: 9, fontWeight: 500, padding: "2px 7px", borderRadius: 20, background: bg, color, border: `1px solid ${border}`, letterSpacing: "0.2px" }}>
      {label}
    </span>
  )
}
function TypingIndicator() {
  return (
    <div style={{ alignSelf: "flex-start", marginTop: 12 }}>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 20, background: "var(--primary-10)", color: "#7B2FFF", border: "1px solid rgba(123,47,255,0.22)", letterSpacing: "0.4px" }}>AI</span>
      </div>
      <div style={{ padding: "11px 15px", borderRadius: "4px 14px 14px 14px", background: "var(--surface-2)", border: "1px solid var(--border-2)", display: "flex", gap: 5, alignItems: "center" }}>
        <style>{`@keyframes typingBounce{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-5px);opacity:1}}`}</style>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#7B2FFF", animation: `typingBounce 1.2s ${i * 0.15}s infinite ease-in-out` }} />
        ))}
      </div>
    </div>
  )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  return isMobile
}

export default function Bandeja() {
  const [turnos,      setTurnos]      = useState([])
  const [activo,      setActivo]      = useState(null)
  const [mensajes,    setMensajes]    = useState([])
  const [filtro,      setFiltro]      = useState("Todos")
  const [busqueda,    setBusqueda]    = useState("")
  const [loading,     setLoading]     = useState(true)
  const [bajoControl, setBajoControl] = useState(false)
  const [typing,      setTyping]      = useState(false)
  const [inputText,   setInputText]   = useState("")
  const [enviando,    setEnviando]    = useState(false)
  const [vistaChat,   setVistaChat]   = useState(false)
  const typingTimeoutRef = useRef(null)
  const messagesEndRef   = useRef(null)
  const activoRef        = useRef(null)
  const isMobile         = useIsMobile()

  useEffect(() => { activoRef.current = activo }, [activo])

  useEffect(() => {
    fetchTurnos()
    const ch = supabase.channel("turnos-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "turnos", filter: `client_id=eq.${CLIENT_ID}` },
        () => { fetchTurnos() })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  useEffect(() => {
    if (!activo) return
    fetchMensajes(activo.contact_id)
    setBajoControl(activo.bajo_control || false)
    setTyping(false)

    const chatCh = supabase.channel(`chat-${activo.contact_id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "n8n_chat_histories", filter: `session_id=eq.${activo.contact_id}` },
        () => { setTyping(false); if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); fetchMensajes(activo.contact_id) })
      .subscribe()

    const lockCh = supabase.channel(`lock-${activo.contact_id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "locks", filter: `contact_id=eq.${activo.contact_id}` },
        () => { setTyping(true); if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); typingTimeoutRef.current = setTimeout(() => setTyping(false), 60000) })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "locks", filter: `contact_id=eq.${activo.contact_id}` },
        () => { setTyping(false); if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); setTimeout(() => fetchMensajes(activo.contact_id), 500) })
      .subscribe()

    return () => {
      supabase.removeChannel(chatCh)
      supabase.removeChannel(lockCh)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [activo?.contact_id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes, typing])

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {})
  }, [])

  async function fetchTurnos() {
    setLoading(true)
    const { data, error } = await supabase.from("turnos").select("*").eq("client_id", CLIENT_ID).order("updated_at", { ascending: false })
    if (!error && data) {
      setTurnos(data)
      if (data.length > 0 && !activoRef.current) setActivo(data[0])
    }
    setLoading(false)
  }

  async function fetchMensajes(contact_id) {
    const { data, error } = await supabase.from("n8n_chat_histories").select("*").eq("session_id", String(contact_id)).order("id", { ascending: true }).limit(100)
    if (!error && data) {
      const hora = (id) => new Date(id * 1000 || Date.now()).toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" })
      const parsed = data.flatMap(m => {
        try {
          const msg = typeof m.message === "string" ? JSON.parse(m.message) : m.message
          if (msg.name) return []
          if (msg.type === "human") {
            let texto = ""
            const canalPos  = msg.content.indexOf("CANAL:")
            const firstDash = msg.content.indexOf("\n---")
            if (canalPos !== -1 && firstDash !== -1 && firstDash > canalPos) {
              const afterCanal = msg.content.indexOf("\n", canalPos) + 1
              texto = msg.content.slice(afterCanal, firstDash).trim()
            } else if (firstDash !== -1) {
              texto = msg.content.slice(0, firstDash).trim().split("\n").filter(Boolean).pop() || ""
            } else {
              texto = msg.content.slice(0, 100)
            }
            if (!texto) return []
            return [{ id: m.id, tipo: "user", texto, hora: hora(m.id) }]
          } else if (msg.type === "ai") {
            try {
              const start = msg.content.indexOf("{")
              const end   = msg.content.lastIndexOf("}")
              if (start !== -1 && end > start) {
                const json = JSON.parse(msg.content.slice(start, end + 1))
                const bubbles = []
                if (json.mensaje_1) bubbles.push({ id: m.id,       tipo: "bot", texto: json.mensaje_1, hora: hora(m.id) })
                if (json.mensaje_2) bubbles.push({ id: m.id + 0.1, tipo: "bot", texto: json.mensaje_2, hora: hora(m.id) })
                return bubbles
              }
            } catch {}
            return []
          }
          return []
        } catch { return [] }
      })
      setMensajes(parsed.length > 0 ? parsed : msgs_demo)
    } else {
      setMensajes(msgs_demo)
    }
  }

  async function archivar(id, e) {
    e.stopPropagation()
    const { error } = await supabase.from("turnos").update({ estado: "archivado" }).eq("id", id)
    if (!error) setTurnos(prev => prev.map(t => t.id === id ? { ...t, estado: "archivado" } : t))
  }

  async function desarchivar(id, e) {
    e.stopPropagation()
    const { error } = await supabase.from("turnos").update({ estado: "confirmado" }).eq("id", id)
    if (!error) setTurnos(prev => prev.map(t => t.id === id ? { ...t, estado: "confirmado" } : t))
  }

  async function eliminar(id, e) {
    e.stopPropagation()
    if (!window.confirm("Eliminar este contacto permanentemente?")) return
    const { error } = await supabase.from("turnos").delete().eq("id", id)
    if (!error) {
      setTurnos(prev => prev.filter(t => t.id !== id))
      if (activo?.id === id) { setActivo(null); setVistaChat(false) }
    }
  }

  async function tomarControl() {
    if (!activo) return
    const newVal = !bajoControl
    const { error } = await supabase.from("turnos").update({ bajo_control: newVal, updated_at: new Date().toISOString() }).eq("id", activo.id)
    if (!error) {
      setBajoControl(newVal)
      setActivo(prev => ({ ...prev, bajo_control: newVal }))
      setTurnos(prev => prev.map(t => t.id === activo.id ? { ...t, bajo_control: newVal } : t))
    }
  }

  async function enviarMensaje() {
    if (!inputText.trim() || !activo || enviando) return
    setEnviando(true)
    try {
      const textToSend = inputText.trim()
      await fetch("/api/send-message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscriber_id: activo.contact_id, text: textToSend, canal: activo.canal || "Instagram" }) })
      setInputText("")
      setMensajes(prev => [...prev, { id: Date.now(), tipo: "user", texto: textToSend, hora: new Date().toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" }) }])
    } catch (e) { console.error("Error enviando:", e) }
    setEnviando(false)
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensaje() }
  }

  function abrirChat(t) {
    setActivo(t)
    setBajoControl(t.bajo_control || false)
    if (isMobile) setVistaChat(true)
  }

  const filtrados = turnos
    .filter(t => {
      if (filtro === "Archivados") return t.estado === "archivado"
      if (t.estado === "archivado") return false
      if (filtro === "Todos") return true
      return t.canal === filtro
    })
    .filter(t => {
      if (!busqueda.trim()) return true
      const q = busqueda.toLowerCase()
      return (t.nombre || "").toLowerCase().includes(q) || (t.servicio || "").toLowerCase().includes(q) || (t.preview || "").toLowerCase().includes(q)
    })

  /* ── Panel lista ── */
  const PanelLista = (
    <div style={{ width: isMobile ? "100%" : 280, flexShrink: 0, background: "var(--surface-1)", borderRight: isMobile ? "none" : "1px solid var(--border)", display: isMobile && vistaChat ? "none" : "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 14px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.2px" }}>Conversaciones</span>
          <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: "var(--primary-10)", color: "#c9a0ff", border: "1px solid var(--primary-25)" }}>{filtrados.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface-2)", borderRadius: "var(--radius-sm)", padding: "8px 11px", border: `1px solid ${busqueda ? "rgba(123,47,255,0.4)" : "var(--border-2)"}`, transition: "border-color 0.15s" }}>
          <span style={{ color: "var(--text-3)", display: "flex", alignItems: "center", flexShrink: 0 }}><SearchIcon /></span>
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar contacto..." style={{ background: "none", border: "none", outline: "none", fontSize: 11, color: "var(--text-1)", width: "100%", fontFamily: "inherit" }} />
          {busqueda && <button onClick={() => setBusqueda("")} style={{ background: "none", border: "none", color: "var(--text-4)", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, padding: "0 14px 12px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
        {["Todos", "WhatsApp", "Instagram", "Archivados"].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{ fontSize: 10, fontWeight: filtro === f ? 500 : 400, padding: "4px 10px", borderRadius: 20, background: filtro === f ? "var(--primary-10)" : "rgba(255,255,255,0.02)", border: filtro === f ? "1px solid var(--primary-25)" : "1px solid #1e1e1e", color: filtro === f ? "#c9a0ff" : "var(--text-3)", transition: "all 0.15s" }}>{f}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? <div style={{ padding: 28, textAlign: "center", fontSize: 11, color: "var(--text-4)" }}>Cargando...</div>
        : filtrados.length === 0 ? <div style={{ padding: 28, textAlign: "center", fontSize: 11, color: "var(--text-4)" }}>{busqueda ? `Sin resultados para "${busqueda}"` : "Sin conversaciones"}</div>
        : filtrados.map(t => {
          const isAct = activo?.id === t.id
          const es = ESTADO[t.estado] || ESTADO.confirmado
          const ca = CANAL[t.canal] || CANAL.Instagram
          return (
            <div key={t.id} onClick={() => abrirChat(t)}
              style={{ display: "flex", gap: 10, padding: "12px 14px", borderBottom: "1px solid #161616", borderLeft: isAct && !isMobile ? "2px solid #7B2FFF" : "2px solid transparent", background: isAct && !isMobile ? "rgba(123,47,255,0.07)" : "transparent", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => { if (!isAct) e.currentTarget.style.background = "rgba(255,255,255,0.025)" }}
              onMouseLeave={e => { if (!isAct) e.currentTarget.style.background = "transparent" }}
            >
              <div style={{ position: "relative" }}>
                <Avatar name={t.nombre || "?"} size={isMobile ? 42 : 36} />
                {t.bajo_control && <div style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, borderRadius: "50%", background: "#f07070", border: "2px solid var(--surface-1)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} /></div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: isMobile ? 13 : 12, fontWeight: 500, color: isAct ? "#e8e8e8" : "#bbb" }}>{t.nombre || "Cliente nuevo"}</span>
                  <span style={{ fontSize: 9, color: "var(--text-4)", flexShrink: 0, marginLeft: 6 }}>{t.hora_turno || ""}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: isMobile ? 5 : 7 }}>
                  {t.preview ? <><span style={{ color: "#555", marginRight: 3 }}>AI:</span>{t.preview.length > 38 ? t.preview.slice(0, 38) + "…" : t.preview}</> : <span style={{ color: "#333" }}>{t.servicio || "Sin servicio"}</span>}
                </div>
                <div style={{ display: "flex", gap: 5, alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    <Badge label={t.canal || "Instagram"} {...ca} />
                    <Badge label={t.estado || "confirmado"} {...es} />
                    {t.bajo_control && <Badge label="En control" color="#f07070" bg="rgba(240,112,112,0.10)" border="rgba(240,112,112,0.22)" />}
                  </div>
                  <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                    {t.estado === "archivado" ? (
                      <>
                        <button onClick={e => desarchivar(t.id, e)} style={{ background: "none", border: "none", color: "#2a2a2a", cursor: "pointer", padding: "2px 5px", borderRadius: 4, fontSize: 11, lineHeight: 1 }} onMouseEnter={e => e.currentTarget.style.color = "#1D9E75"} onMouseLeave={e => e.currentTarget.style.color = "#2a2a2a"}>↩</button>
                        <button onClick={e => eliminar(t.id, e)} style={{ background: "none", border: "none", color: "#2a2a2a", cursor: "pointer", padding: "2px 4px", borderRadius: 4, fontSize: 13, lineHeight: 1 }} onMouseEnter={e => e.currentTarget.style.color = "#f07070"} onMouseLeave={e => e.currentTarget.style.color = "#2a2a2a"}>🗑</button>
                      </>
                    ) : (
                      <button onClick={e => archivar(t.id, e)} style={{ background: "none", border: "none", color: "#2a2a2a", cursor: "pointer", padding: "2px 4px", borderRadius: 4, fontSize: 14, lineHeight: 1 }} onMouseEnter={e => e.currentTarget.style.color = "#f07070"} onMouseLeave={e => e.currentTarget.style.color = "#2a2a2a"}>×</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  /* ── Panel chat ── */
  const PanelChat = (
    <div style={{ flex: 1, display: isMobile && !vistaChat ? "none" : "flex", flexDirection: "column", minWidth: 0, width: isMobile ? "100%" : undefined, height: "100%" }}>
      {activo ? (
        <>
          {/* Header — siempre fijo arriba */}
          <div style={{ flexShrink: 0, padding: isMobile ? "10px 14px" : "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: bajoControl ? "rgba(240,112,112,0.05)" : "var(--surface-1)", transition: "background 0.3s", zIndex: 10 }}>
            {isMobile && (
              <button onClick={() => setVistaChat(false)} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px 4px 4px 0", marginRight: 2 }}>
                <BackIcon />
              </button>
            )}
            <Avatar name={activo.nombre || "?"} size={isMobile ? 34 : 36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activo.nombre || "Cliente nuevo"}</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {activo.canal || "Instagram"} · {activo.servicio}
                {bajoControl && <span style={{ marginLeft: 6, color: "#f07070", fontWeight: 500 }}>● En control</span>}
              </div>
            </div>
            <button onClick={tomarControl} style={{ display: "flex", alignItems: "center", gap: 5, padding: isMobile ? "6px 10px" : "7px 14px", background: bajoControl ? "rgba(240,112,112,0.12)" : "var(--primary-10)", border: `1px solid ${bajoControl ? "rgba(240,112,112,0.35)" : "var(--primary-25)"}`, borderRadius: "var(--radius-sm)", fontSize: isMobile ? 10 : 11, fontWeight: 500, color: bajoControl ? "#f07070" : "#c9a0ff", transition: "all 0.15s", flexShrink: 0, whiteSpace: "nowrap" }}>
              {bajoControl ? <><BotIcon /> {isMobile ? "Liberar" : "Liberar bot"}</> : <><HandIcon /> {isMobile ? "Tomar" : "Tomar conversación"}</>}
            </button>
          </div>

          {/* Mensajes — scroll interno, nunca tapa el header ni el input */}
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 14px" : "20px 22px", display: "flex", flexDirection: "column", background: "var(--bg)", backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "22px 22px", minHeight: 0 }}>
            {mensajes.map((m, i) => {
              const first = isFirst(mensajes, i)
              const last  = isLast(mensajes, i)
              return (
                <div key={m.id} style={{ maxWidth: isMobile ? "80%" : "65%", alignSelf: m.tipo === "user" ? "flex-end" : "flex-start", marginTop: first ? (i === 0 ? 0 : 12) : 3 }}>
                  {m.tipo === "bot" && first && <div style={{ marginBottom: 4 }}><span style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 20, background: "var(--primary-10)", color: "#7B2FFF", border: "1px solid rgba(123,47,255,0.22)", letterSpacing: "0.4px" }}>AI</span></div>}
                  <div style={{ padding: "8px 13px", borderRadius: bubbleRadius(m.tipo, first, last), background: m.tipo === "user" ? "rgba(123,47,255,0.16)" : "var(--surface-2)", color: m.tipo === "user" ? "#ddd0ff" : "#999", border: `1px solid ${m.tipo === "user" ? "rgba(123,47,255,0.28)" : "var(--border-2)"}`, fontSize: isMobile ? 13 : 12, lineHeight: 1.55 }}>
                    {m.texto}
                  </div>
                  {last && <div style={{ fontSize: 9, color: "var(--text-4)", marginTop: 4, textAlign: m.tipo === "user" ? "right" : "left" }}>{m.hora}</div>}
                </div>
              )
            })}
            {typing && !bajoControl && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input — siempre fijo abajo, respeta safe area */}
          <div style={{ flexShrink: 0, padding: isMobile ? "10px 12px" : "12px 16px 16px", paddingBottom: isMobile ? "max(12px, env(safe-area-inset-bottom))" : "16px", display: "flex", alignItems: "center", gap: 8, background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
            {bajoControl ? (
              <input value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escribir mensaje..." autoFocus
                style={{ flex: 1, background: "rgba(240,112,112,0.05)", border: "1px solid rgba(240,112,112,0.3)", borderRadius: "var(--radius)", padding: isMobile ? "11px 14px" : "9px 14px", fontSize: isMobile ? 14 : 12, color: "var(--text-1)", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = "rgba(240,112,112,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(240,112,112,0.3)"}
              />
            ) : (
              <div style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", padding: isMobile ? "11px 14px" : "9px 14px", fontSize: isMobile ? 13 : 12, color: "#2a2a2a" }}>
                Tomá el control para escribir...
              </div>
            )}
            <button onClick={bajoControl ? enviarMensaje : undefined} disabled={!bajoControl || enviando}
              style={{ width: isMobile ? 40 : 34, height: isMobile ? 40 : 34, flexShrink: 0, borderRadius: 9, background: bajoControl ? "#f07070" : "var(--surface-3)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: bajoControl ? "#fff" : "var(--text-4)", boxShadow: bajoControl ? "0 2px 10px rgba(240,112,112,0.38)" : "none", cursor: bajoControl ? "pointer" : "default", transition: "all 0.2s", opacity: enviando ? 0.6 : 1 }}
              onMouseEnter={e => { if (bajoControl) { e.currentTarget.style.background = "#e05555" } }}
              onMouseLeave={e => { if (bajoControl) { e.currentTarget.style.background = "#f07070" } }}
            >
              <SendIcon />
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--text-4)", backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <div style={{ fontSize: 12 }}>Seleccioná una conversación</div>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)", overflow: "hidden" }}>
      {PanelLista}
      {!isMobile && PanelChat}
      {isMobile && vistaChat && PanelChat}
    </div>
  )
}