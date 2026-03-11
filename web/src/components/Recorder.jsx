import { useState } from "react";

export default function Recorder() {

  const [recording, setRecording] = useState(false);

  return (
    <div className="
      w-full
      bg-white/15
      backdrop-blur-lg
      p-6
      rounded-2xl
      shadow-xl
      border border-white/20
      hover:scale-[1.02]
      transition
    ">

      <h3 className="text-2xl font-semibold mb-6">
        🎤 Consultation Recorder
      </h3>

      {!recording ? (
        <button
          onClick={() => setRecording(true)}
          className="
            bg-green-500
            hover:bg-green-600
            px-6 py-3
            rounded-lg
            font-semibold
            shadow-md
            transition
          "
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={() => setRecording(false)}
          className="
            bg-red-500
            hover:bg-red-600
            px-6 py-3
            rounded-lg
            font-semibold
            shadow-md
            animate-pulse
          "
        >
          Stop Recording
        </button>
      )}

      {recording && (
        <p className="mt-4 text-red-300 font-medium">
          🔴 Recording in progress...
        </p>
      )}

    </div>
  );
}