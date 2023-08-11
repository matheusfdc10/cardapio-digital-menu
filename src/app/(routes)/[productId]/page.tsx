import getProduct from "@/actions/getProduct";
import ProductClient from "./components/client";
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
            <ProductClient product={product} detailsColor={restaurant.colorDetails}/>
        </>
    )
}

export default ProductPage;