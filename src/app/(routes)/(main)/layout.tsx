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
        <div className="w-full">
          <div className="w-full max-w-screen-2xl mx-auto py-4 px-4 sm:py-6 sm:px-8">
            {children}
          </div>
        </div>
      </>
    )
  }
  