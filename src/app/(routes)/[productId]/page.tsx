import getProduct from "@/actions/getProduct";
import ProductCliente from "./components/cliente";
import getRestaurant from "@/actions/getRestaurant";

export const revalidate = 0;

interface ProductPageProps {
    params: {
        productId: string;
    }
}

const ProductPage: React.FC<ProductPageProps> = async ({
    params
}) => {
    const restaurant = await getRestaurant()
    const product = await getProduct(params.productId);

    return (
        <>
            <ProductCliente product={product} detailsColor={restaurant.colorDetails}/>
        </>
    )
}

export default ProductPage;