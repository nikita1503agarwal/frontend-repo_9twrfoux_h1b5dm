import { useState } from 'react'

const sections = [
  { id: 'overview', label: 'Descripción General' },
  { id: 'architecture', label: 'Arquitectura' },
  { id: 'modules', label: 'Módulos' },
  { id: 'hooks', label: 'Hooks & Edge' },
  { id: 'security', label: 'Seguridad' },
  { id: 'metrics', label: 'Métricas' },
  { id: 'examples', label: 'Ejemplos' },
  { id: 'status', label: 'Estado' },
  { id: 'conclusion', label: 'Conclusión' }
]

export default function DocsNav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white px-3 py-2 rounded-lg shadow"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Cerrar' : 'Menú'}
      </button>
      <nav className={`fixed top-0 left-0 h-full w-72 bg-slate-900/80 backdrop-blur border-r border-slate-700/50 p-6 overflow-y-auto transition-transform duration-300 z-40 ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="PandaGo" className="w-8 h-8" />
            <div>
              <p className="text-slate-300 text-xs">Documentation</p>
              <h2 className="text-white font-semibold">PandaGo Fleet</h2>
            </div>
          </div>
        </div>
        <ul className="space-y-1">
          {sections.map(s => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="block px-3 py-2 rounded text-slate-200 hover:bg-slate-700/40">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-slate-400 text-sm">
          <p className="mb-2">Archivos de ejemplo</p>
          <ul className="space-y-1">
            <li>
              <a className="text-blue-300 hover:underline" href="/examples/demand_sample.csv" download>
                demand_sample.csv
              </a>
            </li>
            <li>
              <a className="text-blue-300 hover:underline" href="/examples/assignment_sample.json" download>
                assignment_sample.json
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
