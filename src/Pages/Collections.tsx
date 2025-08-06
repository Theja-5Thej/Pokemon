import { RootState } from "../store/pokemon";
import { useEffect, useState } from "react";
import { Pokemon, PokemonSummary } from "../Types/pokemonTypes";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';

import { SortableCard } from "../Components/SortableCard";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { reorderCollection } from "../store/slices/collectionSlice";
import { Link } from "react-router";
import PokemonNotFound from "../Components/PokemonNotFound";

const Collections = () => {
  const [data, setData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const collection = useSelector((state: RootState) => state.collection.collection);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const promises = collection.map((item: PokemonSummary) =>
        axios.get(`https://pokeapi.co/api/v2/pokemon/${item.id}`).then(res => res.data)
      );
      const results: Pokemon[] = await Promise.all(promises);
      setData(results);
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (collection.length > 0) {
      fetchData();
    } else {
      setData([]);
    }
  }, [collection]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = collection.findIndex(p => p.id === active.id);
    const newIndex = collection.findIndex(p => p.id === over.id);
    const newOrder = arrayMove(collection, oldIndex, newIndex);

    dispatch(reorderCollection(newOrder));
  };

  return (
    <div>
      <header className="flex flex-col items-center pt-4 text-center">
        <h1 className="font-bold text-2xl md:text-4xl">❤️ My Pokémon Collection </h1>
        <p className="font-medium text-md md:text-xl mt-2">
          🪄 Drag & Drop to Reorder Based on Your Priority
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
        >
          🏠 Go to Home
        </Link>
      </header>

      <main className="px-4 mt-6 xl:px-[100px] 2xl:px-[20vw] mx-auto overflow-y-auto custom-scrollbar h-[74vh]">
        {loading ? (
          <p className="text-center text-sm text-gray-500">Loading...</p>
        ) : data.length === 0 ? (<PokemonNotFound message="Your collection is empty. Start adding your favorite Pokémon!"/>) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={collection.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.map((pokemon) => (
                  <SortableCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </main>
    </div>
  );
};

export default Collections;
