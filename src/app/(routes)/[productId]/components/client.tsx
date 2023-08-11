"use client"
import { Product } from "@/types";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductForm from "./ProductForm";

interface ProductClienteProps {
    product: Product,
    detailsColor: string;
}

const ProductClient: React.FC<ProductClienteProps> = ({
    product,
    detailsColor
}) => {
    const router = useRouter();
    return (
        <>
            <div className="relative  flex items-center justify-center p-6 border-b">
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