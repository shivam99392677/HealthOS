import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">

      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-6 md:px-12 py-4 bg-white/10 backdrop-blur-md border-b border-white/20">

        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          HealthOS
        </h1>

        <div className="flex gap-6 text-lg font-medium">

          <Link
            to="/"
            className="hover:text-yellow-300 transition duration-200"
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="hover:text-yellow-300 transition duration-200"
          >
            Dashboard
          </Link>

        </div>

      </nav>

      {/* Main Page Content */}
      <div className="w-full px-4 sm:px-8 lg:px-16 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;