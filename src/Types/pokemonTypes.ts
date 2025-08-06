export type Pokemon = {
    id: number;
    name: string;
    sprites: {
        front_default: string;
    };
    types: { type: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
};
export type PokemonSummary = {
  id: number;
  name: string;
};
