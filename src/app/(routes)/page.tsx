import getMenu from "@/actions/getMenu"
import getRestaurant from "@/actions/getRestaurant";
import Header from "@/components/Header";
import { Category } from "@/components/ui/Category";

export const revalidate = 0;

export default async function HomePage() {
  const restaurant = await getRestaurant()
  const menu = await getMenu()
  
  return (
    <>
      <Header data={restaurant}/>
      <div className="w-full">
        <div className="w-full max-w-screen-2xl mx-auto py-4 px-4 sm:py-6 sm:px-8">
          <div className="space-y-8">
            {menu.map((category) => (
              <Category key={category.id} category={category} detailsColor={restaurant.colorDetails}/>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
