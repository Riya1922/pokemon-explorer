import React, { useState, useEffect } from 'react';
import './App.css';

// Helper function to fetch Pokémon data
const fetchPokemons = async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
    const data = await response.json();
    const pokemons = await Promise.all(data.results.map(async (pokemon) => {
      // Fetch additional data for each Pokémon (like id and types)
      const res = await fetch(pokemon.url);
      const pokemonData = await res.json();
      return {
        id: pokemonData.id,
        name: pokemonData.name,
        types: pokemonData.types.map((type) => type.type.name), // Extracting types
      };
    }));
    return pokemons;
  } catch (error) {
    throw new Error('Error fetching Pokémon data');
  }
};

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [error, setError] = useState(null);

  // Fetch Pokémon data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const pokemonsData = await fetchPokemons();
        setPokemons(pokemonsData);
        setFilteredPokemons(pokemonsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle filter dropdown change
  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  // Filtering function for both search term and type filter
  useEffect(() => {
    let filtered = pokemons;

    // Filter by name (search term)
    if (searchTerm) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== 'All') {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.includes(typeFilter)
      );
    }

    setFilteredPokemons(filtered);
  }, [searchTerm, typeFilter, pokemons]);

  // Render loading, error, or content based on the state
  if (loading) {
    return <p className="loading">Loading Pokémon...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (filteredPokemons.length === 0) {
    return <p className="no-results">No Pokémon found!</p>;
  }

  return (
    <div className="App">
      <header>
        <h1>Pokémon Explorer</h1>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Search Pokémon by name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={typeFilter} onChange={handleTypeFilterChange}>
          <option value="All">All Types</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          <option value="electric">Electric</option>
          <option value="bug">Bug</option>
          <option value="normal">Normal</option>
          <option value="poison">Poison</option>
          <option value="ghost">Ghost</option>
          {/* Add more types as necessary */}
        </select>
      </div>

      <div className="pokemon-list">
        {filteredPokemons.map((pokemon) => (
          <div className="pokemon-card" key={pokemon.id}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
              alt={pokemon.name}
            />
            <h3>{pokemon.name}</h3>
            <p>ID: {pokemon.id}</p>
            <div className="types">
              {pokemon.types.map((type) => (
                <span key={type} className="type">
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
