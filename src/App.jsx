import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Bandeja from "./components/Bandeja"
import Turnos from "./components/Turnos"
import Metricas from "./components/Metricas"
import Configuracion from "./components/Configuracion"

const NAV = [
  { id: "bandeja", label: "Bandeja", icon: "📥" },
  { id: "turnos", label: "Turnos", icon: "📅" },
  { id: "metricas", label: "Métricas", icon: "📊" },
  { id: "configuracion", label: "Configuración", icon: "⚙️" },
]

function Login() {
  const [email, setEmail] = useState("")
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    if (!error) setEnviado(true)
    setLoading(false)
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#121212", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ width: 360, background: "#161616", border: "1px solid #1e1e1e", borderRadius: 16, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#7B2FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✦</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>Estética AI</div>
            <div style={{ fontSize: 11, color: "#444" }}>Panel de control</div>
          </div>
        </div>

        {!enviado ? (
          <>
            <div style={{ fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 8 }}>Iniciar sesión</div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 24 }}>Te enviamos un link a tu email para entrar</div>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#fff", outline: "none", marginBottom: 12, boxSizing: "border-box" }}
            />
            <div
              onClick={handleLogin}
              style={{ width: "100%", background: loading ? "#5a1fcc" : "#7B2FFF", borderRadius: 8, padding: "11px", fontSize: 13, color: "#fff", textAlign: "center", cursor: "pointer", fontWeight: 500 }}
            >
              {loading ? "Enviando..." : "Enviar link de acceso"}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📬</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", marginBottom: 8 }}>Revisá tu email</div>
            <div style={{ fontSize: 12, color: "#555" }}>Te enviamos un link a <span style={{ color: "#d4a8ff" }}>{email}</span> — hacé clic para entrar</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState("bandeja")
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (loading) return (
    <div style={{ display: "flex", height: "100vh", background: "#121212", alignItems: "center", justifyContent: "center", color: "#444", fontFamily: "sans-serif" }}>Cargando...</div>
  )

  if (!session) return <Login />

  const renderPage = () => {
    if (page === "bandeja") return <Bandeja />
    if (page === "turnos") return <Turnos />
    if (page === "metricas") return <Metricas />
    if (page === "configuracion") return <Configuracion />
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#121212", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ width: 200, background: "#161616", borderRight: "1px solid #1e1e1e", display: "flex", flexDirection: "column", padding: "16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px 20px", borderBottom: "1px solid #1e1e1e", marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#7B2FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Estética AI</div>
            <div style={{ fontSize: 10, color: "#444" }}>Panel de control</div>
          </div>
        </div>
        {NAV.map(n => (
          <div key={n.id} onClick={() => setPage(n.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 12, cursor: "pointer", borderLeft: page === n.id ? "2px solid #7B2FFF" : "2px solid transparent", background: page === n.id ? "#1a1030" : "transparent", color: page === n.id ? "#d4a8ff" : "#555" }}>
            <span>{n.icon}</span>
            {n.label}
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "12px 16px", borderTop: "1px solid #1e1e1e" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#7B2FFF22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#d4a8ff" }}>
              {session.user.email.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#bbb" }}>Lumina Estética</div>
              <div style={{ fontSize: 10, color: "#444" }}>{session.user.email}</div>
            </div>
          </div>
          <div onClick={handleLogout} style={{ fontSize: 11, color: "#555", cursor: "pointer", padding: "4px 0" }}>🚪 Cerrar sesión</div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {renderPage()}
      </div>
    </div>
  )
}