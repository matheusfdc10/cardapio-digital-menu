import getMenu from "@/actions/getMenu"
import Image from "next/image";

export default async function HomePage() {
  const menu = await getMenu()
  
  return (
    <div className="space-y-6">
      {menu.map((item) => (
        <div key={item.id} className="space-y-3">
          <h2 className="font-bold text-2xl">
            {item.name}
          </h2>
          <div className=" grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {item.products.map((product) => (
              <div 
                key={product.id}
                className="cursor-pointer border rounded-md p-3 flex justify-between gap-4 shadow-md hover:border-neutral-300/80"
              >
                <div className="flex flex-col justify-between gap-4">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 overflow-hidden">
                    {product.name}
                  </h3>
                  <p className="mb-3 text-sm text-neutral-500 line-clamp-2 overflow-hidden">
                    {product.description}
                  </p>
                  <span className="text-green-500 text-base font-medium">
                    R$ {product.price}
                  </span>
                </div>
                {!!product?.images?.length  && (
                  <div className="w-36 h-28 aspect-square rounded-md bg-gray-100 relative my-3">
                    <Image
                      fill
                      alt="image"
                      src={product?.images[0]?.url}
                      className="aspect-square object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
