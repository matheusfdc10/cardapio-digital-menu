"use client"

import { Product } from "@/types";
import { formatterCurrencey } from "@/utils/formatterCurrency";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product
}) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/${product.id}`)}
            className="cursor-pointer border rounded-md p-4 flex justify-between gap-4 shadow-md hover:border-neutral-300/80 "
        >
            <div className="flex flex-col justify-between gap-4">
                <h3 className="font-semibold text-lg leading-tight line-clamp-2 overflow-hidden">
                {product.name}
                </h3>
                <p className="mb-3 text-sm text-neutral-500 line-clamp-2 overflow-hidden">
                {product.description}
                </p>
                <span className="text-green-500 text-base font-medium">
                {formatterCurrencey.format(product.price)}
                </span>
            </div>
            {!!product?.images?.length  && (
                <div className="w-auto h-28 aspect-square rounded-md bg-gray-100 relative my-3 overflow-hidde">
                    <Image
                        fill
                        alt="image"
                        src={product?.images[0]?.url}
                        sizes="112px"
                        className="object-cover rounded-md"
                    />
                </div>
            )}
        </div>
    )
}