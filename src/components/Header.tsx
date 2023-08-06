import { Restaurant } from "@/types";
import { ShoppingBasket } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
    data: Restaurant
}

const Header: React.FC<HeaderProps> = ({
    data
}) => {

    return (
        <header className="border-b w-full" style={{ backgroundColor: data.colorHeader }}>
            <div className="flex items-center gap-4 h-20 px-4 py-3 max-w-screen-2xl mx-auto">
                <div className="relative flex items-center h-full w-full">
                    {data.logo ? (
                        <Image
                            fill
                            objectFit="contain"
                            objectPosition="left"
                            alt="Logo"
                            src={data?.logo}
                            // className="object-contain "
                        />
                    ) : (
                        <h1 className="text-3xl font-bold tracking-tight">
                            {data.name}
                        </h1>
                    )}
                </div>
                <div className="flex items-center justify-center">
                    <div className="flex items-center rounded-full bg-black px-4 py-2 shadow hover:bg-black/80 cursor-pointer">
                        <ShoppingBasket
                            size={24}
                            color="white"
                        />
                        <span className="ml-2 text-sm font-medium text-white">
                            0
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;