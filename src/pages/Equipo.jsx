import { useNavigate } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import { typeBgColors } from "../utils/typeColors";
import { formatName } from "../utils/format";

export default function Equipo() {
  const { team, removeFromTeam, MAX_TEAM_SIZE } = useTeam();
  const navigate = useNavigate();

  const isFull = team.length >= MAX_TEAM_SIZE;

  const emptySlots = Array.from(
    { length: MAX_TEAM_SIZE - team.length },
    (_, i) => i
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-white text-3xl font-bold text-center mb-2">Mi Equipo</h1>

      {isFull && (
        <p className="text-center text-primary font-semibold mb-6">
          ¡Ya tienes todos los Pokémon en tu equipo!
        </p>
      )}

      {!isFull && team.length > 0 && (
        <p className="text-center text-muted mb-6">
          Aún puedes añadir {MAX_TEAM_SIZE - team.length} Pokémon más
        </p>
      )}

      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto max-md:grid-cols-2 max-sm:grid-cols-1">
        {team.map((pokemon) => (
          <div
            key={pokemon.id}
            className="relative bg-surface rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-55 border-2 border-transparent transition-colors duration-300 overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${typeBgColors[pokemon.types[0]]}`} />

            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-24 h-24 object-contain cursor-pointer drop-shadow-lg transition-transform duration-300 hover:scale-110"
              onClick={() => navigate(`/pokemon/${pokemon.id}`)}
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
            <button
              className="mt-3 px-4 py-1.5 rounded-full border-2 border-primary bg-transparent text-primary text-sm font-semibold transition-all duration-300 hover:bg-primary hover:text-white"
              onClick={() => removeFromTeam(pokemon.id)}
            >
              ✕ Quitar
            </button>
          </div>
        ))}

        {emptySlots.map((i) => (
          <div
            key={`empty-${i}`}
            className="bg-surface rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-55 border-2 border-dashed border-surface-dark opacity-50"
          >
            <div className="w-16 h-16 rounded-full border-3 border-dashed border-surface-dark flex items-center justify-center text-2xl text-surface-dark mb-2">
              ?
            </div>
            <p className="text-muted">Slot vacío</p>
          </div>
        ))}
      </div>

      {team.length === 0 && (
        <div className="text-center mt-8 text-muted">
          <p className="text-xl mb-4">¡Tu equipo está vacío!</p>
          <button
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5"
            onClick={() => navigate("/pokedex")}
          >
            Ir a la Pokédex
          </button>
        </div>
      )}
    </div>
  );
}
