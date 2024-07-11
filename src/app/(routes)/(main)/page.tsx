import getMenu from "@/actions/getMenu"
import getRestaurant from "@/actions/getRestaurant";
import { Container } from "@/components/Container";
import { Category } from "@/components/ui/Category";
import FilterSection from "./components/FilterSection";
import SummaryCart from "./components/SummaryCart";
import Footer from "@/components/Footer";

export const revalidate = 0;

export default async function HomePage() {
  const restaurant = await getRestaurant()
  const menu = await getMenu()

  return (
    <>
      <FilterSection menu={menu} detailsColor={restaurant.colorDetails}/>
      <Container>
        {/* <div> */}
          {menu.map((category) => (
            <Category key={category.id} category={category} detailsColor={restaurant.colorDetails}/>
          ))}
        {/* </div> */}
      </Container>
      <Footer restaurant={restaurant}/>
      <SummaryCart colorDetails={restaurant.colorDetails}/>
    </>
  )
}
