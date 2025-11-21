import React, { useMemo, useRef, useState } from 'react'

const numberFmt = (n) => new Intl.NumberFormat().format(n)

function SeriesChart({ data, height = 260, padding = 32 }) {
  // data: [{time, demand, available, staffed, unmet, surplus}]
  const width = 800
  const innerW = width - padding * 2
  const innerH = height - padding * 2

  const xVals = data.map(d => new Date(d.time).getTime())
  const yMax = Math.max(1, ...data.map(d => Math.max(d.demand, d.available, d.staffed)))
  const xMin = Math.min(...xVals)
  const xMax = Math.max(...xVals)

  const xScale = (t) => {
    if (xMax === xMin) return padding
    return padding + ((t - xMin) / (xMax - xMin)) * innerW
  }
  const yScale = (v) => padding + innerH - (v / yMax) * innerH

  const linePath = (key, color) => {
    if (!data.length) return ''
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(new Date(d.time).getTime())} ${yScale(d[key])}`).join(' ')
  }

  // gridlines and labels
  const yTicks = 4
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((i * yMax) / yTicks))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto rounded-lg bg-slate-900/40 border border-slate-700/50">
      {/* Axes */}
      <line x1={padding} y1={padding + innerH} x2={padding + innerW} y2={padding + innerH} stroke="#334155" />
      <line x1={padding} y1={padding} x2={padding} y2={padding + innerH} stroke="#334155" />

      {/* Y grid and labels */}
      {yTickVals.map((v, i) => {
        const y = yScale(v)
        return (
          <g key={i}>
            <line x1={padding} y1={y} x2={padding + innerW} y2={y} stroke="#1f2937" opacity="0.5" />
            <text x={8} y={y + 4} fill="#94a3b8" fontSize="10">{v}</text>
          </g>
        )
      })}

      {/* Lines */}
      <path d={linePath('demand')} fill="none" stroke="#60a5fa" strokeWidth="2.5" />
      <path d={linePath('available')} fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" />
      <path d={linePath('staffed')} fill="none" stroke="#f59e0b" strokeWidth="2" />

      {/* Legend */}
      <g transform={`translate(${padding + 8}, ${padding})`}>
        <Legend color="#60a5fa" label="Demanda" />
        <g transform="translate(100,0)"><Legend color="#34d399" label="Riders disponibles" dashed /></g>
        <g transform="translate(270,0)"><Legend color="#f59e0b" label="Asignados" /></g>
      </g>
    </svg>
  )
}

function Legend({ color, label, dashed }) {
  return (
    <g>
      <line x1="0" y1="0" x2="18" y2="0" stroke={color} strokeWidth="3" strokeDasharray={dashed ? '4 4' : '0'} />
      <text x="24" y="4" fill="#cbd5e1" fontSize="12">{label}</text>
    </g>
  )
}

export default function Optimizer() {
  const [demandFile, setDemandFile] = useState(null)
  const [ridersFile, setRidersFile] = useState(null)
  const [city, setCity] = useState('MAD')
  const [startDate, setStartDate] = useState('2025-01-06T12:00')
  const [endDate, setEndDate] = useState('2025-01-06T16:00')
  const [interval, setInterval] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!demandFile || !ridersFile) {
      setError('Sube ambos archivos: demanda y riders.')
      return
    }
    setLoading(true)
    try {
      const form = new FormData()
      form.append('demand_file', demandFile)
      form.append('riders_file', ridersFile)
      form.append('start_date', startDate.replace('T', ' '))
      form.append('end_date', endDate.replace('T', ' '))
      form.append('city', city.trim())
      form.append('interval_minutes', String(interval))

      const resp = await fetch(`${backend}/api/optimize`, {
        method: 'POST',
        body: form,
      })
      if (!resp.ok) {
        const msg = await resp.text()
        throw new Error(msg || 'Error en la optimización')
      }
      const data = await resp.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(147,197,253,0.06),transparent_40%)]" />

      <header className="relative z-10 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" className="w-8 h-8" alt="Flames" />
            <div>
              <h1 className="text-white font-semibold leading-tight">Optimizador de Cobertura</h1>
              <p className="text-slate-400 text-sm">Alinea riders con la demanda por ciudad e intervalo</p>
            </div>
          </div>
          <a href="/" className="text-slate-300 hover:text-white text-sm">Volver a la doc</a>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Entrada</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Demanda (.csv o .xlsx)</label>
              <input type="file" accept=".csv,.xls,.xlsx" onChange={(e)=>setDemandFile(e.target.files[0]||null)} className="w-full text-sm file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-500" />
              <p className="text-xs text-slate-400 mt-1">Columnas: city_code, slot_started_local_at, final_order_forecast (o city, timestamp, demand)</p>
            </div>
            <div>
              <label className="block text-sm mb-1">Riders (.csv o .xlsx)</label>
              <input type="file" accept=".csv,.xls,.xlsx" onChange={(e)=>setRidersFile(e.target.files[0]||null)} className="w-full text-sm file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-emerald-600 file:text-white hover:file:bg-emerald-500" />
              <p className="text-xs text-slate-400 mt-1">Columnas: CIUDAD, RIDER ID, Available from, Available to (o city, rider_id, start, end)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Inicio</label>
                <input type="datetime-local" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm mb-1">Fin</label>
                <input type="datetime-local" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Ciudad</label>
                <input placeholder="MAD" value={city} onChange={(e)=>setCity(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm mb-1">Intervalo (min)</label>
                <input type="number" min={5} step={5} value={interval} onChange={(e)=>setInterval(Number(e.target.value)||30)} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm" />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition">{loading ? 'Calculando…' : 'Calcular'}</button>

            <div className="text-xs text-slate-400">
              ¿Archivos de ejemplo? Descarga demanda y crea uno de riders con turnos que cubran el rango.
              <div className="mt-1 space-x-3">
                <a className="text-blue-300 hover:underline" href="/examples/demand_sample.csv" target="_blank">demand_sample.csv</a>
                <a className="text-blue-300 hover:underline" href="/examples/assignment_sample.json" target="_blank">assignment_sample.json</a>
              </div>
            </div>
          </form>
        </section>

        <section className="lg:col-span-2 bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-xl min-h-[320px]">
          {!result ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Sube archivos y pulsa "Calcular" para visualizar la cobertura.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-4 gap-3">
                <Stat label="Ciudad" value={result.summary.city} />
                <Stat label="Intervalos" value={numberFmt(result.summary.points)} />
                <Stat label="Demanda sin cubrir" value={numberFmt(result.summary.total_unmet)} highlight="red" />
                <Stat label="Exceso de riders" value={numberFmt(result.summary.total_surplus)} highlight="amber" />
              </div>
              <SeriesChart data={result.series} />
              <div className="overflow-auto">
                <table className="w-full text-xs">
                  <thead className="text-slate-300">
                    <tr>
                      <th className="text-left font-medium py-2">Hora</th>
                      <th className="text-right font-medium">Demanda</th>
                      <th className="text-right font-medium">Disponibles</th>
                      <th className="text-right font-medium">Asignados</th>
                      <th className="text-right font-medium">Sin cubrir</th>
                      <th className="text-right font-medium">Exceso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {result.series.map((r) => (
                      <tr key={r.time}>
                        <td className="py-1 text-slate-300">{new Date(r.time).toLocaleString()}</td>
                        <td className="text-right">{r.demand}</td>
                        <td className="text-right">{r.available}</td>
                        <td className="text-right">{r.staffed}</td>
                        <td className="text-right text-red-300">{r.unmet}</td>
                        <td className="text-right text-amber-300">{r.surplus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} PandaGo
      </footer>
    </div>
  )
}

function Stat({ label, value, highlight }) {
  const color = highlight === 'red' ? 'text-red-300' : highlight === 'amber' ? 'text-amber-300' : 'text-white'
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
      <div className="text-slate-400 text-xs">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
    </div>
  )
}
