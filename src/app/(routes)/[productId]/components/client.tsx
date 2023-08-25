"use client"
import { Product } from "@/types";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductForm from "./ProductForm";
import { useEffect } from "react";

interface ProductClienteProps {
    product: Product,
    detailsColor: string;
}

const ProductClient: React.FC<ProductClienteProps> = ({
    product,
    detailsColor
}) => {
    const router = useRouter();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <>
            <div className="sticky top-0 z-50 bg-neutral-50 flex items-center justify-center p-6 border-b">
                <div className="absolute left-4 cursor-pointer" onClick={() => router.back()}>
                    <ChevronLeft className="h-9 w-9" style={{ color: detailsColor}}/> 
                </div>
                <h1 className="font-medium uppercase text-sm sm:text-xl leading-5 text-center mx-8">
                    {product.name}
                </h1>
            </div>

            <ProductForm product={product} detailsColor={detailsColor}/>            
        </>
    )
}

export default ProductClient;