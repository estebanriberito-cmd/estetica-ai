import { useEffect, useState } from "react"
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

function AIIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M9 11V7a3 3 0 016 0v4"/><circle cx="9" cy="16" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="16" r="1" fill="currentColor" stroke="none"/></svg> }
function MoneyIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> }
function CalendarIcon(){ return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function CheckIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function CloseIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function ReIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> }
function IgIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> }
function WaIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> }
function NoShowIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7"/><line x1="17" y1="17" x2="21" y2="21"/><line x1="21" y1="17" x2="17" y2="21"/></svg> }
function ExportIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }

function parsePrecio(str) {
  if (!str) return 0
  const clean = String(str).replace(/[^0-9.,]/g,"").replace(/\.(?=\d{3}(?:[,.]|$))/g,"").replace(",",".")
  const n = parseFloat(clean)
  return isNaN(n) ? 0 : n
}

function heroMsg(periodo, confirmados, facturacion) {
  const fmt = n => `$${n.toLocaleString("es-UY")}`
  const sinDatos = { emoji: "🤖", title: "El sistema está activo y listo para trabajar", sub: "Cuando llegue el primer mensaje, tu IA lo gestiona sola" }
  if (confirmados === 0) return sinDatos
  const s = confirmados !== 1 ? "s" : ""
  if (periodo === "hoy") return {
    emoji: "🔥",
    title: `Hoy tu IA cerró ${confirmados} turno${s} en piloto automático`,
    sub: facturacion > 0 ? `Facturación recuperada hoy: ${fmt(facturacion)}` : `${confirmados} cliente${s} atendido${s} sin que toques el celular`,
  }
  if (periodo === "semana") return {
    emoji: "💰",
    title: `Esta semana tu IA cerró ${confirmados} turno${s} sola`,
    sub: facturacion > 0 ? `Facturación recuperada esta semana: ${fmt(facturacion)}` : `${confirmados} cliente${s} que antes se podían perder`,
  }
  return {
    emoji: "🚀",
    title: `Este mes tu IA cerró ${confirmados} turno${s} en piloto automático`,
    sub: facturacion > 0 ? `Facturación recuperada este mes: ${fmt(facturacion)}` : `${confirmados} cliente${s} gestionados solos`,
  }
}

