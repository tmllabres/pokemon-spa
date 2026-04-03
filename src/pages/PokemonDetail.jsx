import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPokemonDetail } from "../services/pokemonService";
import { useTeam } from "../context/TeamContext";
import { typeBgColors, typeBgFaded } from "../utils/typeColors";
import { formatName } from "../utils/format";

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToTeam, removeFromTeam, isInTeam, isTeamFull } = useTeam();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getPokemonDetail(id)
      .then(setPokemon)
      .catch(() => setError("No se pudo cargar el Pokémon."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="text-center py-16">
        <h2 className="text-primary text-2xl font-bold mb-4">
          {error || "Pokémon no encontrado"}
        </h2>
        <button
          onClick={() => navigate("/pokedex")}
          className="px-4 py-2 rounded-xl border-2 border-surface-dark bg-surface text-gray-200 font-semibold transition-all duration-300 hover:border-primary hover:text-primary"
        >
          Volver a la Pokédex
        </button>
      </div>
    );
  }

  const inTeam = isInTeam(pokemon.id);
  const teamFull = isTeamFull();
  const mainType = pokemon.types[0];

  const statNames = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defensa",
    "special-attack": "At. Esp.",
    "special-defense": "Def. Esp.",
    speed: "Velocidad",
  };

  const getStatColor = (value) => {
    if (value < 30) return "#a63a3a";
    if (value < 60) return "#a66a3a";
    if (value < 90) return "#a6943a";
    if (value < 120) return "#5a9a50";
    if (value < 150) return "#3a8a7a";
    return "#3a6a9a";
  };

  const handleTeamToggle = () => {
    if (inTeam) {
      removeFromTeam(pokemon.id);
    } else if (!teamFull) {
      addToTeam({
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
      });
    }
  };

  const getButtonProps = () => {
    if (inTeam) return { text: "★ Quitar del equipo", style: "bg-primary border-primary text-white hover:bg-primary-dark" };
    if (teamFull) return { text: "Equipo completo", style: "bg-transparent border-surface-dark text-muted/50 cursor-not-allowed" };
    return { text: "☆ Añadir al equipo", style: "bg-transparent border-surface-dark text-muted hover:border-primary hover:text-primary" };
  };

  const btn = getButtonProps();

  return (
    <div className={`max-w-3xl mx-auto rounded-2xl p-4 max-sm:p-2 ${typeBgFaded[mainType] || ""}`}>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-xl border-2 border-surface-dark bg-surface text-gray-200 font-semibold mb-6 transition-all duration-300 hover:border-primary hover:text-primary"
      >
        ← Volver
      </button>

      <div className="flex gap-8 items-center mb-8 max-md:flex-col max-md:text-center">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-64 h-64 object-contain drop-shadow-2xl animate-float max-md:w-48 max-md:h-48"
        />
        <div className="flex-1">
          <span className="text-gray-500 text-xl font-bold">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          <h1 className="text-white text-4xl font-bold mt-1 mb-3 max-md:text-3xl max-sm:text-2xl">
            {formatName(pokemon.name)}
          </h1>
          <div className="flex gap-2 flex-wrap max-md:justify-center mb-4">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${typeBgColors[type]}`}
              >
                {formatName(type)}
              </span>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed mb-4">
            {pokemon.description}
          </p>
          <button
            className={`px-6 py-2.5 rounded-full font-semibold text-base border-2 transition-all duration-300 ${btn.style}`}
            onClick={handleTeamToggle}
            disabled={teamFull && !inTeam}
          >
            {btn.text}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <div className="bg-surface rounded-2xl p-6">
          <h3 className="text-primary font-semibold mb-4 pb-2 border-b border-surface-dark">
            Datos
          </h3>
          <div className="flex gap-8 max-sm:gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-muted text-sm">Altura</span>
              <span className="text-white text-xl font-semibold">{pokemon.height} m</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted text-sm">Peso</span>
              <span className="text-white text-xl font-semibold">{pokemon.weight} kg</span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6">
          <h3 className="text-primary font-semibold mb-4 pb-2 border-b border-surface-dark">
            Habilidades
          </h3>
          <div className="flex gap-2 flex-wrap">
            {pokemon.abilities.map((ability) => (
              <span
                key={ability}
                className="px-3 py-1.5 rounded-xl bg-surface-dark text-gray-200 text-sm select-none"
              >
                {formatName(ability)}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 col-span-2 max-md:col-span-1">
          <h3 className="text-primary font-semibold mb-4 pb-2 border-b border-surface-dark">
            Estadísticas Base
          </h3>
          <div className="flex flex-col gap-4">
            {pokemon.stats.map((stat) => (
              <div key={stat.name} className="grid grid-cols-[90px_40px_1fr] gap-3 items-center max-md:grid-cols-[70px_35px_1fr]">
                <span className="text-muted text-sm text-right">
                  {statNames[stat.name] || stat.name}
                </span>
                <span className="text-white font-bold text-sm">
                  {stat.value}
                </span>
                <div className="h-5 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min((stat.value / 255) * 100, 100)}%`,
                      backgroundColor: getStatColor(stat.value),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
