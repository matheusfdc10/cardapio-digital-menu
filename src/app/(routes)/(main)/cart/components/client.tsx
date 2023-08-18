"use client"
import useCart from "@/hooks/useCart";
import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import Summary from "./Summary";
import { Restaurant } from "@/types";

interface CartClientProps {
    restaurant: Restaurant
}

const CartClient: React.FC<CartClientProps> = ({
    restaurant
}) => {
    const cart = useCart();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <div className="sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-black">Seu pedido</h1>
            <div className="mt-4 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                <div className="lg:col-span-7">
                    {cart.items.length === 0 && (
                        <p className="text-neutral-500 text-center">
                            Não possui itens.
                        </p>
                    )}

                    <ul>
                        {cart.items.map((item, index) => (
                            <CartItem 
                                key={item.id}
                                data={item}
                                index={index}
                            />
                        ))}
                    </ul>
                </div>
                <Summary restaurant={restaurant}/>
            </div>
        </div>
    )
}

export default CartClient;