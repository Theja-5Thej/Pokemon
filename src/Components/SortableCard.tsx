import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PokemonCard } from './PokemonCard';
import type { Pokemon } from '../Types/pokemonTypes';
import { CSSProperties } from 'react';

type Props = {
    pokemon: Pokemon;
};

export const SortableCard = ({ pokemon }: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        setActivatorNodeRef, // <- NEW: for drag handle
    } = useSortable({ id: pokemon.id });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        zIndex: isDragging ? 50 : 'auto',
        position: isDragging ? 'relative' : 'static',
    };

    return (
        <div ref={setNodeRef} style={style}>
            <PokemonCard
                pokemon={pokemon}
                dragHandleProps={{
                    ref: setActivatorNodeRef,
                    ...attributes,
                    ...listeners,
                }}
            />
        </div>
    );
};
