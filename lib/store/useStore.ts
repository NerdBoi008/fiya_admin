import { Category, Product } from "@/types";
import { create } from "zustand";

interface StroreState {
    categories: Category[] | null;
    products: Product[] | null;
    fetchCategories: () => Promise<boolean>;
    fetchProducts: () => Promise<boolean>;
}

const useStore = create<StroreState>((set) => ({
    categories: null,
    products: null,

    fetchCategories: async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            set({ categories: data });
            return true;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return false;
        }
    },

    fetchProducts: async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            set({ products: data });
            return true;
        } catch (error) {
            console.error("Error fetching products:", error);
            return false;
        }
    },
}));

export default useStore;