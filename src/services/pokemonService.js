const BASE_URL = "https://pokeapi.co/api/v2";

export const POKEMON_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

export const REGIONS = [
  { id: 1, name: "Kanto", range: [1, 151] },
  { id: 2, name: "Johto", range: [152, 251] },
  { id: 3, name: "Hoenn", range: [252, 386] },
  { id: 4, name: "Sinnoh", range: [387, 493] },
  { id: 5, name: "Unova", range: [494, 649] },
  { id: 6, name: "Kalos", range: [650, 721] },
  { id: 7, name: "Alola", range: [722, 809] },
  { id: 8, name: "Galar", range: [810, 898] },
  { id: 9, name: "Paldea", range: [899, 1025] },
];

let allPokemonNamesCache = null;

async function getAllPokemonNames() {
  if (allPokemonNamesCache) return allPokemonNamesCache;

  const res = await fetch(`${BASE_URL}/pokemon?limit=1025`);
  const data = await res.json();
  allPokemonNamesCache = data.results.map((p, i) => ({
    name: p.name,
    id: i + 1,
    url: p.url,
  }));
  return allPokemonNamesCache;
}

// Type index: { pokemonId: ["fire", "flying"] }
let typeIndexCache = null;

async function getTypeIndex() {
  if (typeIndexCache) return typeIndexCache;

  const typeData = await Promise.all(
    POKEMON_TYPES.map(async (type) => {
      const res = await fetch(`${BASE_URL}/type/${type}`);
      const data = await res.json();
      return {
        type,
        ids: data.pokemon
          .map((p) => parseInt(p.pokemon.url.split("/").filter(Boolean).pop()))
          .filter((id) => id <= 1025),
      };
    })
  );

  typeIndexCache = {};
  typeData.forEach(({ type, ids }) => {
    ids.forEach((id) => {
      if (!typeIndexCache[id]) typeIndexCache[id] = [];
      typeIndexCache[id].push(type);
    });
  });

  return typeIndexCache;
}

// Cache individual Pokemon basic info
const basicCache = new Map();

async function getPokemonBasic(entry) {
  if (basicCache.has(entry.id)) return basicCache.get(entry.id);

  const res = await fetch(entry.url);
  const data = await res.json();
  const result = {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default,
    types: data.types.map((t) => t.type.name),
    totalStats: data.stats.reduce((sum, s) => sum + s.base_stat, 0),
  };
  basicCache.set(entry.id, result);
  return result;
}

export const SORT_OPTIONS = [
  { value: "id-asc", label: "# Menor a Mayor" },
  { value: "id-desc", label: "# Mayor a Menor" },
  { value: "name-asc", label: "A → Z" },
  { value: "name-desc", label: "Z → A" },
  { value: "stats-desc", label: "Stats ↓" },
  { value: "stats-asc", label: "Stats ↑" },
];

export async function getFilteredPokemon({ query = "", type = "", regionId = null, sort = "id-asc", offset = 0, limit = 20 }) {
  const allPokemon = await getAllPokemonNames();
  const typeIndex = type ? await getTypeIndex() : null;

  let filtered = allPokemon;

  // Filter by region
  if (regionId) {
    const region = REGIONS.find((r) => r.id === regionId);
    if (region) {
      filtered = filtered.filter((p) => p.id >= region.range[0] && p.id <= region.range[1]);
    }
  }

  // Filter by type
  if (type && typeIndex) {
    filtered = filtered.filter((p) => typeIndex[p.id]?.includes(type));
  }

  // Filter by name or number
  if (query) {
    const q = query.toLowerCase().trim();
    const numQuery = parseInt(q);
    filtered = filtered.filter(
      (p) => p.name.includes(q) || (!isNaN(numQuery) && p.id === numQuery)
    );
  }

  // For name sort, we can sort before fetching details
  if (sort === "name-asc") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === "id-desc") {
    filtered = [...filtered].sort((a, b) => b.id - a.id);
  }
  // id-asc is the default order, no need to sort

  // For stats sort, we need to fetch ALL filtered results first, sort, then paginate
  if (sort === "stats-asc" || sort === "stats-desc") {
    const allResults = await Promise.all(filtered.map((p) => getPokemonBasic(p)));
    allResults.sort((a, b) =>
      sort === "stats-desc" ? b.totalStats - a.totalStats : a.totalStats - b.totalStats
    );
    const total = allResults.length;
    const page = allResults.slice(offset, offset + limit);
    return { results: page, total };
  }

  const total = filtered.length;
  const page = filtered.slice(offset, offset + limit);

  const results = await Promise.all(page.map((p) => getPokemonBasic(p)));

  return { results, total };
}

export async function getPokemonList(offset = 0, limit = 20) {
  const res = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  const data = await res.json();

  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon) => {
      const detail = await fetch(pokemon.url);
      const detailData = await detail.json();
      return {
        id: detailData.id,
        name: detailData.name,
        image:
          detailData.sprites.other["official-artwork"].front_default ||
          detailData.sprites.front_default,
        types: detailData.types.map((t) => t.type.name),
        totalStats: detailData.stats.reduce((sum, s) => sum + s.base_stat, 0),
      };
    })
  );

  return {
    count: data.count,
    results: pokemonDetails,
  };
}

export async function getPokemonDetail(nameOrId) {
  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`${BASE_URL}/pokemon/${nameOrId}`),
    fetch(`${BASE_URL}/pokemon-species/${nameOrId}`),
  ]);

  if (!pokemonRes.ok) throw new Error("Pokémon no encontrado");

  const pokemon = await pokemonRes.json();
  const species = speciesRes.ok ? await speciesRes.json() : null;

  const descriptionEntry = species?.flavor_text_entries?.find(
    (entry) => entry.language.name === "es"
  ) ||
    species?.flavor_text_entries?.find(
      (entry) => entry.language.name === "en"
    );

  return {
    id: pokemon.id,
    name: pokemon.name,
    image:
      pokemon.sprites.other["official-artwork"].front_default ||
      pokemon.sprites.front_default,
    types: pokemon.types.map((t) => t.type.name),
    stats: pokemon.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    abilities: pokemon.abilities.map((a) => a.ability.name),
    description: descriptionEntry
      ? descriptionEntry.flavor_text.replace(/\f|\n/g, " ")
      : "Sin descripción disponible.",
  };
}

export async function searchPokemon(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const allNames = await getAllPokemonNames();
  const matches = allNames.filter((p) => p.name.includes(q)).slice(0, 12);

  if (matches.length === 0) return [];

  const results = await Promise.all(
    matches.map(async (match) => {
      const res = await fetch(match.url);
      const data = await res.json();
      return {
        id: data.id,
        name: data.name,
        image:
          data.sprites.other["official-artwork"].front_default ||
          data.sprites.front_default,
        types: data.types.map((t) => t.type.name),
        totalStats: data.stats.reduce((sum, s) => sum + s.base_stat, 0),
      };
    })
  );

  return results;
}

export async function getRandomPokemon(count = 6) {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * 898) + 1);
  }

  const results = await Promise.all(
    [...ids].map(async (id) => {
      const res = await fetch(`${BASE_URL}/pokemon/${id}`);
      const data = await res.json();
      return {
        id: data.id,
        name: data.name,
        image:
          data.sprites.other["official-artwork"].front_default ||
          data.sprites.front_default,
        types: data.types.map((t) => t.type.name),
        totalStats: data.stats.reduce((sum, s) => sum + s.base_stat, 0),
      };
    })
  );

  return results;
}
