"use client";
import dynamic from 'next/dynamic';

// Dynamically import the map so it only runs in the browser
const ParkingMap = dynamic(() => import('../components/ParkingMaps'), { 
  ssr: false,
  loading: () => <div className="h-screen w-full flex items-center justify-center bg-black text-white text-xl">Loading LA Parking Map...</div>
});

export default function Home() {
  return (
    <main className="h-screen w-full overflow-hidden">
      <ParkingMap />
    </main>
  );
}