import create from 'zustand';
import {persist } from 'zustand/middleware';

let appStore = (set) => ({
    dopen:true,
    rows:[],
    gridWiseData:[],
    setRows: (rows) => set((state)=>({rows:rows})),
    updateOpen: (dopen) => set((state)=>({dopen:dopen})),
    setGridWiseData: (grid) => set((state)=>({grid:grid})),
});

appStore = persist(appStore, {name: "my_app_store"});
export const useAppStore = create(appStore);