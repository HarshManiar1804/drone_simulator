import "./App.css";
// import { useCallback } from "react";
import { lazy, Suspense } from 'react';
import { useState } from "react";
// import icons
import { Loader } from 'lucide-react';

// import components
import Controls from './components/Controls';

// Lazy load components
const Map = lazy(() => import('./components/Map'));
const Sidebar = lazy(() => import('./components/Sidebar'));

function App() {
  // State for the Entire App
  const [mapType, setMapType] = useState("osm");
  const [coordinates, setCoordinatesState] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isReset, setIsReset] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <div className="font-bold text-5xl">Drone Simulator</div>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={50} />
      </div>}>
        <div className="flex gap-4 p-8">
          <div>
            <Map
              progress={progress}
              isReset={isReset}
              mapType={mapType}
              coordinates={coordinates}
              isPlaying={isPlaying}
              setProgress={setProgress}
            />
          </div>
          <div>
            <Sidebar
              mapType={mapType}
              setMapType={setMapType}
              coordinates={coordinates}
              setCoordinatesState={setCoordinatesState}
            />
          </div>
        </div>
      </Suspense>
      <div className="pl-8">
        <Controls
          setIsReset={setIsReset}
          coordinates={coordinates}
          progress={progress}
          setProgress={setProgress}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </>
  );
}

export default App;