// ── Carga dinámica de jsPDF desde CDN ──
function loadJsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf) { resolve(window.jspdf.jsPDF); return }
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    script.onload = () => resolve(window.jspdf.jsPDF)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function generarPDF({ turnos, config, periodo, confirmados, cancelados, reagendados, noShow, facturacion, conversion, total }) {
  const JsPDF = await loadJsPDF()
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  const W = 210
  const PURPLE = [123, 47, 255]
  const MAGENTA = [217, 38, 255]
  const GREEN = [29, 158, 117]
  const DARK = [18, 18, 18]
  const GRAY = [120, 120, 120]
  const LIGHT = [240, 240, 245]

  const periodoLabel = { hoy: "Hoy", semana: "Esta semana", mes: "Este mes" }[periodo] || periodo
  const fechaExport = new Date().toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit", year: "numeric" })
  const nombreSalon = config?.nombre || CLIENT_ID

  // ── HEADER con gradiente ──
  doc.setFillColor(...DARK)
  doc.rect(0, 0, W, 42, "F")

  // Logo SVG como círculo + líneas (recreado geométricamente)
  const lx = 18, ly = 21
  doc.setDrawColor(...PURPLE)
  doc.setLineWidth(2.2)
  doc.circle(lx, ly, 7, "S")
  doc.setFillColor(...PURPLE)
  doc.circle(lx, ly, 1.8, "F")
  doc.setLineWidth(1.2)
  doc.line(lx - 10, ly, lx - 7, ly)
  doc.circle(lx - 10, ly, 1.2, "F")
  doc.line(lx + 7, ly, lx + 10, ly)
  doc.setFillColor(...MAGENTA)
  doc.circle(lx + 10, ly, 1.2, "F")

  // Nombre empresa
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.text("Estética AI", 34, 18)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.text("Panel de Control Inteligente", 34, 24.5)

  // Línea separadora degradada simulada
  doc.setDrawColor(...PURPLE)
  doc.setLineWidth(0.4)
  doc.line(14, 32, W - 14, 32)

  // Período y fecha
  doc.setFontSize(8)
  doc.setTextColor(...GRAY)
  doc.text(`Período: ${periodoLabel}`, 14, 38)
  doc.text(`Exportado: ${fechaExport}`, W - 14, 38, { align: "right" })

  // ── NOMBRE DEL SALÓN ──
  let y = 52
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setTextColor(...DARK)
  doc.text(nombreSalon, 14, y)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.text("Reporte de turnos y rendimiento", 14, y + 6)
  y += 16

  // ── KPIs en 4 cajas ──
  const kpis = [
    { label: "Agendados",   val: String(total),        color: PURPLE },
    { label: "Confirmados", val: String(confirmados),  color: GREEN  },
    { label: "Cancelados",  val: String(cancelados),   color: [240, 112, 112] },
    { label: "Conversión",  val: `${conversion}%`,     color: [239, 159, 39] },
  ]
  const kw = (W - 28 - 9) / 4
  kpis.forEach((k, i) => {
    const kx = 14 + i * (kw + 3)
    doc.setFillColor(248, 248, 252)
    doc.roundedRect(kx, y, kw, 20, 2, 2, "F")
    doc.setDrawColor(220, 220, 230)
    doc.setLineWidth(0.3)
    doc.roundedRect(kx, y, kw, 20, 2, 2, "S")
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.setTextColor(...GRAY)
    doc.text(k.label, kx + kw / 2, y + 6.5, { align: "center" })
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(...k.color)
    doc.text(k.val, kx + kw / 2, y + 15.5, { align: "center" })
  })
  y += 28

  // ── FACTURACIÓN ──
  doc.setFillColor(235, 250, 244)
  doc.roundedRect(14, y, W - 28, 14, 2, 2, "F")
  doc.setDrawColor(...GREEN)
  doc.setLineWidth(0.3)
  doc.roundedRect(14, y, W - 28, 14, 2, 2, "S")
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(...GREEN)
  doc.text("Facturación recuperada en piloto automático", 20, y + 5.5)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text(`$${facturacion.toLocaleString("es-UY")}`, W - 18, y + 9, { align: "right" })
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(...GRAY)
  doc.text(`Basada en ${confirmados} turno${confirmados !== 1 ? "s" : ""} confirmado${confirmados !== 1 ? "s" : ""}`, 20, y + 11)
  y += 22

  // ── TABLA DE TURNOS ──
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(...DARK)
  doc.text("Detalle de turnos", 14, y)
  y += 6

  // Header tabla
  const cols = [
    { label: "Nombre",   w: 38, x: 14 },
    { label: "Teléfono", w: 28, x: 52 },
    { label: "Canal",    w: 22, x: 80 },
    { label: "Servicio", w: 46, x: 102 },
    { label: "Fecha",    w: 22, x: 148 },
    { label: "Estado",   w: 26, x: 170 },
  ]

  doc.setFillColor(...PURPLE)
  doc.roundedRect(14, y, W - 28, 8, 1, 1, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7.5)
  doc.setTextColor(255, 255, 255)
  cols.forEach(c => doc.text(c.label, c.x + 2, y + 5.2))
  y += 10

  // Filas — solo turnos con nombre Y servicio, ordenados por fecha, excluir "contacto"
  const estadoColor = {
    confirmado: GREEN,
    reagendado: PURPLE,
    cancelado:  [240, 112, 112],
    "no vino":  [239, 159, 39],
  }

  const turnosFiltrados = turnos
    .filter(t => t.nombre && t.servicio && t.estado !== "contacto")
    .sort((a, b) => {
      const fa = a.fecha_hora ? new Date(a.fecha_hora) : new Date(a.created_at)
      const fb = b.fecha_hora ? new Date(b.fecha_hora) : new Date(b.created_at)
      return fa - fb
    })

  turnosFiltrados.forEach((t, i) => {
    if (y > 265) {
      doc.addPage()
      y = 20
    }
    const bg = i % 2 === 0 ? [252, 252, 255] : [255, 255, 255]
    doc.setFillColor(...bg)
    doc.rect(14, y, W - 28, 7.5, "F")
    doc.setDrawColor(230, 230, 238)
    doc.setLineWidth(0.2)
    doc.line(14, y + 7.5, W - 14, y + 7.5)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.setTextColor(...DARK)

    const fechaStr = t.fecha_hora
      ? new Date(t.fecha_hora).toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit" })
      : (t.hora_turno || "—")

    const estadoLabel = t.no_show ? "no vino" : (t.estado || "—")

    const rows = [
      t.nombre    || "—",
      t.telefono  || "—",
      t.canal     || "—",
      t.servicio  || "—",
      fechaStr,
    ]
    rows.forEach((val, ci) => {
      const col = cols[ci]
      const truncated = String(val).length > (col.w / 2.2) ? String(val).slice(0, Math.floor(col.w / 2.2)) + "…" : String(val)
      doc.text(truncated, col.x + 2, y + 5)
    })

    // Estado con color
    const ec = estadoColor[estadoLabel] || GRAY
    doc.setTextColor(...ec)
    doc.setFont("helvetica", "bold")
    doc.text(estadoLabel, cols[5].x + 2, y + 5)
    y += 7.5
  })

  if (turnosFiltrados.length === 0) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(...GRAY)
    doc.text("Sin turnos con datos en este período", 14, y + 6)
    y += 14
  }

  y += 10

  // ── RESUMEN FINAL ──
  if (y > 240) { doc.addPage(); y = 20 }

  doc.setFillColor(248, 248, 252)
  doc.roundedRect(14, y, W - 28, 36, 2, 2, "F")
  doc.setDrawColor(220, 220, 230)
  doc.setLineWidth(0.3)
  doc.roundedRect(14, y, W - 28, 36, 2, 2, "S")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...DARK)
  doc.text("Resumen del período", 20, y + 7)

  const resumenItems = [
    ["Confirmados", confirmados, GREEN],
    ["Reagendados", reagendados, PURPLE],
    ["Cancelados",  cancelados,  [240, 112, 112]],
    ["No vino",     noShow,      [239, 159, 39]],
  ]
  const rw = (W - 28 - 20) / 4
  resumenItems.forEach(([label, val, color], i) => {
    const rx = 20 + i * (rw + 4)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.setTextColor(...GRAY)
    doc.text(label, rx, y + 17)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor(...color)
    doc.text(String(val), rx, y + 29)
  })
  y += 44

  // ── FOOTER ──
  const pageCount = doc.internal.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setFillColor(...DARK)
    doc.rect(0, 287, W, 10, "F")
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.text("Estética AI — Panel de Control Inteligente", 14, 293)
    doc.text(`Página ${p} de ${pageCount}`, W - 14, 293, { align: "right" })
  }

  const periodoFile = { hoy: "hoy", semana: "semana", mes: "mes" }[periodo]
  doc.save(`estetica-ai-reporte-${periodoFile}-${fechaExport.replace(/\//g, "-")}.pdf`)
}

