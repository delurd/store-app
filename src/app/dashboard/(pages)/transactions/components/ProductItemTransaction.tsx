import Link from 'next/link';
import React from 'react';

type Props = {
  product?: any;
};

const ProductItemTransaction = (props: Props) => {
  return (
    <Link href={'/product/details/' + props.product.slug}>
      <div className="bg-grey-base p-2 rounded-lg flex items-center gap-4 hover:shadow-lg">
        <div className="h-11 aspect-square">
          <img
            className="w-full h-full object-cover rounded-md"
            src={
              props.product.thumbnailPath
                ? props.product.thumbnailPath
                : '/images/noimage.png'
            }
          />
        </div>
        <p className="flex-1">{props.product.name}</p>
        <p className="px-2">❯</p>
      </div>
    </Link>
  );
};

export default ProductItemTransaction;
