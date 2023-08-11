import getMenu from "@/actions/getMenu"
import getRestaurant from "@/actions/getRestaurant";
import { Category } from "@/components/ui/Category";

export const revalidate = 0;

export default async function HomePage() {
  const restaurant = await getRestaurant()
  const menu = await getMenu()

  return (
    <div className="space-y-8">
      {menu.map((category) => (
        <Category key={category.id} category={category} detailsColor={restaurant.colorDetails}/>
      ))}
    </div>
  )
}
