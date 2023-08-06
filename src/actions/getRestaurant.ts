import { Restaurant } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/restaurant`

const getRestaurant = async (): Promise<Restaurant> => {
    const res = await fetch(URL);

    return res.json();
}

export default getRestaurant;