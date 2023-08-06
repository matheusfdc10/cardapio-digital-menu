import { Menu } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/menu`

const getMenu = async (): Promise<Menu[]> => {
    const res = await fetch(URL);

    return res.json();
}

export default getMenu;