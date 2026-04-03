import { useState, useEffect, useRef, useCallback } from "react";
import { getPokemonList, searchPokemon } from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";

const PAGE_SIZE = 20;

export default function Pokedex() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const debounceRef = useRef(null);
  const observerRef = useRef();

  const lastCardRef = useCallback(
    (node) => {
      if (loadingMore || searchQuery) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore, searchQuery]
  );

  useEffect(() => {
    getPokemonList(0, PAGE_SIZE)
      .then((data) => {
        setPokemon(data.results);
        setOffset(PAGE_SIZE);
        setHasMore(PAGE_SIZE < data.count);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    getPokemonList(offset, PAGE_SIZE)
      .then((data) => {
        setPokemon((prev) => [...prev, ...data.results]);
        setOffset((prev) => prev + PAGE_SIZE);
        setHasMore(offset + PAGE_SIZE < data.count);
      })
      .finally(() => setLoadingMore(false));
  }, [offset]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSearchResults([]);
      setSearchError("");
      setSearching(false);
      return;
    }

    setSearching(true);
    setSearchError("");

    debounceRef.current = setTimeout(async () => {
      const results = await searchPokemon(value);
      if (results.length > 0) {
        setSearchResults(results);
        setSearchError("");
      } else {
        setSearchResults([]);
        setSearchError(`No se encontró ningún Pokémon con "${value}".`);
      }
      setSearching(false);
    }, 500);
  };

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-white text-3xl font-bold text-center mb-6">Pokédex</h1>

      <div className="max-w-md mx-auto mb-8 px-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="block w-full box-border px-4 py-3 rounded-xl border-2 border-surface-dark bg-surface text-gray-200 transition-colors duration-300 focus:border-primary placeholder:text-muted"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p>Cargando Pokémon...</p>
        </div>
      ) : isSearchActive ? (
        <div>
          {searching ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p>Buscando...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
              {searchResults.map((p) => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>
          ) : searchError ? (
            <p className="text-center text-muted text-lg mt-8">{searchError}</p>
          ) : null}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
            {pokemon.map((p, index) => (
              <div
                key={p.id}
                ref={index === pokemon.length - 1 ? lastCardRef : null}
              >
                <PokemonCard pokemon={p} />
              </div>
            ))}
          </div>

          {loadingMore && (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-muted">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p>Cargando más Pokémon...</p>
            </div>
          )}

          {!hasMore && pokemon.length > 0 && (
            <p className="text-center text-muted text-sm mt-8">
              Has llegado al final de la Pokédex.
            </p>
          )}
        </>
      )}
    </div>
  );
}
