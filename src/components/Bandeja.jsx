import { useEffect, useState, useRef } from "react"
import { supabase } from "../supabase"

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "lumina_estetica"
/* ── Demo data ──────────────────────────────────────────────────────────── */
const msgs_demo = [
  { id: 1, tipo: "user", texto: "hola quiero turno para limpieza facial el viernes", hora: "19:20" },
  { id: 2, tipo: "bot",  texto: "hola! tenemos lugar el viernes a las 9:00 o a las 11:00", hora: "19:20" },
  { id: 3, tipo: "bot",  texto: "cual te queda mejor?", hora: "19:20" },
  { id: 4, tipo: "user", texto: "a las 11, me llamo María, cel 098123456", hora: "19:23" },
  { id: 5, tipo: "bot",  texto: "listo María, te agendé para el viernes a las 11:00", hora: "19:23" },
]

/* ── Helpers ────────────────────────────────────────────────────────────── */
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
const ACTIONS = [
  { label: "Confirmar", color: "#1D9E75", bg: "rgba(29,158,117,0.10)",  border: "rgba(29,158,117,0.22)",  Icon: CheckIcon,  estado: "confirmado" },
  { label: "Reagendar", color: "#c9a0ff", bg: "rgba(123,47,255,0.12)",  border: "rgba(123,47,255,0.28)",  Icon: ClockIcon,  estado: "reagendado"  },
  { label: "Cancelar",  color: "#f07070", bg: "rgba(240,112,112,0.10)", border: "rgba(240,112,112,0.22)", Icon: CloseIcon,  estado: "cancelado"   },
  { label: "Perdido",   color: "#3a3a3a", bg: "rgba(255,255,255,0.03)", border: "#1e1e1e",                Icon: GhostIcon,  estado: null          },
]

/* ── Icons ──────────────────────────────────────────────────────────────── */
function SearchIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}
function SendIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
}
function HandIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 00-2-2 2 2 0 00-2 2"/><path d="M14 10V4a2 2 0 00-2-2 2 2 0 00-2 2v2"/><path d="M10 10.5V6a2 2 0 00-2-2 2 2 0 00-2 2v8"/><path d="M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15"/></svg>
}
function BotIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M9 11V7a3 3 0 016 0v4"/><circle cx="9" cy="16" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="16" r="1" fill="currentColor" stroke="none"/></svg>
}
function CheckIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}
function ClockIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function CloseIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
function GhostIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 10h.01M15 10h.01M12 2a8 8 0 00-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 00-8-8z"/></svg>
}

/* ── Sub-components ─────────────────────────────────────────────────────── */
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

