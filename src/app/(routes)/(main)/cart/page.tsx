import getRestaurant from "@/actions/getRestaurant";
import CartClient from "./components/client";
import { Container } from "@/components/Container";

export const revalidate = 0;

const CartPage = async () => {
    const restaurant = await getRestaurant()

    return (
        <Container>
            <CartClient restaurant={restaurant} />
        </Container>
    )
}

export default CartPage;