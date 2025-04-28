
const PokemonCard = ({ name, sprite, types, id }) => {
    return (
      <div className="pokemon-card">
        <img src={sprite} alt={name} />
        <h3>{name}</h3>
        <p>ID: {id}</p>
        <p>Types: {types.join(', ')}</p>
      </div>
    );
  };
  
  export default PokemonCard;
  