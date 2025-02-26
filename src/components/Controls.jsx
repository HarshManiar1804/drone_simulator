import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";
import debounce from 'lodash/debounce';

// Controls component to handle the play, pause, and reset buttons
const Controls = ({
  coordinates,
  progress,
  setProgress,
  setIsPlaying,
  isReset,
  setIsReset,
}) => {
  const [clickedButton, setClickedButton] = useState("");

  // Effect to reset the progress, isPlaying, and isReset when isReset or coordinates.length is 0 
  useEffect(() => {
    if (isReset || coordinates.length === 0) {
      setProgress(0);
      setIsPlaying(false);
      setIsReset(false);
    }
  }, [isReset, setProgress, setIsPlaying, coordinates, setIsReset]);

  // Debounce the progress update to prevent too many re-renders
  const debouncedSetProgress = useCallback(
    debounce((value) => {
      setProgress(value);
    }, 50),
    []
  );

  return (
    <div className="w-[1400px] flex flex-col gap-4 border rounded-lg p-4 items-end justify-end">
      <div className="w-full rounded-full h-4 overflow-hidden">
        {/* Input to handle the progress */}
        <input
          type="range"
          min="0"
          max="100"
          disabled={coordinates.length === 0}
          value={isReset ? 0 : progress}
          onChange={(e) => {
            if (!isReset) {
              debouncedSetProgress(parseInt(e.target.value));
              setIsPlaying(false);
            }
          }}
          className="w-full h-5 cursor-pointer  accent-blue-500 hover:accent-blue-600 mb-2"
        />
      </div>
      <div className="flex gap-6">
        {/* Button to play the simulation */}
        <button
          disabled={coordinates.length === 0}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-blue-700 cursor-pointer text-white ${
            clickedButton === "Play" ? "bg-blue-700" : "bg-blue-500"
          }`}
          onClick={() => {
            setClickedButton("Play");
            setIsPlaying(true);
            setIsReset(false);
          }}
        >
          <Play size={20} /> Play
        </button>
        {/* Button to pause the simulation */}
        <button
          disabled={coordinates.length === 0}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-blue-700 cursor-pointer text-white ${
            clickedButton === "Pause" ? "bg-blue-700" : "bg-blue-500"
          }`}
          onClick={() => {
            setClickedButton("Pause");
            setIsPlaying(false);
          }}
        >
          <Pause size={20} /> Pause
        </button>
        {/* Button to reset the simulation */}
        <button
          disabled={coordinates.length === 0}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-blue-700 cursor-pointer text-white ${
            clickedButton === "Reset" ? "bg-blue-700" : "bg-blue-500"
          }`}
          onClick={() => {
            setClickedButton("Reset");
            setIsReset(true);
            setProgress(0);
          }}
        >
          <RefreshCw size={20} /> Reset
        </button>
      </div>
    </div>
  );
};

export default Controls;
