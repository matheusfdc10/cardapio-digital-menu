import { toast } from "@/components/ui/use-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AdditionalItem {
    id: string;
    name: string;
    price: number;
    amount: number;
}

interface Product {
    id: string;
    name: string;
    url: string;
    price: number
    comment: string;
    amount: number;
    additionalItems: AdditionalItem[];
}

interface CartMenu {
    items: Product[];
    addItem: (data: Product) => void;
    removeItem: (index: number) => void;
    removeAll: () => void;
}

const useCart = create(
    persist<CartMenu>((set, get) => ({
        items: [],
        addItem: (data: Product) => {
            const currentItems = get().items;
            // const existingItem = currentItems.find((item) => item.id === data.id);

            // if (existingItem) {
            //     return toast({
            //         title: 'Item já no carrinho.'
            //     });
            // }

            set({ items: [...get().items, data] });
            // toast({
            //     title: 'Item adicionado no carrinho.'
            // });
        },
    removeItem: (index: number) => {
        set({ items: [...get().items.filter((item, i) => i !== index)] });
        // toast({
        //     title: 'Item removido do carrinho'
        // });
    },
    removeAll: () => set({ items: []}),
    }), {
        name: "cart-storage",
        storage: createJSONStorage(() => localStorage)
    })
)

export default useCart;