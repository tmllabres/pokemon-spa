const BASE_URL = "https://pokeapi.co/api/v2";

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
      };
    })
  );

  return results;
}
