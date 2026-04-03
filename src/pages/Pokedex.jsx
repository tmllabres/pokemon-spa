import { useState, useEffect, useRef, useCallback } from "react";
import { getFilteredPokemon, POKEMON_TYPES, REGIONS, SORT_OPTIONS } from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";
import { formatName } from "../utils/format";

const PAGE_SIZE = 20;

export default function Pokedex() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedSort, setSelectedSort] = useState("id-asc");

  const debounceRef = useRef(null);
  const observerRef = useRef();
  const filtersRef = useRef({ query: "", type: "", regionId: null, sort: "id-asc" });
  const offsetRef = useRef(0);

  const hasMore = offset < total;

  const fetchPokemon = useCallback(async (filters, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    try {
      const currentOffset = append ? offsetRef.current : 0;
      const data = await getFilteredPokemon({
        ...filters,
        offset: currentOffset,
        limit: PAGE_SIZE,
      });

      const newOffset = currentOffset + PAGE_SIZE;
      offsetRef.current = newOffset;
      setOffset(newOffset);

      if (append) {
        setPokemon((prev) => [...prev, ...data.results]);
      } else {
        setPokemon(data.results);
      }
      setTotal(data.total);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPokemon(filtersRef.current);
  }, []);

  const applyFilters = useCallback((newFilters) => {
    filtersRef.current = newFilters;
    offsetRef.current = 0;
    fetchPokemon(newFilters, false);
  }, [fetchPokemon]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      applyFilters({ ...filtersRef.current, query: value.trim() });
    }, 400);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    applyFilters({ ...filtersRef.current, type: value });
  };

  const handleRegionChange = (e) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setSelectedRegion(value);
    applyFilters({ ...filtersRef.current, regionId: value });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSelectedSort(value);
    applyFilters({ ...filtersRef.current, sort: value });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedRegion(null);
    setSelectedSort("id-asc");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    applyFilters({ query: "", type: "", regionId: null, sort: "id-asc" });
  };

  const hasActiveFilters = searchQuery.trim() || selectedType || selectedRegion || selectedSort !== "id-asc";

  // Infinite scroll
  const lastCardRef = useCallback(
    (node) => {
      if (loadingMore || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPokemon(filtersRef.current, true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore, fetchPokemon]
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-white text-3xl font-bold text-center mb-6">Pokédex</h1>

      {/* Search */}
      <div className="max-w-md mx-auto mb-4 px-4">
        <input
          type="text"
          placeholder="Buscar por nombre o número..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="block w-full box-border px-4 py-3 rounded-xl border-2 border-surface-dark bg-surface text-gray-200 transition-colors duration-300 focus:border-primary placeholder:text-muted"
        />
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-6 px-4 flex-wrap max-sm:flex-col max-sm:items-stretch">
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="px-4 py-2.5 rounded-xl border-2 border-surface-dark bg-surface text-gray-200 text-sm font-medium transition-colors duration-300 focus:border-primary"
        >
          <option value="">Todos los tipos</option>
          {POKEMON_TYPES.map((type) => (
            <option key={type} value={type}>
              {formatName(type)}
            </option>
          ))}
        </select>

        <select
          value={selectedRegion || ""}
          onChange={handleRegionChange}
          className="px-4 py-2.5 rounded-xl border-2 border-surface-dark bg-surface text-gray-200 text-sm font-medium transition-colors duration-300 focus:border-primary"
        >
          <option value="">Todas las regiones</option>
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSort}
          onChange={handleSortChange}
          className="px-4 py-2.5 rounded-xl border-2 border-surface-dark bg-surface text-gray-200 text-sm font-medium transition-colors duration-300 focus:border-primary"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 rounded-xl border-2 border-primary/30 bg-primary/10 text-primary text-sm font-semibold transition-all duration-300 hover:bg-primary/20 shrink-0"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-muted text-sm text-center mb-4">
          {total} Pokémon encontrados
        </p>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p>Cargando Pokémon...</p>
        </div>
      ) : pokemon.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted text-lg mb-4">No se encontraron Pokémon con esos filtros.</p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:bg-primary-dark"
          >
            Limpiar filtros
          </button>
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
              Has llegado al final — {total} Pokémon en total.
            </p>
          )}
        </>
      )}
    </div>
  );
}
