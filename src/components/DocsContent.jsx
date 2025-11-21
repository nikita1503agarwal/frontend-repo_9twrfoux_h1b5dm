export default function DocsContent() {
  return (
    <div className="prose prose-invert prose-slate max-w-none">
      <section id="overview" className="scroll-mt-24">
        <h1>DOCUMENTACIÓN TÉCNICA FINAL Y OPTIMIZADA</h1>
        <h2>PandaGo – Fleet Management System</h2>
        <p>
          PandaGo Fleet Management System es una plataforma web SaaS para la gestión integral de flotas de riders en operaciones de última milla. Centraliza la planificación, asignación de turnos, análisis de rendimiento, simulación operativa y administración de marketplace de turnos internos.
        </p>
        <p>
          Es utilizada por equipos de Operaciones, Fleet Managers, Team Leaders y Analysts para gestionar más de <strong>1.460+</strong> riders en 7 ciudades, optimizando más de <strong>230k</strong> entregas semanales.
        </p>
      </section>

      <section id="architecture" className="mt-16 scroll-mt-24">
        <h2>Arquitectura del Sistema</h2>
        <h3>Frontend</h3>
        <ul>
          <li>Next.js 14 App Router</li>
          <li>UI: Shadcn/UI, TailwindCSS, Recharts</li>
          <li>Estado: Hooks + React Query</li>
          <li>Auth: Supabase Auth</li>
          <li>Caché: localStorage para módulos pesados (Shifts, Scoring)</li>
        </ul>
        <h3>Backend</h3>
        <ul>
          <li>Supabase (Postgres + RLS) para riders & shift-market</li>
          <li>BigQuery para KPIs, métricas de rendimiento y demanda histórica</li>
          <li>API externa (Java backend) para generación de turnos</li>
          <li>Edge Functions en Next.js como proxy seguro</li>
        </ul>
        <h3>Integraciones</h3>
        <ul>
          <li>BigQuery (consultas optimizadas por ciudad, rango y hora)</li>
          <li>CSV ingestión masiva (riders & demanda)</li>
          <li>Exportación: CSV, PDF</li>
        </ul>
      </section>

      <section id="modules" className="mt-16 scroll-mt-24">
        <h2>Módulos Principales</h2>
        <h3>Dashboard Operativo</h3>
        <p>Vista en tiempo real del estado operativo: demanda, entregas, SLA, UTR, cobertura y actividad reciente.</p>
        <ul>
          <li>Selector Global de Ciudad</li>
          <li>KPI Cards: Riders activos, entregas 7d, horas trabajadas, Slot Filling, Excess, UTR, Reassigned</li>
          <li>Gráficos: Entregas por hora (D-1 vs D-2), Heatmaps (Coverage, Excess, UTR), SLA por ciudad, Courier Delivery Time</li>
          <li>Activity Feed y accesos rápidos</li>
        </ul>
        <h4>Funcionalidades invisibles</h4>
        <ul>
          <li>Detección automática del último día con datos</li>
          <li>Factores de reparto por ciudad hardcodeados</li>
          <li>12+ consultas simultáneas a BigQuery</li>
          <li>Mecanismos de retry y fallback a días previos</li>
        </ul>

        <h3 className="mt-8">Planning – Shifts (Generación de Turnos)</h3>
        <p>Calcula turnos óptimos en base a demanda, contratos, disponibilidad y restricciones.</p>
        <h4>Entradas</h4>
        <ul>
          <li>riders.csv (normalización automática)</li>
          <li>demand.csv (detección automática de fechas)</li>
          <li>Formulario con 81 parámetros operativos</li>
          <li>Config por tipo de vehículo y DAY/NIGHT</li>
        </ul>
        <h4>Algoritmo Backend (Java)</h4>
        <ol>
          <li>Reducción de demanda inicial</li>
          <li>Asignación iterativa por prioridad (vehículo, horas, disponibilidad)</li>
          <li>Validación de reglas (min/max, descansos, días libres, ventanas)</li>
          <li>Overtime opcional, ghosting y iteraciones incrementales</li>
        </ol>
        <h4>Salida</h4>
        <ul>
          <li>Assignments BOOK por rider</li>
          <li>Métricas: Slot Filling, Excess, Missing, Unique Riders</li>
          <li>CSV compatible con Glovo</li>
          <li>Persistencia de configuración + resultado</li>
        </ul>

        <h3 className="mt-8">Planning – Simulation (Escenarios de Capacidad)</h3>
        <p>Simula capacidad necesaria sin riders reales: slot filling, excess, mix de contratos y coste.</p>
        <h4>Entradas</h4>
        <ul>
          <li>Ciudad, rango de fechas, targets</li>
          <li>demand.csv</li>
        </ul>
        <h4>Salidas</h4>
        <ul>
          <li>Riders necesarios totales y mix por contrato</li>
          <li>Curva de capacidad vs demanda (7 días)</li>
          <li>Costo total estimado</li>
        </ul>
        <p className="text-slate-400 text-sm">Algoritmo futuro: programación lineal + heurística greedy.</p>

        <h3 className="mt-8">Planning – Riders</h3>
        <p>Gestión tipo CRM: contratos, vehículos, advertencias, scores, horas y estado laboral.</p>
        <ul>
          <li>Tabla paginada, buscador por ID, CRUD con transacciones CSV</li>
          <li>Exportación CSV y badges visuales</li>
          <li>Datos demo realistas (1.460 riders)</li>
          <li>RLS: pertenencia por usuario autenticado</li>
        </ul>

        <h3 className="mt-8">Planning – ShiftMarket</h3>
        <p>Marketplace de turnos con reglas operativas y RLS avanzada.</p>
        <ul>
          <li>Flujos: publicar, reclamar, completar/cancelar</li>
          <li>Reglas anti-conflictos</li>
        </ul>

        <h3 className="mt-8">Performance – Scoring</h3>
        <p>Score compuesto por KPIs de BigQuery: SLA, UTR, reassigned, cancelaciones, horas, productividad y penalties.</p>
        <ul>
          <li>Filtros, consultas paralelas, tabla por rider y exportación PDF</li>
          <li>Persistencia del último reporte</li>
        </ul>
      </section>

      <section id="hooks" className="mt-16 scroll-mt-24">
        <h2>Hooks y Edge Functions</h2>
        <table>
          <thead>
            <tr>
              <th>Hook</th>
              <th>Función</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>useDashboardStats</td><td>7 KPIs simultáneos desde BigQuery</td></tr>
            <tr><td>useDashboardCharts</td><td>5 gráficos (heatmaps, comparativas)</td></tr>
            <tr><td>useShiftGeneration</td><td>Orquesta CSV → FormData → Edge → Parsing</td></tr>
            <tr><td>useLocalStorage</td><td>Persistencia de resultados</td></tr>
            <tr><td>useRidersData</td><td>Capa de datos riders con React Query</td></tr>
            <tr><td>useSimulation</td><td>Generador sintético de escenarios</td></tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Propósito</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>/api/proxy-shifts-api</td><td>Proxy con timeout + parseo seguro para turnos</td></tr>
            <tr><td>/api/export-pdf</td><td>Generación de PDF para scoring</td></tr>
          </tbody>
        </table>
      </section>

      <section id="security" className="mt-16 scroll-mt-24">
        <h2>Seguridad y Accesos</h2>
        <h3>Supabase RLS</h3>
        <ul>
          <li>Riders: visibilidad y modificación solo del propio propietario</li>
          <li>Shift Market: lectura libre, modificaciones por ownership</li>
        </ul>
        <h3>Edge Functions</h3>
        <ul>
          <li>Sanitización y validación estricta de CSVs</li>
          <li>Manejo seguro de timeouts del backend externo</li>
        </ul>
      </section>

      <section id="metrics" className="mt-16 scroll-mt-24">
        <h2>Métricas Operativas</h2>
        <pre>
coverage = min(assigned / demand * 100, 100)
excess   = max(0, assigned - demand)
missing  = max(0, demand - assigned)
slot_fill= assigned / demand_total * 100
        </pre>
      </section>

      <section id="examples" className="mt-16 scroll-mt-24">
        <h2>Ejemplos de Entrada/Salida</h2>
        <h3>Entrada: demand.csv</h3>
        <pre>
2025-01-06 12:00:00,25,MAD
2025-01-06 12:30:00,28,MAD
        </pre>
        <h3>Salida: assignment</h3>
        <pre>{`{
  "codigo_ciudad": "MAD",
  "dia": "06/01/2025",
  "hora_inicio": "12:00",
  "hora_final": "16:00",
  "accion": "BOOK",
  "rider_id": "4096001"
}`}</pre>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <p className="text-sm text-slate-300">Descarga archivos de ejemplo:</p>
          <ul className="list-disc pl-6">
            <li><a className="text-blue-300 hover:underline" href="/examples/demand_sample.csv" download>demand_sample.csv</a></li>
            <li><a className="text-blue-300 hover:underline" href="/examples/assignment_sample.json" download>assignment_sample.json</a></li>
          </ul>
        </div>
      </section>

      <section id="status" className="mt-16 scroll-mt-24">
        <h2>Estado Actual del Proyecto</h2>
        <table>
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Estado</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Dashboard</td><td>Completo</td><td>100% funcional</td></tr>
            <tr><td>Shifts</td><td>Completo</td><td>Integrado con backend externo</td></tr>
            <tr><td>Riders</td><td>Completo</td><td>Demo + Supabase-ready</td></tr>
            <tr><td>ShiftMarket</td><td>85%</td><td>Backend listo, falta UI de acciones</td></tr>
            <tr><td>Simulation</td><td>70%</td><td>Lógica futura, mock funcional</td></tr>
            <tr><td>Scoring</td><td>90%</td><td>Falta optimización de pesos</td></tr>
          </tbody>
        </table>
      </section>

      <section id="conclusion" className="mt-16 scroll-mt-24">
        <h2>Conclusión Final</h2>
        <p>
          Documento exhaustivo de arquitectura, módulos, hooks, flujos de API, cálculos, restricciones, bases de datos y funcionalidades visibles/invisibles de PandaGo. Apto como manual técnico, referencia para desarrolladores, documento de auditoría y base de documentación oficial.
        </p>
      </section>
    </div>
  )
}
