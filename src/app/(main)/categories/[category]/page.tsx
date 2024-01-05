import ProductList from '@/components/Product/ProductList';
import React from 'react';

type Props = {};

const CategoryQueryPage = ({params}: {params: {category: string}}) => {
  const category = params.category
    .split('-')
    .map((word) =>
      word
        .split('')
        .map((char, idx) => (idx == 0 ? char.toUpperCase() : char))
        .join('')
    )
    .join(' ');

  return (
    <main className="flex-1">
      <div className="container-base mb-10">
        <h1 className="font-medium mb-10">Products by {category}</h1>
        <div>
          <ProductList query={`category=${category}`} />
        </div>
      </div>
    </main>
  );
};

export default CategoryQueryPage;
