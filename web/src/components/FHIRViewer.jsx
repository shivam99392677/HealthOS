export default function FHIRViewer() {
  return (
    <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg">

      <h3 className="text-white text-xl font-semibold mb-4">
        🏥 FHIR Structured Data
      </h3>

      <pre className="bg-black/40 text-green-300 p-4 rounded-lg text-sm overflow-auto">
{`{
  "patient": "Rahul Kumar",
  "condition": "Fever",
  "observation": "Temperature 101F"
}`}
      </pre>

    </div>
  );
}