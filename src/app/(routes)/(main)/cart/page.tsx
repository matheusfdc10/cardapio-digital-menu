import getRestaurant from "@/actions/getRestaurant";
import CartClient from "./components/client";

export const revalidate = 0;

const CartPage = async () => {
    const restaurant = await getRestaurant()

    return (
        <CartClient restaurant={restaurant} />
    )
}

export default CartPage;