"use client"
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { formatterCurrencey } from "@/utils/formatterCurrency";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SummaryCartProps {
    colorDetails: string;
}

const SummaryCart: React.FC<SummaryCartProps> = ({
    colorDetails
}) => {
    const router = useRouter()
    const items = useCart((state) => state.items);
    const cart = useCart();
    const [isMounted, setIsMountend] = useState(false);
    

    useEffect(() => {
        setIsMountend(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    const totalPrice = items.reduce((total, item) => {
        const totalProduct = item.additionalItems.reduce((sum, i) => sum + i.price, item.price) * item.amount;

        return total + totalProduct;
    }, 0)

    if(cart.items?.length === 0 ) {
        return null;
    }

    return (
        <div className="sticky bottom-0 sm:hidden  w-full z-50 bg-neutral-100 border-t">
            <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
                <div>
                    <h4>Total</h4>
                    <span className="font-bold text-lg">{formatterCurrencey.format(totalPrice)}<span className="text-sm text-neutral-500 font-normal"> / {cart.items.length} item(s)</span></span>
                </div>
                <div>
                    <Button
                        onClick={() => router.push('/cart')}
                        style={{backgroundColor: colorDetails}}
                    >
                        Ver sacola
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SummaryCart;