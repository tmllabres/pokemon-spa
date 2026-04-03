import { createContext, useContext, useState } from "react";

const TeamContext = createContext();
const MAX_TEAM_SIZE = 6;

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);

  const addToTeam = (pokemon) => {
    setTeam((prev) => {
      if (prev.length >= MAX_TEAM_SIZE) return prev;
      if (prev.some((p) => p.id === pokemon.id)) return prev;
      return [...prev, pokemon];
    });
  };

  const removeFromTeam = (pokemonId) => {
    setTeam((prev) => prev.filter((p) => p.id !== pokemonId));
  };

  const isInTeam = (pokemonId) => {
    return team.some((p) => p.id === pokemonId);
  };

  const isTeamFull = () => {
    return team.length >= MAX_TEAM_SIZE;
  };

  return (
    <TeamContext.Provider
      value={{ team, addToTeam, removeFromTeam, isInTeam, isTeamFull, MAX_TEAM_SIZE }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam debe usarse dentro de un TeamProvider");
  }
  return context;
}
