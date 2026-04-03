import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMenuOpen(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const linkClass = ({ isActive }) =>
    `font-medium pb-1 border-b-2 transition-colors duration-300 ${
      isActive
        ? "text-primary border-primary"
        : "text-muted border-transparent hover:text-primary hover:border-primary"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block py-3 px-4 rounded-xl text-base font-medium transition-colors duration-200 ${
      isActive
        ? "text-primary bg-surface-dark"
        : "text-muted hover:text-primary hover:bg-surface-dark"
    }`;

  return (
    <nav className="bg-surface sticky top-0 z-50 border-b-2 border-surface-dark shadow-lg shadow-black/30">
      <div className="flex items-center justify-between h-16 px-8 max-sm:px-4">
        <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Pokeball"
            className="w-8 h-8 animate-spin-slow"
          />
          <span>Pokédex</span>
        </NavLink>

        {/* Desktop links */}
        <div className="flex items-center gap-6 max-sm:hidden">
          <NavLink to="/" end className={linkClass}>
            Inicio
          </NavLink>
          <NavLink to="/pokedex" className={linkClass}>
            Pokédex
          </NavLink>
          <NavLink to="/equipo" className={linkClass}>
            Mi Equipo
          </NavLink>
        </div>

        {/* Hamburger button */}
        <button
          className="hidden max-sm:flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`hidden max-sm:block overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-60" : "max-h-0"}`}>
        <div className="flex flex-col gap-1 px-4 pb-4">
          <NavLink to="/" end className={mobileLinkClass} onClick={closeMobileMenu}>
            Inicio
          </NavLink>
          <NavLink to="/pokedex" className={mobileLinkClass} onClick={closeMobileMenu}>
            Pokédex
          </NavLink>
          <NavLink to="/equipo" className={mobileLinkClass} onClick={closeMobileMenu}>
            Mi Equipo
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
