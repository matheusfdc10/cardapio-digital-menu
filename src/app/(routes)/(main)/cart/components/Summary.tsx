"use client"

import OrderModal from "@/components/modals/OrderModal";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { Restaurant } from "@/types";
import { formatterCurrencey } from "@/utils/formatterCurrency";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SummaryProps {
    restaurant: Restaurant
}

const Summary: React.FC<SummaryProps> = ({
    restaurant
}) => {
    const route = useRouter();
    const [open, setOpen] = useState(false)
    const items = useCart((state) => state.items);

    const totalPrice = items.reduce((total, item) => {
        const totalProduct = item.additionalItems.reduce((sum, i) => sum + i.price, item.price) * item.amount;

        return total + totalProduct;
    }, 0)

    if(!items.length) {
        route.push('/')
    }

    return (
        <>
        <OrderModal restaurant={restaurant} open={open} setOpen={() => setOpen(false)}/>
        <div className="mt-4 rounded-lg bg-neutral-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-neutral-900">
                Resumo do pedido
            </h2>
            <div className="mt-6 space-y-1">
                <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
                    <div className="text-base font-medium text-neutral-900">
                        Subtotal
                    </div>
                    <span>{formatterCurrencey.format(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between border-neutral-200">
                    <div className="text-base font-medium text-neutral-900">
                        Taxa de entrega
                    </div>
                    <span className="text-green-500">Grátis</span>
                </div>
                <div className="flex items-center justify-between border-neutral-200 pt-4">
                    <div className="text-lg font-bold text-neutral-900">
                        Total
                    </div>
                    <span className="font-bold">{formatterCurrencey.format(totalPrice)}</span>
                </div>
            </div>
            <Button disabled={items.length === 0} onClick={() => setOpen(true)} className="w-full mt-6">
                Finalizar compra
            </Button>
        </div>
        </>
    )
}

export default Summary;