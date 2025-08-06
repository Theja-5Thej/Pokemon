import { useCallback, useEffect, useRef, useState } from 'react';
import { PokemonCard } from '../Components/PokemonCard';
import { useDebounce } from '../customHooks/debounceSearch';
import type { Pokemon } from '../Types/pokemonTypes';
import axios from 'axios';
import { Link } from 'react-router';
import PokemonNotFound from '../Components/PokemonNotFound';
import { useSelector } from 'react-redux';
import { RootState } from '../store/pokemon';

const LIMIT = 6;


const Home = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 800);
  const observer = useRef<IntersectionObserver | null>(null);
  const collection = useSelector((state: RootState) => state.collection.collection);



  const fetchPokemon = async (name?: string) => {
    setLoading(true);
    try {
      if (name) {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        setPokemonList([res.data]);
        setOffset(0);
      } else {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`);
        const pokemonDetails = await Promise.all(
          res.data.results.map(async (poke: { url: string }) => {
            const details = await axios.get(poke.url);
            return details.data;
          })
        );
        setPokemonList(prev => [...prev, ...pokemonDetails]);
        setOffset(prev => prev + LIMIT);
      }
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      setPokemonList([])
    }
    setLoading(false);
  };

  // Observer to handle infinite scroll
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !debouncedSearch) {
          fetchPokemon();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, debouncedSearch]
  );

  // Initial fetch and on search change
  useEffect(() => {
    if (debouncedSearch.trim()) {
      fetchPokemon(debouncedSearch.trim());
    } else {
      setPokemonList([]);
      setOffset(0);
      fetchPokemon();
    }
  }, [debouncedSearch]);

  return (
    <>
      <header className="flex flex-col items-center pt-4 text-center">
        <h1 className="font-bold text-2xl md:text-4xl">🔥 Pokémon Collection App</h1>
        <p className="font-medium text-md md:text-xl mt-2">
          Discover, collect and organize your favorite Pokémon!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <div className="flex items-center">
            <button
              onClick={() => {
                setShowSearch(prev => !prev);
                if (showSearch) setSearchTerm('')
              }}
              className="bg-fuchsia-600 text-white px-4 cursor-pointer py-2 rounded-full hover:bg-fuchsia-700 transition"
            >
              {showSearch ? "Close" : "🔍 Search"}
            </button>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${showSearch ? "max-w-[400px] opacity-100 ml-2" : "max-w-0 opacity-0"
                }`}
            >
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-full text-sm focus:outline-none w-full"
              />
            </div>
          </div>
          <Link to='mycollections'>
            <button
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full transition" >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
                2.09C13.09 3.81 14.76 3 16.5 
                3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                6.86-8.55 11.54L12 21.35z" />
              </svg>
              My Collection{collection.length >0 && ' (' + collection.length +')'}
            </button>
          </Link>
        </div>
      </header>

      <main className={`px-4 mt-6 xl:px-[100px] 2xl:px-[20vw] mx-auto overflow-y-auto custom-scrollbar h-[74vh] ${(debouncedSearch.length > 0 && (loading || pokemonList.length === 0)) ? '' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'} `}>
        {(debouncedSearch.length > 0 && (loading || pokemonList.length === 0)) ? <PokemonNotFound message={loading ? "Loading.." : "We couldn't find the Pokémon you're looking for.Try again"} /> :
          pokemonList.length > 0 && pokemonList.map((pokemon, idx) => {
            const isLast = idx === pokemonList.length - 1;
            return (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                ref={isLast ? lastElementRef : null}
              />
            );
          })
        }


      </main>
    </>
  );
};

export default Home;
