import getProduct from "@/actions/getProduct";
import ProductCliente from "./components/cliente";

export const revalidate = 0;

interface ProductPageProps {
    params: {
        productId: string;
    }
}

const ProductPage: React.FC<ProductPageProps> = async ({
    params
}) => {
    const product = await getProduct(params.productId);

    return (
        <>
            <ProductCliente product={product}/>
        </>
    )
}

export default ProductPage;