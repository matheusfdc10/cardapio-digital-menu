import { Menu } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";

interface CategoryProps {
  category: Menu;
  detailsColor: string;
}

export const Category: React.FC<CategoryProps> = ({
  category,
  detailsColor,
}) => {
  return (
    <section id={category.name} className="space-y-4 pb-8">
      <div className="flex items-center gap-2">
        <div
          className="py-2 px-3 h-full"
          style={{ backgroundColor: detailsColor }}
        >
          <span className="font-black text-white">|</span>
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-2xl leading-6">{category.name}</h2>
        </div>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
