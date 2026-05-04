import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ProductGrid } from "@/components/ProductGrid";
import { getProduct, products } from "@/data/products";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: ProductPageProps) {
  const product = getProduct(params.slug);

  return {
    title: product?.name ?? "Product",
    description: product?.description,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .concat(products.filter((item) => item.id !== product.id))
    .slice(0, 3);

  return (
    <main>
      <ProductDetailClient product={product} />
      <section className="section">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Recently loved</p>
            <h2 className="title">Complete the look.</h2>
          </div>
        </div>
        <ProductGrid products={related} />
      </section>
    </main>
  );
}
