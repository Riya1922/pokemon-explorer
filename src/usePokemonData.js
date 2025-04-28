// src/usePokemonData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const usePokemonData = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch the list of Pokémon (basic data)
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
        const pokemonList = response.data.results;

        // Step 2: Fetch detailed data for each Pokémon
        const detailedPokemons = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const pokemonData = await axios.get(pokemon.url);
            return {
              id: pokemonData.data.id,
              name: pokemonData.data.name,
              sprite: pokemonData.data.sprites.front_default,
              types: pokemonData.data.types.map((type) => type.type.name),
            };
          })
        );

        setPokemons(detailedPokemons);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { pokemons, loading, error };
};

export default usePokemonData;
