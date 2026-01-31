import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Layer } from '../types';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import L from 'leaflet';

// Mock Data
const MOCK_LOCATIONS = {
  center: [28.6139, 77.2090] as [number, number], // New Delhi
  project: [28.6129, 77.2290] as [number, number],
  ev_stations: [
    [28.6100, 77.2000],
    [28.6200, 77.2100],
    [28.6150, 77.1900],
    [28.6050, 77.2150],
  ] as [number, number][],
  trees: [
    [28.6145, 77.2095], [28.6140, 77.2085], [28.6135, 77.2100], [28.6155, 77.2080],
    [28.6160, 77.2110], [28.6125, 77.2070], [28.6110, 77.2090], [28.6130, 77.2060],
  ] as [number, number][],
  solar_potential: [
    [28.6180, 77.2050],
    [28.6190, 77.2060],
    [28.6170, 77.2040],
  ] as [number, number][],
  corridor_path: [
    [28.6129, 77.2290],
    [28.6100, 77.2250],
    [28.6080, 77.2200],
    [28.6050, 77.2150],
    [28.6000, 77.2100]
  ] as [number, number][]
};

const layersData: Layer[] = [
  { id: 'ev', name: 'EV Count', icon: 'ev_station', active: false, colorClass: 'text-blue-600', bgClass: 'bg-blue-100' },
  { id: 'tree', name: 'Tree Cover', icon: 'forest', active: true, colorClass: 'text-green-600', bgClass: 'bg-green-100' },
  { id: 'solar', name: 'Solar Potential', icon: 'wb_sunny', active: false, colorClass: 'text-yellow-600', bgClass: 'bg-yellow-100' },
  { id: 'hotspot', name: 'Hotspot Layer', icon: 'device_thermostat', active: true, colorClass: 'text-red-600', bgClass: 'bg-red-100' },
  { id: 'corridor', name: 'Green Corridors', icon: 'alt_route', active: true, colorClass: 'text-white', bgClass: 'bg-primary', isAi: true },
  { id: 'shade', name: 'Shade Coverage', icon: 'beach_access', active: false, colorClass: 'text-purple-600', bgClass: 'bg-purple-100' },
];

