import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

const StreetTool: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(true);
  
  // Mock Toggles state
  const [toggles, setToggles] = useState({
      trees: true,
      shade: false,
      greenBelt: true,
      cycleLane: true,
      vegetation: false,
      gardens: false
  });

  const handleToggle = (key: string) => {
      setToggles(prev => ({ ...prev, [key]: !(prev as any)[key] }));
  };

  const handleGenerate = () => {
      setIsGenerating(true);
      setTimeout(() => {
          setIsGenerating(false);
          setShowResult(true);
      }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light font-display">
      <Navbar />
      <main className="flex-grow flex flex-col items-center py-8 px-6 lg:px-12 w-full max-w-[1440px] mx-auto gap-8">
        
        <div className="w-full max-w-[1200px] flex flex-col gap-2">
           <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">Street Transformation Tool</h1>
           <p className="text-gray-500 max-w-2xl font-body">Visualize urban sustainability improvements instantly. Upload a street photo and apply green interventions to see the potential impact.</p>
        </div>

        <div className="flex flex-col lg:flex-row w-full max-w-[1200px] gap-6 items-start">
           {/* Visualizer */}
           <div className="flex-1 w-full flex flex-col gap-4">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden shadow-sm group">
                 {isGenerating && (
                    <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <span className="material-symbols-outlined text-4xl animate-spin mb-2">autorenew</span>
                        <span className="font-bold">Generating AI Transformation...</span>
                    </div>
                 )}
                 <BeforeAfterSlider 
                    beforeImage="https://lh3.googleusercontent.com/aida-public/AB6AXuD2b85fZA5ZhSV6ALnmH30gWhXPINZbMos-K8l5CDdeWBVzy-Cen78tC8z0bldCnYH56qHqYRb2LpS054_J_1g2tf5VVmgsFBR_v3qHrftKh8Yp_2W1ZAwJeklFJV3VSNIK6MuigHWnd0ZRTRDA4HR6BdryKYeXPKLFfvKBKDXsNcoWxNpMBymVNu_Kh114iJOmuDDREOelF4Z_0UGUM0JLUOcC6g-vL-m5x2u8lVtvF0_7EpJxPbLzy3TbACE0n9R66E6f-sVxMg"
                    afterImage="https://lh3.googleusercontent.com/aida-public/AB6AXuCHMrif_FZz6MFxzgYOs8DkUKUMy1kgjRQlm0dsWSV2e3KvCAUsz8bwUcLu3V1swB9_heMVTDwKKosK57c4CdW-b9hO3CAQQ7N4AKl5GxC-d0baLGi--UG91c-w2zt6qfjZxsFhuyWgaopmRJCYHs0sRM7i0pyiYNK-SCJbfwSUa7JVoE64VQsX3KpJ8ssuwg62YOxCLtBlHYN-u1okLrP9vomNTnLpdg3QA4scmcKd-ibGfMELIKDv2XzlxpRFEDgbueLBqX9J7A"
                    labelBefore="Before"
                    labelAfter="After"
                 />
              </div>

              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-dashed border-[#cfe7d3]">
                 <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400">add_photo_alternate</span>
                    <span className="text-sm text-gray-600">Want to try another street?</span>
                 </div>
                 <button className="text-sm font-bold text-primary hover:text-primary/80">Upload New</button>
              </div>
           </div>

           {/* Controls */}
           <div className="w-full lg:w-[400px] flex flex-col gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-[#e7f3e9] p-6 flex flex-col gap-6">
                 <div className="flex items-center justify-between pb-2 border-b border-[#e7f3e9]">
                    <h2 className="text-xl font-bold text-text-main">Interventions</h2>
                    <span className="material-symbols-outlined text-gray-400">tune</span>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                    <Toggle label="Add Trees" icon="park" checked={toggles.trees} onChange={() => handleToggle('trees')} />
                    <Toggle label="Shade Canopy" icon="umbrella" checked={toggles.shade} onChange={() => handleToggle('shade')} />
                    <Toggle label="Green Belt" icon="forest" checked={toggles.greenBelt} onChange={() => handleToggle('greenBelt')} />
                    <Toggle label="Cycle Lane" icon="directions_bike" checked={toggles.cycleLane} onChange={() => handleToggle('cycleLane')} />
                    <Toggle label="Vegetation" icon="grass" checked={toggles.vegetation} onChange={() => handleToggle('vegetation')} />
                    <Toggle label="Vertical Gardens" icon="potted_plant" checked={toggles.gardens} onChange={() => handleToggle('gardens')} />
                 </div>

                 <div className="pt-4 border-t border-[#e7f3e9]">
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-sm text-text-main">Green Density</span>
                       <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded">High</span>
                    </div>
                    <input type="range" className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" min="1" max="100" defaultValue="75" />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                       <span>Sparse</span>
                       <span>Dense</span>
                    </div>
                 </div>

                 <button 
                    className="w-full bg-primary hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                 >
                    {isGenerating ? (
                        <>
                           <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Processing...
                        </>
                    ) : (
                        <>
                           <span className="material-symbols-outlined">auto_fix_high</span> Generate After Image
                        </>
                    )}
                 </button>
              </div>
           </div>
        </div>

        {/* Dashboard */}
        <div className="w-full max-w-[1200px] mt-4">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
              <span className="material-symbols-outlined text-primary">analytics</span> Projected Impact Metrics
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricBox icon="air" label="Air Quality Index" value={toggles.trees ? "+18%" : "+5%"} sub="Improved" subColor="text-green-600 bg-green-100" iconColor="text-blue-500 bg-blue-50" />
              <MetricBox icon="thermostat" label="Surface Temp" value={toggles.shade ? "-6°C" : "-2°C"} sub="Cooler" subColor="text-green-600 bg-green-100" iconColor="text-orange-500 bg-orange-50" />
              <MetricBox icon="emoji_nature" label="Biodiversity Score" value="8.5" sub="/ 10" subColor="text-gray-400" iconColor="text-purple-500 bg-purple-50" />
              <MetricBox icon="directions_walk" label="Walkability" value="High" sub="Safe" subColor="text-green-600 bg-green-100" iconColor="text-yellow-600 bg-yellow-50" />
           </div>
        </div>

      </main>
    </div>
  );
};

const Toggle = ({ label, icon, checked, onChange }: any) => (
   <label className="flex items-center justify-between p-3 rounded-lg hover:bg-background-light transition-colors cursor-pointer group select-none">
      <div className="flex items-center gap-3">
         <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">{icon}</span>
         <span className="font-medium text-text-main">{label}</span>
      </div>
      <div className="relative inline-flex items-center cursor-pointer">
         <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </div>
   </label>
);

const MetricBox = ({ icon, label, value, sub, subColor, iconColor }: any) => (
   <div className="bg-white p-6 rounded-xl border border-[#e7f3e9] shadow-sm flex flex-col items-start gap-2 hover:border-primary/50 transition-colors">
      <div className={`${iconColor} p-2 rounded-lg mb-1`}>
         <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-sm text-gray-500 font-body">{label}</span>
      <div className="flex items-baseline gap-2">
         <span className="text-2xl font-bold text-text-main transition-all duration-300">{value}</span>
         <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${subColor}`}>{sub}</span>
      </div>
   </div>
);

export default StreetTool;