export default function Metricas() {
  const [turnos,      setTurnos]      = useState([])
  const [config,      setConfig]      = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [periodo,     setPeriodo]     = useState("semana")
  const [exportando,  setExportando]  = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => { fetchData() }, [periodo])

  async function fetchData() {
    setLoading(true)
    let desde = new Date()
    if (periodo === "hoy")         desde.setHours(0, 0, 0, 0)
    else if (periodo === "semana") desde.setDate(desde.getDate() - 7)
    else if (periodo === "mes")    desde.setDate(desde.getDate() - 30)
    const [{ data: t }, { data: c }] = await Promise.all([
      supabase.from("turnos").select("*").eq("client_id", CLIENT_ID).gte("created_at", desde.toISOString()),
      supabase.from("config").select("*").eq("client_id", CLIENT_ID).limit(1).single(),
    ])
    if (t) setTurnos(t)
    if (c) setConfig(c)
    setLoading(false)
  }

  const confirmados = turnos.filter(t => t.estado === "confirmado" || t.estado === "reagendado").length
  const reagendados = turnos.filter(t => t.estado === "reagendado").length
  const cancelados  = turnos.filter(t => t.estado === "cancelado").length
  const noShow      = turnos.filter(t => t.no_show === true).length
  const total       = turnos.length
  const conversion  = total > 0 ? Math.round((confirmados / total) * 100) : 0

  const facturacion = turnos
    .filter(t => (t.estado === "confirmado" || t.estado === "reagendado") && t.servicio)
    .reduce((acc, t) => {
      const match = (config?.servicios || []).find(s =>
        s.nombre?.toLowerCase().trim() === t.servicio?.toLowerCase().trim()
      )
      return acc + parsePrecio(match?.precio)
    }, 0)

  const porCanal = {
    Instagram: turnos.filter(t => t.canal === "Instagram").length,
    WhatsApp:  turnos.filter(t => t.canal === "WhatsApp").length,
  }

  const serviciosMap = {}
  turnos.forEach(t => { if (t.servicio) serviciosMap[t.servicio] = (serviciosMap[t.servicio] || 0) + 1 })
  const servicios   = Object.entries(serviciosMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxServicio = servicios[0]?.[1] || 1

  const porDia = {}
  turnos.forEach(t => {
    const dia = new Date(t.created_at).toLocaleDateString("es-UY", { weekday: "short" })
    porDia[dia] = (porDia[dia] || 0) + 1
  })
  const diasKeys = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"]
  const maxDia   = Math.max(...Object.values(porDia), 1)

  const KPIS = [
    { label: "Agendados",   val: total,            color: "#c9a0ff", bg: "rgba(123,47,255,0.08)",  border: "rgba(123,47,255,0.15)"  },
    { label: "Confirmados", val: confirmados,       color: "#1D9E75", bg: "rgba(29,158,117,0.08)",  border: "rgba(29,158,117,0.15)"  },
    { label: "Cancelados",  val: cancelados,        color: cancelados > 0 ? "#f07070" : "var(--text-3)", bg: cancelados > 0 ? "rgba(240,112,112,0.08)" : "rgba(255,255,255,0.03)", border: cancelados > 0 ? "rgba(240,112,112,0.15)" : "var(--border-2)" },
    { label: "Conversión",  val: `${conversion}%`, color: "#EF9F27", bg: "rgba(239,159,39,0.08)",  border: "rgba(239,159,39,0.15)"  },
  ]

  const RESUMEN = [
    { label: "Total turnos",  val: total,                color: "#aaa",    Icon: CalendarIcon },
    { label: "Confirmados",   val: confirmados,          color: "#1D9E75", Icon: CheckIcon    },
    { label: "Reagendados",   val: reagendados,          color: "#c9a0ff", Icon: ReIcon       },
    { label: "Cancelados",    val: cancelados,           color: cancelados > 0 ? "#f07070" : "var(--text-4)", Icon: CloseIcon  },
    { label: "No vino",       val: noShow,               color: noShow > 0 ? "#EF9F27" : "var(--text-4)",     Icon: NoShowIcon },
    { label: "Por Instagram", val: porCanal.Instagram||0, color: "#D926FF", Icon: IgIcon },
    { label: "Por WhatsApp",  val: porCanal.WhatsApp||0,  color: "#1D9E75", Icon: WaIcon },
  ]

  const card = (children, extra = {}) => (
    <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "var(--radius)", padding: "14px 16px", ...extra }}>
      {children}
    </div>
  )

  const hero = heroMsg(periodo, confirmados, facturacion)

  async function handleExport() {
    setExportando(true)
    try {
      await generarPDF({
        turnos, config, periodo,
        confirmados, cancelados, reagendados, noShow,
        facturacion, conversion, total,
      })
    } catch (e) {
      console.error("Error generando PDF:", e)
    }
    setExportando(false)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)", overflowY: "auto" }}>

      {/* Header sticky */}
      <div style={{
        flexShrink: 0, padding: isMobile ? "12px 14px" : "16px 22px",
        borderBottom: "1px solid var(--border)", background: "var(--surface-1)",
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
      }}>
        {!isMobile && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.3px" }}>Métricas</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Rendimiento del negocio</div>
          </div>
        )}
        <div style={{ display: "flex", gap: 6, alignItems: "center", ...(isMobile ? { width: "100%" } : {}) }}>
          <div style={{ display: "flex", gap: 4, flex: isMobile ? 1 : undefined }}>
            {[["hoy", "Hoy"], ["semana", "Esta semana"], ["mes", "Este mes"]].map(([val, label]) => (
              <button key={val} onClick={() => setPeriodo(val)} style={{
                flex: isMobile ? 1 : undefined,
                fontSize: isMobile ? 12 : 11, fontWeight: periodo === val ? 500 : 400,
                padding: isMobile ? "8px 4px" : "5px 12px",
                borderRadius: "var(--radius-sm)",
                background: periodo === val ? "var(--primary-10)" : "rgba(255,255,255,0.02)",
                border: periodo === val ? "1px solid var(--primary-25)" : "1px solid var(--border-2)",
                color: periodo === val ? "#c9a0ff" : "var(--text-3)", transition: "all 0.15s",
              }}>{label}</button>
            ))}
          </div>

          {/* ── BOTÓN EXPORTAR ── */}
          <button
            onClick={handleExport}
            disabled={exportando || loading}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: isMobile ? "8px 10px" : "5px 12px",
              borderRadius: "var(--radius-sm)",
              background: exportando ? "rgba(123,47,255,0.05)" : "rgba(123,47,255,0.12)",
              border: "1px solid rgba(123,47,255,0.35)",
              color: exportando ? "var(--text-4)" : "#c9a0ff",
              fontSize: isMobile ? 12 : 11,
              fontWeight: 500,
              cursor: exportando ? "default" : "pointer",
              transition: "all 0.15s",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { if (!exportando) e.currentTarget.style.background = "rgba(123,47,255,0.20)" }}
            onMouseLeave={e => { if (!exportando) e.currentTarget.style.background = "rgba(123,47,255,0.12)" }}
          >
            <ExportIcon />
            {exportando ? "Generando..." : isMobile ? "PDF" : "Exportar PDF"}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: "center", fontSize: 12, color: "var(--text-4)" }}>Cargando métricas...</div>
      ) : (
        <div style={{ padding: isMobile ? "12px 14px" : "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* ── HERO METRIC ── */}
          <div style={{
            background: "linear-gradient(135deg, rgba(29,158,117,0.10), rgba(123,47,255,0.07))",
            border: "1px solid rgba(29,158,117,0.22)",
            borderRadius: "var(--radius)",
            padding: isMobile ? "14px 14px" : "16px 20px",
            display: "flex", alignItems: "center", gap: isMobile ? 12 : 16,
          }}>
            <div style={{ fontSize: isMobile ? 30 : 36, lineHeight: 1, flexShrink: 0, filter: "drop-shadow(0 0 8px rgba(29,158,117,0.4))" }}>
              {hero.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: "#f0f0f0", lineHeight: 1.3, marginBottom: 4 }}>
                {hero.title}
              </div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: "#1D9E75", fontWeight: 500 }}>
                {hero.sub}
              </div>
            </div>
            {total > 0 && (
              <div style={{
                flexShrink: 0, textAlign: "center",
                background: "rgba(29,158,117,0.12)", border: "1px solid rgba(29,158,117,0.25)",
                borderRadius: 10, padding: isMobile ? "8px 10px" : "10px 14px",
              }}>
                <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: "#1D9E75", lineHeight: 1, letterSpacing: "-1px" }}>{conversion}%</div>
                <div style={{ fontSize: 9, color: "var(--text-4)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>conversión</div>
              </div>
            )}
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
            {KPIS.map(({ label, val, color, bg, border }) => (
              <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "var(--radius)", padding: isMobile ? "12px 12px" : "14px 16px" }}>
                <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 6, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 600, color, letterSpacing: "-0.5px" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Automatización */}
          <div style={{ background: "rgba(123,47,255,0.07)", border: "1px solid rgba(123,47,255,0.18)", borderRadius: "var(--radius)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: "var(--primary-10)", border: "1px solid var(--primary-25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a0ff" }}>
              <AIIcon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 500, color: "var(--text-1)", marginBottom: 2 }}>
                {confirmados} de {total} turnos cerrados automáticamente
              </div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{conversion}% de automatización</div>
            </div>
            <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: "#1D9E75", letterSpacing: "-0.5px", flexShrink: 0 }}>{conversion}%</div>
          </div>

          {/* Facturación */}
          <div style={{ background: "rgba(29,158,117,0.07)", border: "1px solid rgba(29,158,117,0.18)", borderRadius: "var(--radius)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: "rgba(29,158,117,0.10)", border: "1px solid rgba(29,158,117,0.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1D9E75" }}>
              <MoneyIcon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 500, color: "var(--text-1)", marginBottom: 2 }}>Facturación recuperada en piloto automático</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>Basada en {confirmados} turnos confirmados</div>
            </div>
            <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: "#1D9E75", letterSpacing: "-0.5px", flexShrink: 0 }}>
              ${facturacion.toLocaleString("es-UY")}
            </div>
          </div>

          {/* Gráficos */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            {card(<>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 2 }}>Turnos por día</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 16 }}>Período seleccionado</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 90 }}>
                {diasKeys.map(dia => {
                  const val = porDia[dia] || 0
                  const h   = val > 0 ? Math.max(Math.round((val / maxDia) * 72), 6) : 4
                  return (
                    <div key={dia} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 9, color: val > 0 ? "#c9a0ff" : "transparent", fontWeight: 500 }}>{val}</span>
                      <div style={{ width: "100%", height: h, borderRadius: val > 0 ? "3px 3px 0 0" : "2px", background: val > 0 ? "linear-gradient(to top, #7B2FFF, #b060ff)" : "rgba(255,255,255,0.04)" }} />
                      <span style={{ fontSize: 9, color: "var(--text-4)" }}>{dia}</span>
                    </div>
                  )
                })}
              </div>
            </>)}

            {card(<>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 2 }}>Canal de origen</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 16 }}>Distribución de turnos</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[["Instagram", "#D926FF"], ["WhatsApp", "#1D9E75"]].map(([canal, color]) => {
                  const val = porCanal[canal] || 0
                  const pct = total > 0 ? Math.round((val / total) * 100) : 0
                  return (
                    <div key={canal}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <span style={{ fontSize: 11, color: "var(--text-2)" }}>{canal}</span>
                        <span style={{ fontSize: 11, color: "#ccc", fontWeight: 500 }}>{val} · {pct}%</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(to right, ${color}, ${color}99)`, borderRadius: 3 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </>)}
          </div>

          {/* Servicios + Resumen */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            {card(<>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 2 }}>Servicios más pedidos</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 14 }}>Por cantidad</div>
              {servicios.length === 0
                ? <div style={{ fontSize: 11, color: "var(--text-4)" }}>Sin datos</div>
                : servicios.map(([nombre, count], i) => (
                  <div key={nombre} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, color: "var(--text-4)", width: 14, textAlign: "right" }}>{i + 1}</span>
                    <span style={{ fontSize: 11, color: "var(--text-2)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nombre}</span>
                    <div style={{ width: 70, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.round((count / maxServicio) * 100)}%`, background: "linear-gradient(to right, #7B2FFF, #b060ff)", borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: "#c9a0ff", width: 18, textAlign: "right" }}>{count}</span>
                  </div>
                ))}
            </>)}

            {card(<>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc", marginBottom: 14 }}>Resumen del período</div>
              {RESUMEN.map(({ label, val, color, Icon }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--text-3)", fontSize: 11 }}>
                    <span style={{ color }}><Icon /></span>{label}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color }}>{val}</span>
                </div>
              ))}
            </>)}
          </div>

        </div>
      )}
    </div>
  )
}