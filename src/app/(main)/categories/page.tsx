import CategoriesMenu from '@/components/Categories/CategoriesMenu';
import ProductList from '@/components/Product/ProductList';
import {categoriesDatas} from '@/utils/data/category';

type Props = {};

const CategoriesPage = (props: Props) => {
  return (
    <main className="flex-1 container-base space-y-8 mb-10">
      <div className="space-y-4">
        <h1 className="font-medium">All Categories</h1>
        <CategoriesMenu categoriesData={categoriesDatas} />
      </div>
      <div className="space-y-4">
        <h1 className="font-medium">Products</h1>
        <ProductList />
      </div>
    </main>
  );
};

export default CategoriesPage;
