import { useNavigate } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import { typeBgColors, typeBorderColors } from "../utils/typeColors";
import { formatName } from "../utils/format";

export default function PokemonCard({ pokemon }) {
  const navigate = useNavigate();
  const { addToTeam, removeFromTeam, isInTeam, isTeamFull } = useTeam();

  const inTeam = isInTeam(pokemon.id);
  const teamFull = isTeamFull();
  const mainType = pokemon.types[0];

  const handleClick = () => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  const handleTeamToggle = (e) => {
    e.stopPropagation();
    if (inTeam) {
      removeFromTeam(pokemon.id);
    } else if (!teamFull) {
      addToTeam(pokemon);
    }
  };

  const getButtonContent = () => {
    if (inTeam) return { text: "★ En equipo", style: "bg-primary border-primary text-white hover:bg-primary-dark" };
    if (teamFull) return { text: "Equipo completo", style: "bg-transparent border-surface-dark text-muted/50 cursor-not-allowed" };
    return { text: "☆ Añadir", style: "bg-transparent border-surface-dark text-muted hover:border-primary hover:text-primary" };
  };

  const btn = getButtonContent();

  return (
    <div
      className={`relative bg-surface rounded-2xl p-6 pt-8 text-center cursor-pointer border-2 border-transparent transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/30 hover:${typeBorderColors[mainType]}`}
      onClick={handleClick}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${typeBgColors[mainType]}`} />

      <span className="absolute top-3 right-3 text-xs font-bold text-gray-500">
        #{String(pokemon.id).padStart(3, "0")}
      </span>

      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="w-28 h-28 max-sm:w-20 max-sm:h-20 mx-auto object-contain drop-shadow-lg transition-transform duration-300 hover:scale-110"
      />

      <h3 className="text-white text-lg font-semibold mt-2">
        {formatName(pokemon.name)}
      </h3>

      <div className="flex gap-1.5 justify-center flex-wrap mt-2">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className={`px-3 py-0.5 rounded-full text-xs font-semibold text-white ${typeBgColors[type]}`}
          >
            {formatName(type)}
          </span>
        ))}
      </div>

      {pokemon.totalStats != null && (
        <p className="text-muted text-xs font-bold mt-2">
          {pokemon.totalStats} <span className="text-muted/60">BTS</span>
        </p>
      )}

      <button
        className={`mt-3 px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${btn.style}`}
        onClick={handleTeamToggle}
        disabled={teamFull && !inTeam}
        title={teamFull && !inTeam ? "Ya tienes todos los Pokémon en tu equipo" : inTeam ? "Quitar del equipo" : "Añadir al equipo"}
      >
        {btn.text}
      </button>
    </div>
  );
}
