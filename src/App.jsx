import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TeamProvider } from "./context/TeamContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Pokedex from "./pages/Pokedex";
import PokemonDetail from "./pages/PokemonDetail";
import Equipo from "./pages/Equipo";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <TeamProvider>
        <Navbar />
        <main className="flex-1 p-8 max-w-6xl mx-auto w-full max-md:p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokedex" element={<Pokedex />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/equipo" element={<Equipo />} />
          </Routes>
        </main>
      </TeamProvider>
    </BrowserRouter>
  );
}
