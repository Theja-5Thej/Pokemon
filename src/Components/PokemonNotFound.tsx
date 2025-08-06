type Props = {
  message?: string;
};
const PokemonNotFound = ({ message = "We couldn't find the Pokémon you're looking for." }: Props) => {
    return (
        <div className="flex flex-col max-h-[280px]  items-center justify-center w-full text-center bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10">
            <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Pokeball"
                className="w-20 h-20 mb-4 animate-bounce"
            />
            <p className="text-sm text-gray-500 mb-4">
               {message}
            </p>
        </div>
    );
};

export default PokemonNotFound;