/* ── Main component ─────────────────────────────────────────────────────── */
export default function Bandeja() {
  const [turnos,      setTurnos]      = useState([])
  const [activo,      setActivo]      = useState(null)
  const [mensajes,    setMensajes]    = useState([])
  const [filtro,      setFiltro]      = useState("Todos")
  const [loading,     setLoading]     = useState(true)
  const [bajoControl, setBajoControl] = useState(false)
  const [typing,      setTyping]      = useState(false)
  const [inputText,   setInputText]   = useState("")
  const [enviando,    setEnviando]    = useState(false)
  const typingTimeoutRef = useRef(null)
  const messagesEndRef   = useRef(null)
  const activoRef        = useRef(null)

  /* Sync activoRef */
  useEffect(() => { activoRef.current = activo }, [activo])

  /* Turnos realtime */
  useEffect(() => {
    fetchTurnos()
    const ch = supabase.channel("turnos-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "turnos", filter: `client_id=eq.${CLIENT_ID}` },
        () => { fetchTurnos() })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  /* Chat realtime cuando cambia activo */
  useEffect(() => {
    if (!activo) return
    fetchMensajes(activo.contact_id)
    setBajoControl(activo.bajo_control || false)
    setTyping(false)

    const ch = supabase.channel(`chat-${activo.contact_id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "n8n_chat_histories",
        filter: `session_id=eq.${activo.contact_id}`
      }, (payload) => {
        try {
          const msg = typeof payload.new.message === "string"
            ? JSON.parse(payload.new.message) : payload.new.message
          if (msg.type === "human" && !msg.name) {
            setTyping(true)
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = setTimeout(() => setTyping(false), 45000)
          } else if (msg.type === "ai" && !msg.name) {
            setTyping(false)
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            fetchMensajes(activo.contact_id)
          }
        } catch {}
      })
      .subscribe()

    return () => {
      supabase.removeChannel(ch)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [activo?.contact_id])

  /* Auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes, typing])

  async function fetchTurnos() {
    setLoading(true)
    const { data, error } = await supabase
      .from("turnos").select("*")
      .eq("client_id", CLIENT_ID)
      .order("created_at", { ascending: false })
    if (!error && data) {
      setTurnos(data)
      if (data.length > 0 && !activoRef.current) setActivo(data[0])
    }
    setLoading(false)
  }

  async function fetchMensajes(contact_id) {
    const { data, error } = await supabase
      .from("n8n_chat_histories").select("*")
      .eq("session_id", String(contact_id))
      .order("id", { ascending: true }).limit(100)

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
                if (json.mensaje_1) bubbles.push({ id: m.id,     tipo: "bot", texto: json.mensaje_1, hora: hora(m.id) })
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

  async function actualizarEstado(estado) {
    if (!activo) return
    const { error } = await supabase.from("turnos")
      .update({ estado, updated_at: new Date().toISOString() }).eq("id", activo.id)
    if (!error) {
      setTurnos(prev => prev.map(t => t.id === activo.id ? { ...t, estado } : t))
      setActivo(prev => ({ ...prev, estado }))
    }
  }

  async function tomarControl() {
    if (!activo) return
    const newVal = !bajoControl
    const { error } = await supabase.from("turnos")
      .update({ bajo_control: newVal, updated_at: new Date().toISOString() }).eq("id", activo.id)
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
      await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriber_id: activo.contact_id,
          text: textToSend,
          canal: activo.canal || "Instagram"
        })
      })
      setInputText("")
      setMensajes(prev => [...prev, {
        id: Date.now(),
        tipo: "user",
        texto: textToSend,
        hora: new Date().toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" })
      }])
    } catch (e) { console.error("Error enviando:", e) }
    setEnviando(false)
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensaje() }
  }

  const filtrados = turnos.filter(t => filtro === "Todos" || t.canal === filtro)

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)" }}>

      {/* Left panel */}
      <div style={{ width: 280, flexShrink: 0, background: "var(--surface-1)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 14px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.2px" }}>Conversaciones</span>
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: "var(--primary-10)", color: "#c9a0ff", border: "1px solid var(--primary-25)" }}>{filtrados.length}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface-2)", borderRadius: "var(--radius-sm)", padding: "8px 11px", border: "1px solid var(--border-2)" }}>
            <span style={{ color: "var(--text-3)", display: "flex", alignItems: "center" }}><SearchIcon /></span>
            <span style={{ fontSize: 11, color: "#2a2a2a" }}>Buscar contacto...</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 5, padding: "0 14px 12px", borderBottom: "1px solid var(--border)" }}>
          {["Todos", "WhatsApp", "Instagram"].map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{ fontSize: 10, fontWeight: filtro === f ? 500 : 400, padding: "4px 10px", borderRadius: 20, background: filtro === f ? "var(--primary-10)" : "rgba(255,255,255,0.02)", border: filtro === f ? "1px solid var(--primary-25)" : "1px solid #1e1e1e", color: filtro === f ? "#c9a0ff" : "var(--text-3)", transition: "all 0.15s" }}>{f}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: 28, textAlign: "center", fontSize: 11, color: "var(--text-4)" }}>Cargando...</div>
          ) : filtrados.length === 0 ? (
            <div style={{ padding: 28, textAlign: "center", fontSize: 11, color: "var(--text-4)" }}>Sin conversaciones</div>
          ) : filtrados.map(t => {
            const isAct = activo?.id === t.id
            const es    = ESTADO[t.estado] || ESTADO.confirmado
            const ca    = CANAL[t.canal]   || CANAL.Instagram
            return (
              <div key={t.id} onClick={() => { setActivo(t); setBajoControl(t.bajo_control || false) }}
                style={{ display: "flex", gap: 10, padding: "12px 14px", borderBottom: "1px solid #161616", borderLeft: isAct ? "2px solid #7B2FFF" : "2px solid transparent", background: isAct ? "rgba(123,47,255,0.07)" : "transparent", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => { if (!isAct) e.currentTarget.style.background = "rgba(255,255,255,0.025)" }}
                onMouseLeave={e => { if (!isAct) e.currentTarget.style.background = "transparent" }}
              >
                <div style={{ position: "relative" }}>
                  <Avatar name={t.nombre || "?"} size={36} />
                  {t.bajo_control && (
                    <div style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, borderRadius: "50%", background: "#f07070", border: "2px solid var(--surface-1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: isAct ? "#e8e8e8" : "#bbb" }}>{t.nombre || "Sin nombre"}</span>
                    <span style={{ fontSize: 9, color: "var(--text-4)", flexShrink: 0, marginLeft: 6 }}>{t.hora_turno || ""}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 7 }}>{t.servicio || "Sin servicio"}</div>
                  <div style={{ display: "flex", gap: 5 }}>
                    <Badge label={t.canal || "Instagram"} {...ca} />
                    <Badge label={t.estado || "confirmado"} {...es} />
                    {t.bajo_control && <Badge label="En control" color="#f07070" bg="rgba(240,112,112,0.10)" border="rgba(240,112,112,0.22)" />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {activo ? (
          <>
            {/* Header */}
            <div style={{ flexShrink: 0, padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, background: bajoControl ? "rgba(240,112,112,0.05)" : "var(--surface-1)", transition: "background 0.3s" }}>
              <Avatar name={activo.nombre || "?"} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{activo.nombre || "Sin nombre"}</div>
                <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>
                  {activo.canal || "Instagram"} · {activo.servicio}
                  {bajoControl && <span style={{ marginLeft: 8, color: "#f07070", fontWeight: 500 }}>● En control</span>}
                </div>
              </div>
              <button onClick={tomarControl} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                background: bajoControl ? "rgba(240,112,112,0.12)" : "var(--primary-10)",
                border: `1px solid ${bajoControl ? "rgba(240,112,112,0.35)" : "var(--primary-25)"}`,
                borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 500,
                color: bajoControl ? "#f07070" : "#c9a0ff", transition: "all 0.15s",
              }}>
                {bajoControl ? <><BotIcon /> Liberar bot</> : <><HandIcon /> Tomar conversación</>}
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: "20px 22px", display: "flex", flexDirection: "column", justifyContent: "flex-start", overflowY: "auto", background: "var(--bg)", backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
              {mensajes.map((m, i) => {
                const first = isFirst(mensajes, i)
                const last  = isLast(mensajes, i)
                return (
                  <div key={m.id} style={{ maxWidth: "65%", alignSelf: m.tipo === "user" ? "flex-end" : "flex-start", marginTop: first ? (i === 0 ? 0 : 12) : 3 }}>
                    {m.tipo === "bot" && first && (
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 20, background: "var(--primary-10)", color: "#7B2FFF", border: "1px solid rgba(123,47,255,0.22)", letterSpacing: "0.4px" }}>AI</span>
                      </div>
                    )}
                    <div style={{ padding: "8px 13px", borderRadius: bubbleRadius(m.tipo, first, last), background: m.tipo === "user" ? "rgba(123,47,255,0.16)" : "var(--surface-2)", color: m.tipo === "user" ? "#ddd0ff" : "#999", border: `1px solid ${m.tipo === "user" ? "rgba(123,47,255,0.28)" : "var(--border-2)"}`, fontSize: 12, lineHeight: 1.55 }}>
                      {m.texto}
                    </div>
                    {last && <div style={{ fontSize: 9, color: "var(--text-4)", marginTop: 4, textAlign: m.tipo === "user" ? "right" : "left" }}>{m.hora}</div>}
                  </div>
                )
              })}
              {typing && !bajoControl && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Action buttons */}
            <div style={{ flexShrink: 0, display: "flex", gap: 5, padding: "9px 16px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
              {ACTIONS.map(({ label, color, bg, border, Icon, estado }) => {
                const isActive = activo?.estado === estado
                return (
                  <button key={label} onClick={() => estado && actualizarEstado(estado)} style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                    borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: isActive ? 600 : 500,
                    background: isActive ? bg.replace("0.10", "0.22").replace("0.12", "0.25") : bg,
                    border: `1px solid ${isActive ? border.replace("0.22", "0.5").replace("0.28", "0.5") : border}`,
                    color, cursor: estado ? "pointer" : "default", opacity: !estado ? 0.4 : 1, transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { if (estado && !isActive) e.currentTarget.style.opacity = "0.7" }}
                    onMouseLeave={e => { if (estado && !isActive) e.currentTarget.style.opacity = "1" }}
                  >
                    <Icon /> {label}
                  </button>
                )
              })}
            </div>

            {/* Input */}
            <div style={{ flexShrink: 0, padding: "9px 16px 14px", display: "flex", alignItems: "center", gap: 8, background: "var(--bg)" }}>
              {bajoControl ? (
                <input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribir mensaje como operador..."
                  autoFocus
                  style={{
                    flex: 1, background: "rgba(240,112,112,0.05)", border: "1px solid rgba(240,112,112,0.3)",
                    borderRadius: "var(--radius)", padding: "9px 14px", fontSize: 12,
                    color: "var(--text-1)", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(240,112,112,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(240,112,112,0.3)"}
                />
              ) : (
                <div style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", padding: "9px 14px", fontSize: 12, color: "#2a2a2a" }}>
                  Tomá el control para escribir...
                </div>
              )}
              <button onClick={bajoControl ? enviarMensaje : undefined} disabled={!bajoControl || enviando} style={{
                width: 34, height: 34, flexShrink: 0, borderRadius: 9,
                background: bajoControl ? "#f07070" : "var(--surface-3)",
                border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                color: bajoControl ? "#fff" : "var(--text-4)",
                boxShadow: bajoControl ? "0 2px 10px rgba(240,112,112,0.38)" : "none",
                cursor: bajoControl ? "pointer" : "default", transition: "all 0.2s", opacity: enviando ? 0.6 : 1,
              }}
                onMouseEnter={e => { if (bajoControl) { e.currentTarget.style.background = "#e05555"; e.currentTarget.style.boxShadow = "0 2px 14px rgba(240,112,112,0.55)" } }}
                onMouseLeave={e => { if (bajoControl) { e.currentTarget.style.background = "#f07070"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(240,112,112,0.38)" } }}
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
    </div>
  )
}