const MapExplorer: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>(layersData);
  const [selectedProject, setSelectedProject] = useState<boolean>(false);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };

  // Initialize Map
  useEffect(() => {
    // Small timeout to ensure container has size before init
    const timer = setTimeout(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView(MOCK_LOCATIONS.center, 14);

        // Add CartoDB Voyager tiles (clean, light map style)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        mapInstanceRef.current = map;

        // Initialize layer groups
        layerGroupsRef.current = {
            ev: L.layerGroup().addTo(map),
            tree: L.layerGroup().addTo(map),
            solar: L.layerGroup().addTo(map),
            hotspot: L.layerGroup().addTo(map),
            corridor: L.layerGroup().addTo(map),
            shade: L.layerGroup().addTo(map),
            project: L.layerGroup().addTo(map) // For the project pin
        };

        // Add data to layer groups
        
        // EV Stations
        MOCK_LOCATIONS.ev_stations.forEach(loc => {
            const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full border-2 border-white shadow-md"><span class="material-symbols-outlined text-[18px]">ev_station</span></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
            });
            L.marker(loc, { icon }).addTo(layerGroupsRef.current.ev);
        });

        // Trees
        MOCK_LOCATIONS.trees.forEach(loc => {
            L.circle(loc, {
            radius: 40,
            color: 'transparent',
            fillColor: '#16a34a', // green-600
            fillOpacity: 0.6
            }).addTo(layerGroupsRef.current.tree);
        });

        // Solar
        MOCK_LOCATIONS.solar_potential.forEach(loc => {
            L.circle(loc, {
            radius: 60,
            color: 'transparent',
            fillColor: '#eab308', // yellow-500
            fillOpacity: 0.5
            }).addTo(layerGroupsRef.current.solar);
        });

        // Hotspots (Heatmap simulation with circles)
        [
            [28.6110, 77.2050], [28.6180, 77.2150]
        ].forEach((loc: any) => {
            L.circle(loc, {
            radius: 300,
            color: 'transparent',
            fillColor: '#ef4444', // red-500
            fillOpacity: 0.2
            }).addTo(layerGroupsRef.current.hotspot);
        });

        // Green Corridor
        const corridorLine = L.polyline(MOCK_LOCATIONS.corridor_path, {
            color: '#11d432',
            weight: 6,
            dashArray: '10, 10',
            opacity: 0.8
        }).addTo(layerGroupsRef.current.corridor);
        
        // Halo for corridor
        L.polyline(MOCK_LOCATIONS.corridor_path, {
            color: '#11d432',
            weight: 20,
            opacity: 0.2,
            lineCap: 'round'
        }).addTo(layerGroupsRef.current.corridor);

        // Project Pin (Interactive)
        const projectIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="relative flex items-center justify-center w-8 h-8 cursor-pointer group">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <div class="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg border-2 border-white transform transition-transform group-hover:scale-110">
                        <span class="material-symbols-outlined text-[18px]">star</span>
                    </div>
                    </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        
        const projectMarker = L.marker(MOCK_LOCATIONS.project, { icon: projectIcon }).addTo(layerGroupsRef.current.project);
        projectMarker.on('click', () => {
            setSelectedProject(true);
            // Center map on project slightly offset
            map.flyTo([MOCK_LOCATIONS.project[0], MOCK_LOCATIONS.project[1] - 0.005], 15, { animate: true });
        });

        // Force a resize calculation to ensure tiles load correctly
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
        }
    }, 100);
    
    // Cleanup
    return () => {
        clearTimeout(timer);
      // mapInstanceRef.current?.remove(); // Strict mode might double init, but simple ref check handles it.
    };
  }, []);

  // Update Layers Visibility
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    layers.forEach(layer => {
      const group = layerGroupsRef.current[layer.id];
      if (group) {
        if (layer.active) {
          if (!mapInstanceRef.current!.hasLayer(group)) {
             mapInstanceRef.current!.addLayer(group);
          }
        } else {
          if (mapInstanceRef.current!.hasLayer(group)) {
             mapInstanceRef.current!.removeLayer(group);
          }
        }
      }
    });
    
    // Always show project marker if corridor is active? Or just always.
    // Let's keep project marker always visible for now or linked to Corridor
    const projectGroup = layerGroupsRef.current['project'];
    const corridorActive = layers.find(l => l.id === 'corridor')?.active;
    if (corridorActive) {
        if (!mapInstanceRef.current!.hasLayer(projectGroup)) mapInstanceRef.current!.addLayer(projectGroup);
    } else {
        if (mapInstanceRef.current!.hasLayer(projectGroup)) mapInstanceRef.current!.removeLayer(projectGroup);
    }

  }, [layers]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-200 font-display">
      <Navbar />
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Map Container */}
        <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full" />

        {/* Floating Sidebar */}
        <div className="absolute left-6 top-6 bottom-6 z-[400] w-80 flex flex-col gap-4 pointer-events-none">
            {/* Search */}
            <div className="pointer-events-auto bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-2 border border-slate-200">
            <div className="flex items-center gap-2 px-3 h-12">
                <span className="material-symbols-outlined text-slate-400">search</span>
                <input 
                type="text" 
                placeholder="Search city or coordinates" 
                className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium placeholder:text-slate-400 text-slate-800 focus:outline-none" 
                defaultValue="New Delhi, India"
                />
            </div>
            </div>

            {/* Layers Panel */}
            <div className="pointer-events-auto flex-1 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9-Nb3aRjGhOZIvN0KnPMSCH1Zq92I-mzZxS0U1KKqDca_jO2kceKq5myUjsXLytS3mDwBh_8JpgvEr5-6NYLgYbrLTOzglmiYqPQvebCV2LI7wmd61GQw_NzYgECi1g85NUmYby48JcdKPo9ikuUXWOibAvfk_bMHMxfugGKzUE8pdBSb1qocLpcEkNrYyQK12HeixNX7J6sf4CPtwSe1qAlTFPmP8z-lpkN3StUs9scGECNNA_6r-dywHEeiRfgosGIY8YTUeg')"}}></div>
                <div>
                    <h1 className="text-slate-900 text-base font-bold leading-tight">Data Layers</h1>
                    <p className="text-primary text-xs font-medium uppercase tracking-wider">Map Overlays</p>
                </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {layers.map((layer) => (
                    <label 
                    key={layer.id} 
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${layer.active ? (layer.isAi ? 'bg-primary/10 border border-primary/20' : layer.bgClass.replace('100', '50')) : 'hover:bg-slate-50'}`}
                    onClick={() => toggleLayer(layer.id)}
                    >
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${layer.isAi ? 'bg-primary text-white shadow-sm' : `${layer.bgClass} ${layer.colorClass}`}`}>
                        <span className="material-symbols-outlined text-[20px]">{layer.icon}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900">{layer.name}</span>
                            {layer.isAi && <span className="text-[10px] text-primary uppercase font-bold tracking-wider">AI Suggested</span>}
                        </div>
                    </div>
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${layer.active ? 'bg-primary' : 'bg-slate-200'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${layer.active ? 'translate-x-6' : 'translate-x-1'}`}></span>
                    </div>
                    </label>
                ))}
            </div>

            {/* Stats Footer */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                    <span>Current View Stats</span>
                    <span className="material-symbols-outlined text-[16px]">info</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded border border-slate-100">
                        <div className="text-xl font-bold text-slate-800">68%</div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">Green Score</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-100">
                        <div className="text-xl font-bold text-slate-800">24°C</div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">Avg Temp</div>
                    </div>
                </div>
            </div>
            </div>
        </div>

        {/* Right Controls */}
        <div className="absolute right-6 top-6 z-[400] flex flex-col items-end gap-4 pointer-events-none">
            <button 
            className="pointer-events-auto group relative flex items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary hover:bg-green-500 text-slate-900 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={() => {
                // Mock AI Suggestion
                toggleLayer('corridor');
                if (!layers.find(l=>l.id==='corridor')?.active) {
                    // If turning on, fly to project
                    mapInstanceRef.current?.flyTo(MOCK_LOCATIONS.project, 14, { duration: 1.5 });
                }
            }}
            >
                <span className="material-symbols-outlined mr-2 text-[20px] animate-pulse">auto_awesome</span>
                <span className="text-sm font-bold tracking-wide">Suggest Green Corridors (AI)</span>
            </button>
            
            <div className="pointer-events-auto flex flex-col bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 overflow-hidden mt-4">
                <button className="flex w-10 h-10 items-center justify-center hover:bg-slate-100 border-b border-slate-100 text-slate-700" onClick={() => mapInstanceRef.current?.zoomIn()}><span className="material-symbols-outlined">add</span></button>
                <button className="flex w-10 h-10 items-center justify-center hover:bg-slate-100 text-slate-700" onClick={() => mapInstanceRef.current?.zoomOut()}><span className="material-symbols-outlined">remove</span></button>
            </div>
        </div>

        {/* Legend */}
        <div className="absolute right-6 bottom-6 z-[400] pointer-events-auto bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 p-4 w-64">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Legend</h3>
                <span className="material-symbols-outlined text-slate-400 text-[18px] cursor-pointer">expand_more</span>
            </div>
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-[10px] font-medium text-slate-600 mb-1">
                    <span>Urban Heat</span>
                    <span>Intensity</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-yellow-200 via-orange-400 to-red-600"></div>
                </div>
                <div>
                    <div className="flex justify-between text-[10px] font-medium text-slate-600 mb-1">
                    <span>Corridor Feasibility</span>
                    <span>AI Score</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-slate-200 to-primary"></div>
                </div>
            </div>
        </div>

        {/* Project Details Modal (Right Drawer) */}
        <div 
            className={`absolute top-4 right-4 bottom-4 w-[440px] z-[500] flex flex-col bg-surface-light shadow-2xl rounded-2xl border border-gray-200 overflow-hidden transition-transform duration-300 ease-in-out ${selectedProject ? 'translate-x-0' : 'translate-x-[120%]'}`}
        >
            <div className="flex items-start justify-between p-6 pb-2 shrink-0">
                <div className="flex flex-col gap-2">
                <div className="flex h-6 shrink-0 items-center justify-center gap-x-1.5 rounded-full bg-primary/20 pl-2.5 pr-2.5 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <p className="text-primary text-xs font-bold uppercase tracking-wider leading-normal">Planned Phase</p>
                </div>
                <h1 className="text-slate-900 text-[28px] font-bold leading-tight">Downtown Riverwalk Extension</h1>
                </div>
                <button onClick={() => setSelectedProject(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="py-4">
                <button 
                    onClick={() => setShowComparisonModal(true)}
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-primary hover:bg-[#0ebf2d] transition-colors text-[#0d1b10] gap-2 text-sm font-bold shadow-md shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
                    <span>Compare Before / After</span>
                </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="col-span-1 aspect-square rounded-xl overflow-hidden border border-gray-200 relative group cursor-pointer">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIu2MIzWJCAZqKMH8Ag1zyo1eHSo3ERCiVDMMDzUb-1PUcxcU7yhdkXY_NHXib8EfMsj2ebnm6z9rROebt4xzQjVXQstMXn-As2M6yel8Zz3ikxWa9a0sGBu0FLI3q6MgNO2kP1JrtJ27KH8vH6iscBXhPFFuBLTk4ISoTGTzVdFQVUWRAgIxDJsvD9lvLo8ODzb6AOxneqXVYHXKGesPuQoVdR2mqSnvAWeiW3thuutkOTXRHEbkOS9cfr216dywsou09XHZvWw" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="map detail"/>
                </div>
                <div className="col-span-2 text-sm text-gray-600 font-normal leading-relaxed">
                    This project transforms the former industrial railway along the river into a bio-diverse pedestrian greenway, connecting the North District to the City Center.
                </div>
                </div>

                <hr className="border-gray-100 mb-6"/>

                {/* Metrics */}
                <div className="flex flex-col items-center justify-center mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4">Overall Eco-Impact</h3>
                <div className="relative size-40 rounded-full bg-[conic-gradient(#11d432_87%,#e2e8f0_0)] shadow-inner flex items-center justify-center">
                    <div className="bg-white size-32 rounded-full flex flex-col items-center justify-center shadow-lg">
                        <span className="text-4xl font-bold text-slate-900">87</span>
                        <span className="text-xs font-medium text-gray-400">/ 100</span>
                    </div>
                </div>
                <p className="text-primary text-sm font-medium mt-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">trending_up</span> High Impact
                </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <MetricCard icon="forest" label="Trees Added" value="+145" subValue="+12% vs last plan" subColor="text-primary" />
                    <MetricCard icon="thermostat" label="Cooling" value="-2.4°C" subValue="Heat island reduction" subColor="text-blue-500" iconBg="bg-blue-100" iconColor="text-blue-500" />
                    <MetricCard icon="air" label="Air Quality" value="Good" subValue="AQI improved by 15%" subColor="text-primary" iconBg="bg-purple-100" iconColor="text-purple-500" />
                    <MetricCard icon="directions_walk" label="Walkability" value="92" subValue="Walker's Paradise" subColor="text-orange-500" iconBg="bg-orange-100" iconColor="text-orange-500" />
                </div>
            </div>
        </div>

        {/* Comparison Modal Overlay */}
        {showComparisonModal && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Proposed Green Corridor Transformation</h2>
                        <p className="text-sm text-gray-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> West 4th Avenue • Sector 7</p>
                    </div>
                    <button onClick={() => setShowComparisonModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <span className="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="aspect-video w-full rounded-lg overflow-hidden mb-8">
                        <BeforeAfterSlider 
                        beforeImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAFH6zu0Et-9Sr7LNGZ9Q4TJ_qqqYygiv3BHgpi6kDsXvunnapFePQ-7YY19y85eCxta4UU9sbrqOAvWxcVpiqoYaQomwpcrWvBEOTfsn0hC2P0hMIYdyQCs_p24K-8CH_OrfQ2-pycbIpol6uk6A9kWM4Az9Lw83mqbVXwa2eq_H4aR8Bmt1UTGuaz-qyKeHojAGWqMmjxEODYUYI_K731styzmAQjkkw9Z2J7oAovwIx_qsmocc1nVhKGws5DaMITrJFGykpcOg"
                        afterImage="https://lh3.googleusercontent.com/aida-public/AB6AXuA_zSknFTIPjy5_EZF6yIggEP5tC0qAKaRybv0DHDRPJ0mN2tjaNZy5vYJ5xUw-ARmRmfR30EUJn8TG2ZBK5KZTB6PkGoBgxm0vU4ZI_Kitnb_u2u8FqAvmp9RoAlpZd84URks9ck-b0yKlbqbryYMFllNwgoQ03QcYZWiOE7_QP5SObleVBq368VbCSv3T0JtCB7q9-IcYjx10yoj5HU1nb1YDDiRv0KumaP_iNeY0V2LM6RyPpYxXEIQkbcwA6sWjv-BBOa4SRg"
                        labelBefore="Current State"
                        labelAfter="AI Proposal"
                        />
                    </div>
                    
                    <h3 className="font-bold text-lg mb-4">Impact Analysis</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <ImpactStat icon="thermostat" label="Heat" value="-4.5°C" sub="-12% avg" isPositive={true} />
                        <ImpactStat icon="beach_access" label="Shade" value="45%" sub="30% gain" isPositive={true} />
                        <ImpactStat icon="water_drop" label="Water" value="1200 L" sub="100% gain" isPositive={true} />
                        <ImpactStat icon="park" label="Trees" value="12" sub="12 new" isPositive={true} />
                        <ImpactStat icon="air" label="AQI" value="42" sub="Good" isPositive={true} />
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-2"><span className="material-symbols-outlined text-sm">info</span> AI model v2.4 • Last updated today</span>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2"><span className="material-symbols-outlined text-sm">download</span> Download Image</button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 flex items-center gap-2"><span className="material-symbols-outlined text-sm">auto_fix_high</span> Regenerate View</button>
                    </div>
                </div>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, subValue, subColor, iconBg = "bg-primary/10", iconColor = "text-primary" }: any) => (
    <div className="bg-gray-50 p-4 rounded-xl flex flex-col gap-1 border border-transparent hover:border-primary/30 transition-colors">
       <div className="flex items-center gap-2 mb-1">
          <div className={`${iconBg} p-1.5 rounded-lg ${iconColor}`}>
             <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
       </div>
       <p className="text-2xl font-bold text-slate-900">{value}</p>
       <p className={`text-xs ${subColor} font-medium`}>{subValue}</p>
    </div>
);

const ImpactStat = ({ icon, label, value, sub, isPositive }: any) => (
   <div className="flex flex-col gap-2 rounded-xl p-4 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
       <div className="flex items-center gap-2 text-gray-500 mb-1">
           <span className="material-symbols-outlined text-[20px]">{icon}</span>
           <p className="text-xs font-medium uppercase tracking-wider">{label}</p>
       </div>
       <p className="text-slate-900 text-2xl font-bold">{value}</p>
       <div className={`flex items-center gap-1 text-xs font-medium w-fit px-2 py-0.5 rounded ${isPositive ? 'text-primary bg-green-50' : 'text-red-500 bg-red-50'}`}>
           <span className="material-symbols-outlined text-[14px]">{isPositive ? 'arrow_upward' : 'arrow_downward'}</span>
           {sub}
       </div>
   </div>
);

export default MapExplorer;