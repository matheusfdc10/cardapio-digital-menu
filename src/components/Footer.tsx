import { Restaurant } from "@/types";

interface FooterProps {
    restaurant: Restaurant;
}

const Footer: React.FC<FooterProps> = ({
    restaurant
}) => {

    const endereco = `${restaurant.address.streetAddress}, ${restaurant.address.number}, ${restaurant.address.complement ? `${restaurant.address.complement},` : ''} ${restaurant.address.neighborhood}, ${restaurant.address.city}/${restaurant.address.state} - CEP ${restaurant.address.zipCode}`;
    
    return (
        <footer className="w-full border-t">
            <div className="w-full max-w-screen-2xl mx-auto px-6 py-8 sm:px-8 text-xs text-neutral-500  grid grid-cols-1 md:grid-cols-2 gap-1">
                <p>© Copyright 2023 - {restaurant.name}</p>
                <p>E-mail: {restaurant.email}</p>
                <p>WhatsApp: {restaurant.whatsapp}</p>
                {restaurant.phone && (
                    <p>Telefone: {restaurant.phone}</p>
                )}
                <p>Endereço: {endereco}</p>
            </div>
        </footer>
    )
}

export default Footer;