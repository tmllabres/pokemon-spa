import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomPokemon } from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getRandomPokemon(6)
      .then(setFeatured)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    setSearchError("");
    navigate(`/pokemon/${q}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-12 px-4">
        <h1 className="text-5xl font-bold text-white mb-2 max-md:text-3xl">
          Bienvenido a la Pokédex
        </h1>
        <p className="text-lg text-muted mb-8">
          Explora, busca y construye tu equipo Pokémon ideal
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto px-4 max-sm:flex-col">
          <input
            type="text"
            placeholder="Buscar por nombre o número..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-0 box-border px-4 py-3 rounded-xl border-2 border-surface-dark bg-surface text-gray-200 transition-colors duration-300 focus:border-primary placeholder:text-muted"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5"
          >
            Buscar
          </button>
        </form>
        {searchError && (
          <p className="text-primary mt-4 text-sm">{searchError}</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Pokémon Destacados
        </h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p>Cargando Pokémon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
            {featured.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
