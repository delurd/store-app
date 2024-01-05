import HomepageBanner from '@/components/HomepageBanner/HomepageBanner';
import ProductList from '@/components/Product/ProductList';
import TrendCategories from '@/components/Categories/TrendCategories';

export default function Home() {
  return (
    <>
      <main>
        <div className="container-base space-y-8 mb-10">
          <HomepageBanner />
          <div className="space-y-4">
            <h1 className="font-medium">Trend Categories</h1>
            <TrendCategories />
          </div>
          <div className="space-y-4">
            <h1 className="font-medium">New Products</h1>
            <ProductList isPaginate={false} query='totalOnPage=4'/>
          </div>
        </div>
      </main>
    </>
  );
}
