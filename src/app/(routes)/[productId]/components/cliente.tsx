"use client"
import { Product } from "@/types";
import { formatterCurrencey } from "@/utils/formatterCurrency";
import { ChevronLeft, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductClienteProps {
    product: Product
}

const ProductCliente: React.FC<ProductClienteProps> = ({
    product
}) => {
    const router = useRouter();
    return (
        <>
            <div className="relative  flex items-center justify-center p-6 border-b">
                <div className="absolute left-2 cursor-pointer" onClick={() => router.back()}>
                    <ChevronLeft className="h-9 w-9"/> 
                </div>
                <h1 className="font-medium uppercase text-sm sm:text-xl leading-5 text-center mx-8">
                    {product.name}
                </h1>
            </div>
            
            <div className="max-w-3xl mx-auto">
                {!!product.images.length && (
                    <div className="w-full">
                        <div className=" relative h-full w-full overflow-hidden">
                            <Image
                                priority
                                alt="Image"
                                src={product?.images[0].url}
                                width={768}
                                height={384}
                                className="object-cover w-full sm:max-h-96"
                            />
                        </div>
                    </div>
                )}
                <div className="m-4 md:mx-0">
                    <div>
                        <h2 className="font-semibold text-xl leading-tight mb-2">
                            {product.name}
                        </h2>
                        <p className="mb-3 text-neutral-500 leading-5">
                            {product.description}
                        </p>
                        <span className="text-green-500 text-lg font-medium">
                            {formatterCurrencey.format(product.price)}
                        </span>
                    </div>
                </div>
                <div className="space-y-2">
                    {product.additionalItemCategories.map((additionalCategory) => (
                        <div key={additionalCategory.id} className="space-y-2">
                            <div className="bg-neutral-200/50 px-4 py-2 leading-2">
                                <h3 className="font-medium">{additionalCategory.name}</h3>
                                <p className="text-sm text-neutral-500">{additionalCategory.description}</p>
                                {additionalCategory.maxQtdItems > 0 && (
                                    <span className="text-xs">Escolha até {additionalCategory.maxQtdItems} opções.</span>
                                )}
                            </div>
                            <div className="px-4 divide-y">
                                {additionalCategory.additionalItems.map((additionalItem) => (
                                    <div key={additionalItem.id} className="flex justify-between items-center py-4">
                                        <div>
                                            <p className="text-sm sm:text-base">
                                                {additionalItem.name}
                                            
                                                <span> + {formatterCurrencey.format(additionalItem.price)}</span>
                                            </p>
                                        </div>
                                        <div className="mr-4">
                                            <Plus className="w-8 h-8"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </>
    )
}

export default ProductCliente;