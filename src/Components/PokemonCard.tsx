import React, { forwardRef } from 'react';
import type { Pokemon } from '../Types/pokemonTypes';
import { useDispatch, useSelector } from 'react-redux';
import { addToCollection, removeFromCollection } from '../store/slices/collectionSlice';
import type { RootState } from '../store/pokemon';

type Props = {
    pokemon: Pokemon;
    dragHandleProps?: any;
    isDragging?:boolean
};
const typeColors: { [key: string]: string } = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-400 text-black',
    ice: 'bg-cyan-300 text-black',
    fighting: 'bg-orange-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-300 text-black',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500 text-black',
    rock: 'bg-yellow-800',
    ghost: 'bg-indigo-700',
    dark: 'bg-gray-800',
    dragon: 'bg-indigo-600',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300 text-black',
};


export const PokemonCard = forwardRef<HTMLDivElement, Props>(({ pokemon, dragHandleProps,isDragging }, ref?) => {
    const statMap = pokemon.stats.reduce((acc: Record<string, number>, stat: any) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
    }, {});
    const dispatch = useDispatch();
    const collection = useSelector((state: RootState) => state.collection.collection);
    const isInCollection = collection.some(p => p.id === pokemon.id);

    const handleClick = () => {
        if (isInCollection) {
            dispatch(removeFromCollection(pokemon.id));
        } else {
            dispatch(addToCollection({ id: pokemon.id, name: pokemon.name }));
        }
    };
    return (
        <div ref={ref}  className={`bg-white p-4 rounded-xl max-h-[220px] shadow text-center max-w-sm min-w-[280px] md:min-w-0 relative transition-transform duration-300 ${
          isDragging ? 'ring-2 ring-fuchsia-600 scale-105' : ''
        }`}>
            <button
                onClick={handleClick}
                className={`text-white px-3 z-40 py-1 rounded-full hover:opacity-90 cursor-pointer absolute top-[16px] right-[16px] ${isInCollection ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
            >
                {isInCollection ? '×' : '+'}
            </button>
            {dragHandleProps && <div
                {...dragHandleProps}
                className="absolute left-2 top-2 cursor-grab text-gray-400 hover:text-black"
            >
                ⠿
            </div>}

            <div className='w-[80px] h-[80px] mx-auto rounded-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-300'>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} className="mx-auto w-[80px] h-[80px]" />
            </div>

            <h2 className="capitalize text-gray-500 font-bold mt-2">{pokemon.name}</h2>
            <p className="text-sm text-gray-500 flex flex-wrap gap-2 justify-center mt-2">
                {pokemon.types.map((t, index) => (
                    <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-white text-xs ${typeColors[t.type.name]}`}
                    >
                        {t.type.name}
                    </span>
                ))}
            </p>
            <div className='flex  px-0 md:px-5 justify-between items-center text-xs mt-3 text-gray-500'>
                <div>
                    <p>HP</p>
                    <p>{statMap.hp}</p>
                </div>
                <div>
                    <p>Attack</p>
                    <p>{statMap.attack}</p>
                </div>
                <div>
                    <p>Defense</p>
                    <p>{statMap.defense}</p>
                </div>

            </div>
        </div>
    );
});

// Set display name to avoid dev warning
PokemonCard.displayName = 'PokemonCard';
