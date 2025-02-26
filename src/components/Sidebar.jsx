import { useState } from "react";
import { toast } from "react-hot-toast";

// Sidebar component to handle the map type and input type
const Sidebar = ({ mapType, setMapType, coordinates, setCoordinatesState }) => {
  const [inputType, setInputType] = useState("manual");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [file, setFile] = useState(null);

  // Handle adding a coordinate
    const handleAddCoordinate = () => {
    const numLat = Number(lat);
    const numLng = Number(lng);

    if (!isValidCoordinate(numLat, numLng)) {
      if (!isValidCoordinate(numLat, 0) || !isValidCoordinate(0, numLng)) {
        alert(
          `Invalid latitude: ${lat}. Must be between -90 and 90 and longitude: ${lng}. Must be between -180 and 180.`
        );
      }
      return;
    }

    const newCoords = [...coordinates, { lat: numLat, lng: numLng }];
    setCoordinatesState(newCoords);
    setLat("");
    setLng("");
  };

  // Handle file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file upload
    const handleFileUpload = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n").filter((row) => row.trim()); // Remove empty rows

      if (rows.length === 0) {
        toast.error("File is empty");
        return;
      }

      // Check headers
      const headers = rows[0]
        .toLowerCase()
        .split(",")
        .map((h) => h.trim());
      const latIndex = headers.findIndex((h) => h.includes("lat"));
      const lngIndex = headers.findIndex(
        (h) => h.includes("lon") || h.includes("lng")
      );

      if (latIndex === -1 || lngIndex === -1) {
        toast.error("Could not find latitude/longitude columns in headers");
        return;
      }

      const coords = [];

      // Process data rows
      for (let index = 1; index < rows.length; index++) {
        const row = rows[index].split(",").map((val) => val.trim());
        if (row.length <= Math.max(latIndex, lngIndex)) continue;

        const latitude = Number(row[latIndex]);
        const longitude = Number(row[lngIndex]);

        if (!isValidCoordinate(latitude, longitude)) {
          alert(
            `Invalid coordinates at row ${
              index + 2
            }: (${latitude}, ${longitude})`
          );
          return;
        }

        coords.push({ lat: latitude, lng: longitude });
      }

      if (coords.length > 0) {
        setCoordinatesState(coords);
      }
    };
    reader.readAsText(file);
  };

  // Handle input type change
  const handleInputTypeChange = (e) => {
    setInputType(e.target.value);
    setCoordinatesState([]);
  };

  // Check if the coordinate is valid
  const isValidCoordinate = (latitude, longitude) => {
    if (typeof latitude !== "number" || latitude < -90 || latitude > 90) {
      return false;
    }
    if (typeof longitude !== "number" || longitude < -180 || longitude > 180) {
      return false;
    }
    return true;
  };

  // Handle clear list
  const handleClearList = () => {
    setCoordinatesState([]);
    setFile(null);
  };

  return (
    <div className="border-1 h-[500px] w-[300px] rounded-md p-4">
      <div className="mb-4">
        <h3 className="font-bold">Select Map Type</h3>
        <div className="bg-white bg-opacity-70 rounded-md shadow-md flex">
          {/* Button to select the OSM map */}
          <button
            onClick={() => setMapType("osm")}
            className={`px-4 py-2 transition-all duration-300 cursor-pointer ${
              mapType === "osm"
                ? "font-bold text-black"
                : "font-light text-gray-500"
            }`}
          >
            OSM Map
          </button>
          {/* Button to select the Carto map */}
          <button
            onClick={() => setMapType("carto")}
            className={`px-4 py-2 transition-all duration-300 cursor-pointer ${
              mapType === "carto"
                ? "font-bold text-black"
                : "font-light text-gray-500"
            }`}
          >
            Carto Map
          </button>
        </div>
      </div>

      {/* Select input type */}
      <div className="mb-4">
        <h3 className="font-bold">Select Input Type</h3>
        <select
          className="border p-2 w-full rounded-md"
          value={inputType}
          onChange={handleInputTypeChange}
        >
          <option value="manual">Manual Input</option>
          <option value="file">Upload CSV</option>
        </select>
      </div>

      {/* Manual input and file upload */}
      {inputType === "manual" ? (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="border p-2 w-full rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="border p-2 w-full rounded-md mb-2"
            />
          </div>
          <button
            onClick={handleAddCoordinate}
            className="w-full bg-blue-500 text-white py-2 rounded-md cursor-pointer"
          >
            Add Coordinates
          </button>
        </>
      ) : (
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full border p-2 rounded-md mb-2"
          />
          <button
            onClick={handleFileUpload}
            className="w-full bg-blue-500 text-white py-2 rounded-md cursor-pointer"
          >
            Upload File
          </button>
        </div>
      )}

      {/* Coordinates list */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold">Coordinates List</h4>
          <button
            onClick={handleClearList}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
          >
            Clear List
          </button>
        </div>
        <div className="h-42 overflow-y-auto border p-2 rounded-md">
          <ul className="list-disc pl-4">
            {coordinates.map((coord, index) => (
              <li key={index}>
                {coord.lat}, {coord.lng}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
