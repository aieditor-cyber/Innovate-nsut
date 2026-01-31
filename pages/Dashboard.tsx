import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_DATA = [
  { name: 'JAN', uv: 24.5 },
  { name: 'FEB', uv: 23.2 },
  { name: 'MAR', uv: 21.8 },
  { name: 'APR', uv: 20.4 },
  { name: 'MAY', uv: 19.1 },
  { name: 'JUN', uv: 17.5 },
  { name: 'JUL', uv: 15.2 },
];

const Dashboard: React.FC = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const [timeRange, setTimeRange] = useState('month');

  const handleAction = (action: string) => {
    alert(`Initiating simulation: ${action}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-text-main">
      <Navbar />
      <main className="flex-1 px-6 py-8 md:px-12 lg:px-24 max-w-[1600px] mx-auto w-full">
         
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                  <span className="material-symbols-outlined text-lg">location_on</span> District 9
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-text-main">Global Impact Dashboard</h1>
               <p className="text-text-muted max-w-2xl font-body">Real-time visualization of urban sustainability initiatives and their environmental impact projections for 2030.</p>
            </div>
            <div className="flex gap-3">
               <button 
                  onClick={() => setTimeRange(timeRange === 'month' ? 'year' : 'month')}
                  className="flex items-center gap-2 px-5 h-11 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#2a4d31] font-bold text-sm text-text-main hover:bg-gray-50 dark:hover:bg-surface-dark/80 transition-colors shadow-sm"
               >
                  <span className="material-symbols-outlined text-gray-500 dark:text-text-muted">calendar_month</span> {timeRange === 'month' ? 'This Month' : 'This Year'}
               </button>
               <button 
                 onClick={() => alert("Downloading Report...")}
                 className="flex items-center gap-2 px-5 h-11 rounded-xl bg-primary hover:bg-green-600 text-[#0d1b10] font-bold text-sm transition-colors shadow-lg shadow-primary/30"
               >
                  <span className="material-symbols-outlined">download</span> Export Report
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardStat title="Total New Trees" value="12,450" change="+15%" icon="forest" progress={62} sub="Target: 20,000 by Q4" />
            <DashboardStat title="Daily EV Impact" value="8,500" change="+12%" icon="electric_car" progress={45} sub="Rides per day" />
            <DashboardStat title="Solar Potential" value="450" change="+8%" icon="solar_power" progress={78} sub="GWh Annually" />
            <DashboardStat title="Air Quality Index" value="42" change="Good" isStatus icon="air" progress={90} sub="PM2.5 Levels (µg/m³)" />
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Main Chart */}
            <div className="xl:col-span-2 rounded-2xl bg-white dark:bg-surface-dark p-6 md:p-8 border border-gray-100 dark:border-[#2a4d31] shadow-sm">
               <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                  <div>
                     <h3 className="text-lg font-bold mb-1 text-text-main">Urban Heat Island Mitigation</h3>
                     <p className="text-sm text-gray-500 dark:text-text-muted">Average street temperature reduction vs baseline</p>
                  </div>
                  <div className="text-right">
                     <p className="text-4xl font-bold tracking-tight text-text-main">-2.5°C</p>
                     <p className="text-sm font-medium text-primary">Current Deviation</p>
                  </div>
               </div>
               
               <div className="w-full aspect-[2/1] md:aspect-[2.5/1]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#11d432" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#11d432" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#7ec583', fontSize: 12}} dy={10}/>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Area type="monotone" dataKey="uv" stroke="#11d432" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Side Widgets */}
            <div className="flex flex-col gap-6">
               {/* Donut Chart Simulation */}
               <div className="flex-1 rounded-2xl bg-white p-6 border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold">Green Cover Distribution</h3>
                     <button className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="relative size-32 shrink-0 rounded-full" style={{ background: 'conic-gradient(#11d432 0% 45%, #0d9624 45% 75%, #a6eeb1 75% 100%)' }}>
                        <div className="absolute inset-4 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center flex-col">
                           <span className="text-2xl font-bold text-text-main">85%</span>
                           <span className="text-[10px] uppercase text-gray-400 dark:text-text-muted font-bold tracking-wider">Coverage</span>
                        </div>
                     </div>
                     <div className="flex flex-col gap-3 flex-1">
                        <LegendItem color="bg-primary" label="Parks" value="45%" />
                        <LegendItem color="bg-[#0d9624]" label="Vertical" value="30%" />
                        <LegendItem color="bg-[#a6eeb1]" label="Rooftops" value="25%" />
                     </div>
                  </div>
               </div>

               {/* Bar Chart Simulation */}
               <div className="flex-1 rounded-2xl bg-white dark:bg-surface-dark p-6 border border-gray-100 dark:border-[#2a4d31] shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-text-main">CO2 Offset Sources</h3>
                     <div className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                        <span className="material-symbols-outlined text-sm">arrow_upward</span> 12%
                     </div>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-32 w-full mt-auto">
                     <Bar height="65%" label="Solar" />
                     <Bar height="85%" label="Wind" />
                     <Bar height="45%" label="EVs" />
                     <Bar height="30%" label="Waste" />
                  </div>
               </div>
            </div>
         </div>

         {/* Actions */}
         <div className="rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-[#2a4d31] p-6 shadow-sm">
            <h3 className="font-bold text-lg text-text-main mb-4">Simulation & Planning Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <ActionCard icon="add_location_alt" color="green" title="New Green Zone" sub="Designate park area" onClick={() => handleAction('New Green Zone')} />
               <ActionCard icon="water_drop" color="blue" title="Simulate Flood" sub="Test drainage capacity" onClick={() => handleAction('Flood Simulation')} />
               <ActionCard icon="wb_sunny" color="amber" title="Solar Heatmap" sub="Analyze roof potential" onClick={() => handleAction('Solar Heatmap')} />
               <ActionCard icon="hub" color="purple" title="Deploy EV Hub" sub="Charging infrastructure" onClick={() => handleAction('Deploy EV Hub')} />
            </div>
         </div>
      </main>
    </div>
  );
};

const DashboardStat = ({ title, value, change, icon, progress, sub, isStatus }: any) => (
   <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark p-6 shadow-sm border border-gray-100 dark:border-[#2a4d31] transition-all hover:shadow-md cursor-default">
      <div className="absolute right-0 top-0 p-4 opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity pointer-events-none">
         <span className="material-symbols-outlined text-8xl text-primary">{icon}</span>
      </div>
      <div className="flex flex-col gap-1 relative z-10">
         <span className="text-sm font-medium text-gray-500 dark:text-text-muted">{title}</span>
         <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-main">{value}</span>
            <span className="text-xs font-bold text-primary flex items-center bg-primary/10 px-1.5 py-0.5 rounded-md">
                {change} {!isStatus && <span className="material-symbols-outlined text-xs">trending_up</span>} {isStatus && <span className="material-symbols-outlined text-xs">check_circle</span>}
            </span>
         </div>
         <span className="text-xs text-gray-400 dark:text-text-muted mt-2">{sub}</span>
      </div>
      <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
         <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
      </div>
   </div>
);

const LegendItem = ({ color, label, value }: any) => (
   <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
         <div className={`size-2.5 rounded-full ${color}`}></div>
         <span className="text-gray-600 dark:text-text-muted">{label}</span>
      </div>
      <span className="font-bold text-text-main">{value}</span>
   </div>
);

const Bar = ({ height, label }: any) => (
   <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
      <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t-lg relative h-full group-hover:bg-primary/30 dark:group-hover:bg-primary/40 transition-colors overflow-hidden">
         <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-500" style={{ height }}></div>
      </div>
      <span className="text-xs font-bold text-gray-400 dark:text-text-muted">{label}</span>
   </div>
);

const ActionCard = ({ icon, color, title, sub, onClick }: any) => {
    const colorClasses: any = {
        green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 group-hover:bg-primary dark:group-hover:bg-primary group-hover:text-white',
        blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white',
        amber: 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white',
        purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white',
    };
    const textColors: any = {
        green: 'group-hover:text-primary',
        blue: 'group-hover:text-blue-500',
        amber: 'group-hover:text-amber-500',
        purple: 'group-hover:text-purple-500',
    }

    return (
        <button onClick={onClick} className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-gray-300 dark:border-[#2a4d31] hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group text-left">
           <div className={`size-10 rounded-lg flex items-center justify-center transition-colors ${colorClasses[color]}`}>
              <span className="material-symbols-outlined">{icon}</span>
           </div>
           <div>
              <p className={`font-bold text-sm transition-colors text-text-main ${textColors[color]}`}>{title}</p>
              <p className="text-xs text-gray-500 dark:text-text-muted">{sub}</p>
           </div>
        </button>
    )
}

export default Dashboard;