import { Link } from 'react-router-dom'
import DocsNav from './components/DocsNav'
import DocsContent from './components/DocsContent'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(147,197,253,0.06),transparent_40%)]" />
      <div className="relative flex">
        <DocsNav />
        <main className="md:ml-72 w-full">
          <header className="sticky top-0 z-30 bg-slate-900/60 backdrop-blur border-b border-slate-700/40">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/flame-icon.svg" className="w-8 h-8" alt="Flames" />
                <div>
                  <h1 className="text-white font-semibold leading-tight">PandaGo – Documentación</h1>
                  <p className="text-slate-400 text-sm">Versión final, optimizada y lista para entregar</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="#examples"
                  className="hidden md:inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition"
                >
                  Descargar ejemplos
                </a>
                <Link
                  to="/optimizador"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition"
                >
                  Abrir optimizador
                </Link>
              </div>
            </div>
          </header>

          <div className="max-w-5xl mx-auto px-6 py-10">
            <DocsContent />
          </div>

          <footer className="border-t border-slate-700/40 py-8">
            <div className="max-w-5xl mx-auto px-6 text-slate-400 text-sm flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} PandaGo. Todos los derechos reservados.</p>
              <p>
                Archivos de ejemplo en <a className="text-blue-300 hover:underline" href="/examples/demand_sample.csv">/examples</a>
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
