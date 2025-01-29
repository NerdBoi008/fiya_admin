import { Category, Product } from "@/types";
import { create } from "zustand";

interface StroreState {
    categories: Category[];
    products: Product[];
    fetchCategories: () => void;
    fetchProducts: () => void;
}

const useStore = create<StroreState>((set) => ({
    categories: [],
    products: [],

    fetchCategories: async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            set({ categories: data });
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    },

    fetchProducts: async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            set({ products: data });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    },
}));

export default useStore;