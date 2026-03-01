"use client";
import React, { useState, useEffect, useContext } from 'react';
import { 
  AzureMap, 
  AzureMapsProvider, 
  IAzureMapOptions, 
  AzureMapHtmlMarker, 
  AzureMapsContext 
} from 'react-azure-maps';
import { AuthenticationType } from 'azure-maps-control';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const CameraController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const context = useContext(AzureMapsContext);
  
  useEffect(() => {
    if (context?.isMapReady && context?.mapRef) {
      try {
        context.mapRef.setCamera({ center, zoom, type: 'fly', duration: 1000 });
      } catch (err) {
        console.warn("Camera fly error", err);
      }
    }
  }, [center, zoom, context]);

  return null; 
};

export default function ParkingMap() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [occupancyLookup, setOccupancyLookup] = useState<Map<string, string>>(new Map());
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true); 
  const [isMounted, setIsMounted] = useState(false);
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([-118.2437, 34.0522]);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const azureKey = process.env.NEXT_PUBLIC_AZURE_KEY;
  
  const baseMapOptions: IAzureMapOptions = {
    authOptions: { authType: AuthenticationType.subscriptionKey, subscriptionKey: azureKey },
  };
  
  useEffect(() => {
    setIsMounted(true);
    
    const hardcodedSpots = [
      // Cluster 1: Crypto.com Arena
      { spaceid: "C-1", latitude: "34.0435", longitude: "-118.2670", occupancystate: "VACANT" },
      { spaceid: "C-2", latitude: "34.0425", longitude: "-118.2680", occupancystate: "VACANT" },
      { spaceid: "C-3", latitude: "34.0432", longitude: "-118.2665", occupancystate: "VACANT" },
      { spaceid: "C-4", latitude: "34.0440", longitude: "-118.2660", occupancystate: "OCCUPIED" }, 
      
      // Cluster 2: Walt Disney Concert Hall
      { spaceid: "W-1", latitude: "34.0558", longitude: "-118.2495", occupancystate: "VACANT" },
      { spaceid: "W-2", latitude: "34.0548", longitude: "-118.2505", occupancystate: "VACANT" },
      { spaceid: "W-3", latitude: "34.0550", longitude: "-118.2490", occupancystate: "VACANT" },
      { spaceid: "W-4", latitude: "34.0560", longitude: "-118.2510", occupancystate: "OCCUPIED" }, 

      // Cluster 3: Dodger Stadium
      { spaceid: "D-1", latitude: "34.0745", longitude: "-118.2395", occupancystate: "VACANT" },
      { spaceid: "D-2", latitude: "34.0735", longitude: "-118.2405", occupancystate: "VACANT" },
      { spaceid: "D-3", latitude: "34.0740", longitude: "-118.2390", occupancystate: "VACANT" },
      { spaceid: "D-4", latitude: "34.0750", longitude: "-118.2410", occupancystate: "OCCUPIED" }  
    ];

    const lookup = new Map();
    hardcodedSpots.forEach(spot => lookup.set(spot.spaceid, spot.occupancystate));

    setInventory(hardcodedSpots);
    setOccupancyLookup(lookup);
    setBooting(false);
  }, []);

  const handleSearch = () => {
    if (!query) return;
    setLoading(true);

    const q = query.toLowerCase();
    let lat = 34.0522;
    let lon = -118.2437;

    if (q.includes("crypto")) {
      lat = 34.0430;
      lon = -118.2673;
    } else if (q.includes("disney")) {
      lat = 34.0553;
      lon = -118.2498;
    } else if (q.includes("dodger")) {
      lat = 34.0738;
      lon = -118.2400;
    } else {
      alert("For the demo, please search for 'Crypto', 'Disney', or 'Dodger'");
      setLoading(false);
      return;
    }

    setMapCenter([lon, lat]);
    setMapZoom(16);

    const nearby = inventory
      .filter(spot => occupancyLookup.get(spot.spaceid) === "VACANT")
      .map(spot => ({
        ...spot,
        dist: calculateDistance(lat, lon, parseFloat(spot.latitude), parseFloat(spot.longitude))
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3); 

    setRecommendations(nearby);
    setLoading(false);
  };

  if (!isMounted) return <div className="h-screen w-full bg-gray-100" />;
  return (
      <div style={{ position: 'relative', height: '100vh', width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        
        {/* Sidebar: Apple Glassmorphism (Works without Tailwind) */}
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 20,
          width: '340px',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '32px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          
          {/* Header */}
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', color: '#1d1d1f' }}>Find Parking</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#86868b', fontWeight: 500 }}>Los Angeles Real-time</p>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  fontSize: '15px',
                  outline: 'none',
                  color: '#000'
                }}
                placeholder="Search 'Crypto', 'Disney'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={booting}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                  onClick={handleSearch} 
                  disabled={loading || booting}
                  style={{
                    backgroundColor: '#0071e3', // Apple Blue
                    color: 'white',
                    border: 'none',
                    padding: '0 20px',
                    borderRadius: '14px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
              >
                  {loading ? "..." : "Find"}
              </button>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nearest Open Spots</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '6px', height: '6px', backgroundColor: '#34c759', borderRadius: '50%' }}></div>
                          <span style={{ fontSize: '11px', color: '#34c759', fontWeight: 600 }}>LIVE</span>
                      </div>
                  </div>

                  {recommendations.map((spot, i) => (
                      <button 
                          key={spot.spaceid}
                          style={{
                            textAlign: 'left',
                            padding: '14px',
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            borderRadius: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onClick={() => {
                            setMapCenter([parseFloat(spot.longitude), parseFloat(spot.latitude)]);
                            setMapZoom(19);
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'}
                      >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  backgroundColor: '#1d1d1f', 
                                  color: '#white', 
                                  borderRadius: '10px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                  
                              }}>
                                  {i + 1}
                              </div>
                              <div>
                                  <div style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '14px' }}>Space {spot.spaceid}</div>
                                  <div style={{ fontSize: '12px', color: '#34c759', fontWeight: 500 }}>Available</div>
                              </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 700, fontSize: '14px', color: '#1d1d1f' }}>{spot.dist.toFixed(2)}</div>
                              <div style={{ fontSize: '10px', color: '#86868b', fontWeight: 600 }}>MILES</div>
                          </div>
                      </button>
                  ))}
              </div>
          )}
        </div>

        <AzureMapsProvider>
          <AzureMap options={{ ...baseMapOptions, center: [-118.2437, 34.0522], zoom: 12 }}>
              <>
                  <CameraController center={mapCenter} zoom={mapZoom} />
                  
                  {inventory.map((s: any) => (
                    <AzureMapHtmlMarker 
                        key={s.spaceid} 
                        options={{ 
                          position: [parseFloat(s.longitude), parseFloat(s.latitude)], 
                          htmlContent: `<div style="width:12px; height:12px; background:${occupancyLookup.get(s.spaceid) === 'VACANT' ? '#34c759' : '#ff3b30'}; border-radius:50%; border:2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>` 
                        }} 
                    />
                  ))}

                  {recommendations.map((s: any) => (
                    <AzureMapHtmlMarker 
                        key={`rec-${s.spaceid}`} 
                        options={{ 
                          position: [parseFloat(s.longitude), parseFloat(s.latitude)], 
                          htmlContent: `
                              <div style="width:32px; height:32px; background:#0071e3; border:3px solid white; border-radius:10px; display:flex; align-items:center; justify-content:center; box-shadow: 0 8px 16px rgba(0,0,0,0.2); transform: translateY(-5px);">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>` 
                        }} 
                    />
                  ))}
              </>
          </AzureMap>
        </AzureMapsProvider>
      </div>
    );
}