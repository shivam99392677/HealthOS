import Recorder from "../components/Recorder";
import Transcript from "../components/Transcript";
import ClinicalNotes from "../components/ClinicalNotes";
import FHIRViewer from "../components/FHIRViewer";

export default function Home() {
  return (
    <div className="w-full">

      {/* Title */}
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
        AI Consultation Assistant
      </h2>

      {/* Responsive Grid */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-2
        gap-8
      ">

        <Recorder />
        <Transcript />
        <ClinicalNotes />
        <FHIRViewer />

      </div>

    </div>
  );
}