import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { formatterCurrencey } from "@/utils/formatterCurrency";
import { X } from "lucide-react";
import Image from "next/image";

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

interface CartItemProps {
    data: Product,
    index: number;
}

const CartItem: React.FC<CartItemProps> = ({
    data,
    index
}) => {
    const cart = useCart();

    const onRemove = () => {
        cart.removeItem(index)
    }

    const priceTotal = () => {

        return data.additionalItems.reduce((sum, item) => sum + item.price ,data.price) * data.amount
    }

    return (
        <li className="relative flex gap-2 py-6 border-b">
            <div className="relative flex flex-1 flex-col justify-between ">
                <div className="relative flex flex-col gap-2">
                    <div className="flex justify-between">
                        <p className="text-lg font-semibold text-black">
                            {data.amount}x {data.name}
                        </p>
                    </div>
                    <div className="text-sm text-neutral-500">
                        <p>{data.additionalItems.map((item, i) => {
                            if (i) {
                                return `, ${item.amount}x ` + item.name 
                            } else {

                                return `${item.amount}x ` + item.name 
                            }
                        })}</p>
                    </div>
                    <span>{formatterCurrencey.format(priceTotal())}</span>
                </div>
            </div>
            <div className="absolute z-10 right-1 top-7">
                <Button
                    size="icon"
                    variant="destructive"
                    onClick={onRemove}
                >
                    <X className="text-neutral-50"/>
                </Button>
            </div>
            {data.url && (
                <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-32 sm:w-32">
                    <Image
                        fill
                        src={data.url}
                        alt="Image"
                        className="object-cover object-center"
                    />
                </div>
            )}
        </li>
    )
}

export default CartItem;