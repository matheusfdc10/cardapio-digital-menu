import getRestaurant from "@/actions/getRestaurant"
import Header from "@/components/Header"

export const revalidate = 0;

export default async function HomeLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const restaurant = await getRestaurant()

    return (
      <>
        <Header data={restaurant}/>
        {children}
      </>
    )
  }
  