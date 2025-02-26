import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Plane } from "lucide-react";
import ReactDOMServer from "react-dom/server";

const CARTO_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const OSM_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

// MapUpdater component to update the map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
};

// Map component to display the map
const Map = ({
  mapType,
  coordinates,
  isPlaying,
  setProgress,
  isReset,
  progress,
}) => {
  const [dronePosition, setDronePosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  // Effect to set the map center to the first coordinate
  useEffect(() => {
    if (coordinates.length > 0) {
      setMapCenter([coordinates[0].lat, coordinates[0].lng]);
    } else {
      setMapCenter([20.5937, 78.9629]);
    }
  }, [coordinates]);

  // Effect to set the drone position and map center to the current coordinate
  useEffect(() => {
    if (coordinates.length > 0 && !isPlaying) {
      const newIndex = Math.floor((progress / 100) * (coordinates.length - 1));
      indexRef.current = newIndex;
      setDronePosition(coordinates[newIndex]);
      setMapCenter([coordinates[newIndex].lat, coordinates[newIndex].lng]);
    }
  }, [progress, coordinates, isPlaying]);

  // Effect to reset the drone position and map center to the first coordinate  
  useEffect(() => {
    if (coordinates.length > 0) {
      if (isReset) {
        indexRef.current = 0;
        setDronePosition(coordinates[0]);
        setMapCenter([coordinates[0].lat, coordinates[0].lng]);
        setProgress(0);
        clearInterval(intervalRef.current);
      } else if (isPlaying) {
        setDronePosition(coordinates[indexRef.current]);
        setMapCenter([
          coordinates[indexRef.current].lat,
          coordinates[indexRef.current].lng,
        ]);

        intervalRef.current = setInterval(() => {
          if (indexRef.current < coordinates.length - 1) {
            indexRef.current++;
            setDronePosition({ ...coordinates[indexRef.current] });
            setMapCenter([
              coordinates[indexRef.current].lat,
              coordinates[indexRef.current].lng,
            ]);
            setProgress(((indexRef.current + 1) / coordinates.length) * 100);
          } else {
            clearInterval(intervalRef.current);
            setProgress(100);
            setDronePosition(coordinates[coordinates.length - 1]);
          }
        }, 1000);
      } else {
        setDronePosition(coordinates[indexRef.current]);
        setMapCenter([
          coordinates[indexRef.current].lat,
          coordinates[indexRef.current].lng,
        ]);
        clearInterval(intervalRef.current);
      }

      return () => clearInterval(intervalRef.current);
    }
  }, [coordinates, isPlaying, isReset, setProgress]);

  const getTileLayerURL = () => (mapType === "carto" ? CARTO_URL : OSM_URL);

  // Memoize the polyline positions to prevent unnecessary recalculations
  const polylinePositions = useMemo(() => 
    coordinates.map((coord) => [coord.lat, coord.lng]),
    [coordinates]
  );

  // Memoize the tile layer URL
  const tileLayerURL = useMemo(() => 
    mapType === "carto" ? CARTO_URL : OSM_URL,
    [mapType]
  );

  // Memoize the plane icon to prevent recreation on every render
  const memoizedDroneIcon = useMemo(() => new L.DivIcon({
    className: "custom-plane-icon",
    html: ReactDOMServer.renderToString(<Plane size={40} color="blue" />),
    iconSize: [30, 0],
    iconAnchor: [20, 20],
  }), []);

  return (
    <div className="relative w-[1080px] h-[500px] border rounded-md overflow-hidden shadow-md">
      <div style={{ height: "100%", width: "100%" }}>
        {/* MapContainer to display the map */}
        <MapContainer
          center={mapCenter}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <MapUpdater center={mapCenter} />
          <TileLayer
            attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileLayerURL}
          />
          {/* Polyline to display the path */}
          {coordinates.length > 1 && (
            <Polyline
              positions={polylinePositions}
              color="blue"
            />
          )}
          {/* Marker to display the drone */}
          {dronePosition && coordinates.length > 0 && (
            <Marker
              position={[dronePosition.lat, dronePosition.lng]}
              icon={memoizedDroneIcon}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
