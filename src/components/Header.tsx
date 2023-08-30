"use client"
import useCart from "@/hooks/useCart";
import { Restaurant } from "@/types";
import { ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface HeaderProps {
    data: Restaurant
}

const Header: React.FC<HeaderProps> = ({
    data
}) => {
    const [isMounted, setIsMountend] = useState(false);
    

    useEffect(() => {
        setIsMountend(true);
    }, [])

    const route = useRouter();
    const cart = useCart();

    if (!isMounted) {
        return null;
    }


    return (
        <>
            <header className="border-b w-full" style={{ backgroundColor: data.colorHeader }}>
                <div className="flex items-center justify-between gap-4 h-24 p-4 max-w-screen-2xl mx-auto">
                    <div className="relative flex items-center h-full w-full">
                        {data.logo ? (
                            <Image
                                fill
                                objectFit="contain"
                                objectPosition="left"
                                alt="Logo"
                                src={data?.logo}
                                className="cursor-pointer"
                                onClick={() => route.push('/')}
                            />
                        ) : (
                            <h1 onClick={() => route.push('/')} className="text-3xl font-bold tracking-tight cursor-pointer">
                                {data.name}
                            </h1>
                        )}
                    </div>
                    <div className="hidden sm:block">
                        <div className=" flex items-center justify-center">
                            <Button
                                disabled={!cart.items.length}
                                onClick={() => route.push('/cart')} 
                                className="flex items-center rounded-full bg-black hover:bg-black/80">
                                <ShoppingBasket
                                    size={24}
                                    color="white"
                                />
                                <span className="ml-2 text-sm font-medium text-white">
                                    {cart.items.length}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;