import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PokemonSummary = {
    id: number;
    name: string;
};

type CollectionState = {
    collection: PokemonSummary[];
};

const initialState: CollectionState = {
    collection: JSON.parse(localStorage.getItem('collection') || '[]'),
};

const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        addToCollection: (state, action: PayloadAction<PokemonSummary>) => {
            if (!state.collection.some(p => p.id === action.payload.id)) {
                state.collection.push(action.payload);
                localStorage.setItem('collection', JSON.stringify(state.collection));
            }
        },
        removeFromCollection: (state, action: PayloadAction<number>) => {
            state.collection = state.collection.filter(p => p.id !== action.payload);
            localStorage.setItem('collection', JSON.stringify(state.collection));
        },
        reorderCollection: (state, action: PayloadAction<PokemonSummary[]>) => {
            state.collection = action.payload;
            localStorage.setItem('collection', JSON.stringify(state.collection));
        },

    },
});

export const { addToCollection, removeFromCollection,reorderCollection } = collectionSlice.actions;

export default collectionSlice.reducer;
