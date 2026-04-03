import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `font-medium pb-1 border-b-2 transition-colors duration-300 ${
      isActive
        ? "text-primary border-primary"
        : "text-muted border-transparent hover:text-primary hover:border-primary"
    }`;

  return (
    <nav className="bg-surface sticky top-0 z-50 flex items-center justify-between h-16 px-8 border-b-2 border-surface-dark shadow-lg shadow-black/30">
      <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          alt="Pokeball"
          className="w-8 h-8 animate-spin-slow"
        />
        <span>Pokédex</span>
      </NavLink>

      <div className="flex items-center gap-6">
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
    </nav>
  );
}
