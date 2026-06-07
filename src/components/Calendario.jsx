import { useEffect, useState } from "react"
import { supabase } from "../supabase"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  return isMobile
}

function ChevronLeft()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> }
function ChevronRight() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg> }
function CalIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function ClockIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function ArrowLeft()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> }

const DIAS  = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

function parseEventTime(event) {
  const start = event.start?.dateTime || event.start?.date
  const end   = event.end?.dateTime   || event.end?.date
  return { start: start ? new Date(start) : null, end: end ? new Date(end) : null }
}

function formatHora(date) {
  if (!date) return ""
  return date.toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" })
}

export default function Calendario() {
  const [eventos,    setEventos]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [hoy]                       = useState(new Date())
  const [mes,        setMes]        = useState(new Date().getMonth())
  const [año,        setAño]        = useState(new Date().getFullYear())
  const [diaActivo,  setDiaActivo]  = useState(null)
  const [noShowMap,  setNoShowMap]  = useState({})   // { event_id: true/false }
  const [noShowLoading, setNoShowLoading] = useState({}) // { event_id: true } mientras se guarda
  const isMobile = useIsMobile()

  useEffect(() => {
    fetchEventos()
    fetchNoShow()

    const channel = supabase
      .channel("calendario-turnos-watch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "turnos" },
        () => {
          setTimeout(fetchEventos, 2500)
          fetchNoShow()
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchEventos() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/calendar")
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setEventos(data.events || [])
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  async function fetchNoShow() {
    const { data } = await supabase
      .from("turnos")
      .select("event_id, no_show")
      .eq("client_id", "lumina_estetica")
    if (data) {
      const map = {}
      data.forEach(t => { if (t.event_id) map[t.event_id] = t.no_show })
      setNoShowMap(map)
    }
  }

  async function marcarNoVino(eventId) {
    // Optimistic update
    setNoShowMap(prev => ({ ...prev, [eventId]: true }))
    setNoShowLoading(prev => ({ ...prev, [eventId]: true }))
    await supabase
      .from("turnos")
      .update({ no_show: true })
      .eq("event_id", eventId)
      .eq("client_id", "lumina_estetica")
    setNoShowLoading(prev => ({ ...prev, [eventId]: false }))
  }

  const eventosMes = eventos.filter(ev => {
    const { start } = parseEventTime(ev)
    return start && start.getMonth() === mes && start.getFullYear() === año
  })

  const eventosDia = diaActivo ? eventos.filter(ev => {
    const { start } = parseEventTime(ev)
    return start &&
      start.getDate()     === diaActivo &&
      start.getMonth()    === mes &&
      start.getFullYear() === año
  }).sort((a, b) => {
    const at = parseEventTime(a).start
    const bt = parseEventTime(b).start
    return (at || 0) - (bt || 0)
  }) : []

  const primerDia = new Date(año, mes, 1).getDay()
  const diasEnMes = new Date(año, mes + 1, 0).getDate()
  const celdas    = []
  for (let i = 0; i < primerDia; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

  function eventosDelDia(dia) {
    return eventosMes.filter(ev => {
      const { start } = parseEventTime(ev)
      return start && start.getDate() === dia
    })
  }

  function navMes(dir) {
    let m = mes + dir
    let a = año
    if (m < 0)  { m = 11; a-- }
    if (m > 11) { m = 0;  a++ }
    setMes(m)
    setAño(a)
    setDiaActivo(null)
  }

  const esHoy = (dia) => dia === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear()

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)", overflowY: "auto" }}>

      {/* Header */}
      <div style={{ flexShrink: 0, padding: isMobile ? "12px 14px" : "16px 22px", borderBottom: "1px solid var(--border)", background: "var(--surface-1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navMes(-1)} style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-3)" }}>
            <ChevronLeft />
          </button>
          <span style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.3px", minWidth: 140, textAlign: "center" }}>
            {MESES[mes]} {año}
          </span>
          <button onClick={() => navMes(1)} style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-3)" }}>
            <ChevronRight />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text-4)" }}>{eventosMes.length} turno{eventosMes.length !== 1 ? "s" : ""}</span>
          <button onClick={() => { setMes(hoy.getMonth()); setAño(hoy.getFullYear()); setDiaActivo(hoy.getDate()) }} style={{ fontSize: 11, fontWeight: 500, padding: "5px 12px", borderRadius: 20, background: "var(--primary-10)", border: "1px solid var(--primary-25)", color: "#c9a0ff", cursor: "pointer" }}>
            Hoy
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: isMobile ? "12px 10px" : "16px 22px", paddingBottom: isMobile ? "max(80px, calc(env(safe-area-inset-bottom) + 70px))" : "16px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: 16, overflowY: "auto" }}>

        {/* Grilla calendario */}
        <div style={{ flex: isMobile ? "none" : 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
            {DIAS.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "var(--text-4)", padding: "4px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>{d}</div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
            {celdas.map((dia, i) => {
              if (!dia) return <div key={`empty-${i}`} />
              const evs     = eventosDelDia(dia)
              const activo  = diaActivo === dia
              const hoyFlag = esHoy(dia)
              return (
                <div key={dia} onClick={() => setDiaActivo(activo ? null : dia)}
                  style={{
                    aspectRatio: "1", borderRadius: 8, cursor: "pointer",
                    background: activo ? "rgba(123,47,255,0.15)" : hoyFlag ? "rgba(123,47,255,0.07)" : "transparent",
                    border: activo ? "1px solid rgba(123,47,255,0.4)" : hoyFlag ? "1px solid rgba(123,47,255,0.25)" : "1px solid transparent",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                    transition: "all 0.15s", padding: 2,
                  }}
                  onMouseEnter={e => { if (!activo) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
                  onMouseLeave={e => { if (!activo && !hoyFlag) e.currentTarget.style.background = "transparent"; if (!activo && hoyFlag) e.currentTarget.style.background = "rgba(123,47,255,0.07)" }}
                >
                  <span style={{ fontSize: isMobile ? 13 : 12, fontWeight: hoyFlag ? 700 : 400, color: hoyFlag ? "#c9a0ff" : activo ? "#ddd0ff" : "var(--text-2)" }}>{dia}</span>
                  {evs.length > 0 && (
                    <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                      {evs.slice(0, 3).map((_, j) => (
                        <div key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: "#7B2FFF", boxShadow: "0 0 4px rgba(123,47,255,0.6)" }} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel lateral */}
        <div style={{ width: isMobile ? "100%" : 260, flexShrink: 0 }}>
          {loading ? (
            <div style={{ padding: 24, textAlign: "center", fontSize: 12, color: "var(--text-4)" }}>Cargando...</div>
          ) : error ? (
            <div style={{ padding: 16, background: "rgba(240,112,112,0.08)", border: "1px solid rgba(240,112,112,0.2)", borderRadius: "var(--radius)", fontSize: 11, color: "#f07070" }}>
              Error: {error}
            </div>
          ) : diaActivo ? (
            <div>
              {/* Botón volver */}
              <button
                onClick={() => setDiaActivo(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: 11, color: "#c9a0ff", background: "transparent",
                  border: "none", cursor: "pointer", padding: "0 0 10px 0",
                  fontWeight: 500, opacity: 0.8,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.style.opacity = "0.8"}
              >
                <ArrowLeft /> Próximos
              </button>

              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <CalIcon />
                {diaActivo} de {MESES[mes]}
                <span style={{ fontSize: 10, color: "var(--text-4)", fontWeight: 400 }}>· {eventosDia.length} turno{eventosDia.length !== 1 ? "s" : ""}</span>
              </div>

              {eventosDia.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", fontSize: 11, color: "var(--text-4)" }}>Sin turnos este día</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {eventosDia.map(ev => {
                    const { start, end } = parseEventTime(ev)
                    const isPast   = start && start < new Date()
                    const isNoShow = noShowMap[ev.id] === true
                    const isSaving = noShowLoading[ev.id] === true
                    const borderColor = isNoShow ? "#f07070" : "#7B2FFF"

                    return (
                      <div key={ev.id} style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border-2)",
                        borderLeft: `3px solid ${borderColor}`,
                        borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                        padding: "10px 12px",
                        transition: "border-left-color 0.2s",
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#ddd", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {ev.summary || "Sin título"}
                        </div>

                        {start && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#aaa" }}>
                            <ClockIcon />
                            {formatHora(start)}{end ? ` — ${formatHora(end)}` : ""}
                          </div>
                        )}

                        {ev.description && (
                          <div style={{ fontSize: 10, color: "var(--text-4)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {ev.description}
                          </div>
                        )}

                        {/* Botón No vino — solo para turnos pasados */}
                        {isPast && (
                          <div style={{ marginTop: 8 }}>
                            {isNoShow ? (
                              <span style={{
                                fontSize: 10, color: "#f07070",
                                display: "inline-flex", alignItems: "center", gap: 4,
                                background: "rgba(240,112,112,0.08)",
                                border: "1px solid rgba(240,112,112,0.2)",
                                padding: "2px 7px", borderRadius: 4,
                              }}>
                                ✕ No vino
                              </span>
                            ) : (
                              <button
                                onClick={() => marcarNoVino(ev.id)}
                                disabled={isSaving}
                                style={{
                                  fontSize: 10, padding: "3px 9px", borderRadius: 4,
                                  background: "rgba(240,112,112,0.08)",
                                  border: "1px solid rgba(240,112,112,0.25)",
                                  color: "#f07070", cursor: isSaving ? "not-allowed" : "pointer",
                                  opacity: isSaving ? 0.5 : 1,
                                  transition: "opacity 0.15s",
                                }}
                                onMouseEnter={e => { if (!isSaving) e.currentTarget.style.background = "rgba(240,112,112,0.15)" }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(240,112,112,0.08)" }}
                              >
                                {isSaving ? "Guardando..." : "No vino"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: "32px 0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-4)" }}>
              <div style={{ opacity: 0.3 }}><CalIcon /></div>
              <div style={{ fontSize: 11 }}>Tocá un día para ver los turnos</div>
            </div>
          )}

          {/* Próximos turnos — solo cuando no hay día activo */}
          {!diaActivo && !loading && !error && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Próximos</div>
              {eventos
                .filter(ev => {
                  const { start } = parseEventTime(ev)
                  return start && start >= hoy
                })
                .sort((a, b) => parseEventTime(a).start - parseEventTime(b).start)
                .slice(0, 5)
                .map(ev => {
                  const { start } = parseEventTime(ev)
                  return (
                    <div key={ev.id} onClick={() => { setMes(start.getMonth()); setAño(start.getFullYear()); setDiaActivo(start.getDate()) }}
                      style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #161616", cursor: "pointer" }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--primary-10)", border: "1px solid var(--primary-25)", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#c9a0ff", lineHeight: 1 }}>{start.getDate()}</span>
                        <span style={{ fontSize: 8, color: "var(--text-4)", textTransform: "uppercase" }}>{MESES[start.getMonth()].slice(0, 3)}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.summary || "Sin título"}</div>
                        <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{formatHora(start)}</div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}